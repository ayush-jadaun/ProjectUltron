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
RECENT_FLOOD_PERIOD_DAYS = 14             # Look for S1 images in the last 14 days
BASELINE_PERIOD_OFFSET_YEARS = 1          # Look 1 year back for baseline
BASELINE_PERIOD_DURATION_DAYS = 14        # Duration of the baseline period window
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
    # Note: Sentinel-1 GRD data is already in dB for log units scale in GEE.
    water = image.select(S1_POLARIZATION).lt(WATER_THRESHOLD_DB).rename('water')
    # Return the water mask, carrying over the image time
    return water.copyProperties(image, ['system:time_start'])

# --- Main Flood Check Logic ---
def check_flooding(region_geometry, threshold_percent, buffer_radius_meters):
    """
    Performs GEE analysis to detect potential flooding using Sentinel-1.
    Compares recent water extent to a baseline period.
    """
    try:
        # --- Define Time Periods ---
        end_date_recent = ee.Date(datetime.datetime.utcnow())
        start_date_recent = end_date_recent.advance(-RECENT_FLOOD_PERIOD_DAYS, 'day')

        # Baseline period (e.g., same timeframe one year ago)
        end_date_baseline = end_date_recent.advance(-BASELINE_PERIOD_OFFSET_YEARS, 'year')
        start_date_baseline = end_date_baseline.advance(-BASELINE_PERIOD_DURATION_DAYS, 'day')

        # Safely get date strings for logging
        try:
            start_date_baseline_str = start_date_baseline.format('YYYY-MM-dd').getInfo()
            end_date_baseline_str = end_date_baseline.format('YYYY-MM-dd').getInfo()
            start_date_recent_str = start_date_recent.format('YYYY-MM-dd').getInfo()
            end_date_recent_str = end_date_recent.format('YYYY-MM-dd').getInfo()
            print(f"Analysis Periods: Baseline {start_date_baseline_str} -> {end_date_baseline_str}", file=sys.stderr)
            print(f"                  Recent   {start_date_recent_str} -> {end_date_recent_str}", file=sys.stderr)
        except Exception as date_error:
            print(f"WARNING: Unable to format date strings for logging: {date_error}", file=sys.stderr)
            # Continue execution - this is just for logging

        # --- Load and Filter Sentinel-1 Collection ---
        s1_collection = (ee.ImageCollection(S1_COLLECTION)
                          .filter(ee.Filter.eq('instrumentMode', S1_INSTRUMENT_MODE))
                          .filter(ee.Filter.listContains('transmitterReceiverPolarisation', S1_POLARIZATION))
                          .filterBounds(region_geometry)
                          .select(S1_POLARIZATION)) # Select only VV initially

        # --- Process Recent Period ---
        recent_s1 = s1_collection.filterDate(start_date_recent, end_date_recent)
        # Optional: Filter by orbit pass (ASCENDING/DESCENDING) if needed for consistency
        # recent_s1 = recent_s1.filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))

        # Create a water mask composite for the recent period (using median)
        # Median helps reduce noise and speckle effects to some extent
        recent_water_composite = recent_s1.map(apply_water_threshold).median().unmask(0) # Use median, unmask potential nodata to 0
        recent_water_composite = recent_water_composite.clip(region_geometry)

        # --- Process Baseline Period ---
        baseline_s1 = s1_collection.filterDate(start_date_baseline, end_date_baseline)
        # Optional: Filter by orbit pass to match recent
        # baseline_s1 = baseline_s1.filter(ee.Filter.eq('orbitProperties_pass', 'DESCENDING'))

        # **Optional but Recommended: Filter baseline by relative orbit number(s) from recent images**
        # This helps compare images from the same viewing geometry, reducing variability.
        try:
            recent_orbits = recent_s1.aggregate_array('relativeOrbitNumber_start').distinct().getInfo()
            if recent_orbits:
                print(f"Filtering baseline by recent orbit numbers: {recent_orbits}", file=sys.stderr)
                baseline_s1 = baseline_s1.filter(ee.Filter.inList('relativeOrbitNumber_start', recent_orbits))
            else:
                 print("WARNING: No recent S1 images found to determine orbit numbers for baseline filtering.", file=sys.stderr)
        except Exception as orbit_err:
            print(f"WARNING: Could not filter baseline by orbit number: {orbit_err}", file=sys.stderr)
            # Proceed without orbit filtering if it fails

        baseline_water_composite = baseline_s1.map(apply_water_threshold).median().unmask(0) # Use median, unmask potential nodata to 0
        baseline_water_composite = baseline_water_composite.clip(region_geometry)

        # --- Calculate Flood Water ---
        # Pixels that are water now (1) but were not water in baseline (0)
        # Difference will be 1 (1 - 0 = 1). Pixels water in both (1-1=0). Pixels dry now (0-0=0 or 0-1=-1).
        # So, we look for where the difference is greater than 0.
        flood_water_mask = recent_water_composite.subtract(baseline_water_composite).gt(0).rename('flood_water')

        # --- Calculate Areas ---
        # Calculate pixel area in sq meters, then rename to 'area'
        pixel_area = ee.Image.pixelArea().divide(1000000).rename('area')  # Convert to sq km and rename

        # Calculate flooded area
        flood_area_image = flood_water_mask.multiply(pixel_area) # Area only where flood_water_mask is 1
        flood_stats = flood_area_image.reduceRegion(
            reducer=ee.Reducer.sum(),
            geometry=region_geometry,
            scale=REDUCTION_SCALE_S1,
            maxPixels=1e9,
            bestEffort=True
        )

        # Calculate total region area
        total_area_stats = pixel_area.reduceRegion(
            reducer=ee.Reducer.sum(),
            geometry=region_geometry,
            scale=REDUCTION_SCALE_S1,
            maxPixels=1e9,
            bestEffort=True
        )

        # --- Get Results and Check Threshold ---
        flooded_area_sqkm = None
        total_area_sqkm = None
        flooded_percentage = 0.0
        alert_triggered = False
        error_message = None

        try:
            # Extract flooded area
            flood_area_result = flood_stats.get('flood_water')
            # Check if the result is present and not null
            if flood_area_result is not None:
                 flooded_area_sqkm = flood_area_result.getInfo()
                 if flooded_area_sqkm is None: # Check if getInfo() returned None
                      print("WARNING: reduceRegion for flooded area returned None. No flood pixels detected or issue with calculation.", file=sys.stderr)
                      flooded_area_sqkm = 0.0 # Assume zero if calculation returns None

            else:
                 print("WARNING: 'flood_water' key not found in flood_stats. Assuming zero flooded area.", file=sys.stderr)
                 flooded_area_sqkm = 0.0

            # Extract total area
            total_area_result = total_area_stats.get('area') # <-- use 'area'!
            if total_area_result is not None:
                 total_area_sqkm = total_area_result.getInfo()
                 if total_area_sqkm is None or total_area_sqkm == 0:
                     print("ERROR: Could not calculate total area of the region or area is zero.", file=sys.stderr)
                     error_message = "Could not calculate total area of the region."
                     total_area_sqkm = 0 # Avoid division by zero
                 elif total_area_sqkm > 0:
                     flooded_percentage = (flooded_area_sqkm / total_area_sqkm) * 100 if total_area_sqkm else 0.0
                     alert_triggered = flooded_percentage > threshold_percent

            else:
                 print("ERROR: 'area' key not found in total_area_stats. Cannot calculate percentage.", file=sys.stderr)
                 error_message = "Could not calculate total area of the region."
                 total_area_sqkm = 0 # Avoid division by zero

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

        # Safely get date strings for response
        try:
            response_dates = {
                "recent_period_start": start_date_recent.format('YYYY-MM-dd').getInfo(),
                "recent_period_end": end_date_recent.format('YYYY-MM-dd').getInfo(),
                "baseline_period_start": start_date_baseline.format('YYYY-MM-dd').getInfo(),
                "baseline_period_end": end_date_baseline.format('YYYY-MM-dd').getInfo(),
            }
        except Exception as date_format_error:
            print(f"WARNING: Unable to format dates for response: {date_format_error}", file=sys.stderr)
            response_dates = { # Fallback date representation
                 "recent_period_start": f"Today-{RECENT_FLOOD_PERIOD_DAYS}d",
                 "recent_period_end": "Today",
                 "baseline_period_start": f"Approx {BASELINE_PERIOD_OFFSET_YEARS} year(s) ago - {BASELINE_PERIOD_DURATION_DAYS}d",
                 "baseline_period_end": f"Approx {BASELINE_PERIOD_OFFSET_YEARS} year(s) ago",
             }

        # Check if we encountered an error during area calculation
        if error_message:
            return {
                "status": "error",
                "message": error_message,
                "alert_triggered": False,
                 "flooded_area_sqkm": flooded_area_sqkm, # Report what we could calculate
                 "total_area_sqkm": total_area_sqkm,
                 "flooded_percentage": flooded_percentage if total_area_sqkm > 0 else None,
                "threshold_percent": threshold_percent,
                **response_dates,
                "buffer_radius_meters": buffer_radius_meters
            }

        # --- Return Success ---
        return {
            "status": "success",
            "alert_triggered": alert_triggered,
            "flooded_area_sqkm": flooded_area_sqkm,
            "total_area_sqkm": total_area_sqkm,
            "flooded_percentage": flooded_percentage,
            "threshold_percent": threshold_percent,
            **response_dates,
            "buffer_radius_meters": buffer_radius_meters,
            "water_detection_threshold_db": WATER_THRESHOLD_DB # Include the threshold used
        }

    except ee.EEException as gee_error:
        # Check for common GEE errors like "No images found"
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
        # Use 'threshold_percent' from input if provided, otherwise use default
        threshold_pct = float(input_params.get('threshold_percent', DEFAULT_FLOOD_ALERT_THRESHOLD_PERCENT))
        region_id = str(input_params.get('region_id', region_id))
        buffer_radius = int(input_params.get('buffer_meters', DEFAULT_POINT_BUFFER))
        print(f"Received job: region='{region_id}', thresh={threshold_pct}%, buffer={buffer_radius}m", file=sys.stderr)
    except (json.JSONDecodeError, KeyError, ValueError) as e:
        print(f"ERROR: Invalid stdin JSON or parameters: {e}", file=sys.stderr)
        print(f"Received stdin: {input_data_str[:500]}...", file=sys.stderr) # Log received data for debugging
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
            effective_buffer = buffer_radius # Record that buffering was applied
        else:
            raise ValueError(f"Unsupported geometry type: {geom_type}")

        # Geometry validation block removed (no .isValid in Python API)

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
    # Pass the effective buffer radius (which could be None if not a point)
    analysis_result = check_flooding(ee_geometry, threshold_pct, effective_buffer)
    end_time = time.time()
    print(f"GEE analysis duration: {end_time - start_time:.2f} seconds.", file=sys.stderr)

    # Add region_id to the final output
    analysis_result['region_id'] = region_id

    # Print the final JSON result to stdout
    print(json.dumps(analysis_result))

    # Exit with appropriate code based on script success/failure
    if analysis_result.get("status") == "success":
        sys.exit(0)
    else:
        sys.exit(1)