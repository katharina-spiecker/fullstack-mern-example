import Header from "./components/Header.jsx";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

export default function Layout() {
    return (
        <>
            <Header />
            <main>
               <Outlet />
            </main>
            <footer>
            <Link to="/impressum">Impressum</Link>
            <Link to="/privacy">Datenschutz</Link>
            </footer>
        </>
    )
}