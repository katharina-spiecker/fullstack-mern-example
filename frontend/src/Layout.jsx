import { useContext } from "react";
import Header from "./components/Header.jsx";
import { Outlet } from "react-router-dom";
import { AuthContext } from "./context/AuthContext.js";
import { Navigate } from "react-router-dom";

// Layout Komponente redirekted zur Login Seite falls User nicht eingeloggt
export default function Layout() {
    const { isAuthenticated } = useContext(AuthContext);

    return (
        <>
            <Header />
            <main>
                {
                    isAuthenticated ? <Outlet /> : <Navigate to="/login" />
                }
            </main>
        </>
    )
}