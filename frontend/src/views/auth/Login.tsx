import { useState, useContext } from "react";
import { AuthContext } from "../../context/AuthContext.ts";
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from "react-i18next";

export default function Login() {
    const [email, setEmail] = useState<string>("");
    const [password, setPassword] = useState<string>("");
    const [message, setMessage] = useState<string>("");
    const [showEmailNotVerified, setShowEmailNotVerified] = useState<boolean>(false);
    const [emailVerificationMesage, setEmailVerificationMesage] = useState<string>("Your email has not been verified.");
    const [showEmailVerificationBtn, setShowEmailVerificationBtn] = useState<boolean>(false);
    const { login } = useContext(AuthContext);
    const { t } = useTranslation();

    const navigate = useNavigate();

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
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
            }),
            credentials: "include"
        })
        .then(res => {
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
            <h1 className="text-xl md:text-2xl font-semibold mb-2">Login</h1>
            {
                message && <p className="form-info">{message}</p>
            }
            {
                showEmailNotVerified && (
                    <>
                    <div className="form-info" style={{marginBottom: showEmailVerificationBtn ? "0" : "20px"}}>{emailVerificationMesage}</div>
                    {
                        showEmailVerificationBtn &&  <button className="btn btn-primary" style={{marginBottom: "20px"}} onClick={handleEmailVerificationResend}>Resend verification email</button>
                    }
                    </>
                )
            }
            <form onSubmit={onSubmit}>
                <div className="input-section">
                    <label htmlFor="email">{t('general.email')}</label>
                    <input type="text" id="email" value={email} onChange={(e) => setEmail(e.target.value)}/>
                </div>
                <div className="input-section">
                    <label htmlFor="password">{t('general.password')}</label>
                    <input type="password" id="password" value={password} onChange={(e) => setPassword(e.target.value)}/>
                </div>
                <button className="btn btn-primary mb-3">{t('login.submit')}</button>
            </form>
            <Link to="/register" className="link-primary mb-2 inline-block">{t('login.ctaRegisterInstead')}</Link>
            <p><Link className="link" to="/request-pwd-reset">{t('general.forgotPassword')}</Link></p>
        </section>
    )
}