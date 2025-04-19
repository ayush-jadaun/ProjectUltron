import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Get user's analysis results
export const fetchUserAnalysisResults = createAsyncThunk(
  "analysis/fetchUserAnalysisResults",
  async ({ analysis_type, alert_triggered }, { rejectWithValue }) => {
    try {
      const response = await api.get("/analysis-results", {
        params: { analysis_type, alert_triggered }
      });
      return response.data.data;
    } catch (error) {
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
      const response = await api.get(`/analysis-results/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch analysis result"
      );
    }
  }
);

// Get alert summary
export const fetchAlertSummary = createAsyncThunk(
  "analysis/fetchAlertSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/analysis-results/alert-summary");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch alert summary"
      );
    }
  }
);

const analysisSlice = createSlice({
  name: "analysis",
  initialState: {
    results: [],
    currentResult: null,
    alertSummary: null,
    loading: false,
    error: null
  },
  reducers: {
    clearCurrentResult: (state) => {
      state.currentResult = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch User Analysis Results
      .addCase(fetchUserAnalysisResults.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserAnalysisResults.fulfilled, (state, action) => {
        state.loading = false;
        state.results = action.payload;
      })
      .addCase(fetchUserAnalysisResults.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Analysis Result By ID
      .addCase(fetchAnalysisResultById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAnalysisResultById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentResult = action.payload;
      })
      .addCase(fetchAnalysisResultById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Alert Summary
      .addCase(fetchAlertSummary.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchAlertSummary.fulfilled, (state, action) => {
        state.loading = false;
        state.alertSummary = action.payload;
      })
      .addCase(fetchAlertSummary.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentResult, clearError } = analysisSlice.actions;
export default analysisSlice.reducer; 