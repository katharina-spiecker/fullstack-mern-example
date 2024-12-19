import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Header() {
    const { isAuthenticated, logout, login } = useContext(AuthContext);

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
                        <NavLink className="button-secondary" to="/login">Sign In</NavLink>
                    )
                }
            </header> 
        </>
    )
}