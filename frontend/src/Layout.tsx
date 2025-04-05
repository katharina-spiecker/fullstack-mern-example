import Nav from "./components/Nav.tsx";
import { Outlet } from "react-router-dom";
import Footer from "./components/Footer.tsx";

export default function Layout() {
    return (
        <>
            <Nav />
            <main className="w-full max-w-5xl mx-auto px-4 pt-5 md:pt-10 pb-8 grow">
               <Outlet />
            </main>
            <Footer />
        </>
    )
}