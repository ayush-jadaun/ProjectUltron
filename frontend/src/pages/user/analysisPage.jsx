import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import {
	BellIcon,
	AlertTriangle,
	BarChart2,
	Calendar,
	MapPin,
	Filter,
} from "lucide-react";
import {
	fetchUserAnalysisResults,
	fetchAlertSummary,
	clearError,
} from "../../store/slices/analysisSlice";
import EnvironmentBackgroundLayers from "../../assets/EnvironmentBackgroundLayers";

const AnalysisPage = () => {
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isAuthenticated, user } = useSelector((state) => state.auth);
	const { results, alertSummary, loading, error } = useSelector(
		(state) => state.analysis
	);

	const [filters, setFilters] = useState({
		analysis_type: "",
		alert_triggered: "",
	});

	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/login");
			return;
		}

		// Fetch analysis data
		dispatch(fetchUserAnalysisResults(filters))
			.unwrap()
			.catch((error) => {
				console.error("Error fetching analysis results:", error);
			});

		// Fetch alert summary
		dispatch(fetchAlertSummary())
			.unwrap()
			.catch((error) => {
				console.error("Error fetching alert summary:", error);
			});
	}, [dispatch, isAuthenticated, navigate, filters]);

	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setFilters((prev) => ({
			...prev,
			[name]: value,
		}));
	};

	if (loading) {
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

	if (error) {
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
									{error || "Failed to load analysis data. Please try again later."}
								</p>
								<button
									onClick={() => {
										dispatch(clearError());
										dispatch(fetchUserAnalysisResults(filters));
										dispatch(fetchAlertSummary());
									}}
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
								View your environmental analysis results and alerts
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

						{/* Results List */}
						<div className="space-y-4">
							{results && results.length > 0 ? (
								results.map((result) => (
									<div
										key={result.id}
										className="bg-white rounded-lg shadow p-4 border border-gray-200"
									>
										<div className="flex items-center justify-between">
											<div>
												<h3 className="text-lg font-medium text-gray-900">
													{result.analysis_type
														.split("_")
														.map((word) => word.charAt(0).toUpperCase() + word.slice(1))
														.join(" ")}
												</h3>
												<p className="text-sm text-gray-500">
													<MapPin className="inline-block mr-1" size={14} />
													{result.location}
												</p>
											</div>
											<div
												className={`px-3 py-1 rounded-full text-sm font-medium ${
													result.alert_triggered
														? "bg-red-100 text-red-800"
														: "bg-green-100 text-green-800"
												}`}
											>
												{result.alert_triggered ? "Alert Triggered" : "No Alert"}
											</div>
										</div>
										<div className="mt-2 text-sm text-gray-600">
											<p>{result.description}</p>
										</div>
										<div className="mt-2 text-xs text-gray-400">
											{new Date(result.createdAt).toLocaleString()}
										</div>
									</div>
								))
							) : (
								<div className="text-center py-8">
									<p className="text-gray-500">No analysis results found</p>
								</div>
							)}
						</div>
					</div>
				</div>
			</EnvironmentBackgroundLayers>
		</div>
	);
};

export default AnalysisPage;
