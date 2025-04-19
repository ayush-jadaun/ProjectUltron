import sys
import json
import os
import ee
import datetime
import time
import traceback
from pathlib import Path

# --- Configuration Constants ---
DEFAULT_FLOOD_ALERT_THRESHOLD_PERCENT = 5.0  # Alert if > 5% of area is newly flooded

# --- UPDATE THESE FOR RECENT/BACKGROUND ANALYSIS WINDOW ---
RECENT_FLOOD_PERIOD_DAYS = 14             # Analyze flooding over the last 6 days (matches Sentinel-1 update cadence)
BASELINE_PERIOD_OFFSET_YEARS = 1         # Look 1 year back for baseline
BASELINE_PERIOD_DURATION_DAYS = 14        # Duration of the baseline period window (6 days)
# ----------------------------------------------------------

S1_COLLECTION = 'COPERNICUS/S1_GRD'
S1_POLARIZATION = 'VV'                   # VV polarization is often sensitive to water
S1_INSTRUMENT_MODE = 'IW'                # Interferometric Wide swath mode
WATER_THRESHOLD_DB = -16                 # Backscatter threshold (dB) for water (tune as needed)
REDUCTION_SCALE_S1 = 30                  # Scale for reduceRegion (meters) - S1 native is ~10m
DEFAULT_POINT_BUFFER = 1000              # Buffer radius for point geometries (meters)
gcp_project_id = 'project-ultron-457221' # Replace with your GCP Project ID if needed

# --- GEE Initialization ---
def initialize_gee(credentials_path_arg):
    global gcp_project_id
    try:
        credentials_path = credentials_path_arg
        print(f"DEBUG: Received credentials path via argument: {credentials_path}", file=sys.stderr)
        if not credentials_path or not os.path.exists(credentials_path):
             print(f"ERROR: Credentials file not found or path empty: {credentials_path}", file=sys.stderr)
             return False
        print(f"Attempting GEE init with key: {credentials_path}", file=sys.stderr)
        credentials = ee.ServiceAccountCredentials(None, key_file=credentials_path)
        ee.Initialize(credentials=credentials, project=gcp_project_id, opt_url='https://earthengine-highvolume.googleapis.com')
        print(f"GEE Initialized OK for project: {gcp_project_id}.", file=sys.stderr)
        return True
    except ee.EEException as e: print(f"ERROR: Failed GEE init: {e}", file=sys.stderr); return False
    except Exception as e: print(f"ERROR: Unexpected GEE init error: {e}", file=sys.stderr); print(traceback.format_exc(), file=sys.stderr); return False

# --- Sentinel-1 Processing Functions ---
def apply_water_threshold(image):
    """Applies the water threshold to VV polarization."""
    water = image.select(S1_POLARIZATION).lt(WATER_THRESHOLD_DB).rename('water')
    return water.copyProperties(image, ['system:time_start'])

# --- Main Flood Check Logic ---
def check_flooding(region_geometry, threshold_percent, buffer_radius_meters):
    """
    Performs GEE analysis to detect potential flooding using Sentinel-1.
    Compares recent water extent to a baseline period.
    """
    try:
        from datetime import timezone
        end_date_recent = ee.Date(datetime.datetime.now(timezone.utc))
        start_date_recent = end_date_recent.advance(-RECENT_FLOOD_PERIOD_DAYS, 'day')

        # Baseline period (e.g., same timeframe one year ago)
        end_date_baseline = end_date_recent.advance(-BASELINE_PERIOD_OFFSET_YEARS, 'year')
        start_date_baseline = end_date_baseline.advance(-BASELINE_PERIOD_DURATION_DAYS, 'day')

        # Logging dates for sanity check
        try:
            start_date_baseline_str = start_date_baseline.format('YYYY-MM-dd').getInfo()
            end_date_baseline_str = end_date_baseline.format('YYYY-MM-dd').getInfo()
            start_date_recent_str = start_date_recent.format('YYYY-MM-dd').getInfo()
            end_date_recent_str = end_date_recent.format('YYYY-MM-dd').getInfo()
            print(f"Analysis Periods: Baseline {start_date_baseline_str} -> {end_date_baseline_str}", file=sys.stderr)
            print(f"                  Recent   {start_date_recent_str} -> {end_date_recent_str}", file=sys.stderr)
        except Exception as date_error:
            print(f"WARNING: Unable to format date strings for logging: {date_error}", file=sys.stderr)

        # --- Load and Filter Sentinel-1 Collection ---
        s1_collection = (ee.ImageCollection(S1_COLLECTION)
                          .filter(ee.Filter.eq('instrumentMode', S1_INSTRUMENT_MODE))
                          .filter(ee.Filter.listContains('transmitterReceiverPolarisation', S1_POLARIZATION))
                          .filterBounds(region_geometry)
                          .select(S1_POLARIZATION))

        # --- Process Recent Period ---
        recent_s1 = s1_collection.filterDate(start_date_recent, end_date_recent)
        recent_count = recent_s1.size().getInfo()
        if recent_count == 0:
            msg = f"No Sentinel-1 images available for the recent period {start_date_recent.getInfo()} to {end_date_recent.getInfo()}."
            print(f"ERROR: {msg}", file=sys.stderr)
            return {
                "status": "error",
                "message": msg,
                "alert_triggered": False,
                "flooded_area_sqkm": None,
                "flooded_percentage": None,
                "threshold_percent": threshold_percent,
                "buffer_radius_meters": buffer_radius_meters
            }

        # --- Process Baseline Period ---
        baseline_s1 = s1_collection.filterDate(start_date_baseline, end_date_baseline)
        baseline_count = baseline_s1.size().getInfo()
        if baseline_count == 0:
            msg = f"No Sentinel-1 images available for the baseline period {start_date_baseline.getInfo()} to {end_date_baseline.getInfo()}."
            print(f"ERROR: {msg}", file=sys.stderr)
            return {
                "status": "error",
                "message": msg,
                "alert_triggered": False,
                "flooded_area_sqkm": None,
                "flooded_percentage": None,
                "threshold_percent": threshold_percent,
                "buffer_radius_meters": buffer_radius_meters
            }

        recent_water_composite = recent_s1.map(apply_water_threshold).median().unmask(0).clip(region_geometry)

        try:
            recent_orbits = recent_s1.aggregate_array('relativeOrbitNumber_start').distinct().getInfo()
            if recent_orbits:
                print(f"Filtering baseline by recent orbit numbers: {recent_orbits}", file=sys.stderr)
                baseline_s1 = baseline_s1.filter(ee.Filter.inList('relativeOrbitNumber_start', recent_orbits))
            else:
                print("WARNING: No recent S1 images found to determine orbit numbers for baseline filtering.", file=sys.stderr)
        except Exception as orbit_err:
            print(f"WARNING: Could not filter baseline by orbit number: {orbit_err}", file=sys.stderr)

        # Re-check that baseline_s1 is not now empty
        baseline_count2 = baseline_s1.size().getInfo()
        if baseline_count2 == 0:
            msg = f"No Sentinel-1 images available for the baseline period after orbit filtering."
            print(f"ERROR: {msg}", file=sys.stderr)
            return {
                "status": "error",
                "message": msg,
                "alert_triggered": False,
                "flooded_area_sqkm": None,
                "flooded_percentage": None,
                "threshold_percent": threshold_percent,
                "buffer_radius_meters": buffer_radius_meters
            }

        baseline_water_composite = baseline_s1.map(apply_water_threshold).median().unmask(0).clip(region_geometry)

        # --- Calculate Flood Water ---
        flood_water_mask = recent_water_composite.subtract(baseline_water_composite).gt(0).rename('flood_water')

        # --- Calculate Areas ---
        pixel_area = ee.Image.pixelArea().divide(1000000).rename('area')  # km²

        flood_area_image = flood_water_mask.multiply(pixel_area)
        flood_stats = flood_area_image.reduceRegion(
            reducer=ee.Reducer.sum(),
            geometry=region_geometry,
            scale=REDUCTION_SCALE_S1,
            maxPixels=1e9,
            bestEffort=True
        )

        total_area_stats = pixel_area.reduceRegion(
            reducer=ee.Reducer.sum(),
            geometry=region_geometry,
            scale=REDUCTION_SCALE_S1,
            maxPixels=1e9,
            bestEffort=True
        )

        flooded_area_sqkm = None
        total_area_sqkm = None
        flooded_percentage = 0.0
        alert_triggered = False
        error_message = None

        try:
            flood_area_result = flood_stats.get('flood_water')
            if flood_area_result is not None:
                flooded_area_sqkm = flood_area_result.getInfo()
                if flooded_area_sqkm is None:
                    print("WARNING: reduceRegion for flooded area returned None. No flood pixels detected or issue with calculation.", file=sys.stderr)
                    flooded_area_sqkm = 0.0
            else:
                print("WARNING: 'flood_water' key not found in flood_stats. Assuming zero flooded area.", file=sys.stderr)
                flooded_area_sqkm = 0.0

            total_area_result = total_area_stats.get('area')
            if total_area_result is not None:
                total_area_sqkm = total_area_result.getInfo()
                if total_area_sqkm is None or total_area_sqkm == 0:
                    print("ERROR: Could not calculate total area of the region or area is zero.", file=sys.stderr)
                    error_message = "Could not calculate total area of the region."
                    total_area_sqkm = 0
                elif total_area_sqkm > 0:
                    flooded_percentage = (flooded_area_sqkm / total_area_sqkm) * 100 if total_area_sqkm else 0.0
                    alert_triggered = flooded_percentage > threshold_percent
            else:
                print("ERROR: 'area' key not found in total_area_stats. Cannot calculate percentage.", file=sys.stderr)
                error_message = "Could not calculate total area of the region."
                total_area_sqkm = 0

            print(f"Flooded Area: {flooded_area_sqkm:.4f} sqkm", file=sys.stderr)
            print(f"Total Region Area: {total_area_sqkm:.4f} sqkm", file=sys.stderr)
            print(f"Flooded Percentage: {flooded_percentage:.2f}%", file=sys.stderr)
            print(f"Alert Triggered (>{threshold_percent}%): {alert_triggered}", file=sys.stderr)

        except Exception as reduce_error:
            print(f"ERROR: Failed during reduceRegion getInfo(): {reduce_error}", file=sys.stderr)
            print(traceback.format_exc(), file=sys.stderr)
            return {
                "status": "error",
                "message": f"Failed to retrieve area statistics: {reduce_error}. Check region geometry and date ranges.",
                "alert_triggered": False,
                "flooded_area_sqkm": None,
                "flooded_percentage": None,
                "total_area_sqkm": None,
                "threshold_percent": threshold_percent,
                "buffer_radius_meters": buffer_radius_meters
            }

        try:
            response_dates = {
                "recent_period_start": start_date_recent.format('YYYY-MM-dd').getInfo(),
                "recent_period_end": end_date_recent.format('YYYY-MM-dd').getInfo(),
                "baseline_period_start": start_date_baseline.format('YYYY-MM-dd').getInfo(),
                "baseline_period_end": end_date_baseline.format('YYYY-MM-dd').getInfo(),
            }
        except Exception as date_format_error:
            print(f"WARNING: Unable to format dates for response: {date_format_error}", file=sys.stderr)
            response_dates = {
                 "recent_period_start": f"Today-{RECENT_FLOOD_PERIOD_DAYS}d",
                 "recent_period_end": "Today",
                 "baseline_period_start": f"Approx {BASELINE_PERIOD_OFFSET_YEARS} year(s) ago - {BASELINE_PERIOD_DURATION_DAYS}d",
                 "baseline_period_end": f"Approx {BASELINE_PERIOD_OFFSET_YEARS} year(s) ago",
             }

        if error_message:
            return {
                "status": "error",
                "message": error_message,
                "alert_triggered": False,
                "flooded_area_sqkm": flooded_area_sqkm,
                "total_area_sqkm": total_area_sqkm,
                "flooded_percentage": flooded_percentage if total_area_sqkm > 0 else None,
                "threshold_percent": threshold_percent,
                **response_dates,
                "buffer_radius_meters": buffer_radius_meters
            }

        return {
            "status": "success",
            "alert_triggered": alert_triggered,
            "flooded_area_sqkm": flooded_area_sqkm,
            "total_area_sqkm": total_area_sqkm,
            "flooded_percentage": flooded_percentage,
            "threshold_percent": threshold_percent,
            **response_dates,
            "buffer_radius_meters": buffer_radius_meters,
            "water_detection_threshold_db": WATER_THRESHOLD_DB
        }

    except ee.EEException as gee_error:
        error_str = str(gee_error)
        print(f"ERROR: GEE computation failed: {error_str}", file=sys.stderr)
        if "Collection.loadTable: No features found for query" in error_str or "ImageCollection.mosaic: Tile error" in error_str or "No bands available for" in error_str:
            message = f"GEE Error: Likely no Sentinel-1 images found for one or both periods in the specified region. Check dates and region coordinates. Details: {error_str}"
        else:
            message = f"GEE Computation Error: {error_str}"
        return {
            "status": "error",
            "message": message,
            "alert_triggered": False,
            "flooded_area_sqkm": None,
            "flooded_percentage": None,
            "threshold_percent": threshold_percent,
            "buffer_radius_meters": buffer_radius_meters
        }
    except Exception as e:
        print(f"ERROR: Unexpected Python error during GEE processing: {e}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        return {
            "status": "error",
            "message": f"Python Script Error: {e}",
            "alert_triggered": False,
            "flooded_area_sqkm": None,
            "flooded_percentage": None,
            "threshold_percent": threshold_percent,
            "buffer_radius_meters": buffer_radius_meters
        }

# --- Main Execution Block ---
if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("ERROR: Missing credentials file path argument.", file=sys.stderr)
        print(json.dumps({"status": "error", "message": "Missing credentials file path argument."}))
        sys.exit(1)
    credentials_path_from_arg = sys.argv[1]

    input_data_str = sys.stdin.read()
    threshold_pct = DEFAULT_FLOOD_ALERT_THRESHOLD_PERCENT
    region_id = "unknown_region"
    buffer_radius = DEFAULT_POINT_BUFFER

    try:
        input_params = json.loads(input_data_str)
        geojson_geometry = input_params['geometry']
        threshold_pct = float(input_params.get('threshold_percent', DEFAULT_FLOOD_ALERT_THRESHOLD_PERCENT))
        region_id = str(input_params.get('region_id', region_id))
        buffer_radius = int(input_params.get('buffer_meters', DEFAULT_POINT_BUFFER))
        print(f"Received job: region='{region_id}', thresh={threshold_pct}%, buffer={buffer_radius}m", file=sys.stderr)
    except (json.JSONDecodeError, KeyError, ValueError) as e:
        print(f"ERROR: Invalid stdin JSON or parameters: {e}", file=sys.stderr)
        print(f"Received stdin: {input_data_str[:500]}...", file=sys.stderr)
        print(json.dumps({"status": "error", "message": f"Invalid Stdin Parameters: {e}", "region_id": region_id}))
        sys.exit(1)
    except Exception as e:
        print(f"ERROR: Unexpected error processing input: {e}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        print(json.dumps({"status": "error", "message": f"Unexpected error processing input: {e}", "region_id": region_id}))
        sys.exit(1)

    if not initialize_gee(credentials_path_from_arg):
        print(json.dumps({"status": "error", "message": "GEE initialization failed.", "region_id": region_id}))
        sys.exit(1)

    ee_geometry = None
    effective_buffer = None
    try:
        geom_type = geojson_geometry.get('type')
        coords = geojson_geometry.get('coordinates')
        if not geom_type or not coords:
            raise ValueError("Invalid GeoJSON structure: Missing 'type' or 'coordinates'.")

        if geom_type == 'Polygon':
            ee_geometry = ee.Geometry.Polygon(coords)
        elif geom_type == 'MultiPolygon':
            ee_geometry = ee.Geometry.MultiPolygon(coords)
        elif geom_type == 'Point':
            if not isinstance(coords, list) or len(coords) != 2:
                raise ValueError("Invalid Point coordinates.")
            ee_geometry = ee.Geometry.Point(coords).buffer(buffer_radius)
            effective_buffer = buffer_radius
        else:
            raise ValueError(f"Unsupported geometry type: {geom_type}")

    except ValueError as e:
        print(f"ERROR: Invalid GeoJSON geometry: {e}", file=sys.stderr)
        print(json.dumps({"status": "error", "message": f"Invalid GeoJSON Geometry: {e}", "region_id": region_id}))
        sys.exit(1)
    except ee.EEException as e:
        print(f"ERROR: GEE error processing geometry: {e}", file=sys.stderr)
        print(json.dumps({"status": "error", "message": f"GEE error processing geometry: {e}", "region_id": region_id}))
        sys.exit(1)
    except Exception as e:
        print(f"ERROR: Unexpected error converting GeoJSON: {e}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        print(json.dumps({"status": "error", "message": f"Unexpected GeoJSON Conversion Error: {e}", "region_id": region_id}))
        sys.exit(1)

    print(f"Starting GEE flood analysis for region: {region_id}...", file=sys.stderr)
    start_time = time.time()
    analysis_result = check_flooding(ee_geometry, threshold_pct, effective_buffer)
    end_time = time.time()
    print(f"GEE analysis duration: {end_time - start_time:.2f} seconds.", file=sys.stderr)

    analysis_result['region_id'] = region_id
    print(json.dumps(analysis_result))

    if analysis_result.get("status") == "success":
        sys.exit(0)
    else:
        sys.exit(1)