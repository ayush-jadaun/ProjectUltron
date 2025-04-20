/*
=============================
        Imports
=============================
*/
import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import { toast } from "react-toastify"; // <-- for notifications

/*
=============================
        Axios API Instance
=============================
*/
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

/*
=============================
    Fetch User Analysis Results
=============================
*/
export const fetchUserAnalysisResults = createAsyncThunk(
  "analysis/fetchUserAnalysisResults",
  async (
    { page = 1, limit = 10, analysis_type, alert_triggered },
    { rejectWithValue }
  ) => {
    try {
      const response = await api.get("/analysis-results", {
        params: { page, limit, analysis_type, alert_triggered },
      });
      return response.data.data.results; // Assuming the response includes `.results`
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch analysis results"
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch analysis results"
      );
    }
  }
);

/*
=============================
    Fetch Analysis Result By ID
=============================
*/
export const fetchAnalysisResultById = createAsyncThunk(
  "analysis/fetchAnalysisResultById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/analysis-results/${id}`);
      return response.data.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch analysis result"
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch analysis result"
      );
    }
  }
);

/*
=============================
    Fetch Results By Subscription
=============================
*/
export const fetchResultsBySubscription = createAsyncThunk(
  "analysis/fetchResultsBySubscription",
  async ({ subscriptionId, page = 1, limit = 10 }, { rejectWithValue }) => {
    try {
      const response = await api.get(
        `/analysis-results/subscription/${subscriptionId}`,
        {
          params: { page, limit },
        }
      );
      return response.data.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch subscription results"
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subscription results"
      );
    }
  }
);

/*
=============================
        Fetch Alert Summary
=============================
*/
export const fetchAlertSummary = createAsyncThunk(
  "analysis/fetchAlertSummary",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/analysis-results/alert-summary");
      return response.data.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to fetch alert summary"
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch alert summary"
      );
    }
  }
);

/*
=============================
    Delete Analysis Result By ID
=============================
*/
export const deleteAnalysisResult = createAsyncThunk(
  "analysis/deleteAnalysisResult",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/analysis-results/${id}`);
      toast.success("Analysis result deleted successfully.");
      return id; // Return the ID to remove it from the state
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to delete analysis result"
      );
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete analysis result"
      );
    }
  }
);

/*
=============================
    Analysis Slice Definition
=============================
*/
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
    /*
    =============================
          Clear Current Result
    =============================
    */
    clearCurrentResult: (state) => {
      state.currentResult = null;
    },
    /*
    =============================
              Clear Error
    =============================
    */
    clearError: (state) => {
      state.error = null;
    },
  },
  /*
  =============================
        Extra Reducers
  =============================
  */
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
      // Fetch Results By Subscription
      .addCase(fetchResultsBySubscription.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchResultsBySubscription.fulfilled, (state, action) => {
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
      })
      // Delete Analysis Result
      .addCase(deleteAnalysisResult.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(deleteAnalysisResult.fulfilled, (state, action) => {
        state.loading = false;
        // Remove the deleted result from the state
        state.results = state.results.filter(
          (result) => result.id !== action.payload
        );
      })
      .addCase(deleteAnalysisResult.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      });
  },
});

/*
=============================
    Export Actions & Reducer
=============================
*/
export const { clearCurrentResult, clearError } = analysisSlice.actions;
export default analysisSlice.reducer;
