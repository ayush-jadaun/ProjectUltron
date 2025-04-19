import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Setup axios instance
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// ==================== Thunks ====================

// Create new subscription (accepts all backend fields)
export const createSubscription = createAsyncThunk(
  "subscription/createSubscription",
  async (subscriptionData, { rejectWithValue }) => {
    try {
      const response = await api.post("/subscriptions", subscriptionData);
      // Return the subscription object directly
      return response.data.data.subscription || response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create subscription"
      );
    }
  }
);

// Get all subscriptions for the logged-in user
export const fetchUserSubscriptions = createAsyncThunk(
  "subscription/fetchUserSubscriptions",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/subscriptions");
      // Return the array of subscriptions
      return response.data.data.subscriptions || response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subscriptions"
      );
    }
  }
);

// Get a single subscription by ID
export const fetchSubscriptionById = createAsyncThunk(
  "subscription/fetchSubscriptionById",
  async (id, { rejectWithValue }) => {
    try {
      const response = await api.get(`/subscriptions/${id}`);
      return response.data.data.subscription || response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch subscription"
      );
    }
  }
);

// Update a subscription
export const updateSubscription = createAsyncThunk(
  "subscription/updateSubscription",
  async ({ id, updateData }, { rejectWithValue }) => {
    try {
      const response = await api.put(`/subscriptions/${id}`, updateData);
      return response.data.data.subscription || response.data.data;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update subscription"
      );
    }
  }
);

// Delete a subscription
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

// ==================== Slice ====================

const subscriptionSlice = createSlice({
  name: "subscription",
  initialState: {
    subscriptions: [],
    currentSubscription: null,
    loading: false,
    error: null,
    creating: false,
    updating: false,
    deleting: false,
    createSuccess: false,
    updateSuccess: false,
    deleteSuccess: false,
  },
  reducers: {
    clearCurrentSubscription: (state) => {
      state.currentSubscription = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    resetSuccessFlags: (state) => {
      state.createSuccess = false;
      state.updateSuccess = false;
      state.deleteSuccess = false;
    },
  },
  extraReducers: (builder) => {
    builder
      // Create Subscription
      .addCase(createSubscription.pending, (state) => {
        state.creating = true;
        state.createSuccess = false;
        state.error = null;
      })
      .addCase(createSubscription.fulfilled, (state, action) => {
        state.creating = false;
        state.createSuccess = true;
        // Add new subscription to list
        state.subscriptions.unshift(action.payload);
      })
      .addCase(createSubscription.rejected, (state, action) => {
        state.creating = false;
        state.createSuccess = false;
        state.error = action.payload;
      })
      // Fetch User Subscriptions
      .addCase(fetchUserSubscriptions.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUserSubscriptions.fulfilled, (state, action) => {
        state.loading = false;
        state.subscriptions = action.payload || [];
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
        state.updateSuccess = false;
        state.error = null;
      })
      .addCase(updateSubscription.fulfilled, (state, action) => {
        state.updating = false;
        state.updateSuccess = true;
        // Update in list if present
        const index = state.subscriptions.findIndex(
          (sub) => sub.id === action.payload.id
        );
        if (index !== -1) {
          state.subscriptions[index] = action.payload;
        }
        // Update current if it matches
        if (state.currentSubscription?.id === action.payload.id) {
          state.currentSubscription = action.payload;
        }
      })
      .addCase(updateSubscription.rejected, (state, action) => {
        state.updating = false;
        state.updateSuccess = false;
        state.error = action.payload;
      })
      // Delete Subscription
      .addCase(deleteSubscription.pending, (state) => {
        state.deleting = true;
        state.deleteSuccess = false;
        state.error = null;
      })
      .addCase(deleteSubscription.fulfilled, (state, action) => {
        state.deleting = false;
        state.deleteSuccess = true;
        state.subscriptions = state.subscriptions.filter(
          (sub) => sub.id !== action.payload
        );
        if (state.currentSubscription?.id === action.payload) {
          state.currentSubscription = null;
        }
      })
      .addCase(deleteSubscription.rejected, (state, action) => {
        state.deleting = false;
        state.deleteSuccess = false;
        state.error = action.payload;
      });
  },
});

export const { clearCurrentSubscription, clearError, resetSuccessFlags } =
  subscriptionSlice.actions;
export default subscriptionSlice.reducer;
