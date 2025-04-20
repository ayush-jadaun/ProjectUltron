/*
=============================
        Imports
=============================
*/
import React, { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import App from "./App.jsx";
import store from "./store/store.js";
import { Provider } from "react-redux";
import { checkAuthStatus } from "./store/slices/authSlice";

/*
=============================
      App Wrapper
=============================
*/
const AppWrapper = () => {
  useEffect(() => {
    // Check authentication status on app load
    store.dispatch(checkAuthStatus());

    // Periodically check authentication status every 15 minutes
    const interval = setInterval(() => {
      store.dispatch(checkAuthStatus());
    }, 15 * 60 * 1000);

    // Cleanup interval on unmount
    return () => clearInterval(interval);
  }, []);

  return <App />;
};

/*
=============================
     Render Application
=============================
*/
createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  </StrictMode>
);
