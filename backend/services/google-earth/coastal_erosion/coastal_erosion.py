import sys
import json
import os
import ee
import datetime
import time
import traceback
from pathlib import Path

DEFAULT_SHORELINE_RETREAT_THRESHOLD = 5.0  # meters (example threshold)
RECENT_PERIOD_DAYS = 365     # Last 12 months
BASELINE_PERIOD_DAYS = 365   # 12 months before recent
S2_COLLECTION = 'COPERNICUS/S2_SR_HARMONIZED'
REDUCTION_SCALE = 10
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

def calculate_ndwi(image):
    # NDWI = (Green - NIR) / (Green + NIR)
    ndwi = image.normalizedDifference(['B3', 'B8']).rename('NDWI')
    return image.addBands(ndwi).copyProperties(image, ['system:time_start'])

def get_median_ndwi_image(s2_collection, start, end, region_geometry):
    ndwi_collection = s2_collection.filterDate(start, end).map(mask_s2_clouds).map(calculate_ndwi)
    ndwi_only_collection = ndwi_collection.map(lambda img: img.select(['NDWI']))
    ndwi_median_img = ndwi_only_collection.median().clip(region_geometry)
    print("DEBUG: Bands of median NDWI image:", ndwi_median_img.bandNames().getInfo(), file=sys.stderr)
    return ndwi_median_img

def extract_shoreline(image, ndwi_threshold=0.0):
    # Returns an ee.Image with value 1 where NDWI > threshold (water), 0 elsewhere (land)
    return image.select('NDWI').gt(ndwi_threshold).rename('water')

def get_shoreline_edge(image, region_geometry):
    # Detect the water-land boundary (edge of water mask)
    canny = ee.Algorithms.CannyEdgeDetector(image, threshold=0.1, sigma=1)
    shoreline = canny.mask(canny).clip(region_geometry)
    return shoreline

def check_coastal_erosion(region_geometry, threshold, buffer_radius_meters):
    try:
        from datetime import datetime, timezone

        now = datetime.now(timezone.utc)
        end_date_recent = ee.Date(now)
        start_date_recent = end_date_recent.advance(-RECENT_PERIOD_DAYS, 'day')
        end_date_baseline = start_date_recent
        start_date_baseline = end_date_baseline.advance(-BASELINE_PERIOD_DAYS, 'day')

        # Sentinel-2 data starts from June 23, 2015
        SENTINEL2_START = ee.Date('2015-06-23')
        # Adjust baseline if it falls before coverage
        if start_date_baseline.millis().getInfo() < SENTINEL2_START.millis().getInfo():
            print("Baseline period before Sentinel-2 data. Adjusting to first available date.", file=sys.stderr)
            start_date_baseline = SENTINEL2_START

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

        baseline_ndwi_img = get_median_ndwi_image(s2_collection, start_date_baseline, end_date_baseline, region_geometry)
        recent_ndwi_img = get_median_ndwi_image(s2_collection, start_date_recent, end_date_recent, region_geometry)

        # Check for NDWI band presence
        baseline_bands = baseline_ndwi_img.bandNames().getInfo()
        recent_bands = recent_ndwi_img.bandNames().getInfo()
        print("DEBUG: Bands of baseline_ndwi_img:", baseline_bands, file=sys.stderr)
        print("DEBUG: Bands of recent_ndwi_img:", recent_bands, file=sys.stderr)

        if not baseline_bands or 'NDWI' not in baseline_bands:
            error_message = "No NDWI band found in baseline composite. No cloud-free data available in this period/region."
            print("ERROR:", error_message, file=sys.stderr)
            return {
                "status": "error",
                "message": error_message,
                "alert_triggered": False,
                "baseline_shoreline": None,
                "recent_shoreline": None,
                "shoreline_retreat_meters": None,
                "threshold": threshold,
                "buffer_radius_meters": buffer_radius_meters
            }
        if not recent_bands or 'NDWI' not in recent_bands:
            error_message = "No NDWI band found in recent composite. No cloud-free data available in this period/region."
            print("ERROR:", error_message, file=sys.stderr)
            return {
                "status": "error",
                "message": error_message,
                "alert_triggered": False,
                "baseline_shoreline": None,
                "recent_shoreline": None,
                "shoreline_retreat_meters": None,
                "threshold": threshold,
                "buffer_radius_meters": buffer_radius_meters
            }

        # Extract shorelines using NDWI threshold (0 is common)
        baseline_water_mask = extract_shoreline(baseline_ndwi_img)
        recent_water_mask = extract_shoreline(recent_ndwi_img)

        # Find shoreline edges
        baseline_shoreline = get_shoreline_edge(baseline_water_mask, region_geometry)
        recent_shoreline = get_shoreline_edge(recent_water_mask, region_geometry)

        # For demonstration: estimate shoreline retreat as centroid-to-centroid distance
        try:
            baseline_centroid = baseline_shoreline.geometry().centroid().coordinates().getInfo()
            recent_centroid = recent_shoreline.geometry().centroid().coordinates().getInfo()
            print(f"Baseline shoreline centroid: {baseline_centroid}", file=sys.stderr)
            print(f"Recent shoreline centroid: {recent_centroid}", file=sys.stderr)
            # Haversine distance
            from math import radians, sin, cos, sqrt, atan2
            lat1, lon1 = baseline_centroid[1], baseline_centroid[0]
            lat2, lon2 = recent_centroid[1], recent_centroid[0]
            R = 6371000
            dlat = radians(lat2 - lat1)
            dlon = radians(lon2 - lon1)
            a = sin(dlat/2)**2 + cos(radians(lat1))*cos(radians(lat2))*sin(dlon/2)**2
            c = 2 * atan2(sqrt(a), sqrt(1-a))
            shoreline_retreat_meters = R * c
        except Exception as calc_error:
            print(f"ERROR: Failed to calculate shoreline shift: {calc_error}", file=sys.stderr)
            shoreline_retreat_meters = None

        alert_triggered = shoreline_retreat_meters is not None and abs(shoreline_retreat_meters) > threshold

        # Dates for response
        try:
            response_dates = {
                "recent_period_start": start_date_recent.format('YYYY-MM-dd').getInfo(),
                "recent_period_end": end_date_recent.format('YYYY-MM-dd').getInfo(),
                "baseline_period_start": start_date_baseline.format('YYYY-MM-dd').getInfo(),
                "baseline_period_end": end_date_baseline.format('YYYY-MM-dd').getInfo(),
            }
        except Exception:
            response_dates = {}

        return {
            "status": "success" if shoreline_retreat_meters is not None else "error",
            "alert_triggered": alert_triggered,
            "shoreline_retreat_meters": shoreline_retreat_meters,
            "threshold": threshold,
            **response_dates,
            "buffer_radius_meters": buffer_radius_meters
        }

    except ee.EEException as gee_error:
        error_str = str(gee_error)
        print(f"ERROR: GEE computation failed: {error_str}", file=sys.stderr)
        message = f"GEE Computation Error: {error_str}"
        return {
            "status": "error",
            "message": message,
            "alert_triggered": False,
            "shoreline_retreat_meters": None,
            "threshold": threshold,
            "buffer_radius_meters": buffer_radius_meters
        }
    except Exception as e:
        print(f"ERROR: Unexpected Python error during GEE processing: {e}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        return {
            "status": "error",
            "message": f"Python Script Error: {e}",
            "alert_triggered": False,
            "shoreline_retreat_meters": None,
            "threshold": threshold,
            "buffer_radius_meters": buffer_radius_meters
        }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("ERROR: Missing credentials file path argument.", file=sys.stderr)
        print(json.dumps({"status": "error", "message": "Missing credentials file path argument."}))
        sys.exit(1)
    credentials_path_from_arg = sys.argv[1]

    input_data_str = sys.stdin.read()
    threshold = DEFAULT_SHORELINE_RETREAT_THRESHOLD
    region_id = "unknown_region"
    buffer_radius = DEFAULT_POINT_BUFFER

    try:
        input_params = json.loads(input_data_str)
        geojson_geometry = input_params['geometry']
        threshold = float(input_params.get('threshold', DEFAULT_SHORELINE_RETREAT_THRESHOLD))
        region_id = str(input_params.get('region_id', region_id))
        buffer_radius = int(input_params.get('buffer_meters', DEFAULT_POINT_BUFFER))
        print(f"Received job: region='{region_id}', thresh={threshold}, buffer={buffer_radius}m", file=sys.stderr)
    except Exception as e:
        print(f"ERROR: Invalid stdin params: {e}", file=sys.stderr)
        print(json.dumps({"status": "error", "message": f"Invalid Stdin Param: {e}", "region_id": region_id}))
        sys.exit(1)

    if not initialize_gee(credentials_path_from_arg):
        print(json.dumps({"status": "error", "message": "GEE initialization failed.", "region_id": region_id}))
        sys.exit(1)

    ee_geometry = None
    effective_buffer = None
    try:
        geom_type = geojson_geometry.get('type')
        coords = geojson_geometry.get('coordinates')
        if geom_type == 'Polygon':
            ee_geometry = ee.Geometry.Polygon(coords)
        elif geom_type == 'MultiPolygon':
            ee_geometry = ee.Geometry.MultiPolygon(coords)
        elif geom_type == 'Point':
            ee_geometry = ee.Geometry.Point(coords).buffer(buffer_radius)
            effective_buffer = buffer_radius
        else:
            raise ValueError(f"Unsupported type: {geom_type}")
    except Exception as e:
        print(f"ERROR: GeoJSON convert fail: {e}", file=sys.stderr)
        print(json.dumps({"status": "error", "message": f"GeoJSON Error: {e}", "region_id": region_id}))
        sys.exit(1)

    print(f"Starting GEE coastal erosion analysis for region: {region_id}...", file=sys.stderr)
    start_time = time.time()
    analysis_result = check_coastal_erosion(ee_geometry, threshold, effective_buffer)
    end_time = time.time()
    print(f"GEE analysis duration: {end_time - start_time:.2f} seconds.", file=sys.stderr)
    analysis_result['region_id'] = region_id
    print(json.dumps(analysis_result))
    if analysis_result.get("status") == "success":
        sys.exit(0)
    else:
        sys.exit(1)