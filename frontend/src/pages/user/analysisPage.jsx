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

const AnalysisPage = () => {
	console.log("Rendr hor rha?");
	const dispatch = useDispatch();
	const navigate = useNavigate();
	const { isAuthenticated, user } = useSelector((state) => state.auth);
	const { results, alertSummary, loading, error, pagination } = useSelector(
		(state) => state.analysis
	);

	const [filters, setFilters] = useState({
		analysis_type: "",
		alert_triggered: "",
		page: 1,
		limit: 10,
	});
	useEffect(() => {
		if (!isAuthenticated) {
			navigate("/login");
			return;
		}
		console.log("Fetching analysis data with filters:", filters);
		dispatch(fetchUserAnalysisResults(filters))
			.unwrap()
			.then((data) => {
				console.log("Analysis results received:", data);
			})
			.catch((error) => {
				console.error("Error fetching analysis results:", error);
			});

		dispatch(fetchAlertSummary())
			.unwrap()
			.then((data) => {
				console.log("Alert summary received:", data);
			})
			.catch((error) => {
				console.error("Error fetching alert summary:", error);
			});
	}, [dispatch, isAuthenticated, navigate, filters]);

	const handleFilterChange = (e) => {
		const { name, value } = e.target;
		setFilters((prev) => ({
			...prev,
			[name]: value,
			page: 1, // Reset to first page when filters change
		}));
	};

	const handlePageChange = (newPage) => {
		setFilters((prev) => ({ ...prev, page: newPage }));
	};

	if (loading) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-600 mx-auto"></div>
					<p className="mt-4 text-gray-600">Loading analysis data...</p>
				</div>
			</div>
		);
	}

	if (error) {
		return (
			<div className="min-h-screen flex items-center justify-center">
				<div className="text-center">
					<div className="text-red-600 text-xl mb-4">Error Loading Data</div>
					<p className="text-gray-600">{error}</p>
					<button
						onClick={() => {
							dispatch(clearError());
							dispatch(fetchUserAnalysisResults(filters));
							dispatch(fetchAlertSummary());
						}}
						className="mt-4 px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700"
					>
						Retry
					</button>
				</div>
			</div>
		);
	}

	if (!isAuthenticated) return null;
	return (
		<div className="min-h-screen">
			<main className="container mx-auto py-12 px-4">
				<div className="bg-white/80 backdrop-blur-sm rounded-lg shadow-xl p-6 md:p-8 max-w-6xl mx-auto border border-gray-200/50">
					<h2 className="text-2xl font-bold mb-6 text-green-800 flex items-center">
						<BellIcon className="mr-2" size={24} />
						Environmental Analysis Dashboard
					</h2>

					{/* Alert Summary Section */}
					{alertSummary && (
						<div className="mb-8 grid grid-cols-1 md:grid-cols-3 gap-4">
							<div className="bg-green-50/80 p-4 rounded-lg border border-green-200">
								<h3 className="text-lg font-semibold text-green-800 flex items-center">
									<AlertTriangle className="mr-2" size={20} />
									Total Alerts
								</h3>
								<p className="text-3xl font-bold text-green-600 mt-2">
									{alertSummary.totalAlerts || 0}
								</p>
							</div>
							<div className="bg-blue-50/80 p-4 rounded-lg border border-blue-200">
								<h3 className="text-lg font-semibold text-blue-800 flex items-center">
									<BarChart2 className="mr-2" size={20} />
									Alerts by Category
								</h3>
								<div className="mt-2 space-y-1">
									{alertSummary.alertsByCategory?.map((category) => (
										<p key={category.analysis_type} className="text-blue-600">
											{category.analysis_type}: {category.count}
										</p>
									))}
								</div>
							</div>
							<div className="bg-purple-50/80 p-4 rounded-lg border border-purple-200">
								<h3 className="text-lg font-semibold text-purple-800 flex items-center">
									<Calendar className="mr-2" size={20} />
									Recent Alerts
								</h3>
								<div className="mt-2 space-y-1">
									{alertSummary.recentAlerts?.map((alert) => (
										<p key={alert.id} className="text-purple-600">
											{alert.subscription?.subscription_name} -{" "}
											{alert.analysis_type}
										</p>
									))}
								</div>
							</div>
						</div>
					)}

					{/* Filters */}
					<div className="mb-6 flex flex-wrap gap-4 items-center">
						<div className="flex items-center">
							<Filter className="mr-2 text-gray-600" size={20} />
							<select
								name="analysis_type"
								value={filters.analysis_type}
								onChange={handleFilterChange}
								className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
							>
								<option value="">All Types</option>
								<option value="deforestation">Deforestation</option>
								<option value="airPollution">Air Pollution</option>
								<option value="flooding">Flooding</option>
								<option value="glacierMelting">Glacier Melting</option>
								<option value="urbanExpansion">Urban Expansion</option>
								<option value="coastalErosion">Coastal Erosion</option>
							</select>
						</div>
						<div className="flex items-center">
							<select
								name="alert_triggered"
								value={filters.alert_triggered}
								onChange={handleFilterChange}
								className="rounded-md border-gray-300 shadow-sm focus:border-green-500 focus:ring-green-500"
							>
								<option value="">All Results</option>
								<option value="true">Alerts Only</option>
								<option value="false">No Alerts</option>
							</select>
						</div>
					</div>

					{/* Results Table */}
					<div className="overflow-x-auto">
						<table className="min-w-full divide-y divide-gray-200">
							<thead className="bg-gray-50/80">
								<tr>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Subscription
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Analysis Type
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Alert Status
									</th>
									<th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
										Date
									</th>
								</tr>
							</thead>
							<tbody className="bg-white divide-y divide-gray-200">
								{results?.length === 0 ? (
									<tr>
										<td colSpan="4" className="px-6 py-4 text-center">
											No analysis results found. Try adjusting your filters or
											check back later.
										</td>
									</tr>
								) : (
									results?.map((result) => (
										<tr key={result.id} className="hover:bg-gray-50">
											<td className="px-6 py-4 whitespace-nowrap">
												<div className="flex items-center">
													<MapPin className="mr-2 text-gray-400" size={16} />
													{result.subscription?.subscription_name ||
														"Unknown Subscription"}
												</div>
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												{result.analysis_type}
											</td>
											<td className="px-6 py-4 whitespace-nowrap">
												<span
													className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
														result.alert_triggered
															? "bg-red-100 text-red-800"
															: "bg-green-100 text-green-800"
													}`}
												>
													{result.alert_triggered ? "Alert" : "Normal"}
												</span>
											</td>
											<td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
												{new Date(result.createdAt).toLocaleDateString()}
											</td>
										</tr>
									))
								)}
							</tbody>
						</table>
					</div>

					{/* Pagination */}
					{pagination && pagination.totalPages > 1 && (
						<div className="mt-6 flex justify-center">
							<nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
								{Array.from(
									{ length: pagination.totalPages },
									(_, i) => i + 1
								).map((page) => (
									<button
										key={page}
										onClick={() => handlePageChange(page)}
										className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
											page === pagination.currentPage
												? "z-10 bg-green-50 border-green-500 text-green-600"
												: "bg-white border-gray-300 text-gray-500 hover:bg-gray-50"
										}`}
									>
										{page}
									</button>
								))}
							</nav>
						</div>
					)}
				</div>
			</main>
		</div>
	);
};

export default AnalysisPage;
