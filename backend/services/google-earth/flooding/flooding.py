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

RECENT_FLOOD_PERIOD_DAYS = 14
BASELINE_PERIOD_OFFSET_YEARS = 1
BASELINE_PERIOD_DURATION_DAYS = 14

S1_COLLECTION = 'COPERNICUS/S1_GRD'
S1_POLARIZATION = 'VV'
S1_INSTRUMENT_MODE = 'IW'
WATER_THRESHOLD_DB = -16
REDUCTION_SCALE_S1 = 30
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
    except ee.EEException as e: print(f"ERROR: Failed GEE init: {e}", file=sys.stderr); return False
    except Exception as e: print(f"ERROR: Unexpected GEE init error: {e}", file=sys.stderr); print(traceback.format_exc(), file=sys.stderr); return False

def apply_water_threshold(image):
    water = image.select(S1_POLARIZATION).lt(WATER_THRESHOLD_DB).rename('water')
    return water.copyProperties(image, ['system:time_start'])

def get_flood_image_url(image, region_geometry, vis_params, label):
    try:
        url = image.getThumbURL({
            'min': vis_params.get('min', 0),
            'max': vis_params.get('max', 1),
            'dimensions': vis_params.get('dimensions', 512),
            'palette': vis_params.get('palette', ['#333399', '#00ffff']),
            'region': region_geometry
        })
        return url
    except Exception as e:
        print(f"WARNING: Could not get {label} flood image URL: {e}", file=sys.stderr)
        return None

def check_flooding(region_geometry, threshold_percent, buffer_radius_meters):
    try:
        from datetime import timezone
        end_date_recent = ee.Date(datetime.datetime.now(timezone.utc))
        start_date_recent = end_date_recent.advance(-RECENT_FLOOD_PERIOD_DAYS, 'day')

        end_date_baseline = end_date_recent.advance(-BASELINE_PERIOD_OFFSET_YEARS, 'year')
        start_date_baseline = end_date_baseline.advance(-BASELINE_PERIOD_DURATION_DAYS, 'day')

        s1_collection = (ee.ImageCollection(S1_COLLECTION)
                          .filter(ee.Filter.eq('instrumentMode', S1_INSTRUMENT_MODE))
                          .filter(ee.Filter.listContains('transmitterReceiverPolarisation', S1_POLARIZATION))
                          .filterBounds(region_geometry)
                          .select(S1_POLARIZATION))

        recent_s1 = s1_collection.filterDate(start_date_recent, end_date_recent)
        baseline_s1 = s1_collection.filterDate(start_date_baseline, end_date_baseline)

        recent_water_composite = recent_s1.map(apply_water_threshold).median().unmask(0).clip(region_geometry)
        baseline_water_composite = baseline_s1.map(apply_water_threshold).median().unmask(0).clip(region_geometry)

        # --- Generate before/after images for frontend ---
        vis_params = {
            'min': 0,
            'max': 1,
            'palette': ['#333399', '#00ffff'],
            'dimensions': 512
        }
        start_image_url = get_flood_image_url(baseline_water_composite, region_geometry, vis_params, "before")
        end_image_url = get_flood_image_url(recent_water_composite, region_geometry, vis_params, "after")

        # --- Calculate Flood Water ---
        flood_water_mask = recent_water_composite.subtract(baseline_water_composite).gt(0).rename('flood_water')
        pixel_area = ee.Image.pixelArea().divide(1000000).rename('area')
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
                    flooded_area_sqkm = 0.0
            else:
                flooded_area_sqkm = 0.0

            total_area_result = total_area_stats.get('area')
            if total_area_result is not None:
                total_area_sqkm = total_area_result.getInfo()
                if total_area_sqkm is None or total_area_sqkm == 0:
                    error_message = "Could not calculate total area of the region."
                    total_area_sqkm = 0
                elif total_area_sqkm > 0:
                    flooded_percentage = (flooded_area_sqkm / total_area_sqkm) * 100 if total_area_sqkm else 0.0
                    alert_triggered = flooded_percentage > threshold_percent
            else:
                error_message = "Could not calculate total area of the region."
                total_area_sqkm = 0
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
                "buffer_radius_meters": buffer_radius_meters,
                "start_image_url": start_image_url,
                "end_image_url": end_image_url
            }

        try:
            response_dates = {
                "recent_period_start": start_date_recent.format('YYYY-MM-dd').getInfo(),
                "recent_period_end": end_date_recent.format('YYYY-MM-dd').getInfo(),
                "baseline_period_start": start_date_baseline.format('YYYY-MM-dd').getInfo(),
                "baseline_period_end": end_date_baseline.format('YYYY-MM-dd').getInfo(),
            }
        except Exception as date_format_error:
            response_dates = {}

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
                "buffer_radius_meters": buffer_radius_meters,
                "start_image_url": start_image_url,
                "end_image_url": end_image_url
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
            "water_detection_threshold_db": WATER_THRESHOLD_DB,
            "start_image_url": start_image_url,
            "end_image_url": end_image_url
        }

    except ee.EEException as gee_error:
        error_str = str(gee_error)
        print(f"ERROR: GEE computation failed: {error_str}", file=sys.stderr)
        return {
            "status": "error",
            "message": f"GEE Computation Error: {error_str}",
            "alert_triggered": False,
            "flooded_area_sqkm": None,
            "flooded_percentage": None,
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
            "flooded_area_sqkm": None,
            "flooded_percentage": None,
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
    except Exception as e:
        print(f"ERROR: GeoJSON convert fail: {e}", file=sys.stderr)
        print(json.dumps({"status": "error", "message": f"GeoJSON Error: {e}", "region_id": region_id}))
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