import { useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext";
import { NavLink, useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const { login } = useContext(AuthContext);

    const navigate = useNavigate();

    function onSubmit(e) {
        e.preventDefault();

        fetch('http://localhost:3000/api/auth/login', {
            method: 'POST', // HTTP-Methode
            headers: {
              'Content-Type': 'application/json' // Header, der den Inhaltstyp angibt
            },
            body: JSON.stringify({ // Daten, die im Anfrage-Body gesendet werden
              email: email,
              password: password
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Login failed");
            }
            setMessage(""); // entferne Nachricht, falls vorher login fehlgeschlagen und Fehlernachricht noch angezeigt wird
            return res.json();
        })
        .then(data => {
            if (data.token) {
                setEmail("");
                setPassword("");
                login(data.token);
                navigate("/posts")
            }
        })
        .catch(() => setMessage("Bitte kontrolliere deine Daten"))
    }

    return (
        <section className="form-wrapper">
            <h1>Login</h1>
            <p className="form-info">{message}</p>
            <form onSubmit={onSubmit}>
                <div className="input-section">
                    <label htmlFor="email">E-Mail-Adresse</label>
                    <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="input-section">
                    <label htmlFor="password">Passwort</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button className="button-primary">Anmelden</button>
            </form>
            <p style={{marginTop: "20px"}}>Neu hier? <br/><NavLink to="/register">Jetzt registrieren</NavLink></p>
        </section>
    )
}