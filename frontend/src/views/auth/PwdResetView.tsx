import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";

export default function RequestPwdResetView() {
    const { token } = useParams();
    const [invalidMessage, setInvalidMessage] = useState("");
    const [showSuccess, setShowSuccess] = useState(false);
    const [allowReset, setAllowReset] = useState(false);
    const [pwd, setPwd] = useState("");
    const [repeatPwd, setRepeatPwd] = useState("");
    const [invalidPwd, setInvalidPwd] = useState(false);
    const [invalidPwdRepeat, setInvalidPwdRepeat] = useState(false);

    useEffect(() => {
        // Check if token is valid
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify/pwd-reset-token/${token}`)
        .then(res => {
            if (!res.ok) {
                throw new Error("token validation failed");
            }
            setAllowReset(true);
            setInvalidMessage("");
        })
        .catch(error => {
            setAllowReset(false);
            setInvalidMessage("Your reset link is not valid. Request a new link.");
            console.error(error.message);
        })
    }, [])

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/reset-pwd`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                token: token,
                password: pwd
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("resetting password failed");
            }
            setInvalidMessage("");
            setShowSuccess(true);
            setPwd("");
            setRepeatPwd("");
        })
        .catch(error => {
            setInvalidMessage("Unfortunately, it was not possible to reset your password.");
            setShowSuccess(false);
            console.error(error.message);
        })
    }

    function onChangePwd(e: React.ChangeEvent<HTMLInputElement>) {
        setPwd(e.target.value);
        if (e.target.value.length < 8) {
            setInvalidPwd(true);
        } else {
            setInvalidPwd(false);
        }
    }

    function onChangePwdRepeat(e: React.ChangeEvent<HTMLInputElement>) {
        setRepeatPwd(e.target.value);
        // check if pwd match
        if (pwd !== e.target.value) {
            setInvalidPwdRepeat(true);
        } else {
            setInvalidPwdRepeat(false);
        }
    }

    return (
        <>
            <section className="form-wrapper">
                {
                    invalidMessage && <div>{invalidMessage}</div>
                }
                {
                    showSuccess && (
                        <div>
                            <p className="success-message">You have successfully reset you password.</p>
                            <Link style={{display: "block", marginBottom: "10px"}}  to="/login">Jetzt einloggen</Link>
                        </div>
                    )
                }
                {
                    allowReset && (
                        <form onSubmit={handleSubmit}>
                            <h1>Choose a new Password</h1>
                            <div className="input-section">
                                <label htmlFor="pwd">Password</label>
                                <input type="password" id="pwd" value={pwd} onChange={onChangePwd} />
                                {
                                    invalidPwd && <div className="input-information">Your password needs to be at least 8 characters long</div>
                                }
                            </div>
                            <div className="input-section">
                                <label htmlFor="confirm-pwd">Confirm Password</label>
                                <input type="password" id="confirm-pwd" value={repeatPwd} onChange={onChangePwdRepeat} />
                                {
                                    invalidPwdRepeat && <div className="input-information">Your passwords neet to match</div>
                                }
                            </div>
                            <button className="button-primary" disabled={invalidPwd || invalidPwdRepeat}>Reset Password</button>
                        </form>
                    )
                }
                
            </section>
        </>
        
    )
}