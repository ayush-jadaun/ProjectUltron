import React, { useState, useRef, useEffect } from "react";
import {
  MapContainer,
  TileLayer,
  FeatureGroup,
  useMap,
  GeoJSON,
  Marker,
  Popup,
} from "react-leaflet";
import { EditControl } from "react-leaflet-draw";
import "leaflet/dist/leaflet.css";
import "leaflet-draw/dist/leaflet.draw.css";
import "leaflet.heat";
import jsPDF from "jspdf";
import html2canvas from "html2canvas";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

// Chart.js registration
ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend
);

// Custom Image Comparison Component to replace ReactCompareImage
const ImageComparison = ({
  leftImage,
  rightImage,
  leftImageLabel,
  rightImageLabel,
}) => {
  const [sliderPosition, setSliderPosition] = useState(50);
  const containerRef = useRef(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleMove = (e) => {
    if (!isDragging || !containerRef.current) return;

    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const newPosition = Math.max(0, Math.min(100, (x / rect.width) * 100));
    setSliderPosition(newPosition);
  };

  const handleMouseDown = () => {
    setIsDragging(true);
  };

  const handleMouseUp = () => {
    setIsDragging(false);
  };

  useEffect(() => {
    document.addEventListener("mouseup", handleMouseUp);
    document.addEventListener("mousemove", handleMove);

    return () => {
      document.removeEventListener("mouseup", handleMouseUp);
      document.removeEventListener("mousemove", handleMove);
    };
  }, [isDragging]);

  return (
    <div
      ref={containerRef}
      style={{
        position: "relative",
        width: "100%",
        height: "400px",
        overflow: "hidden",
        userSelect: "none",
      }}
    >
      {/* Left Image (Full Width) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <img
          src={leftImage}
          alt="Before"
          style={{ width: "100%", height: "100%", objectFit: "cover" }}
        />
        {leftImageLabel && (
          <div
            style={{
              position: "absolute",
              bottom: 10,
              left: 10,
              background: "rgba(0,0,0,0.5)",
              color: "white",
              padding: "4px 8px",
              borderRadius: 4,
              fontSize: 14,
            }}
          >
            {leftImageLabel}
          </div>
        )}
      </div>

      {/* Right Image (Partial Width based on slider) */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: `${sliderPosition}%`,
          height: "100%",
          overflow: "hidden",
        }}
      >
        <img
          src={rightImage}
          alt="After"
          style={{
            width: `${100 * (100 / sliderPosition)}%`,
            height: "100%",
            objectFit: "cover",
            transform:
              sliderPosition === 0
                ? "none"
                : `translateX(${
                    -100 * ((100 - sliderPosition) / sliderPosition)
                  }%)`,
          }}
        />
        {rightImageLabel && (
          <div
            style={{
              position: "absolute",
              bottom: 10,
              right: 10,
              background: "rgba(0,0,0,0.5)",
              color: "white",
              padding: "4px 8px",
              borderRadius: 4,
              fontSize: 14,
            }}
          >
            {rightImageLabel}
          </div>
        )}
      </div>

      {/* Slider */}
      <div
        style={{
          position: "absolute",
          top: 0,
          left: `${sliderPosition}%`,
          width: "3px",
          height: "100%",
          background: "#fff",
          transform: "translateX(-50%)",
          cursor: "ew-resize",
          boxShadow: "0 0 5px rgba(0,0,0,0.5)",
        }}
        onMouseDown={handleMouseDown}
      />

      {/* Slider Handle */}
      <div
        style={{
          position: "absolute",
          top: "50%",
          left: `${sliderPosition}%`,
          width: "40px",
          height: "40px",
          borderRadius: "50%",
          background: "white",
          transform: "translate(-50%, -50%)",
          cursor: "ew-resize",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          boxShadow: "0 0 5px rgba(0,0,0,0.5)",
        }}
        onMouseDown={handleMouseDown}
      >
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            transform: "rotate(90deg)",
          }}
        >
          <span>⟵</span>
          <span>⟶</span>
        </div>
      </div>
    </div>
  );
};

// ---- Custom HeatmapLayer using leaflet.heat ----
function HeatmapLayer({ points, options }) {
  const map = useMap();
  React.useEffect(() => {
    if (!window.L.heatLayer) return;
    const heatLayer = window.L.heatLayer(points, options).addTo(map);
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, options]);
  return null;
}

const API_URL = "http://localhost:5000/api/gee-reports/generate";

const ANALYSIS_OPTIONS = [
  { value: "DEFORESTATION", label: "Deforestation", extra: ["threshold"] },
  {
    value: "FLOODING",
    label: "Flooding",
    extra: ["thresholdPercent", "bufferMeters"],
  },
  {
    value: "GLACIER",
    label: "Glacier Melting",
    extra: ["thresholdPercent", "bufferMeters"],
  },
  { value: "COASTAL_EROSION", label: "Coastal Erosion", extra: ["threshold"] },
];

const HistoricalChangePage = () => {
  const [fromDate, setFromDate] = useState("2024-01-01");
  const [toDate, setToDate] = useState("2024-05-01");
  const [regionGeoJson, setRegionGeoJson] = useState(null);
  const [analysisType, setAnalysisType] = useState("DEFORESTATION");
  const [threshold, setThreshold] = useState(-0.1);
  const [thresholdPercent, setThresholdPercent] = useState("");
  const [bufferMeters, setBufferMeters] = useState("");
  const [loading, setLoading] = useState(false);
  const [reportResult, setReportResult] = useState(null);
  const [error, setError] = useState("");
  const featureGroupRef = useRef(null);

  // Handler to call backend API
  const handleGenerateReport = async () => {
    if (!regionGeoJson) {
      setError("Please select a region on the map before generating a report.");
      return;
    }
    setLoading(true);
    setError("");
    setReportResult(null);

    let payload = {
      regionGeoJson,
      regionId: "user-area-1",
      analysisType,
      fromDate,
      toDate,
    };
    if (
      analysisType === "DEFORESTATION" ||
      analysisType === "COASTAL_EROSION"
    ) {
      payload.threshold = threshold !== "" ? parseFloat(threshold) : undefined;
    }
    if (analysisType === "FLOODING" || analysisType === "GLACIER") {
      payload.thresholdPercent =
        thresholdPercent !== "" && !isNaN(parseFloat(thresholdPercent))
          ? parseFloat(thresholdPercent)
          : undefined;
      payload.bufferMeters =
        bufferMeters !== "" && !isNaN(parseInt(bufferMeters, 10))
          ? parseInt(bufferMeters, 10)
          : undefined;
    }

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || "Failed to get report");
      setReportResult(data.result);
    } catch (err) {
      setError(err.message || "Failed to generate report.");
    } finally {
      setLoading(false);
    }
  };

  // Download as PDF
  const handleDownload = async () => {
    const input = document.getElementById("report-content");
    const canvas = await html2canvas(input, { scale: 2 });
    const pdf = new jsPDF("p", "mm", "a4");
    const imgData = canvas.toDataURL("image/png");
    const pageWidth = pdf.internal.pageSize.getWidth();
    const imgHeight = (canvas.height * pageWidth) / canvas.width;
    pdf.addImage(imgData, "PNG", 0, 0, pageWidth, imgHeight);
    pdf.save(`progress_report_${fromDate}_to_${toDate}.pdf`);
  };

  // Draw handlers for region selection
  const handleCreated = (e) => {
    setRegionGeoJson(e.layer.toGeoJSON().geometry);
  };
  const handleEdited = (e) => {
    const layer = Object.values(e.layers._layers)[0];
    if (layer) setRegionGeoJson(layer.toGeoJSON().geometry);
  };
  const handleDeleted = () => {
    setRegionGeoJson(null);
  };

  // Prepare chart data if available
  let ndviData = null;
  let heatmapPoints = [];
  if (reportResult && reportResult.status === "success") {
    ndviData = {
      labels: [
        reportResult.previous_period_start,
        reportResult.recent_period_start,
        reportResult.recent_period_end,
      ].filter(Boolean),
      datasets: [
        {
          label: "NDVI Change",
          data: [0, 0, reportResult.mean_ndvi_change ?? 0],
          fill: false,
          backgroundColor: "#1976d2",
          borderColor: "#1976d2",
        },
      ],
    };
    heatmapPoints = reportResult.heatmap_points || [
      [20.7, 78.8, Math.abs(reportResult.mean_ndvi_change ?? 0)],
    ];
  }

  // Helpers for overlays
  let resultPolygon = null;
  let resultMarkers = [];
  if (reportResult && reportResult.status === "success") {
    // Example: If your backend returns a flood/deforestation polygon as GeoJSON
    if (reportResult.result_geometry) {
      resultPolygon = (
        <GeoJSON
          data={reportResult.result_geometry}
          style={{ color: "#d32f2f", weight: 3, fillOpacity: 0.18 }}
        />
      );
    }
    // Example: If your backend returns marker points
    if (Array.isArray(reportResult.marker_points)) {
      resultMarkers = reportResult.marker_points.map((pt, i) => (
        <Marker key={i} position={[pt[0], pt[1]]}>
          <Popup>Value: {pt[2]}</Popup>
        </Marker>
      ));
    }
  }

  // --- IMAGE COMPARISON SECTION ---
  const showCompare =
    reportResult && reportResult.start_image_url && reportResult.end_image_url;

  return (
    <div
      style={{
        maxWidth: 1020,
        margin: "0 auto",
        padding: 32,
        background: "beige",
        borderRadius: 14,
        boxShadow: "0 4px 32px 0 rgba(30,80,180,0.09)",
      }}
    >
      <h2 style={{ textAlign: "center", color: "#194185", marginBottom: 10 }}>
        Historical Change Visualization & Progress Report
      </h2>
      <div
        style={{
          display: "flex",
          gap: 18,
          justifyContent: "center",
          marginBottom: 28,
        }}
      >
        <label>
          <b>From:</b>{" "}
          <input
            type="date"
            value={fromDate}
            onChange={(e) => setFromDate(e.target.value)}
            style={{
              border: "1px solid #b4b4b4",
              borderRadius: 4,
              padding: 5,
              marginLeft: 4,
            }}
          />
        </label>
        <label>
          <b>To:</b>{" "}
          <input
            type="date"
            value={toDate}
            onChange={(e) => setToDate(e.target.value)}
            style={{
              border: "1px solid #b4b4b4",
              borderRadius: 4,
              padding: 5,
              marginLeft: 4,
            }}
          />
        </label>
        <label>
          <b>Analysis:</b>{" "}
          <select
            value={analysisType}
            onChange={(e) => setAnalysisType(e.target.value)}
            style={{
              border: "1px solid #b4b4b4",
              borderRadius: 4,
              padding: 5,
              marginLeft: 4,
            }}
          >
            {ANALYSIS_OPTIONS.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        </label>
        {(analysisType === "DEFORESTATION" ||
          analysisType === "COASTAL_EROSION") && (
          <label>
            <b>Threshold:</b>{" "}
            <input
              type="number"
              step="any"
              value={threshold}
              onChange={(e) => setThreshold(e.target.value)}
              style={{
                border: "1px solid #b4b4b4",
                borderRadius: 4,
                padding: 5,
                marginLeft: 4,
                width: 80,
              }}
            />
          </label>
        )}
        {(analysisType === "FLOODING" || analysisType === "GLACIER") && (
          <>
            <label>
              <b>Threshold (%):</b>{" "}
              <input
                type="number"
                step="any"
                value={thresholdPercent}
                onChange={(e) => setThresholdPercent(e.target.value)}
                style={{
                  border: "1px solid #b4b4b4",
                  borderRadius: 4,
                  padding: 5,
                  marginLeft: 4,
                  width: 80,
                }}
              />
            </label>
            <label>
              <b>Buffer (m):</b>{" "}
              <input
                type="number"
                step="any"
                value={bufferMeters}
                onChange={(e) => setBufferMeters(e.target.value)}
                style={{
                  border: "1px solid #b4b4b4",
                  borderRadius: 4,
                  padding: 5,
                  marginLeft: 4,
                  width: 80,
                }}
              />
            </label>
          </>
        )}
        <button
          onClick={handleGenerateReport}
          style={{
            background: "#1976d2",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "7px 18px",
            fontWeight: 600,
            fontSize: 15,
            cursor: loading ? "not-allowed" : "pointer",
            marginLeft: 32,
            boxShadow: "0 2px 8px 0 rgba(40,60,130,0.09)",
          }}
          disabled={loading}
        >
          {loading ? "Generating..." : "Generate Report"}
        </button>
        <button
          onClick={handleDownload}
          style={{
            background: "#13b37b",
            color: "white",
            border: "none",
            borderRadius: 6,
            padding: "7px 18px",
            fontWeight: 600,
            fontSize: 15,
            cursor: !reportResult ? "not-allowed" : "pointer",
            marginLeft: 10,
            opacity: !reportResult ? 0.5 : 1,
            boxShadow: "0 2px 8px 0 rgba(40,60,130,0.09)",
          }}
          disabled={!reportResult}
        >
          Download PDF
        </button>
      </div>

      {/* Region selection map */}
      <div style={{ marginBottom: 24 }}>
        <label>
          <b>Select Region on Map:</b>
          <div
            style={{
              height: 350,
              marginTop: 8,
              marginBottom: 8,
              borderRadius: 7,
              overflow: "hidden",
              boxShadow: "0 2px 16px 0 rgba(30,80,180,0.10)",
            }}
          >
            <MapContainer
              center={[20.7, 78.8]}
              zoom={6}
              style={{ height: "100%", width: "100%" }}
              scrollWheelZoom={true}
            >
              <FeatureGroup ref={featureGroupRef}>
                <EditControl
                  position="topright"
                  onCreated={handleCreated}
                  onEdited={handleEdited}
                  onDeleted={handleDeleted}
                  draw={{
                    polygon: true,
                    rectangle: true,
                    circle: false,
                    marker: false,
                    polyline: false,
                    circlemarker: false,
                  }}
                />
              </FeatureGroup>
              <TileLayer
                url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                attribution="© OpenStreetMap contributors"
              />
              {/* Show overlays from results */}
              {resultPolygon}
              {resultMarkers}
              {reportResult && reportResult.heatmap_points && (
                <HeatmapLayer
                  points={heatmapPoints}
                  options={{ radius: 25, blur: 30, max: 1 }}
                />
              )}
            </MapContainer>
          </div>
          {regionGeoJson ? (
            <div style={{ color: "#148404", fontSize: 15, marginTop: 3 }}>
              <b>✓ Region selected!</b>
            </div>
          ) : (
            <div style={{ color: "#d32f2f", fontSize: 14, marginTop: 3 }}>
              Please select a region on the map.
            </div>
          )}
        </label>
      </div>

      {error && (
        <div style={{ color: "red", fontWeight: 600, marginBottom: 20 }}>
          {error}
        </div>
      )}

      <div id="report-content">
        {reportResult && (
          <>
            {/* IMAGE COMPARISON SLIDER - Using our custom component */}
            {showCompare && (
              <div
                style={{
                  marginBottom: 36,
                  background: "#fff",
                  borderRadius: 10,
                  boxShadow: "0 1px 8px 0 rgba(30,80,180,0.05)",
                  padding: 18,
                  textAlign: "center",
                }}
              >
                <h4 style={{ marginBottom: 18 }}>
                  NDVI Map Comparison ({fromDate} vs {toDate})
                </h4>
                <div style={{ maxWidth: 700, margin: "0 auto" }}>
                  <ImageComparison
                    leftImage={reportResult.start_image_url}
                    rightImage={reportResult.end_image_url}
                    leftImageLabel={fromDate}
                    rightImageLabel={toDate}
                  />
                </div>
              </div>
            )}
            <div style={{ marginBottom: 36 }}>
              <h4>Status: {reportResult.status}</h4>
              <h4>
                Alert Triggered:{" "}
                {reportResult.alert_triggered ? (
                  <span style={{ color: "#d32f2f" }}>Yes 🚨</span>
                ) : (
                  <span style={{ color: "#148404" }}>No</span>
                )}
              </h4>
              {"mean_ndvi_change" in reportResult && (
                <h4>
                  Mean NDVI Change:{" "}
                  <span>
                    {typeof reportResult.mean_ndvi_change === "number"
                      ? reportResult.mean_ndvi_change.toFixed(4)
                      : "N/A"}
                  </span>
                </h4>
              )}
              {"threshold" in reportResult && (
                <h4>Threshold: {reportResult.threshold}</h4>
              )}
              {"threshold_percent" in reportResult && (
                <h4>Threshold (%): {reportResult.threshold_percent}</h4>
              )}
              {"buffer_radius_meters" in reportResult && (
                <h4>Buffer (m): {reportResult.buffer_radius_meters}</h4>
              )}
              {reportResult.message && (
                <div style={{ color: "#555", fontSize: 15, marginTop: 8 }}>
                  {reportResult.message}
                </div>
              )}
            </div>
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: 32,
                justifyContent: "space-between",
                marginBottom: 36,
              }}
            >
              <div
                style={{
                  flex: "1 1 300px",
                  background: "#fff",
                  borderRadius: 10,
                  boxShadow: "0 1px 8px 0 rgba(30,80,180,0.05)",
                  padding: 18,
                  minWidth: 300,
                }}
              >
                <h4>
                  {analysisType === "DEFORESTATION"
                    ? "NDVI Change"
                    : analysisType === "FLOODING"
                    ? "Flood Analysis"
                    : analysisType === "GLACIER"
                    ? "Glacier Melting"
                    : analysisType === "COASTAL_EROSION"
                    ? "Coastal Erosion"
                    : "Analysis"}
                </h4>
                {ndviData ? (
                  <Line data={ndviData} options={{ responsive: true }} />
                ) : (
                  <div>No chart data.</div>
                )}
              </div>
              {/* Add additional charts if backend provides */}
            </div>
            <div
              style={{
                marginBottom: 36,
                background: "beige",
                borderRadius: 10,
                boxShadow: "0 2px 16px 0 rgba(30,80,180,0.06)",
                padding: 18,
              }}
            >
              <h4>Change Heatmap</h4>
              <MapContainer
                center={[20.7, 78.8]}
                zoom={6}
                style={{ height: 350, width: "100%", borderRadius: 10 }}
              >
                <TileLayer
                  url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                  attribution="© OpenStreetMap contributors"
                />
                {/* Show overlays from results */}
                {resultPolygon}
                {resultMarkers}
                {reportResult && reportResult.heatmap_points && (
                  <HeatmapLayer
                    points={heatmapPoints}
                    options={{ radius: 25, blur: 30, max: 1 }}
                  />
                )}
              </MapContainer>
            </div>
            <div
              style={{
                background: "#f1f6fb",
                borderRadius: 8,
                padding: 18,
                marginTop: 10,
              }}
            >
              <h4>Progress Summary</h4>
              <ul style={{ fontSize: 16, color: "#223" }}>
                {reportResult.mean_ndvi_change !== undefined && (
                  <li>
                    <b>NDVI Change Detected:</b>{" "}
                    {typeof reportResult.mean_ndvi_change === "number"
                      ? reportResult.mean_ndvi_change.toFixed(4)
                      : "N/A"}
                  </li>
                )}
                <li>
                  <b>Alert Triggered:</b>{" "}
                  {reportResult.alert_triggered ? "Yes" : "No"}
                </li>
                {reportResult.previous_period_start &&
                  reportResult.recent_period_end && (
                    <li>
                      <b>Dates Analyzed:</b>{" "}
                      {reportResult.previous_period_start} to{" "}
                      {reportResult.recent_period_end}
                    </li>
                  )}
                <li>
                  <b>Region ID:</b> {reportResult.region_id}
                </li>
                {reportResult.threshold !== undefined && (
                  <li>
                    <b>Threshold Used:</b> {reportResult.threshold}
                  </li>
                )}
                {reportResult.threshold_percent !== undefined && (
                  <li>
                    <b>Threshold Used (%):</b> {reportResult.threshold_percent}
                  </li>
                )}
                {reportResult.buffer_radius_meters !== undefined && (
                  <li>
                    <b>Buffer Used (m):</b> {reportResult.buffer_radius_meters}
                  </li>
                )}
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HistoricalChangePage;
