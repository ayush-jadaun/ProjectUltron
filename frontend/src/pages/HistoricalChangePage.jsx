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
import axios from "axios";
import EnvironmentBackgroundLayers from "../assets/EnvironmentBackgroundLayers";


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

// Helper to get appropriate index name and comparison label
function getComparisonLabel(analysisType) {
  switch (analysisType) {
    case "DEFORESTATION":
      return "NDVI";
    case "FLOODING":
      return "NDWI";
    case "COASTAL_EROSION":
      return "NDWI";
    case "GLACIER":
      return "NDSI";
    default:
      return "Change";
  }
}

function getChartLabel(analysisType) {
  switch (analysisType) {
    case "DEFORESTATION":
      return "NDVI Change";
    case "FLOODING":
      return "NDWI Change";
    case "COASTAL_EROSION":
      return "NDWI Change";
    case "GLACIER":
      return "NDSI Change";
    default:
      return "Change";
  }
}

// Custom Image Comparison Component
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

  const handleMouseDown = () => setIsDragging(true);
  const handleMouseUp = () => setIsDragging(false);

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
      className="relative w-full h-96 overflow-hidden select-none"
    >
      {/* Left Image (Full Width) */}
      <div className="absolute top-0 left-0 w-full h-full">
        <img
          src={leftImage}
          alt="Before"
          className="w-full h-full object-cover"
        />
        {leftImageLabel && (
          <div className="absolute bottom-2.5 left-2.5 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {leftImageLabel}
          </div>
        )}
      </div>

      {/* Right Image (Partial Width based on slider) */}
      <div
        className="absolute top-0 left-0 h-full overflow-hidden"
        style={{ width: `${sliderPosition}%` }}
      >
        <img
          src={rightImage}
          alt="After"
          className="h-full object-cover"
          style={{
            width: `${100 * (100 / sliderPosition)}%`,
            transform:
              sliderPosition === 0
                ? "none"
                : `translateX(${
                    -100 * ((100 - sliderPosition) / sliderPosition)
                  }%)`,
          }}
        />
        {rightImageLabel && (
          <div className="absolute bottom-2.5 right-2.5 bg-black/50 text-white px-2 py-1 rounded text-sm">
            {rightImageLabel}
          </div>
        )}
      </div>

      {/* Slider */}
      <div
        className="absolute top-0 h-full w-0.5 bg-white transform -translate-x-1/2 cursor-ew-resize shadow-md"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
      />

      {/* Slider Handle */}
      <div
        className="absolute top-1/2 w-10 h-10 rounded-full bg-white transform -translate-x-1/2 -translate-y-1/2 cursor-ew-resize flex items-center justify-center shadow-md"
        style={{ left: `${sliderPosition}%` }}
        onMouseDown={handleMouseDown}
      >
        <div className="flex flex-col items-center transform rotate-90">
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
  useEffect(() => {
    if (!window.L.heatLayer) return;
    const heatLayer = window.L.heatLayer(points, options).addTo(map);
    return () => {
      map.removeLayer(heatLayer);
    };
  }, [map, points, options]);
  return null;
}
const url=import.meta.env.VITE_API_URL || "http://localhost:5000/api";
const API_URL = `${url}/gee-reports/generate`;

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
     const response = await axios.post(API_URL, payload, {
       headers: { "Content-Type": "application/json" },
     });
     const data = response.data;
     if (!data.success) throw new Error(data.error || "Failed to get report");
     setReportResult(data.result);
   } catch (err) {
     setError(
       err.response?.data?.error || err.message || "Failed to generate report."
     );
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
  let indexData = null;
  let heatmapPoints = [];
  if (reportResult && reportResult.status === "success") {
    // Pick the correct index: NDVI, NDWI, or NDSI based on analysisType
    const value =
      reportResult.mean_ndvi_change ??
      reportResult.mean_ndwi_change ??
      reportResult.mean_ndsi_change ??
      0;
    indexData = {
      labels: [
        reportResult.previous_period_start,
        reportResult.recent_period_start,
        reportResult.recent_period_end,
      ].filter(Boolean),
      datasets: [
        {
          label: getChartLabel(analysisType),
          data: [0, 0, value],
          fill: false,
          backgroundColor: "#1976d2",
          borderColor: "#1976d2",
        },
      ],
    };
    heatmapPoints = reportResult.heatmap_points || [
      [20.7, 78.8, Math.abs(value)],
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
    <div className="min-h-screen">
      <EnvironmentBackgroundLayers>
        <div className="max-w-4xl mx-auto mt-12 p-8 bg-amber-50 rounded-xl shadow-lg">
          <h2 className="text-center text-blue-800 mb-2.5 text-2xl font-bold">
            Historical Change Visualization & Progress Report
          </h2>

          <div className="flex flex-wrap gap-4 justify-center mb-7">
            <label className="flex items-center">
              <span className="font-bold mr-1">From:</span>
              <input
                type="date"
                value={fromDate}
                onChange={(e) => setFromDate(e.target.value)}
                className="border border-gray-400 rounded p-1.5 ml-1"
              />
            </label>
            <label className="flex items-center">
              <span className="font-bold mr-1">To:</span>
              <input
                type="date"
                value={toDate}
                onChange={(e) => setToDate(e.target.value)}
                className="border border-gray-400 rounded p-1.5 ml-1"
              />
            </label>
            <label className="flex items-center">
              <span className="font-bold mr-1">Analysis:</span>
              <select
                value={analysisType}
                onChange={(e) => setAnalysisType(e.target.value)}
                className="border border-gray-400 rounded p-1.5 ml-1"
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
              <label className="flex items-center">
                <span className="font-bold mr-1">Threshold:</span>
                <input
                  type="number"
                  step="any"
                  value={threshold}
                  onChange={(e) => setThreshold(e.target.value)}
                  className="border border-gray-400 rounded p-1.5 ml-1 w-20"
                />
              </label>
            )}
            {(analysisType === "FLOODING" || analysisType === "GLACIER") && (
              <>
                <label className="flex items-center">
                  <span className="font-bold mr-1">Threshold (%):</span>
                  <input
                    type="number"
                    step="any"
                    value={thresholdPercent}
                    onChange={(e) => setThresholdPercent(e.target.value)}
                    className="border border-gray-400 rounded p-1.5 ml-1 w-20"
                  />
                </label>
                <label className="flex items-center">
                  <span className="font-bold mr-1">Buffer (m):</span>
                  <input
                    type="number"
                    step="any"
                    value={bufferMeters}
                    onChange={(e) => setBufferMeters(e.target.value)}
                    className="border border-gray-400 rounded p-1.5 ml-1 w-20"
                  />
                </label>
              </>
            )}
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className={`bg-blue-600 text-white border-none rounded-lg py-1.5 px-4 font-semibold text-base ml-8 shadow-md ${
                loading
                  ? "cursor-not-allowed opacity-70"
                  : "cursor-pointer hover:bg-blue-700"
              }`}
            >
              {loading ? "Generating..." : "Generate Report"}
            </button>
            <button
              onClick={handleDownload}
              disabled={!reportResult}
              className={`bg-green-600 text-white border-none rounded-lg py-1.5 px-4 font-semibold text-base ml-2 shadow-md ${
                !reportResult
                  ? "cursor-not-allowed opacity-50"
                  : "cursor-pointer hover:bg-green-700"
              }`}
            >
              Download PDF
            </button>
          </div>

          {/* Region selection map */}
          <div className="mb-6">
            <label>
              <span className="font-bold block">Select Region on Map:</span>
              <div className="h-[350px] mt-2 mb-2 rounded-lg overflow-hidden shadow-md">
                <MapContainer
                  center={[20.7, 78.8]}
                  zoom={6}
                  className="h-full w-full"
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
                <div className="text-green-700 text-sm mt-0.5 font-semibold">
                  ✓ Region selected!
                </div>
              ) : (
                <div className="text-red-600 text-sm mt-0.5">
                  Please select a region on the map.
                </div>
              )}
            </label>
          </div>

          {error && (
            <div className="text-red-600 font-semibold mb-5">{error}</div>
          )}

          <div id="report-content">
            {reportResult && (
              <>
                {/* IMAGE COMPARISON SLIDER - Dynamic label */}
                {showCompare && (
                  <div className="mb-9 bg-white rounded-xl shadow-sm p-4 text-center">
                    <h4 className="mb-4 text-lg font-semibold">
                      {getComparisonLabel(analysisType)} Map Comparison (
                      {fromDate} vs {toDate})
                    </h4>
                    <div className="max-w-lg mx-auto">
                      <ImageComparison
                        leftImage={reportResult.start_image_url}
                        rightImage={reportResult.end_image_url}
                        leftImageLabel={fromDate}
                        rightImageLabel={toDate}
                      />
                    </div>
                  </div>
                )}

                <div className="mb-9">
                  <h4 className="text-lg font-semibold">
                    Status: {reportResult.status}
                  </h4>
                  <h4 className="text-lg font-semibold">
                    Alert Triggered:{" "}
                    {reportResult.alert_triggered ? (
                      <span className="text-red-600">Yes 🚨</span>
                    ) : (
                      <span className="text-green-700">No</span>
                    )}
                  </h4>
                  {"mean_ndvi_change" in reportResult && (
                    <h4 className="text-lg font-semibold">
                      Mean NDVI Change:{" "}
                      <span>
                        {typeof reportResult.mean_ndvi_change === "number"
                          ? reportResult.mean_ndvi_change.toFixed(4)
                          : "N/A"}
                      </span>
                    </h4>
                  )}
                  {"mean_ndwi_change" in reportResult && (
                    <h4 className="text-lg font-semibold">
                      Mean NDWI Change:{" "}
                      <span>
                        {typeof reportResult.mean_ndwi_change === "number"
                          ? reportResult.mean_ndwi_change.toFixed(4)
                          : "N/A"}
                      </span>
                    </h4>
                  )}
                  {"mean_ndsi_change" in reportResult && (
                    <h4 className="text-lg font-semibold">
                      Mean NDSI Change:{" "}
                      <span>
                        {typeof reportResult.mean_ndsi_change === "number"
                          ? reportResult.mean_ndsi_change.toFixed(4)
                          : "N/A"}
                      </span>
                    </h4>
                  )}
                  {"threshold" in reportResult && (
                    <h4 className="text-lg font-semibold">
                      Threshold: {reportResult.threshold}
                    </h4>
                  )}
                  {"threshold_percent" in reportResult && (
                    <h4 className="text-lg font-semibold">
                      Threshold (%): {reportResult.threshold_percent}
                    </h4>
                  )}
                  {"buffer_radius_meters" in reportResult && (
                    <h4 className="text-lg font-semibold">
                      Buffer (m): {reportResult.buffer_radius_meters}
                    </h4>
                  )}
                  {reportResult.message && (
                    <div className="text-gray-600 text-sm mt-2">
                      {reportResult.message}
                    </div>
                  )}
                </div>

                <div className="flex flex-wrap gap-8 justify-between mb-9">
                  <div className="flex-1 min-w-[300px] bg-white rounded-xl shadow-sm p-4">
                    <h4 className="text-lg font-semibold mb-2">
                      {getChartLabel(analysisType)}
                    </h4>
                    {indexData ? (
                      <Line data={indexData} options={{ responsive: true }} />
                    ) : (
                      <div>No chart data.</div>
                    )}
                  </div>
                  {/* Add additional charts if backend provides */}
                </div>

                <div className="mb-9 bg-amber-50 rounded-xl shadow-md p-4">
                  <h4 className="text-lg font-semibold mb-2">Change Heatmap</h4>
                  <div className="h-[350px] w-full rounded-xl overflow-hidden">
                    <MapContainer
                      center={[20.7, 78.8]}
                      zoom={6}
                      className="h-full w-full"
                    >
                      <TileLayer
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                        attribution="© OpenStreetMap contributors"
                      />
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
                </div>

                <div className="bg-blue-50 rounded-lg p-4 mt-2.5">
                  <h4 className="text-lg font-semibold mb-2">
                    Progress Summary
                  </h4>
                  <ul className="text-base text-gray-800">
                    {reportResult.mean_ndvi_change !== undefined && (
                      <li className="mb-1">
                        <span className="font-semibold">
                          NDVI Change Detected:
                        </span>{" "}
                        {typeof reportResult.mean_ndvi_change === "number"
                          ? reportResult.mean_ndvi_change.toFixed(4)
                          : "N/A"}
                      </li>
                    )}
                    {reportResult.mean_ndwi_change !== undefined && (
                      <li className="mb-1">
                        <span className="font-semibold">
                          NDWI Change Detected:
                        </span>{" "}
                        {typeof reportResult.mean_ndwi_change === "number"
                          ? reportResult.mean_ndwi_change.toFixed(4)
                          : "N/A"}
                      </li>
                    )}
                    {reportResult.mean_ndsi_change !== undefined && (
                      <li className="mb-1">
                        <span className="font-semibold">
                          NDSI Change Detected:
                        </span>{" "}
                        {typeof reportResult.mean_ndsi_change === "number"
                          ? reportResult.mean_ndsi_change.toFixed(4)
                          : "N/A"}
                      </li>
                    )}
                    <li className="mb-1">
                      <span className="font-semibold">Alert Triggered:</span>{" "}
                      {reportResult.alert_triggered ? "Yes" : "No"}
                    </li>
                    {reportResult.previous_period_start &&
                      reportResult.recent_period_end && (
                        <li className="mb-1">
                          <span className="font-semibold">Dates Analyzed:</span>{" "}
                          {reportResult.previous_period_start} to{" "}
                          {reportResult.recent_period_end}
                        </li>
                      )}
                    <li className="mb-1">
                      <span className="font-semibold">Region ID:</span>{" "}
                      {reportResult.region_id}
                    </li>
                    {reportResult.threshold !== undefined && (
                      <li className="mb-1">
                        <span className="font-semibold">Threshold Used:</span>{" "}
                        {reportResult.threshold}
                      </li>
                    )}
                    {reportResult.threshold_percent !== undefined && (
                      <li className="mb-1">
                        <span className="font-semibold">
                          Threshold Used (%):
                        </span>{" "}
                        {reportResult.threshold_percent}
                      </li>
                    )}
                    {reportResult.buffer_radius_meters !== undefined && (
                      <li className="mb-1">
                        <span className="font-semibold">Buffer Used (m):</span>{" "}
                        {reportResult.buffer_radius_meters}
                      </li>
                    )}
                  </ul>
                </div>
              </>
            )}
          </div>
        </div>
      </EnvironmentBackgroundLayers>
    </div>
  );
};

export default HistoricalChangePage;
