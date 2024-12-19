import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";

export default function ProtectedRoute() {
  const { isAuthenticated } = useContext(AuthContext);

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};