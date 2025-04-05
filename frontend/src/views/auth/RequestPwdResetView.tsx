import { useState } from "react";

export default function RequestPwdResetView() {
    const [email, setEmail] = useState<string>("");
    const [showMessage, setShowMessage] = useState<boolean>(false);

    function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();

        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/request/pwd-reset`, {
            method: "POST",
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email
            })
        })
        .then(() => {
            // independent of status code, show message (we dont want to give indication if user has account or not)
            setShowMessage(true);
            setEmail("");
        })
        .catch(error => {
            setShowMessage(false);
            console.error(error);
        })
    }

    return (
        <>
            <section className="form-wrapper">
                {
                    showMessage &&  <div className="text-primary" style={{marginBottom: "20px"}}>If this email has an account with us, an email was sent out. Please open the link in your email inbox to complete the reset process.</div>
                }
                <form onSubmit={handleSubmit}>
                    <h1 className="text-xl md:text-2xl font-semibold mb-2">Reset Password</h1>
                    <div className="input-section">
                        <label htmlFor="email">Email</label>
                        <input type="email" id="email" value={email} onChange={(e) => setEmail(e.target.value)} />
                    </div>
                    <button className="btn btn-primary">Request reset</button>
                </form>
            </section>
        </>
        
    )
}