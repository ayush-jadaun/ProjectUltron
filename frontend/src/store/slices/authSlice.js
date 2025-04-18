import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

const api = axios.create({
	baseURL: import.meta.env.VITE_API_URL || "http://localhost:5000/api",
	withCredentials: true,
	headers: {
		"Content-Type": "application/json",
	},
});

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

export const fetchAllUsers = createAsyncThunk(
	"auth/fetchAllUsers",
	async (_, { rejectWithValue }) => {
		try {
			const response = await api.get("/users/admin/all");
			const users = response.data?.data?.users;
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
				return rejectWithValue("Permission denied: Admin access required.");
			}
			if (error.response?.status === 401) {
				return rejectWithValue("Authentication required.");
			}
			return rejectWithValue(
				error.response?.data?.message ||
					"An error occurred while fetching users."
			);
		}
	}
);

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
			return rejectWithValue("No changes submitted.");
		}

		try {
			const response = await api.put("/users/update", payload);
			const updatedUser = response.data?.data?.user;
			if (!updatedUser) {
				return rejectWithValue("Update failed: Invalid response from server.");
			}
			return updatedUser;
		} catch (error) {
			return rejectWithValue(
				error.response?.data?.message || "Profile update failed."
			);
		}
	}
);

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
		logout: (state) => {
			state.user = null;
			state.isAuthenticated = false;
			state.lastChecked = null;
			state.error = null;
			state.allUsers = [];
			state.usersError = null;
			state.loadingUsers = false;
		},
		clearError: (state) => {
			state.error = null;
		},
		clearUsersError: (state) => {
			state.usersError = null;
		},
		invalidateAuth: (state) => {
			state.lastChecked = null;
		},
	},
	extraReducers: (builder) => {
		builder
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

export const { logout, clearError, clearUsersError, invalidateAuth} =
	authSlice.actions;
export default authSlice.reducer;
