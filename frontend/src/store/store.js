import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";

// Combine reducers without persistence.
const rootReducer = combineReducers({

  auth: authReducer,

});

const store = configureStore({
  reducer: rootReducer,
});

export default store;
