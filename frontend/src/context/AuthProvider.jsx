import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "./AuthContext";

export function AuthProvider({ children }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authIsLoading, setAuthIsLoading] = useState(true);
  const navigate = useNavigate(); // for redirect in logout button

  useEffect(() => {
    if (getToken()) {
      setIsAuthenticated(true);
    }
    setAuthIsLoading(false);
  }, []);

  function login(token) {
    localStorage.setItem("token", token);
    setIsAuthenticated(true);
  }

  function logout() {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/");
  }

  function getToken() {
    return localStorage.getItem("token");
  }

  return (
    <AuthContext.Provider value={{isAuthenticated, authIsLoading, login, getToken,logout,}}>
        {children}
    </AuthContext.Provider>
  );
}
