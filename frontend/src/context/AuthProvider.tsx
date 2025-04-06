import { useEffect, useState } from "react";
import { useNavigate } from 'react-router-dom';
import { AuthContext } from "./AuthContext.ts";

export function AuthProvider({ children }: {children: React.ReactNode}) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [authIsLoading, setAuthIsLoading] = useState<boolean>(true);
  const [token, setToken] = useState<string | null>(null);
  const navigate = useNavigate(); // for redirect in logout button

  useEffect(() => {
    refreshToken();
  }, []);

  function refreshToken() {
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/refresh`, {
        credentials: "include"
    })
    .then(res => {
        if (!res.ok) {
            setIsAuthenticated(false);
            setToken(null);
            throw new Error(`refreshing token failed with status code ${res.status}`)
        }
        return res.json();
    })
    .then((data: {token: string, tokenExpirationMs: number}) => {
        setIsAuthenticated(true);
        setToken(data.token);
        setTimeout(refreshToken, data.tokenExpirationMs)
    })
    .catch(err => console.error(err.message))
    .finally(() => setAuthIsLoading(false))
  }

  function login(token: string) {
    setToken(token);
    setIsAuthenticated(true);
  }

  function logout() {
    setToken(null);
    setIsAuthenticated(false);
    // deletes refresh token from cookies
    fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/logout`, {
        method: "POST",
        credentials: "include"
    })
    .finally(() => navigate("/"))
  }

  return (
    <AuthContext.Provider value={{isAuthenticated, authIsLoading, token, login, logout}}>
        {children}
    </AuthContext.Provider>
  );
}
