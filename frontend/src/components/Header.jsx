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
                            <NavLink to="/posts">Alle Posts</NavLink>
                            <NavLink to="/account/posts">Meine Posts</NavLink>
                            <NavLink to="/newpost">Neuer Post</NavLink>
                        </nav>
                        <button className="button-secondary" onClick={logout}>Logout</button>
                    </header> 
                )  : null 
            }
            
        </>
    )
}