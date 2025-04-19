import { configureStore, combineReducers } from "@reduxjs/toolkit";
import { persistStore, persistReducer } from "redux-persist";
import storage from "redux-persist/lib/storage"; // defaults to localStorage for web

import authReducer from "./slices/authSlice";
import analysisReducer from "./slices/analysisSlice";
import subscriptionReducer from "./slices/subscriptionSlice";

const rootReducer = combineReducers({
  auth: authReducer,
  analysis: analysisReducer,
  subscription: subscriptionReducer,
});


const persistConfig = {
  key: "root",
  storage,
};

const persistedReducer = persistReducer(persistConfig, rootReducer);


const store = configureStore({
  reducer: persistedReducer,

});

export const persistor = persistStore(store);
export default store;
