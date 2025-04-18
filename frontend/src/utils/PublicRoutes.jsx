import React from "react";
import { useSelector } from "react-redux";
import { Navigate, useLocation } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const location = useLocation();

  if (isAuthenticated) {

    return <Navigate to={location.state?.from?.pathname || "/"} replace />;
  }

  return children;
};

export default PublicRoute;
