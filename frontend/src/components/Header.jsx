import { NavLink } from 'react-router-dom';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function Header() {
    const { isAuthenticated, logout } = useContext(AuthContext);

    return (
        <>
        
            {
                isAuthenticated ? (
                    <header>
                        <nav>
                            <NavLink to="/all-posts">Alle Posts</NavLink>
                            <NavLink to="/my-posts">Meine Posts</NavLink>
                            <NavLink to="/new-post">Neuer Post</NavLink>
                        </nav>
                        <button className="button-secondary" onClick={logout}>Logout</button>
                    </header> 
                )  : null 
            }
            
        </>
    )
}