import { Navigate, Outlet } from 'react-router-dom';
import { useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";

export default function ProtectedRoute() {
  const { isAuthenticated, authIsLoading } = useContext(AuthContext);

  // wenn laden beendet ist und User nicht eingeloggt ist
  if (!authIsLoading && !isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};