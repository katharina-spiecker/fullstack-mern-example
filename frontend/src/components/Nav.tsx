import { NavLink, Link } from "react-router-dom";
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.ts';
import { useTranslation } from "react-i18next";
import LangSwitch from "./LangSwitch.tsx";

export default function Nav() {
    const { isAuthenticated, logout } = useContext(AuthContext);
    const { t } = useTranslation();

    return (
        <div className="navbar bg-base-100 shadow-sm">
            <nav className={`w-full max-w-5xl mx-auto px-4 flex justify-between items-center gap-4`}>
                <div className="flex gap-4 items-center">
                    <NavLink to="/" className="me-5 inline-flex items-center">
                        <span className="font-black text-primary text-xl">Y</span>
                    </NavLink>
                    {
                        isAuthenticated &&
                        <>
                        <NavLink className="nav-link hidden md:block" to="/posts">{t('nav.posts')}</NavLink>
                        <NavLink className="nav-link hidden md:block" to="/account/posts">{t('nav.myPosts')}</NavLink>
                        <NavLink className="nav-link hidden md:block" to="/newpost">{t('nav.newPost')}</NavLink>
                        </>
                    }
                </div>
                <div className="flex items-center gap-4">
                    <NavLink className="nav-link hidden md:block" to="/blog">Blog</NavLink>
                    <LangSwitch />
                     {/* Hamburger icon */}
                     <div className="dropdown dropdown-end md:hidden">
                        <div tabIndex={0} role="button" className="btn btn-ghost">
                            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16"></path>
                            </svg>
                        </div>
                        <ul
                            tabIndex={0}
                            className="menu menu-lg dropdown-content bg-slate-200 py-2 dark:bg-slate-900 z-1 mt-2 p-2 shadow rounded-b-lg">
                            {
                                isAuthenticated &&
                                <>
                                    <li>
                                        <Link to="/posts">{t('nav.posts')}</Link>
                                    </li>
                                    <li>
                                        <Link to="/account/posts">{t('nav.myPosts')}</Link>
                                    </li>
                                    <li>
                                        <Link to="/newpost">{t('nav.newPost')}</Link>
                                    </li>
                                </>
                            } 
                            <li>
                                <Link to="/blog">Blog</Link>
                            </li>   
                        </ul>
                    </div>
                    {
                        isAuthenticated ?
                        <>
                        <div className="dropdown dropdown-end">
                            
                            <div tabIndex={0} role="button" className="btn btn-ghost btn-circle avatar">
                                <div className="w-10 rounded-full">
                                <img
                                    alt="Tailwind CSS Navbar component"
                                    src="https://img.daisyui.com/images/stock/photo-1534528741775-53994a69daeb.webp" />
                                </div>
                            </div>

                            <ul
                                tabIndex={0}
                                className="menu menu-lg dropdown-content bg-slate-200 py-2 dark:bg-slate-900 z-1 mt-2 p-2 w-[120px] shadow rounded-b-lg">
                                <li><button className="button-secondary" onClick={logout}>Logout</button></li>
                            </ul>
                        </div>
                        </>
                        : 
                        <div>
                            <NavLink className="btn btn-primary" style={{marginRight: "8px"}} to="/login">Sign In</NavLink>
                            <NavLink className="btn btn-neutral" to="/register">Register</NavLink>
                        </div>
                    }
                </div>
            </nav>
            
        </div>
    )
}