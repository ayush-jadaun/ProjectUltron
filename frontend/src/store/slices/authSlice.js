// src/slices/authSlice.js

import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Configure axios to send cookies with every request.
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
  withCredentials: true, // Important for sending/receiving cookies
  headers: {
    "Content-Type": "application/json",
  },
});

//Interceptor to handle specific errors like 401 globally

api.interceptors.response.use(
  (response) => response,
  (error) => {

    const isAuthCheck = error.config.url.includes("/users/current");
    if (error.response?.status === 401 && !isAuthCheck) {

      console.error("Session expired or invalid. Unauthorized access attempt.");

    }
    return Promise.reject(error);
  }
);

// --- Async Thunks ---

export const checkAuthStatus = createAsyncThunk(
  "auth/checkAuthStatus",
  async (_, { rejectWithValue }) => {
    try {

      const response = await api.get("/users/current");
      const user = response.data?.data?.user || null; 
      return user;
    } catch (error) {

      if (error.response?.status === 401) {
        return null;
      }
      return rejectWithValue(
        error.response?.data?.message || "Failed to check status"
      );
    }
  }
);

export const handleSignIn = createAsyncThunk(
  "auth/handleSignIn",
  async ({ email, password }, { rejectWithValue }) => {
    try {

      const response = await api.post("/users/login", { email, password });
      const user = response.data?.data?.user;

      if (!user) {
        return rejectWithValue("Login failed: Invalid response from server.");
      }
      return user; 
    } catch (error) {

      if (error.response?.status === 403) {

        return rejectWithValue("Please verify your email before logging in.");
      }
      if (error.response?.status === 401) {

        return rejectWithValue("Invalid email or password.");
      }
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to sign in. Please try again later."
      );
    }
  }
);


export const handleSignUp = createAsyncThunk(
  "auth/handleSignUp",
  async (userData, { rejectWithValue }) => {

    const {
      name,
      user_type,
      organization_name,
      contact_number,
      email,
      password,
      location,
    } = userData;

    if (!user_type || !contact_number || !email || !password || !location) {
      return rejectWithValue("Missing required signup fields.");
    }
    if (user_type === "ngo" && !organization_name) {
      return rejectWithValue("Organization name is required for NGO users.");
    }

    try {
      const response = await api.post("/users/signup", {
        name,
        user_type,
        organization_name: user_type === "ngo" ? organization_name : null, 
        email,
        password,
        location,
        contact_number,
      });

      return response.data; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    }
  }
);

export const handleForgetPassword = createAsyncThunk(
  "auth/handleForgetPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/forgot-password", { email });
      return response.data.message;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to send password reset email."
      );
    }
  }
);

export const handleResetPassword = createAsyncThunk(
  "auth/handleResetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/reset-password", {
        token,
        newPassword,
      });
      return response.data.message; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Password reset failed. The link might be invalid or expired."
      );
    }
  }
);

export const handleEmailVerification = createAsyncThunk(
  "auth/handleEmailVerification",
  async (token, { rejectWithValue }) => {
    try {

      const response = await api.get(`/users/verify-email?token=${token}`);
      const user = response.data?.data?.user;

      if (!user) {

        if (response.data?.data?.alreadyVerified) {

          return rejectWithValue("Email already verified. Please log in.");
        }
        return rejectWithValue(
          "Email verification failed: Invalid response from server."
        );
      }
      return user; 
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message ||
          "Email verification failed. The link might be invalid or expired."
      );
    }
  }
);

export const handleLogout = createAsyncThunk(
  "auth/handleLogout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/users/logout");

      return true; 
    } catch (error) {
      console.error("Server logout failed:", error);

      return true;

    }
  }
);

// --- Admin Action ---
export const fetchAllUsers = createAsyncThunk(
  "auth/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      // Backend returns user list under 'data.users' in ApiResponse
      const response = await api.get("/users/admin/all");
      const users = response.data?.data?.users;

      // Check if users is an array (even if empty)
      if (Array.isArray(users)) {
        return users;
      } else {
        return rejectWithValue(
          response.data?.message ||
            "Failed to fetch users: Invalid server response."
        );
      }
    } catch (error) {
      if (error.response?.status === 403) {
        // Backend should return 403 if not admin
        return rejectWithValue("Permission denied: Admin access required.");
      }
      if (error.response?.status === 401) {
        // If somehow not logged in
        return rejectWithValue("Authentication required.");
      }
      return rejectWithValue(
        error.response?.data?.message ||
          "An error occurred while fetching users."
      );
    }
  }
);



// --- Slice Definition ---

const authSlice = createSlice({
  name: "auth",
  initialState: {
    user: null,
    isAuthenticated: false,
    loading: false, 
    error: null,
    lastChecked: null, 


    allUsers: [],
    loadingUsers: false,
    usersError: null,
  },
  reducers: {
    // Synchronous action to force logout (clears state immediately)
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.lastChecked = null; // Needs re-check on next load
      state.error = null;
      // Clear admin state on logout too
      state.allUsers = [];
      state.usersError = null;
      state.loadingUsers = false;
    },
    // Synchronous action to clear the main auth error message
    clearError: (state) => {
      state.error = null;
    },
    // Synchronous action to clear the users list error message
    clearUsersError: (state) => {
      state.usersError = null;
    },
    // Action to manually trigger a re-check (e.g., on window focus)
    invalidateAuth: (state) => {
      state.lastChecked = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // --- checkAuthStatus ---
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // payload is user object or null
        state.isAuthenticated = !!action.payload; // true if user exists
        state.lastChecked = Date.now();
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.user = null; // Ensure logged out state on failure
        state.isAuthenticated = false;
        state.lastChecked = Date.now(); // Still mark as checked
        state.error =
          action.payload || "Failed to check authentication status.";
      })

      // --- handleSignIn ---
      .addCase(handleSignIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleSignIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // payload is the user object
        state.isAuthenticated = true;
        state.lastChecked = Date.now(); // Mark as authenticated now
        state.error = null;
      })
      .addCase(handleSignIn.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload; // Error message from rejectWithValue
      })

      // --- handleSignUp ---
      .addCase(handleSignUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleSignUp.fulfilled, (state, action) => {
        state.loading = false;
        // Don't log in user yet (email verification needed)
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        // UI can show success message based on action.payload.message
        console.log("Signup successful:", action.payload.message);
      })
      .addCase(handleSignUp.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload; // Error message from rejectWithValue
      })

      // --- handleForgetPassword ---
      .addCase(handleForgetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleForgetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log("Forgot Password request successful:", action.payload); // Log success message
      })
      .addCase(handleForgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- handleResetPassword ---
      .addCase(handleResetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleResetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        // Don't log in user, redirect to login page after success message
        console.log("Reset Password successful:", action.payload);
      })
      .addCase(handleResetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })

      // --- handleEmailVerification ---
      .addCase(handleEmailVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleEmailVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload; // Verification logs user in
        state.isAuthenticated = true;
        state.lastChecked = Date.now();
        state.error = null;
      })
      .addCase(handleEmailVerification.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })

      // --- handleLogout ---
      .addCase(handleLogout.pending, (state) => {
        state.loading = true; // Indicate activity
        state.error = null;
      })
      .addCase(handleLogout.fulfilled, (state) => {
        // Clear all auth state using the synchronous reducer logic
        authSlice.caseReducers.logout(state); // Call the logout reducer directly
        state.loading = false; // Ensure loading is reset
      })
      .addCase(handleLogout.rejected, (state, action) => {
        // Still clear client state even if server logout failed
        authSlice.caseReducers.logout(state);
        state.loading = false;
        // Log the server error, but don't show prominently to user
        console.error("Logout rejected:", action.payload);
        // state.error = "Logout failed on server, session cleared locally."; // Optional feedback
      })

      // --- fetchAllUsers (Admin action) ---
      .addCase(fetchAllUsers.pending, (state) => {
        state.loadingUsers = true;
        state.usersError = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loadingUsers = false;
        state.allUsers = action.payload; // Update the users list
        state.usersError = null;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loadingUsers = false;
        state.usersError = action.payload; // Set the specific error
        state.allUsers = []; // Clear list on error
      });

  },
});

// Export synchronous actions
export const { logout, clearError, clearUsersError, invalidateAuth } =
  authSlice.actions;

// Export the reducer
export default authSlice.reducer;
