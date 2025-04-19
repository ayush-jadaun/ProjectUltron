import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Create a reusable API instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Get user's analysis results (with page and limit)
export const fetchUserAnalysisResults = createAsyncThunk(
  "analysis/fetchUserAnalysisResults",
  async (
    { page = 1, limit = 10, analysis_type, alert_triggered },
    { rejectWithValue }
  ) => {
    try {
      console.log("[DEBUG] Fetching user analysis results with params:", {
        page,
        limit,
        analysis_type,
        alert_triggered,
      });
      const response = await api.get("/analysis-results", {
        params: { page, limit, analysis_type, alert_triggered },
      });
      console.log("[DEBUG] FetchUserAnalysisResults Response:", response.data);
      return response.data.data.results; // Assuming the response includes `.results`
    } catch (error) {
      console.error(
        "[ERROR] Failed to fetch user analysis results:",
        error.response || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch analysis results"
      );
    }
  }
);

// Get analysis result by ID
export const fetchAnalysisResultById = createAsyncThunk(
  "analysis/fetchAnalysisResultById",
  async (id, { rejectWithValue }) => {
    try {
      console.log("[DEBUG] Fetching analysis result by ID:", id);
      const response = await api.get(`/analysis-results/${id}`);
      console.log("[DEBUG] FetchAnalysisResultById Response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error(
        "[ERROR] Failed to fetch analysis result by ID:",
        error.response || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch analysis result"
      );
    }
  }
);

// Get results by subscription
export const fetchResultsBySubscription = createAsyncThunk(
  "analysis/fetchResultsBySubscription",
  async ({ subscriptionId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      console.log("[DEBUG] Fetching results by subscription:", {
        subscriptionId,
        page,
        limit,
      });
      const response = await api.get(
        `/analysis-results/subscription/${subscriptionId}`,
        {
          params: { page, limit },
        }
      );
      console.log(
        "[DEBUG] FetchResultsBySubscription Response:",
        response.data
      );
      return response.data.data;
    } catch (error) {
      console.error(
        "[ERROR] Failed to fetch subscription results:",
        error.response || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subscription results"
      );
    }
  }
);

// Get alert summary
export const fetchAlertSummary = createAsyncThunk(
  "analysis/fetchAlertSummary",
  async (_, { rejectWithValue }) => {
    try {
      console.log("[DEBUG] Fetching alert summary...");
      const response = await api.get("/analysis-results/alert-summary");
      console.log("[DEBUG] FetchAlertSummary Response:", response.data);
      return response.data.data;
    } catch (error) {
      console.error(
        "[ERROR] Failed to fetch alert summary:",
        error.response || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch alert summary"
      );
    }
  }
);

// Delete analysis result by ID
export const deleteAnalysisResult = createAsyncThunk(
  "analysis/deleteAnalysisResult",
  async (id, { rejectWithValue }) => {
    try {
      console.log("[DEBUG] Deleting analysis result by ID:", id);
      await api.delete(`/analysis-results/${id}`);
      console.log("[DEBUG] DeleteAnalysisResult: Successfully deleted");
      return id; // Return the ID to remove it from the state
    } catch (error) {
      console.error(
        "[ERROR] Failed to delete analysis result:",
        error.response || error.message
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete analysis result"
      );
    }
  }
);

// Redux slice definition
const analysisSlice = createSlice({
  name: "analysis",
  initialState: {
    results: [],
    currentResult: null,
    alertSummary: null,
    loading: false,
    error: null,
    pagination: {
      currentPage: 1,
      totalPages: 1,
      totalCount: 0,
      limit: 10,
    },
  },
  reducers: {
    clearCurrentResult: (state) => {
      state.currentResult = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Analysis Results
      .addCase(fetchUserAnalysisResults.pending, (state) => {
        console.log("[DEBUG] FetchUserAnalysisResults: Pending...");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAnalysisResults.fulfilled, (state, action) => {
        console.log("[DEBUG] FetchUserAnalysisResults: Fulfilled");
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchUserAnalysisResults.rejected, (state, action) => {
        console.error(
          "[DEBUG] FetchUserAnalysisResults: Rejected",
          action.payload
        );
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Analysis Result By ID
      .addCase(fetchAnalysisResultById.pending, (state) => {
        console.log("[DEBUG] FetchAnalysisResultById: Pending...");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalysisResultById.fulfilled, (state, action) => {
        console.log("[DEBUG] FetchAnalysisResultById: Fulfilled");
        state.loading = false;
        state.currentResult = action.payload;
      })
      .addCase(fetchAnalysisResultById.rejected, (state, action) => {
        console.error(
          "[DEBUG] FetchAnalysisResultById: Rejected",
          action.payload
        );
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Results By Subscription
      .addCase(fetchResultsBySubscription.pending, (state) => {
        console.log("[DEBUG] FetchResultsBySubscription: Pending...");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResultsBySubscription.fulfilled, (state, action) => {
        console.log("[DEBUG] FetchResultsBySubscription: Fulfilled");
        state.loading = false;
        state.results = action.payload.results;
        state.pagination = {
          currentPage: action.payload.currentPage,
          totalPages: action.payload.totalPages,
          totalCount: action.payload.totalCount,
          limit: action.payload.limit,
        };
      })
      .addCase(fetchResultsBySubscription.rejected, (state, action) => {
        console.error(
          "[DEBUG] FetchResultsBySubscription: Rejected",
          action.payload
        );
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Alert Summary
      .addCase(fetchAlertSummary.pending, (state) => {
        console.log("[DEBUG] FetchAlertSummary: Pending...");
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlertSummary.fulfilled, (state, action) => {
        console.log("[DEBUG] FetchAlertSummary: Fulfilled");
        state.loading = false;
        state.alertSummary = action.payload;
      })
      .addCase(fetchAlertSummary.rejected, (state, action) => {
        console.error("[DEBUG] FetchAlertSummary: Rejected", action.payload);
        state.loading = false;
        state.error = action.payload;
      })
      // Delete Analysis Result
      .addCase(deleteAnalysisResult.pending, (state) => {
        console.log("[DEBUG] DeleteAnalysisResult: Pending...");
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAnalysisResult.fulfilled, (state, action) => {
        console.log("[DEBUG] DeleteAnalysisResult: Fulfilled");
        state.loading = false;
        // Remove the deleted result from the state
        state.results = state.results.filter(
          (result) => result.id !== action.payload
        );
      })
      .addCase(deleteAnalysisResult.rejected, (state, action) => {
        console.error("[DEBUG] DeleteAnalysisResult: Rejected", action.payload);
        state.loading = false;
        state.error = action.payload;
      });
  },
});

// Export reducers and actions
export const { clearCurrentResult, clearError } = analysisSlice.actions;
export default analysisSlice.reducer;
