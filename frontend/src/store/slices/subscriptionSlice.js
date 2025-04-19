import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Create new subscription
export const createSubscription = createAsyncThunk(
  "subscription/createSubscription",
  async (subscriptionData, { rejectWithValue }) => {
    try {
      const response = await api.post("/subscriptions", subscriptionData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create subscription"
      );
    }
  }
);

// Get user's subscriptions
export const fetchUserSubscriptions = createAsyncThunk(
  "subscription/fetchUserSubscriptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/subscriptions");
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subscriptions"
      );
    }
  }
);

// Get subscription by ID
export const fetchSubscriptionById = createAsyncThunk(
  "subscription/fetchSubscriptionById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/subscriptions/${id}`);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subscription"
      );
    }
  }
);

// Update subscription
export const updateSubscription = createAsyncThunk(
  "subscription/updateSubscription",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/subscriptions/${id}`, updateData);
      return response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update subscription"
      );
    }
  }
);

// Delete subscription
export const deleteSubscription = createAsyncThunk(
  "subscription/deleteSubscription",
  async (id, { rejectWithValue }) => {
    try {
      await api.delete(`/subscriptions/${id}`);
      return id;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete subscription"
      );
    }
  }
);

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    subscriptions: [],
    currentSubscription: null,
    loading: false,
    error: null,
    creating: false,
    updating: false,
    deleting: false
  },
  reducers: {
    clearCurrentSubscription: (state) => {
      state.currentSubscription = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create Subscription
      .addCase(createSubscription.pending, (state) => {
        state.creating = true;
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.creating = false;
        state.subscriptions.push(action.payload);
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.creating = false;
        state.error = action.payload;
      })
      // Fetch User Subscriptions
      .addCase(fetchUserSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload;
      })
      .addCase(fetchUserSubscriptions.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Fetch Subscription By ID
      .addCase(fetchSubscriptionById.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchSubscriptionById.fulfilled, (state, action) => {
        state.loading = false;
        state.currentSubscription = action.payload;
      })
      .addCase(fetchSubscriptionById.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Update Subscription
      .addCase(updateSubscription.pending, (state) => {
        state.updating = true;
        state.error = null;
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        state.updating = false;
        const index = state.subscriptions.findIndex(sub => sub.id === action.payload.id);
        if (index !== -1) {
          state.subscriptions[index] = action.payload;
        }
        if (state.currentSubscription?.id === action.payload.id) {
          state.currentSubscription = action.payload;
        }
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.updating = false;
        state.error = action.payload;
      })
      // Delete Subscription
      .addCase(deleteSubscription.pending, (state) => {
        state.deleting = true;
        state.error = null;
      })
      .addCase(deleteSubscription.fulfilled, (state, action) => {
        state.deleting = false;
        state.subscriptions = state.subscriptions.filter(sub => sub.id !== action.payload);
        if (state.currentSubscription?.id === action.payload) {
          state.currentSubscription = null;
        }
      })
      .addCase(deleteSubscription.rejected, (state, action) => {
        state.deleting = false;
        state.error = action.payload;
      });
  }
});

export const { clearCurrentSubscription, clearError } = subscriptionSlice.actions;
export default subscriptionSlice.reducer; 