import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";

export default function ProtectedRoute() {
  const { isAuthenticated, authIsLoading } = useContext(AuthContext);

  // loading is completed but user is not authenticated
  if (!authIsLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};