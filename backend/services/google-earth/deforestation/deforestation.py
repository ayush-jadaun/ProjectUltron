import sys
import json
import os
import ee
import datetime
import time
import traceback
from pathlib import Path

DEFAULT_NDVI_DROP_THRESHOLD = -0.1


RECENT_PERIOD_DAYS = 6
PREVIOUS_PERIOD_DAYS = 6
# -----------------------------------------------

SATELLITE_COLLECTION = 'COPERNICUS/S2_SR_HARMONIZED'
NIR_BAND = 'B8'
RED_BAND = 'B4'
CLOUD_MASK_BAND = 'SCL'
SCL_MASK_VALUES = [3, 8, 9, 10, 11]
REDUCTION_SCALE = 30
DEFAULT_POINT_BUFFER = 1000
gcp_project_id = 'project-ultron-457221' 


def initialize_gee(credentials_path_arg):
    global gcp_project_id
    try:
        credentials_path = credentials_path_arg
        print(f"DEBUG: Received credentials path via argument: {credentials_path}", file=sys.stderr)
        if not credentials_path: return False # Simplified
        if not os.path.exists(credentials_path):
             print(f"ERROR: Credentials file not found: {credentials_path}", file=sys.stderr)
             return False
        print(f"Attempting GEE init with key: {credentials_path}", file=sys.stderr)
        credentials = ee.ServiceAccountCredentials(None, key_file=credentials_path)
        ee.Initialize(credentials=credentials, project=gcp_project_id, opt_url='https://earthengine-highvolume.googleapis.com')
        print(f"GEE Initialized OK for project: {gcp_project_id}.", file=sys.stderr)
        return True
    except ee.EEException as e: print(f"ERROR: Failed GEE init: {e}", file=sys.stderr); return False
    except Exception as e: print(f"ERROR: Unexpected GEE init error: {e}", file=sys.stderr); print(traceback.format_exc(), file=sys.stderr); return False


def mask_s2_clouds(image):
    scl = image.select(CLOUD_MASK_BAND)
    mask = scl.remap(SCL_MASK_VALUES, [0]*len(SCL_MASK_VALUES), defaultValue=1)
    return image.updateMask(mask)


def calculate_ndvi(image):
    ndvi = image.normalizedDifference([NIR_BAND, RED_BAND]).rename('NDVI')
    return image.addBands(ndvi).copyProperties(image, ['system:time_start'])


def check_deforestation(region_geometry, threshold, buffer_radius_meters):
    """
    Performs GEE analysis to detect significant NDVI drop within a specified region.
    """
    try:
        # Define Time Periods
        end_date_recent = ee.Date(datetime.datetime.utcnow())
        start_date_recent = end_date_recent.advance(-RECENT_PERIOD_DAYS, 'day')
        end_date_previous = start_date_recent
        start_date_previous = end_date_previous.advance(-PREVIOUS_PERIOD_DAYS, 'day')
        
        # Safely get date strings for logging
        try:
            start_date_previous_str = start_date_previous.format().getInfo()
            end_date_previous_str = end_date_previous.format().getInfo()
            start_date_recent_str = start_date_recent.format().getInfo()
            end_date_recent_str = end_date_recent.format().getInfo()
            print(f"Analysis Periods: {start_date_previous_str}->{end_date_previous_str} vs {start_date_recent_str}->{end_date_recent_str}", file=sys.stderr)
        except Exception as date_error:
            print(f"WARNING: Unable to format date strings for logging: {date_error}", file=sys.stderr)
            # Continue execution - this is just for logging

        # Load/Filter Collection
        s2_collection = ee.ImageCollection(SATELLITE_COLLECTION).filterBounds(region_geometry)

        # Process Periods & Calculate NDVI Composites
        previous_ndvi_composite = s2_collection.filterDate(start_date_previous, end_date_previous).map(mask_s2_clouds).map(calculate_ndvi).select('NDVI').median().clip(region_geometry)
        recent_ndvi_composite = s2_collection.filterDate(start_date_recent, end_date_recent).map(mask_s2_clouds).map(calculate_ndvi).select('NDVI').median().clip(region_geometry)

        # Calculate Difference & Reduce Region
        ndvi_difference = recent_ndvi_composite.subtract(previous_ndvi_composite)
        change_stats = ndvi_difference.reduceRegion(
            reducer=ee.Reducer.mean(),
            geometry=region_geometry,
            scale=REDUCTION_SCALE,
            maxPixels=1e9,
            bestEffort=True
        )
        
        # Safely get the mean change value with proper error handling
        mean_ndvi_change = None
        try:
            ndvi_change_ee = change_stats.get('NDVI')
            if ndvi_change_ee is None:
                raise ValueError("NDVI value is None in the result dictionary")
                
            mean_ndvi_change = ndvi_change_ee.getInfo()
            if mean_ndvi_change is None:
                raise ValueError("getInfo() returned None for NDVI value")
                
        except Exception as ndvi_error:
            print(f"WARNING: Failed to retrieve NDVI change value: {ndvi_error}", file=sys.stderr)
            return {
                "status": "error",
                "message": f"Could not calculate mean NDVI change. No valid pixels found in the region for the specified time periods after cloud masking. Try adjusting dates, buffer size ({buffer_radius_meters}m), or check region coordinates.",
                "mean_ndvi_change": None,
                "alert_triggered": False,
                "threshold": threshold,
                "buffer_radius_meters": buffer_radius_meters
            }

        print(f"Mean NDVI Change: {mean_ndvi_change}", file=sys.stderr)
        alert_triggered = mean_ndvi_change < threshold

        # Safely get date strings for response
        try:
            response_dates = {
                "recent_period_start": start_date_recent.format().getInfo(),
                "recent_period_end": end_date_recent.format().getInfo(),
                "previous_period_start": start_date_previous.format().getInfo(),
                "previous_period_end": end_date_previous.format().getInfo(),
            }
        except Exception as date_format_error:
            print(f"WARNING: Unable to format dates for response: {date_format_error}", file=sys.stderr)
            response_dates = {
                "recent_period_start": f"Today-{RECENT_PERIOD_DAYS}",
                "recent_period_end": "Today",
                "previous_period_start": f"Today-{RECENT_PERIOD_DAYS+PREVIOUS_PERIOD_DAYS}",
                "previous_period_end": f"Today-{RECENT_PERIOD_DAYS}",
            }

        # Return Success
        return {
            "status": "success",
            "alert_triggered": alert_triggered,
            "mean_ndvi_change": mean_ndvi_change,
            "threshold": threshold,
            **response_dates,
            "buffer_radius_meters": buffer_radius_meters
        }

    except ee.EEException as gee_error:
        print(f"ERROR: GEE computation failed: {gee_error}", file=sys.stderr)
        return {
            "status": "error",
            "message": f"GEE Computation Error: {str(gee_error)}",
            "alert_triggered": False,
            "mean_ndvi_change": None,
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
            "mean_ndvi_change": None,
            "threshold": threshold,
            "buffer_radius_meters": buffer_radius_meters
        }

# --- Main Execution Block ---
if __name__ == "__main__":
    if len(sys.argv) < 2: print("ERROR: Missing credentials..."); sys.exit(1)
    credentials_path_from_arg = sys.argv[1]
    input_data_str = sys.stdin.read()
    threshold = DEFAULT_NDVI_DROP_THRESHOLD; region_id = "unknown_region"; buffer_radius = DEFAULT_POINT_BUFFER
    try: 
        input_params = json.loads(input_data_str)
        geojson_geometry = input_params['geometry']
        threshold = float(input_params.get('threshold', DEFAULT_NDVI_DROP_THRESHOLD))
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
        
    print(f"Starting GEE analysis for region: {region_id}...", file=sys.stderr)
    start_time = time.time()
    analysis_result = check_deforestation(ee_geometry, threshold, effective_buffer)
    end_time = time.time()
    print(f"GEE analysis duration: {end_time - start_time:.2f} seconds.", file=sys.stderr)
    analysis_result['region_id'] = region_id
    print(json.dumps(analysis_result))
    if analysis_result.get("status") == "success": 
        sys.exit(0)
    else: 
        sys.exit(1)