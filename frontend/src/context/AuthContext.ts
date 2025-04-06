import { createContext } from "react";

export type AuthContextType = {
    isAuthenticated: boolean;
    authIsLoading: boolean;
    token: string | null;
    login: (token: string) => void;
    logout: () => void;
};

// create AuthContext
export const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    authIsLoading: false,
    token: null,
    logout: () => {},
    login: () => {},
});