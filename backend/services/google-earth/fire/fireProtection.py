import sys
import json
import os
import ee
import datetime
import time
import traceback

DEFAULT_DAYS_BACK = 5  # How many days back to check for fires

MODIS_FIRE_COLLECTION = 'MODIS/006/MCD14DL'  # NASA MODIS Fire/Hotspot Thermal Anomalies
gcp_project_id = 'project-ultron-457221'

def initialize_gee(credentials_path_arg):
    global gcp_project_id
    try:
        credentials_path = credentials_path_arg
        print(f"DEBUG: Received credentials path via argument: {credentials_path}", file=sys.stderr)
        if not credentials_path or not os.path.exists(credentials_path):
            print(f"ERROR: Credentials file not found or path empty: {credentials_path}", file=sys.stderr)
            return False
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

def detect_active_fires(region_geometry, days_back):
    try:
        now = datetime.datetime.now(datetime.timezone.utc)
        end_date = ee.Date(now)
        start_date = end_date.advance(-days_back, 'day')

        fire_collection = ee.FeatureCollection(MODIS_FIRE_COLLECTION) \
            .filterDate(start_date, end_date) \
            .filterBounds(region_geometry)

        fire_count = fire_collection.size().getInfo()
        print(f"Detected {fire_count} active fire pixels in region (last {days_back} days)", file=sys.stderr)

        fires_list = []
        if fire_count > 0:
            # For illustration, get up to 20 fire points' info
            sample = fire_collection.limit(20).getInfo()
            for feat in sample['features']:
                fire_info = {
                    "acq_date": feat['properties'].get('acq_date'),
                    "acq_time": feat['properties'].get('acq_time'),
                    "brightness": feat['properties'].get('brightness'),
                    "confidence": feat['properties'].get('confidence'),
                    "latitude": feat['geometry']['coordinates'][1],
                    "longitude": feat['geometry']['coordinates'][0]
                }
                fires_list.append(fire_info)

        return {
            "status": "success",
            "active_fire_count": fire_count,
            "fires": fires_list,
            "days_back": days_back
        }
    except ee.EEException as gee_error:
        error_str = str(gee_error)
        print(f"ERROR: GEE computation failed: {error_str}", file=sys.stderr)
        return {
            "status": "error",
            "message": f"GEE Computation Error: {error_str}"
        }
    except Exception as e:
        print(f"ERROR: Unexpected Python error during GEE processing: {e}", file=sys.stderr)
        print(traceback.format_exc(), file=sys.stderr)
        return {
            "status": "error",
            "message": f"Python Script Error: {e}"
        }

if __name__ == "__main__":
    if len(sys.argv) < 2:
        print("ERROR: Missing credentials file path argument.", file=sys.stderr)
        print(json.dumps({"status": "error", "message": "Missing credentials file path argument."}))
        sys.exit(1)
    credentials_path_from_arg = sys.argv[1]

    input_data_str = sys.stdin.read()
    days_back = DEFAULT_DAYS_BACK
    region_id = "unknown_region"

    try:
        input_params = json.loads(input_data_str)
        geojson_geometry = input_params['geometry']
        days_back = int(input_params.get('days_back', DEFAULT_DAYS_BACK))
        region_id = str(input_params.get('region_id', region_id))
        print(f"Received job: region='{region_id}', days_back={days_back}", file=sys.stderr)
    except Exception as e:
        print(f"ERROR: Invalid stdin params: {e}", file=sys.stderr)
        print(json.dumps({"status": "error", "message": f"Invalid Stdin Param: {e}", "region_id": region_id}))
        sys.exit(1)

    if not initialize_gee(credentials_path_from_arg):
        print(json.dumps({"status": "error", "message": "GEE initialization failed.", "region_id": region_id}))
        sys.exit(1)

    ee_geometry = None
    try:
        geom_type = geojson_geometry.get('type')
        coords = geojson_geometry.get('coordinates')
        if geom_type == 'Polygon':
            ee_geometry = ee.Geometry.Polygon(coords)
        elif geom_type == 'MultiPolygon':
            ee_geometry = ee.Geometry.MultiPolygon(coords)
        elif geom_type == 'Point':
            ee_geometry = ee.Geometry.Point(coords).buffer(10000)  # 10km buffer for points
        else:
            raise ValueError(f"Unsupported type: {geom_type}")
    except Exception as e:
        print(f"ERROR: GeoJSON convert fail: {e}", file=sys.stderr)
        print(json.dumps({"status": "error", "message": f"GeoJSON Error: {e}", "region_id": region_id}))
        sys.exit(1)

    print(f"Starting GEE fire detection analysis for region: {region_id}...", file=sys.stderr)
    start_time = time.time()
    analysis_result = detect_active_fires(ee_geometry, days_back)
    end_time = time.time()
    print(f"GEE analysis duration: {end_time - start_time:.2f} seconds.", file=sys.stderr)
    analysis_result['region_id'] = region_id
    print(json.dumps(analysis_result))
    if analysis_result.get("status") == "success":
        sys.exit(0)
    else:
        sys.exit(1)