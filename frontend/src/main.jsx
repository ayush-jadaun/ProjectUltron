import React, { StrictMode, useEffect } from "react";
import { createRoot } from "react-dom/client";
import "./global.css";
import App from "./App.jsx";
import store from "./store/store.js";
import { Provider } from "react-redux";
import { checkAuthStatus } from "./store/slices/authSlice";


const AppWrapper = () => {
  useEffect(() => {

    store.dispatch(checkAuthStatus());


    const interval = setInterval(() => {
      store.dispatch(checkAuthStatus());
    }, 15 * 60 * 1000);

    return () => clearInterval(interval);
  }, []);

  return <App />;
};

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <Provider store={store}>
      <AppWrapper />
    </Provider>
  </StrictMode>
);
