import { createContext } from "react";

export type AuthContextType = {
    isAuthenticated: boolean;
    authIsLoading: boolean;
    login: (token: string) => void;
    logout: () => void;
    getToken: () => void;
};

// create AuthContext
export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    authIsLoading: false,
    logout: () => {},
    login: () => {},
    getToken: () => {}
});