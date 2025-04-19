import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createSubscription } from "../store/slices/subscriptionSlice";
import { MapContainer, TileLayer, FeatureGroup } from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";

const ALERT_CATEGORIES = [
  { label: "Deforestation", value: "DEFORESTATION" },
  { label: "Flooding", value: "FLOODING" },
  { label: "Glacier Melting", value: "GLACIER" },
  { label: "Coastal Erosion", value: "COASTAL_EROSION" },
];

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
  // Thresholds/buffers (per category)
  const [thresholdDeforestation, setThresholdDeforestation] = useState("");
  const [thresholdFlooding, setThresholdFlooding] = useState("");
  const [bufferFlooding, setBufferFlooding] = useState("");
  const [thresholdGlacier, setThresholdGlacier] = useState("");
  const [bufferGlacier, setBufferGlacier] = useState("");
  const [thresholdCoastalErosion, setThresholdCoastalErosion] = useState("");
  const [isActive, setIsActive] = useState(true);

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

    dispatch(createSubscription(payload));
  };

  return (
    <div
      className="subscribe-location-page"
      style={{ maxWidth: 650, margin: "0 auto", padding: 24 }}
    >
      <h2>Subscribe to Location Alerts</h2>
      <form onSubmit={handleSubmit}>
        <div style={{ marginBottom: 18 }}>
          <label>
            Subscription Name:
            <input
              type="text"
              value={subscriptionName}
              onChange={(e) => setSubscriptionName(e.target.value)}
              placeholder="Eg. Amazon Forest Watch"
              className="input"
              style={{ width: "100%" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>
            Region Name:
            <input
              type="text"
              value={regionName}
              onChange={(e) => setRegionName(e.target.value)}
              placeholder="Eg. Amazon Basin"
              className="input"
              style={{ width: "100%" }}
            />
          </label>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>
            <b>Select Region on Map:</b>
            <div style={{ height: 400, marginTop: 8, marginBottom: 8 }}>
              <MapContainer
                center={[20, 0]}
                zoom={2}
                style={{ height: "100%" }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap contributors"
                />
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
              </MapContainer>
            </div>
            {regionGeometry && (
              <div style={{ color: "green", fontSize: 14 }}>
                Region selected!
              </div>
            )}
          </label>
        </div>
        <div style={{ marginBottom: 18 }}>
          <label>
            <b>Alert Categories:</b>
            <div style={{ marginTop: 6 }}>
              {ALERT_CATEGORIES.map((cat) => (
                <label key={cat.value} style={{ marginRight: 18 }}>
                  <input
                    type="checkbox"
                    value={cat.value}
                    checked={alertCategories.includes(cat.value)}
                    onChange={() => handleCategoryChange(cat.value)}
                  />{" "}
                  {cat.label}
                </label>
              ))}
            </div>
          </label>
        </div>

        {/* Threshold/buffer fields */}
        <div style={{ marginBottom: 12 }}>
          <b>Thresholds & Buffers (optional):</b>
          <div
            style={{ display: "flex", flexWrap: "wrap", gap: 12, marginTop: 8 }}
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
                  style={{ width: 110 }}
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
                  style={{ width: 70 }}
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
                  style={{ width: 70 }}
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
                  style={{ width: 70 }}
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
                  style={{ width: 70 }}
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
                  style={{ width: 70 }}
                  disabled={!alertCategories.includes("COASTAL_EROSION")}
                />
              </label>
            </div>
          </div>
          <div style={{ fontSize: 13, color: "#555", marginTop: 3 }}>
            Leave blank for default values.
          </div>
        </div>
        <div style={{ marginBottom: 12 }}>
          <label>
            <input
              type="checkbox"
              checked={isActive}
              onChange={() => setIsActive((v) => !v)}
            />{" "}
            Active
          </label>
        </div>
        <button
          type="submit"
          disabled={creating}
          style={{
            background: "#1976d2",
            color: "white",
            border: "none",
            padding: "10px 18px",
            borderRadius: 4,
            fontWeight: 600,
            cursor: creating ? "not-allowed" : "pointer",
            fontSize: 16,
          }}
        >
          {creating ? "Saving..." : "Subscribe"}
        </button>
        {error && <div style={{ color: "red", marginTop: 14 }}>{error}</div>}
        {createSuccess && (
          <div style={{ color: "green", marginTop: 14 }}>
            Subscription created successfully!
          </div>
        )}
      </form>
    </div>
  );
};

export default SubscribeLocationPage;
