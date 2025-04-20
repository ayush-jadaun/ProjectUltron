import React, { useState, useRef, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSubscription } from "../store/slices/subscriptionSlice";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  LayersControl,
  useMapEvents,
  useMap,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import EnvironmentBackgroundLayers from "../assets/EnvironmentBackgroundLayers";

// Satellite layers configuration
const { BaseLayer } = LayersControl;

const ALERT_CATEGORIES = [
  { label: "Deforestation", value: "DEFORESTATION" },
  { label: "Flooding", value: "FLOODING" },
  { label: "Glacier Melting", value: "GLACIER" },
  { label: "Coastal Erosion", value: "COASTAL_EROSION" },
  { label: "Fire Protection", value: "FIRE_PROTECTION" },
];

// Most global/consistent tile sources
const SATELLITE_LAYERS = [
  {
    label: "OpenStreetMap",
    value: "osm",
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution: "© OpenStreetMap contributors",
    minZoom: 1,
    maxZoom: 19,
  },
  {
    label: "Sentinel-2 (EOX, cloudless)",
    value: "sentinel2",
    url: "https://tiles.maps.eox.at/wmts/1.0.0/s2cloudless-2021_3857/default/g/{z}/{y}/{x}.jpg",
    attribution: "Sentinel-2 cloudless by EOX",
    minZoom: 1,
    maxZoom: 15,
  },
  {
    label: "NASA Blue Marble (Global, monthly)",
    value: "bluemarble",
    url: "https://gibs.earthdata.nasa.gov/wmts/epsg3857/best/BlueMarble_NextGeneration/default/2024-03-01/GoogleMapsCompatible_Level8/{z}/{y}/{x}.jpg",
    attribution: "NASA Blue Marble",
    minZoom: 1,
    maxZoom: 8,
  },
];

function PreserveBaseLayerSelection({ baseLayer, setBaseLayer }) {
  const map = useMap();

  // Use useMapEvents to listen for the baselayerchange event
  useMapEvents({
    baselayerchange: (e) => {
      setBaseLayer(e.name);
    },
    // Remove any other map events that might be triggering layer changes
  });

  // Use useEffect to ensure the correct layer is active
  useEffect(() => {
    // This prevents layer reset during map interactions
    const layers = map._layers;
    let currentBaseLayer = null;

    // Find the current active base layer
    Object.values(layers).forEach((layer) => {
      if (layer.options && layer.options.baseLayer) {
        currentBaseLayer = layer;
      }
    });

    // If the current base layer doesn't match the selected one, do nothing
    // This prevents unnecessary layer switching
  }, [map, baseLayer]);

  return null;
}

const SubscribeLocationPage = () => {
  const dispatch = useDispatch();
  const { creating, createSuccess, error } = useSelector(
    (state) => state.subscription
  );

  // Form state
  const [subscriptionName, setSubscriptionName] = useState("");
  const [regionName, setRegionName] = useState("");
  const [regionGeometry, setRegionGeometry] = useState(null);
  const [alertCategories, setAlertCategories] = useState([]);
  const [thresholdDeforestation, setThresholdDeforestation] = useState("");
  const [thresholdFlooding, setThresholdFlooding] = useState("");
  const [bufferFlooding, setBufferFlooding] = useState("");
  const [thresholdGlacier, setThresholdGlacier] = useState("");
  const [bufferGlacier, setBufferGlacier] = useState("");
  const [thresholdCoastalErosion, setThresholdCoastalErosion] = useState("");
  const [daysBackFireProtection, setDaysBackFireProtection] = useState("");
  const [isActive, setIsActive] = useState(true);

  // Map base layer state
  const [baseLayer, setBaseLayer] = useState(SATELLITE_LAYERS[0].label);
  const [mapKey, setMapKey] = useState(Date.now()); // Added key to force re-render when needed

  // Ref for the feature group
  const featureGroupRef = useRef(null);

  // Map draw handlers
  const handleCreated = (e) => {
    const geojson = e.layer.toGeoJSON().geometry;
    setRegionGeometry(geojson);
  };
  const handleEdited = (e) => {
    const layer = Object.values(e.layers._layers)[0];
    if (layer) {
      const geojson = layer.toGeoJSON().geometry;
      setRegionGeometry(geojson);
    }
  };

  // Category checkbox
  const handleCategoryChange = (val) => {
    setAlertCategories((cats) =>
      cats.includes(val) ? cats.filter((c) => c !== val) : [...cats, val]
    );
  };

  // Handle form submit
  const handleSubmit = (e) => {
    e.preventDefault();
    if (!regionGeometry) {
      alert("Please select a region on the map.");
      return;
    }
    if (alertCategories.length === 0) {
      alert("Please select at least one alert category.");
      return;
    }
    // Only include thresholds/buffers if user entered a value
    const payload = {
      subscription_name: subscriptionName,
      region_name: regionName,
      region_geometry: regionGeometry,
      alert_categories: alertCategories,
      is_active: isActive,
    };
    if (thresholdDeforestation !== "")
      payload.threshold_deforestation = parseFloat(thresholdDeforestation);
    if (thresholdFlooding !== "")
      payload.threshold_flooding = parseFloat(thresholdFlooding);
    if (bufferFlooding !== "")
      payload.buffer_flooding = parseInt(bufferFlooding, 10);
    if (thresholdGlacier !== "")
      payload.threshold_glacier = parseFloat(thresholdGlacier);
    if (bufferGlacier !== "")
      payload.buffer_glacier = parseInt(bufferGlacier, 10);
    if (thresholdCoastalErosion !== "")
      payload.threshold_coastal_erosion = parseFloat(thresholdCoastalErosion);
    if (daysBackFireProtection !== "")
      payload.days_back_fire_protection = parseInt(daysBackFireProtection, 10);

    dispatch(createSubscription(payload));
  };

  return (
    <EnvironmentBackgroundLayers>
    <div
      className="subscribe-location-page"
      style={{
        maxWidth: 800,
        margin: "0 auto",
        padding: 32,
        background: "beige",
        borderRadius: 12,
        boxShadow: "0 4px 24px 0 rgba(30,80,180,0.07)",
      }}
    >
      <h2 style={{ textAlign: "center", marginBottom: 20, color: "#194185" }}>
        Subscribe to Location Alerts
      </h2>
      <form onSubmit={handleSubmit} style={{ marginBottom: 0 }}>
        <div style={{ marginBottom: 18, display: "flex", gap: 18 }}>
          <label style={{ flex: 1 }}>
            <span style={{ fontWeight: 500 }}>Subscription Name:</span>
            <input
              type="text"
              value={subscriptionName}
              onChange={(e) => setSubscriptionName(e.target.value)}
              placeholder="Eg. Amazon Forest Watch"
              className="input"
              style={{
                width: "100%",
                marginTop: 4,
                padding: 8,
                borderRadius: 5,
                border: "1px solid #b4b4b4",
              }}
              required
            />
          </label>
          <label style={{ flex: 1 }}>
            <span style={{ fontWeight: 500 }}>Region Name:</span>
            <input
              type="text"
              value={regionName}
              onChange={(e) => setRegionName(e.target.value)}
              placeholder="Eg. Amazon Basin"
              className="input"
              style={{
                width: "100%",
                marginTop: 4,
                padding: 8,
                borderRadius: 5,
                border: "1px solid #b4b4b4",
              }}
              required
            />
          </label>
        </div>
        <div style={{ marginBottom: 22 }}>
          <label>
            <b>Select Region on Map:</b>
            <div
              style={{
                height: 420,
                marginTop: 8,
                marginBottom: 8,
                borderRadius: 7,
                overflow: "hidden",
                boxShadow: "0 2px 16px 0 rgba(30,80,180,0.10)",
              }}
            >
              <MapContainer
                key={mapKey}
                center={[20, 0]}
                zoom={2}
                style={{ height: "100%", width: "100%" }}
                scrollWheelZoom={true}
              >
                <PreserveBaseLayerSelection
                  baseLayer={baseLayer}
                  setBaseLayer={setBaseLayer}
                />
                <LayersControl position="topright">
                  {SATELLITE_LAYERS.map((layer) => (
                    <BaseLayer
                      key={layer.value}
                      checked={baseLayer === layer.label}
                      name={layer.label}
                    >
                      <TileLayer
                        url={layer.url}
                        attribution={layer.attribution}
                        minZoom={layer.minZoom}
                        maxZoom={layer.maxZoom}
                        errorTileUrl={SATELLITE_LAYERS[1].url}
                      />
                    </BaseLayer>
                  ))}
                  <FeatureGroup ref={featureGroupRef}>
                    <EditControl
                      position="topright"
                      onCreated={handleCreated}
                      onEdited={handleEdited}
                      draw={{
                        polygon: true,
                        rectangle: true,
                        circle: false,
                        marker: true,
                        polyline: false,
                        circlemarker: false,
                      }}
                    />
                  </FeatureGroup>
                </LayersControl>
              </MapContainer>
            </div>
            {regionGeometry && (
              <div style={{ color: "#148404", fontSize: 15, marginTop: 3 }}>
                <b>✓ Region selected!</b>
              </div>
            )}
          </label>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>
            <b>Alert Categories:</b>
            <div
              style={{
                marginTop: 6,
                display: "flex",
                flexWrap: "wrap",
                gap: 16,
              }}
            >
              {ALERT_CATEGORIES.map((cat) => (
                <label key={cat.value} style={{ marginRight: 14 }}>
                  <input
                    type="checkbox"
                    value={cat.value}
                    checked={alertCategories.includes(cat.value)}
                    onChange={() => handleCategoryChange(cat.value)}
                    style={{ marginRight: 6 }}
                  />
                  {cat.label}
                </label>
              ))}
            </div>
          </label>
        </div>

        {/* Threshold/buffer fields */}
        <div style={{ marginBottom: 18 }}>
          <b>Thresholds & Buffers (optional):</b>
          <div
            style={{
              display: "flex",
              flexWrap: "wrap",
              gap: 18,
              marginTop: 7,
              background: "beige",
              padding: "10px 8px",
              borderRadius: 7,
            }}
          >
            <div>
              <label>
                Deforestation Threshold
                <input
                  type="number"
                  step="any"
                  value={thresholdDeforestation}
                  onChange={(e) => setThresholdDeforestation(e.target.value)}
                  placeholder="Eg. -0.1"
                  style={{
                    width: 110,
                    marginLeft: 6,
                    borderRadius: 4,
                    border: "1px solid #b4b4b4",
                    padding: 3,
                  }}
                  disabled={!alertCategories.includes("DEFORESTATION")}
                />
              </label>
            </div>
            <div>
              <label>
                Flooding Threshold (%)
                <input
                  type="number"
                  step="any"
                  value={thresholdFlooding}
                  onChange={(e) => setThresholdFlooding(e.target.value)}
                  placeholder="Eg. 5"
                  style={{
                    width: 70,
                    marginLeft: 6,
                    borderRadius: 4,
                    border: "1px solid #b4b4b4",
                    padding: 3,
                  }}
                  disabled={!alertCategories.includes("FLOODING")}
                />
              </label>
            </div>
            <div>
              <label>
                Flood Buffer (m)
                <input
                  type="number"
                  value={bufferFlooding}
                  onChange={(e) => setBufferFlooding(e.target.value)}
                  placeholder="Eg. 100"
                  style={{
                    width: 70,
                    marginLeft: 6,
                    borderRadius: 4,
                    border: "1px solid #b4b4b4",
                    padding: 3,
                  }}
                  disabled={!alertCategories.includes("FLOODING")}
                />
              </label>
            </div>
            <div>
              <label>
                Glacier Threshold (%)
                <input
                  type="number"
                  step="any"
                  value={thresholdGlacier}
                  onChange={(e) => setThresholdGlacier(e.target.value)}
                  placeholder="Eg. 2"
                  style={{
                    width: 70,
                    marginLeft: 6,
                    borderRadius: 4,
                    border: "1px solid #b4b4b4",
                    padding: 3,
                  }}
                  disabled={!alertCategories.includes("GLACIER")}
                />
              </label>
            </div>
            <div>
              <label>
                Glacier Buffer (m)
                <input
                  type="number"
                  value={bufferGlacier}
                  onChange={(e) => setBufferGlacier(e.target.value)}
                  placeholder="Eg. 200"
                  style={{
                    width: 70,
                    marginLeft: 6,
                    borderRadius: 4,
                    border: "1px solid #b4b4b4",
                    padding: 3,
                  }}
                  disabled={!alertCategories.includes("GLACIER")}
                />
              </label>
            </div>
            <div>
              <label>
                Coastal Erosion Threshold (m)
                <input
                  type="number"
                  step="any"
                  value={thresholdCoastalErosion}
                  onChange={(e) => setThresholdCoastalErosion(e.target.value)}
                  placeholder="Eg. 5"
                  style={{
                    width: 70,
                    marginLeft: 6,
                    borderRadius: 4,
                    border: "1px solid #b4b4b4",
                    padding: 3,
                  }}
                  disabled={!alertCategories.includes("COASTAL_EROSION")}
                />
              </label>
            </div>
            <div>
              <label>
                Fire Protection Days Back
                <input
                  type="number"
                  value={daysBackFireProtection}
                  onChange={(e) => setDaysBackFireProtection(e.target.value)}
                  placeholder="Eg. 1"
                  style={{
                    width: 70,
                    marginLeft: 6,
                    borderRadius: 4,
                    border: "1px solid #b4b4b4",
                    padding: 3,
                  }}
                  min={1}
                  disabled={!alertCategories.includes("FIRE_PROTECTION")}
                />
              </label>
            </div>
          </div>
          <div style={{ fontSize: 13, color: "#555", marginTop: 3 }}>
            Leave blank for default values.
          </div>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>
            <input
              type="checkbox"
              checked={isActive}
              onChange={() => setIsActive((v) => !v)}
              style={{ marginRight: 7 }}
            />{" "}
            <span style={{ fontWeight: 500 }}>Active</span>
          </label>
        </div>
        <button
          type="submit"
          disabled={creating}
          style={{
            background: "#1976d2",
            color: "white",
            border: "none",
            padding: "10px 24px",
            borderRadius: 6,
            fontWeight: 600,
            cursor: creating ? "not-allowed" : "pointer",
            fontSize: 18,
            boxShadow: "0 2px 8px 0 rgba(40,60,130,0.09)",
            marginTop: 7,
          }}
        >
          {creating ? "Saving..." : "Subscribe"}
        </button>
        {error && <div style={{ color: "red", marginTop: 14 }}>{error}</div>}
        {createSuccess && (
          <div style={{ color: "#098814", marginTop: 14, fontWeight: 500 }}>
            Subscription created successfully!
          </div>
        )}
      </form>
    </div>
    </EnvironmentBackgroundLayers>
  );
};

export default SubscribeLocationPage;
