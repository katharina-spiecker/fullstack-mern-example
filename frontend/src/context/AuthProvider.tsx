import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "./AuthContext.ts";

export function AuthProvider({ children }: {children: React.ReactNode}) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [authIsLoading, setAuthIsLoading] = useState(true);
  const navigate = useNavigate(); // for redirect in logout button

  useEffect(() => {
    if (getToken()) {
      setIsAuthenticated(true);
    }
    setAuthIsLoading(false);
  }, []);

  function login(token: string) {
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
    <AuthContext.Provider value={{isAuthenticated, authIsLoading, login, getToken, logout}}>
        {children}
    </AuthContext.Provider>
  );
}
