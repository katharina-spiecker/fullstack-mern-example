import { useState } from "react";
import { Link } from 'react-router-dom';

export default function Registration() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
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
                throw new Error("registration failed");
            }
            setMessage("Bitte checke deine Inbox und bestätige deine E-Mail.");
            setEmail("");
            setPassword("");
        })
        .catch(error => setMessage("Bitte kontrolliere deine Daten"));
    }

    return (
        <section className="form-wrapper">
            <h1>Neu hier?</h1>
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
                <button className="button-primary">Registrieren</button>
            </form>
            <p style={{marginTop: "20px"}}>Du hast schon einen Account?<br/> <Link to="/login">Jetzt einloggen</Link></p>
        </section>
    )
}