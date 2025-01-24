import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext";
import { Link, useNavigate } from 'react-router-dom';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const [showEmailNotVerified, setShowEmailNotVerified] = useState(false);
    const [emailVerificationMesage, setEmailVerificationMesage] = useState("Your email has not been verified.");
    const [showEmailVerificationBtn, setShowEmailVerificationBtn] = useState(false);
    const { login } = useContext(AuthContext);

    const navigate = useNavigate();

    function onSubmit(e) {
        e.preventDefault();
        setShowEmailNotVerified(false);

        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/login`, {
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
            console.log(res);
            if (!res.ok) {
                if (res.status === 403) {
                    setShowEmailVerificationBtn(true);
                    setShowEmailNotVerified(true);
                } else {
                    throw new Error("Login failed");
                }
            }
            
            setMessage("");
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
        .catch((error) => {
            console.error(error);
            setMessage("Please check your data");
        })
    }

    function handleEmailVerificationResend() {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/email-verification-resend`, {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({
              email: email
            })
        })
        .then(res => {
            if (res.ok) {
                setShowEmailVerificationBtn(false);
                setEmailVerificationMesage("Email verification sent! Please check your inbox and confirm your email.");
            }
        })
        .catch(error => {
            console.error(error.message);
            setEmailVerificationMesage("We were not able to send your verification email. Please try again.");
        })
    }

    return (
        <section className="form-wrapper">
            <h1>Login</h1>
            {
                message && <p className="form-info">{message}</p>
            }
            {
                showEmailNotVerified && (
                    <>
                    <div className="form-info" style={{marginBottom: showEmailVerificationBtn ? "0" : "20px"}}>{emailVerificationMesage}</div>
                    {
                        showEmailVerificationBtn &&  <button className="button-primary" style={{marginBottom: "20px"}} onClick={handleEmailVerificationResend}>Resend verification email</button>
                    }
                    </>
                )
            }
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
            <p style={{marginTop: "20px", marginBottom: "10px"}}><Link to="/register">Jetzt registrieren</Link></p>
            <p><Link className="text-gray" to="/request-pwd-reset">Passwort vergessen</Link></p>
        </section>
    )
}