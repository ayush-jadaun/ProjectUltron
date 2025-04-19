import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
  BellIcon,
  AlertTriangle,
  BarChart2,
  Calendar,
  MapPin,
  Trash2,
  Eye,
} from "lucide-react";
import {
  fetchUserAnalysisResults,
  fetchAlertSummary,
  deleteAnalysisResult,
  clearError as clearAnalysisError,
} from "../../store/slices/analysisSlice";
import {
  fetchUserSubscriptions,
  deleteSubscription,
  clearError as clearSubscriptionError,
} from "../../store/slices/subscriptionSlice";
import EnvironmentBackgroundLayers from "../../assets/EnvironmentBackgroundLayers";

const AnalysisPage = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { isAuthenticated } = useSelector((state) => state.auth);
  const {
    results,
    alertSummary,
    loading: loadingAnalysis,
    error: analysisError,
  } = useSelector((state) => state.analysis);
  const {
    subscriptions,
    loading: loadingSubscriptions,
    error: subscriptionError,
  } = useSelector((state) => state.subscription);

  const [filters, setFilters] = useState({
    analysis_type: "",
    alert_triggered: "",
  });
  const [visibleResults, setVisibleResults] = useState(5); // Number of visible analysis results

  useEffect(() => {
    if (!isAuthenticated) {
      navigate("/login");
      return;
    }

    // Fetch analysis results and alert summary
    dispatch(fetchUserAnalysisResults(filters))
      .unwrap()
      .catch((error) => {
        console.error("Error fetching analysis results:", error);
      });

    dispatch(fetchAlertSummary())
      .unwrap()
      .catch((error) => {
        console.error("Error fetching alert summary:", error);
      });

    // Fetch subscriptions
    dispatch(fetchUserSubscriptions())
      .unwrap()
      .catch((error) => {
        console.error("Error fetching subscriptions:", error);
      });
  }, [dispatch, isAuthenticated, navigate, filters]);

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDeleteResult = (id) => {
    dispatch(deleteAnalysisResult(id))
      .unwrap()
      .then(() => {
        console.log(`Analysis result with ID ${id} deleted successfully.`);
      })
      .catch((error) => {
        console.error(`Failed to delete analysis result with ID ${id}:`, error);
      });
  };

  const handleDeleteSubscription = (id) => {
    dispatch(deleteSubscription(id))
      .unwrap()
      .then(() => {
        console.log(`Subscription with ID ${id} deleted successfully.`);
      })
      .catch((error) => {
        console.error(`Failed to delete subscription with ID ${id}:`, error);
      });
  };

  const handleViewResult = (id) => {
    navigate(`/analysis-results/${id}`);
  };

  const handleViewSubscription = (id) => {
    navigate(`/subscriptions/${id}`);
  };

  const handleRetry = () => {
    dispatch(clearAnalysisError());
    dispatch(clearSubscriptionError());
    dispatch(fetchUserAnalysisResults(filters));
    dispatch(fetchAlertSummary());
    dispatch(fetchUserSubscriptions());
  };

  if (loadingAnalysis || loadingSubscriptions) {
    return (
      <div className="min-h-screen">
        <EnvironmentBackgroundLayers>
          <div className="container mx-auto max-w-4xl py-8 px-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600"></div>
              </div>
            </div>
          </div>
        </EnvironmentBackgroundLayers>
      </div>
    );
  }

  if (analysisError || subscriptionError) {
    return (
      <div className="min-h-screen">
        <EnvironmentBackgroundLayers>
          <div className="container mx-auto max-w-4xl py-8 px-4">
            <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
              <div className="text-center p-8">
                <AlertTriangle className="mx-auto h-12 w-12 text-red-500" />
                <h3 className="mt-4 text-lg font-medium text-gray-900">
                  Error Loading Data
                </h3>
                <p className="mt-2 text-sm text-gray-500">
                  {analysisError ||
                    subscriptionError ||
                    "Failed to load data. Please try again later."}
                </p>
                <button
                  onClick={handleRetry}
                  className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                >
                  Try Again
                </button>
              </div>
            </div>
          </div>
        </EnvironmentBackgroundLayers>
      </div>
    );
  }

  return (
    <div className="min-h-screen">
      <EnvironmentBackgroundLayers>
        <div className="container mx-auto max-w-4xl py-8 px-4">
          <div className="bg-white/80 backdrop-blur-sm rounded-xl shadow-lg p-6">
            {/* Header */}
            <div className="mb-6">
              <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart2 className="text-green-600" />
                Analysis Dashboard
              </h1>
              <p className="mt-1 text-sm text-gray-500">
                View your environmental analysis results and subscriptions.
              </p>
            </div>

            {/* Filters */}
            <div className="mb-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Analysis Type
                </label>
                <select
                  name="analysis_type"
                  value={filters.analysis_type}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                >
                  <option value="">All Types</option>
                  <option value="deforestation">Deforestation</option>
                  <option value="air_pollution">Air Pollution</option>
                  <option value="flooding">Flooding</option>
                  <option value="glacier_melting">Glacier Melting</option>
                  <option value="urban_expansion">Urban Expansion</option>
                  <option value="coastal_erosion">Coastal Erosion</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Alert Status
                </label>
                <select
                  name="alert_triggered"
                  value={filters.alert_triggered}
                  onChange={handleFilterChange}
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500 sm:text-sm"
                >
                  <option value="">All Statuses</option>
                  <option value="true">Alert Triggered</option>
                  <option value="false">No Alert</option>
                </select>
              </div>
            </div>

            {/* Alert Summary */}
            {alertSummary && (
              <div className="mb-6 grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-green-50 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <BellIcon className="text-green-600" />
                    <h3 className="text-sm font-medium text-gray-900">
                      Total Alerts
                    </h3>
                  </div>
                  <p className="mt-1 text-2xl font-semibold text-green-600">
                    {alertSummary.totalAlerts}
                  </p>
                </div>
                <div className="bg-yellow-50 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="text-yellow-600" />
                    <h3 className="text-sm font-medium text-gray-900">
                      Active Alerts
                    </h3>
                  </div>
                  <p className="mt-1 text-2xl font-semibold text-yellow-600">
                    {alertSummary.activeAlerts}
                  </p>
                </div>
                <div className="bg-blue-50 rounded-lg p-4">
                  <div className="flex items-center gap-2">
                    <Calendar className="text-blue-600" />
                    <h3 className="text-sm font-medium text-gray-900">
                      Last Updated
                    </h3>
                  </div>
                  <p className="mt-1 text-sm text-blue-600">
                    {new Date(alertSummary.lastUpdated).toLocaleDateString()}
                  </p>
                </div>
              </div>
            )}

            {/* Subscriptions Section */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart2 className="text-green-600" />
                Subscriptions
              </h2>
              <div className="space-y-4 mt-4">
                {subscriptions.map((sub) => (
                  <div
                    key={sub.id}
                    className="bg-white rounded-lg shadow p-4 border border-gray-200 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {sub.subscription_name}
                      </h3>
                      <p className="text-sm text-gray-500">
                        {sub.region_name || "No Region Specified"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewSubscription(sub.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye />
                      </button>
                      <button
                        onClick={() => handleDeleteSubscription(sub.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Results Section */}
            <div className="mb-6">
              <h2 className="text-xl font-bold text-gray-900 flex items-center gap-2">
                <BarChart2 className="text-green-600" />
                Analysis Results
              </h2>
              <div className="space-y-4 mt-4">
                {results.slice(0, visibleResults).map((result) => (
                  <div
                    key={result.id}
                    className="bg-white rounded-lg shadow p-4 border border-gray-200 flex justify-between items-center"
                  >
                    <div>
                      <h3 className="text-lg font-medium text-gray-900">
                        {result.analysis_type
                          .split("_")
                          .map(
                            (word) =>
                              word.charAt(0).toUpperCase() + word.slice(1)
                          )
                          .join(" ")}
                      </h3>
                      <p className="text-sm text-gray-500">
                        <MapPin className="inline-block mr-1" size={14} />
                        {result.location || "Unknown Location"}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleViewResult(result.id)}
                        className="text-blue-600 hover:text-blue-800"
                      >
                        <Eye />
                      </button>
                      <button
                        onClick={() => handleDeleteResult(result.id)}
                        className="text-red-600 hover:text-red-800"
                      >
                        <Trash2 />
                      </button>
                    </div>
                  </div>
                ))}
                {results.length > visibleResults && (
                  <button
                    onClick={() => setVisibleResults((prev) => prev + 5)}
                    className="mt-4 inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-green-600 hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-green-500"
                  >
                    View More
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </EnvironmentBackgroundLayers>
    </div>
  );
};

export default AnalysisPage;
