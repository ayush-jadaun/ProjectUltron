/*
=============================
        Imports
=============================
*/
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import analysisReducer from "./slices/analysisSlice";
import subscriptionReducer from "./slices/subscriptionSlice";

/*
=============================
      Root Reducer Setup
=============================
*/
const rootReducer = combineReducers({
  auth: authReducer,
  analysis: analysisReducer,
  subscription: subscriptionReducer,
});

/*
=============================
      Store Configuration
=============================
*/
const store = configureStore({
  reducer: rootReducer,
});

/*
=============================
       Export Store
=============================
*/
export default store;
