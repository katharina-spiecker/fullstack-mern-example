import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

export default function EmailConfirmationView() {
    const { token } = useParams();
    const [message, setMessage] = useState("");

    useEffect(() => {
        // Check if token is valid
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/auth/verify/${token}`)
        .then(res => {
            if (!res.ok) {
                throw new Error("token validation failed");
            }
            setMessage("You successfully confirmed your email. You can login now.");
        })
        .catch(error => {
            setMessage("Your email confirmation link is not valid. Login to request a new link.");
            console.error(error.message);
        })
    }, [])

    return (
       <div>{message}</div>
    )
}