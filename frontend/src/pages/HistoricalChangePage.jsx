import React, { useState, useRef } from "react";
import { MapContainer, TileLayer, FeatureGroup, useMap } from "react-leaflet";
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

const DEFAULT_REGION = {
  type: "Polygon",
  coordinates: [
    [
      [78.5, 20.5],
      [78.9, 20.5],
      [78.9, 20.9],
      [78.5, 20.9],
      [78.5, 20.5],
    ],
  ],
};

const DEFAULT_ANALYSIS_TYPE = "DEFORESTATION";

const HistoricalChangePage = () => {
  const [fromDate, setFromDate] = useState("2024-01-01");
  const [toDate, setToDate] = useState("2024-05-01");
  const [regionGeoJson, setRegionGeoJson] = useState(null); // Initially no region
  const [analysisType, setAnalysisType] = useState(DEFAULT_ANALYSIS_TYPE);
  const [threshold, setThreshold] = useState(-0.1);
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

    try {
      const res = await fetch(API_URL, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          regionGeoJson,
          regionId: "user-area-1",
          analysisType,
          threshold,
          fromDate,
          toDate,
        }),
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

  return (
    <div
      style={{
        maxWidth: 1020,
        margin: "0 auto",
        padding: 32,
        background: "#f8fbfd",
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
            <option value="DEFORESTATION">Deforestation</option>
          </select>
        </label>
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
              <h4>
                Mean NDVI Change:{" "}
                <span>
                  {typeof reportResult.mean_ndvi_change === "number"
                    ? reportResult.mean_ndvi_change.toFixed(4)
                    : "N/A"}
                </span>
              </h4>
              <h4>Threshold: {reportResult.threshold}</h4>
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
                <h4>NDVI Change</h4>
                {ndviData ? (
                  <Line data={ndviData} options={{ responsive: true }} />
                ) : (
                  <div>No NDVI data.</div>
                )}
              </div>
              {/* Add additional charts if backend provides */}
            </div>
            <div
              style={{
                marginBottom: 36,
                background: "#fff",
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
                <HeatmapLayer
                  points={heatmapPoints}
                  options={{ radius: 25, blur: 30, max: 1 }}
                />
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
                <li>
                  <b>NDVI Change Detected:</b>{" "}
                  {typeof reportResult.mean_ndvi_change === "number"
                    ? reportResult.mean_ndvi_change.toFixed(4)
                    : "N/A"}
                </li>
                <li>
                  <b>Alert Triggered:</b>{" "}
                  {reportResult.alert_triggered ? "Yes" : "No"}
                </li>
                <li>
                  <b>Dates Analyzed:</b> {reportResult.previous_period_start} to{" "}
                  {reportResult.recent_period_end}
                </li>
                <li>
                  <b>Region ID:</b> {reportResult.region_id}
                </li>
                <li>
                  <b>Threshold Used:</b> {reportResult.threshold}
                </li>
              </ul>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default HistoricalChangePage;
