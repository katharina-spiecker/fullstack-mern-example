import { useState } from "react";
import { Link } from 'react-router-dom';
import { useTranslation } from "react-i18next";

export default function Registration() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const { t } = useTranslation();

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/register`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
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
            <h1 className="text-xl md:text-2xl font-semibold mb-2">{t('register.title')}</h1>
            <p className="form-info">{message}</p>
            <form onSubmit={onSubmit}>
                <div className="input-section">
                    <label htmlFor="email">{t('general.email')}</label>
                    <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="input-section">
                    <label htmlFor="password">{t('general.password')}</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button className="btn btn-primary mb-3">{t('register.submit')}</button>
            </form>
            <Link to="/login" className="link-primary">{t('register.ctaLoginInstead')}</Link>
        </section>
    )
}