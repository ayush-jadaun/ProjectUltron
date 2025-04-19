import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import analysisReducer from "./slices/analysisSlice";
import subscriptionReducer from "./slices/subscriptionSlice";

// Combine reducers without persistence.
const rootReducer = combineReducers({
  auth: authReducer,
  analysis: analysisReducer,
  subscription: subscriptionReducer,
});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
