import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext.ts';

export default function Header() {
    const { isAuthenticated, logout } = useContext(AuthContext);

    return (
        <>
            <header>
            <nav>
                {
                    isAuthenticated && (
                        <>
                            <NavLink to="/posts">Alle Posts</NavLink>
                            <NavLink to="/account/posts">Meine Posts</NavLink>
                            <NavLink to="/newpost">Neuer Post</NavLink>
                        </>
                    )
                }
                <NavLink to="/blog">Blog</NavLink>
            </nav>
                {
                    isAuthenticated ? (
                        <button className="button-secondary" onClick={logout}>Logout</button>
                    ) : (
                        <div>
                        <NavLink className="button-primary d-block" style={{marginRight: "8px"}} to="/login">Sign In</NavLink>
                        <NavLink className="button-secondary" to="/register">Register</NavLink>
                        </div>
                    )
                }
            </header> 
        </>
    )
}