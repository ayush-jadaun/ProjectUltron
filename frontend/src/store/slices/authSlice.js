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
    Axios Interceptor
=============================
*/
api.interceptors.response.use(
  (response) => response,
  (error) => {
    const isAuthCheck = error.config.url.includes("/users/current");
    if (error.response?.status === 401 && !isAuthCheck) {
      console.error("Session expired or invalid. Unauthorized access attempt.");
      toast.error("Session expired. Please log in again."); // <-- Toast for session expired
    }
    return Promise.reject(error);
  }
);

/*
=============================
    Check Auth Status
=============================
*/
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
      toast.error(error.response?.data?.message || "Failed to check status"); // <-- Toast for error
      return rejectWithValue(
        error.response?.data?.message || "Failed to check status"
      );
    }
  }
);

/*
=============================
        Handle Sign In
=============================
*/
export const handleSignIn = createAsyncThunk(
  "auth/handleSignIn",
  async ({ email, password }, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/login", { email, password });
      const user = response.data?.data?.user;
      if (!user) {
        toast.error("Login failed: Invalid response from server."); // <-- Toast for error
        return rejectWithValue("Login failed: Invalid response from server.");
      }
      toast.success("Login successful!"); // <-- Toast for success
      return user;
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("Please verify your email before logging in."); // <-- Toast for error
        return rejectWithValue("Please verify your email before logging in.");
      }
      if (error.response?.status === 401) {
        toast.error("Invalid email or password."); // <-- Toast for error
        return rejectWithValue("Invalid email or password.");
      }
      toast.error(
        error.response?.data?.message ||
          "Unable to sign in. Please try again later."
      ); // <-- Toast for error
      return rejectWithValue(
        error.response?.data?.message ||
          "Unable to sign in. Please try again later."
      );
    }
  }
);

/*
=============================
        Handle Sign Up
=============================
*/
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
      toast.error("Missing required signup fields."); // <-- Toast for error
      return rejectWithValue("Missing required signup fields.");
    }
    if (user_type === "ngo" && !organization_name) {
      toast.error("Organization name is required for NGO users."); // <-- Toast for error
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
      toast.success(
        "Signup successful! Please check your email to verify your account."
      ); // <-- Toast for success
      return response.data;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Signup failed. Please try again."
      ); // <-- Toast for error
      return rejectWithValue(
        error.response?.data?.message || "Signup failed. Please try again."
      );
    }
  }
);

/*
=============================
    Handle Forget Password
=============================
*/
export const handleForgetPassword = createAsyncThunk(
  "auth/handleForgetPassword",
  async (email, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/forgot-password", { email });
      toast.success(response.data.message || "Password reset email sent!"); // <-- Toast for success
      return response.data.message;
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Failed to send password reset email."
      ); // <-- Toast for error
      return rejectWithValue(
        error.response?.data?.message || "Failed to send password reset email."
      );
    }
  }
);

/*
=============================
    Handle Reset Password
=============================
*/
export const handleResetPassword = createAsyncThunk(
  "auth/handleResetPassword",
  async ({ token, newPassword }, { rejectWithValue }) => {
    try {
      const response = await api.post("/users/reset-password", {
        token,
        newPassword,
      });
      toast.success(response.data.message || "Password reset successful!"); // <-- Toast for success
      return response.data.message;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Password reset failed. The link might be invalid or expired."
      ); // <-- Toast for error
      return rejectWithValue(
        error.response?.data?.message ||
          "Password reset failed. The link might be invalid or expired."
      );
    }
  }
);

/*
=============================
    Handle Email Verification
=============================
*/
export const handleEmailVerification = createAsyncThunk(
  "auth/handleEmailVerification",
  async (token, { rejectWithValue }) => {
    try {
      const response = await api.get(`/users/verify-email?token=${token}`);
      const user = response.data?.data?.user;
      if (!user) {
        if (response.data?.data?.alreadyVerified) {
          toast.info("Email already verified. Please log in."); // <-- Toast for info
          return rejectWithValue("Email already verified. Please log in.");
        }
        toast.error("Email verification failed: Invalid response from server."); // <-- Toast for error
        return rejectWithValue(
          "Email verification failed: Invalid response from server."
        );
      }
      toast.success("Email verified successfully!"); // <-- Toast for success
      return user;
    } catch (error) {
      toast.error(
        error.response?.data?.message ||
          "Email verification failed. The link might be invalid or expired."
      ); // <-- Toast for error
      return rejectWithValue(
        error.response?.data?.message ||
          "Email verification failed. The link might be invalid or expired."
      );
    }
  }
);

/*
=============================
        Handle Logout
=============================
*/
export const handleLogout = createAsyncThunk(
  "auth/handleLogout",
  async (_, { rejectWithValue }) => {
    try {
      await api.post("/users/logout");
      toast.info("Logged out successfully."); // <-- Toast for info
      return true;
    } catch (error) {
      console.error("Server logout failed:", error);
      toast.info("Local logout completed."); // <-- Toast for info
      return true;
    }
  }
);

/*
=============================
        Fetch All Users
=============================
*/
export const fetchAllUsers = createAsyncThunk(
  "auth/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await api.get("/users/admin/all");
      const users = response.data?.data?.users;
      if (Array.isArray(users)) {
        return users;
      } else {
        toast.error(
          response.data?.message ||
            "Failed to fetch users: Invalid server response."
        ); // <-- Toast for error
        return rejectWithValue(
          response.data?.message ||
            "Failed to fetch users: Invalid server response."
        );
      }
    } catch (error) {
      if (error.response?.status === 403) {
        toast.error("Permission denied: Admin access required."); // <-- Toast for error
        return rejectWithValue("Permission denied: Admin access required.");
      }
      if (error.response?.status === 401) {
        toast.error("Authentication required."); // <-- Toast for error
        return rejectWithValue("Authentication required.");
      }
      toast.error(
        error.response?.data?.message ||
          "An error occurred while fetching users."
      ); // <-- Toast for error
      return rejectWithValue(
        error.response?.data?.message ||
          "An error occurred while fetching users."
      );
    }
  }
);

/*
=============================
        Handle Update User
=============================
*/
export const handleUpdateUser = createAsyncThunk(
  "auth/handleUpdateUser",
  async (updateData, { rejectWithValue }) => {
    const payload = {};
    if (updateData.name !== undefined) payload.name = updateData.name;
    if (updateData.organization_name !== undefined)
      payload.organization_name = updateData.organization_name;
    if (updateData.contact_number !== undefined)
      payload.contact_number = updateData.contact_number;
    if (updateData.location !== undefined)
      payload.location = updateData.location;

    if (Object.keys(payload).length === 0) {
      toast.error("No changes submitted."); // <-- Toast for error
      return rejectWithValue("No changes submitted.");
    }

    try {
      const response = await api.put("/users/update", payload);
      const updatedUser = response.data?.data?.user;
      if (!updatedUser) {
        toast.error("Update failed: Invalid response from server."); // <-- Toast for error
        return rejectWithValue("Update failed: Invalid response from server.");
      }
      toast.success("Profile updated successfully!"); // <-- Toast for success
      return updatedUser;
    } catch (error) {
      toast.error(error.response?.data?.message || "Profile update failed."); // <-- Toast for error
      return rejectWithValue(
        error.response?.data?.message || "Profile update failed."
      );
    }
  }
);

/*
=============================
        Auth Slice Definition
=============================
*/
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
    /*
		=============================
				Logout Reducer
		=============================
		*/
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.lastChecked = null;
      state.error = null;
      state.allUsers = [];
      state.usersError = null;
      state.loadingUsers = false;
    },
    /*
		=============================
				Clear Error
		=============================
		*/
    clearError: (state) => {
      state.error = null;
    },
    /*
		=============================
				Clear Users Error
		=============================
		*/
    clearUsersError: (state) => {
      state.usersError = null;
    },
    /*
		=============================
				Invalidate Auth
		=============================
		*/
    invalidateAuth: (state) => {
      state.lastChecked = null;
    },
  },
  /*
	=============================
		Extra Reducers
	=============================
	*/
  extraReducers: (builder) => {
    builder
      // Check Auth Status
      .addCase(checkAuthStatus.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = !!action.payload;
        state.lastChecked = Date.now();
        state.error = null;
      })
      .addCase(checkAuthStatus.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.lastChecked = Date.now();
        state.error =
          action.payload || "Failed to check authentication status.";
      })
      // Handle Sign In
      .addCase(handleSignIn.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleSignIn.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
        state.lastChecked = Date.now();
        state.error = null;
      })
      .addCase(handleSignIn.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      // Handle Sign Up
      .addCase(handleSignUp.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleSignUp.fulfilled, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = null;
        console.log("Signup successful:", action.payload.message);
      })
      .addCase(handleSignUp.rejected, (state, action) => {
        state.loading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.error = action.payload;
      })
      // Handle Forget Password
      .addCase(handleForgetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleForgetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log("Forgot Password request successful:", action.payload);
      })
      .addCase(handleForgetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle Reset Password
      .addCase(handleResetPassword.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleResetPassword.fulfilled, (state, action) => {
        state.loading = false;
        state.error = null;
        console.log("Reset Password successful:", action.payload);
      })
      .addCase(handleResetPassword.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload;
      })
      // Handle Email Verification
      .addCase(handleEmailVerification.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleEmailVerification.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
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
      // Handle Logout
      .addCase(handleLogout.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleLogout.fulfilled, (state) => {
        authSlice.caseReducers.logout(state);
        state.loading = false;
      })
      .addCase(handleLogout.rejected, (state, action) => {
        authSlice.caseReducers.logout(state);
        state.loading = false;
        console.error("Logout rejected:", action.payload);
      })
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.loadingUsers = true;
        state.usersError = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.loadingUsers = false;
        state.allUsers = action.payload;
        state.usersError = null;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.loadingUsers = false;
        state.usersError = action.payload;
        state.allUsers = [];
      })
      // Handle Update User
      .addCase(handleUpdateUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(handleUpdateUser.fulfilled, (state, action) => {
        state.loading = false;
        state.user = action.payload;
        state.error = null;
      })
      .addCase(handleUpdateUser.rejected, (state, action) => {
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
export const { logout, clearError, clearUsersError, invalidateAuth } =
  authSlice.actions;
export default authSlice.reducer;
