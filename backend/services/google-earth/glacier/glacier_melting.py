import sys
import json
import os
import ee
import datetime
import time
import traceback
from pathlib import Path

# --- Configuration Constants ---
DEFAULT_GLACIER_ALERT_THRESHOLD_PERCENT = 2.0  # Alert if > 2% glacier area loss

RECENT_PERIOD_DAYS = 90
BASELINE_PERIOD_YEARS_AGO = 1
BASELINE_PERIOD_DURATION_DAYS = 6
BASELINE_FALLBACK_YEARS = [8, 9, 11, 12]

S2_COLLECTION = 'COPERNICUS/S2_SR_HARMONIZED'
NDSI_GREEN_BAND = 'B3'
NDSI_SWIR_BAND = 'B11'
REDUCTION_SCALE = 30
DEFAULT_POINT_BUFFER = 1000
gcp_project_id = 'project-ultron-457221'

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
    except ee.EEException as e:
        print(f"ERROR: Failed GEE init: {e}", file=sys.stderr)
        return False
    except Exception as e:
        print(f"ERROR: Unexpected GEE init error: {e}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        return False

def mask_s2_clouds(image):
    scl = image.select('SCL')
    mask = scl.neq(3).And(scl.neq(8)).And(scl.neq(9)).And(scl.neq(10)).And(scl.neq(11))
    return image.updateMask(mask)

def calculate_ndsi(image):
    ndsi = image.normalizedDifference([NDSI_GREEN_BAND, NDSI_SWIR_BAND]).rename('NDSI')
    return image.addBands(ndsi).copyProperties(image, ['system:time_start'])

def get_median_ndsi_image(s2_collection, start, end, region_geometry):
    try:
        filtered_collection = s2_collection.filterDate(start, end).filterBounds(region_geometry)
        image_count = filtered_collection.size().getInfo()
        print(f"DEBUG: Found {image_count} images for period {start.format('YYYY-MM-dd').getInfo()} to {end.format('YYYY-MM-dd').getInfo()}", file=sys.stderr)
        if image_count == 0:
            print(f"WARNING: No images found for period {start.format('YYYY-MM-dd').getInfo()} to {end.format('YYYY-MM-dd').getInfo()}", file=sys.stderr)
            return None
        ndsi_collection = filtered_collection.map(mask_s2_clouds).map(calculate_ndsi)
        ndsi_only_collection = ndsi_collection.select(['NDSI'])
        ndsi_median_img = ndsi_only_collection.median().clip(region_geometry)
        bands = ndsi_median_img.bandNames().getInfo()
        print(f"DEBUG: Bands of median NDSI image: {bands}", file=sys.stderr)
        if not bands or 'NDSI' not in bands:
            print("WARNING: No NDSI band in median composite", file=sys.stderr)
            return None
        return ndsi_median_img
    except Exception as e:
        print(f"ERROR in get_median_ndsi_image: {e}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        return None

def glacier_area_mask(image, ndsi_threshold=0.4):
    glacier = image.select('NDSI').gt(ndsi_threshold).rename('glacier')
    return glacier

def get_ndsi_image_url(image, region_geometry, vis_params, label):
    try:
        url = image.getThumbURL({
            'min': vis_params.get('min', -1),
            'max': vis_params.get('max', 1),
            'dimensions': vis_params.get('dimensions', 512),
            'palette': vis_params.get('palette', ['black', 'white', 'lightblue']),
            'region': region_geometry
        })
        return url
    except Exception as e:
        print(f"WARNING: Could not get {label} glacier image URL: {e}", file=sys.stderr)
        return None

def try_alternative_baseline(s2_collection, region_geometry, end_date_recent):
    print("Attempting to find alternative baseline period with sufficient data...", file=sys.stderr)
    for year_offset in BASELINE_FALLBACK_YEARS:
        try:
            end_date_alt = end_date_recent.advance(-year_offset, 'year')
            start_date_alt = end_date_alt.advance(-BASELINE_PERIOD_DURATION_DAYS, 'day')
            print(f"Trying alternate baseline: {start_date_alt.format('YYYY-MM-dd').getInfo()} to {end_date_alt.format('YYYY-MM-dd').getInfo()}", file=sys.stderr)
            alt_ndsi_img = get_median_ndsi_image(s2_collection, start_date_alt, end_date_alt, region_geometry)
            if alt_ndsi_img is not None and 'NDSI' in alt_ndsi_img.bandNames().getInfo():
                print(f"Found valid alternative baseline {year_offset} years ago.", file=sys.stderr)
                return alt_ndsi_img, start_date_alt, end_date_alt
        except Exception as e:
            print(f"Error trying alternative baseline {year_offset} years ago: {e}", file=sys.stderr)
            continue
    print("All alternative baseline periods failed.", file=sys.stderr)
    return None, None, None

def check_glacier_melting(region_geometry, threshold_percent, buffer_radius_meters):
    try:
        from datetime import timezone
        end_date_recent = ee.Date(datetime.datetime.now(timezone.utc))
        start_date_recent = end_date_recent.advance(-RECENT_PERIOD_DAYS, 'day')
        end_date_baseline = end_date_recent.advance(-BASELINE_PERIOD_YEARS_AGO, 'year')
        start_date_baseline = end_date_baseline.advance(-BASELINE_PERIOD_DURATION_DAYS, 'day')

        try:
            start_date_baseline_str = start_date_baseline.format('YYYY-MM-dd').getInfo()
            end_date_baseline_str = end_date_baseline.format('YYYY-MM-dd').getInfo()
            start_date_recent_str = start_date_recent.format('YYYY-MM-dd').getInfo()
            end_date_recent_str = end_date_recent.format('YYYY-MM-dd').getInfo()
            print(f"Analysis Periods: Baseline {start_date_baseline_str} -> {end_date_baseline_str}", file=sys.stderr)
            print(f"                  Recent   {start_date_recent_str} -> {end_date_recent_str}", file=sys.stderr)
        except Exception as date_error:
            print(f"WARNING: Unable to format date strings for logging: {date_error}", file=sys.stderr)

        s2_collection = ee.ImageCollection(S2_COLLECTION).filterBounds(region_geometry)
        recent_ndsi_img = get_median_ndsi_image(s2_collection, start_date_recent, end_date_recent, region_geometry)
        if recent_ndsi_img is None:
            error_message = "No cloud-free data available for recent period. Cannot perform analysis."
            print(f"ERROR: {error_message}", file=sys.stderr)
            return {
                "status": "error",
                "message": error_message,
                "alert_triggered": False,
                "baseline_area_sqkm": None,
                "recent_area_sqkm": None,
                "loss_percent": None,
                "threshold_percent": threshold_percent,
                "buffer_radius_meters": buffer_radius_meters,
                "start_image_url": None,
                "end_image_url": None
            }
        baseline_ndsi_img = get_median_ndsi_image(s2_collection, start_date_baseline, end_date_baseline, region_geometry)
        if baseline_ndsi_img is None:
            print("Primary baseline period has no data, trying alternatives...", file=sys.stderr)
            baseline_ndsi_img, start_date_baseline, end_date_baseline = try_alternative_baseline(
                s2_collection, region_geometry, end_date_recent
            )
            if baseline_ndsi_img is None:
                error_message = "No cloud-free data available for any baseline period. Cannot perform analysis."
                print(f"ERROR: {error_message}", file=sys.stderr)
                return {
                    "status": "error",
                    "message": error_message,
                    "alert_triggered": False,
                    "baseline_area_sqkm": None,
                    "recent_area_sqkm": None,
                    "loss_percent": None,
                    "threshold_percent": threshold_percent,
                    "buffer_radius_meters": buffer_radius_meters,
                    "start_image_url": None,
                    "end_image_url": None
                }

        baseline_bands = baseline_ndsi_img.bandNames().getInfo()
        recent_bands = recent_ndsi_img.bandNames().getInfo()
        print("DEBUG: Bands of baseline_ndsi_img:", baseline_bands, file=sys.stderr)
        print("DEBUG: Bands of recent_ndsi_img:", recent_bands, file=sys.stderr)

        if not baseline_bands or 'NDSI' not in baseline_bands:
            error_message = "No NDSI band found in baseline composite. No cloud-free data available in this period/region."
            print("ERROR:", error_message, file=sys.stderr)
            return {
                "status": "error",
                "message": error_message,
                "alert_triggered": False,
                "baseline_area_sqkm": None,
                "recent_area_sqkm": None,
                "loss_percent": None,
                "threshold_percent": threshold_percent,
                "buffer_radius_meters": buffer_radius_meters,
                "start_image_url": None,
                "end_image_url": None
            }
        if not recent_bands or 'NDSI' not in recent_bands:
            error_message = "No NDSI band found in recent composite. No cloud-free data available in this period/region."
            print("ERROR:", error_message, file=sys.stderr)
            return {
                "status": "error",
                "message": error_message,
                "alert_triggered": False,
                "baseline_area_sqkm": None,
                "recent_area_sqkm": None,
                "loss_percent": None,
                "threshold_percent": threshold_percent,
                "buffer_radius_meters": buffer_radius_meters,
                "start_image_url": None,
                "end_image_url": None
            }

        baseline_glacier_mask = glacier_area_mask(baseline_ndsi_img)
        recent_glacier_mask = glacier_area_mask(recent_ndsi_img)

        print("DEBUG: baseline_glacier_mask type:", type(baseline_glacier_mask), file=sys.stderr)
        print("DEBUG: recent_glacier_mask type:", type(recent_glacier_mask), file=sys.stderr)

        pixel_area = ee.Image.pixelArea().divide(1e6).rename('area_km2')

        baseline_area_stats = baseline_glacier_mask.multiply(pixel_area).reduceRegion(
            reducer=ee.Reducer.sum(),
            geometry=region_geometry,
            scale=REDUCTION_SCALE,
            maxPixels=1e9,
            bestEffort=True
        )
        recent_area_stats = recent_glacier_mask.multiply(pixel_area).reduceRegion(
            reducer=ee.Reducer.sum(),
            geometry=region_geometry,
            scale=REDUCTION_SCALE,
            maxPixels=1e9,
            bestEffort=True
        )

        baseline_area = None
        recent_area = None
        loss_percent = 0.0
        alert_triggered = False
        error_message = None
        try:
            baseline_result = baseline_area_stats.get('glacier')
            if baseline_result is not None:
                baseline_area = baseline_result.getInfo()
                if baseline_area is None:
                    baseline_area = 0.0
            else:
                baseline_area = 0.0

            recent_result = recent_area_stats.get('glacier')
            if recent_result is not None:
                recent_area = recent_result.getInfo()
                if recent_area is None:
                    recent_area = 0.0
            else:
                recent_area = 0.0

            if baseline_area > 0:
                loss_percent = (baseline_area - recent_area) / baseline_area * 100
            else:
                loss_percent = 0.0

            alert_triggered = loss_percent > threshold_percent

            print(f"Baseline Glacier Area: {baseline_area:.4f} sqkm", file=sys.stderr)
            print(f"Recent Glacier Area: {recent_area:.4f} sqkm", file=sys.stderr)
            print(f"Loss Percentage: {loss_percent:.2f}%", file=sys.stderr)
            print(f"Alert Triggered (>{threshold_percent}%): {alert_triggered}", file=sys.stderr)
        except Exception as reduce_error:
            print(f"ERROR: Failed during reduceRegion getInfo(): {reduce_error}", file=sys.stderr)
            print(traceback.format_exc(), file=sys.stderr)
            return {
                "status": "error",
                "message": f"Failed to retrieve area statistics: {reduce_error}. Check region geometry and date ranges.",
                "alert_triggered": False,
                "baseline_area_sqkm": None,
                "recent_area_sqkm": None,
                "loss_percent": None,
                "threshold_percent": threshold_percent,
                "buffer_radius_meters": buffer_radius_meters,
                "start_image_url": None,
                "end_image_url": None
            }

        vis_params = {
            'min': -1,
            'max': 1,
            'palette': ['black', 'white', 'lightblue'],
            'dimensions': 512
        }
        start_image_url = get_ndsi_image_url(baseline_ndsi_img, region_geometry, vis_params, "before")
        end_image_url = get_ndsi_image_url(recent_ndsi_img, region_geometry, vis_params, "after")

        try:
            response_dates = {
                "recent_period_start": start_date_recent.format('YYYY-MM-dd').getInfo(),
                "recent_period_end": end_date_recent.format('YYYY-MM-dd').getInfo(),
                "baseline_period_start": start_date_baseline.format('YYYY-MM-dd').getInfo(),
                "baseline_period_end": end_date_baseline.format('YYYY-MM-dd').getInfo(),
            }
        except Exception:
            response_dates = {}

        if error_message:
            return {
                "status": "error",
                "message": error_message,
                "alert_triggered": False,
                "baseline_area_sqkm": baseline_area,
                "recent_area_sqkm": recent_area,
                "loss_percent": loss_percent,
                "threshold_percent": threshold_percent,
                **response_dates,
                "buffer_radius_meters": buffer_radius_meters,
                "start_image_url": start_image_url,
                "end_image_url": end_image_url
            }

        return {
            "status": "success",
            "alert_triggered": alert_triggered,
            "baseline_area_sqkm": baseline_area,
            "recent_area_sqkm": recent_area,
            "loss_percent": loss_percent,
            "threshold_percent": threshold_percent,
            **response_dates,
            "buffer_radius_meters": buffer_radius_meters,
            "start_image_url": start_image_url,
            "end_image_url": end_image_url
        }

    except ee.EEException as gee_error:
        error_str = str(gee_error)
        print(f"ERROR: GEE computation failed: {error_str}", file=sys.stderr)
        message = f"GEE Computation Error: {error_str}"
        return {
            "status": "error",
            "message": message,
            "alert_triggered": False,
            "baseline_area_sqkm": None,
            "recent_area_sqkm": None,
            "loss_percent": None,
            "threshold_percent": threshold_percent,
            "buffer_radius_meters": buffer_radius_meters,
            "start_image_url": None,
            "end_image_url": None
        }
    except Exception as e:
        print(f"ERROR: Unexpected Python error during GEE processing: {e}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        return {
            "status": "error",
            "message": f"Python Script Error: {e}",
            "alert_triggered": False,
            "baseline_area_sqkm": None,
            "recent_area_sqkm": None,
            "loss_percent": None,
            "threshold_percent": threshold_percent,
            "buffer_radius_meters": buffer_radius_meters,
            "start_image_url": None,
            "end_image_url": None
        }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("ERROR: Missing credentials file path argument.", file=sys.stderr)
        print(json.dumps({"status": "error", "message": "Missing credentials file path argument."}))
        sys.exit(1)
    credentials_path_from_arg = sys.argv[1]

    input_data_str = sys.stdin.read()
    threshold_pct = DEFAULT_GLACIER_ALERT_THRESHOLD_PERCENT
    region_id = "unknown_region"
    buffer_radius = DEFAULT_POINT_BUFFER

    try:
        input_params = json.loads(input_data_str)
        geojson_geometry = input_params['geometry']
        threshold_pct = float(input_params.get('threshold_percent', DEFAULT_GLACIER_ALERT_THRESHOLD_PERCENT))
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

    print(f"Starting GEE glacier melting analysis for region: {region_id}...", file=sys.stderr)
    start_time = time.time()
    analysis_result = check_glacier_melting(ee_geometry, threshold_pct, effective_buffer)
    end_time = time.time()
    print(f"GEE analysis duration: {end_time - start_time:.2f} seconds.", file=sys.stderr)

    analysis_result['region_id'] = region_id
    print(json.dumps(analysis_result))

    if analysis_result.get("status") == "success":
        sys.exit(0)
    else:
        sys.exit(1)