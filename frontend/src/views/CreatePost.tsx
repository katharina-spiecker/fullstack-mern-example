import { useContext, useState } from "react";
import { AuthContext } from "../context/AuthContext.ts";

export default function CreatePost() {
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [message, setMessage] = useState("");
    const { getToken } = useContext(AuthContext);
    const { t } = useTranslation();

    function onSubmit(e: React.FormEvent<HTMLFormElement>) {
        e.preventDefault();
        const jwt = getToken();

        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/posts`, {
            method: 'POST', 
            headers: {
              'Content-Type': 'application/json',
              'Authorization': `Bearer ${jwt}`
            },
            body: JSON.stringify({
                title: title,
                description: description
            })
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Posting failed");
            }
            setTitle("");
            setDescription("");
            setMessage("Post wurde erstellt"); 
        })
        .catch(() => setMessage("Bitte kontrolliere deine Daten"))
    }

    return (
        <section className="form-wrapper">
            <h4>{t('newPost.title')}</h4>
            <p className="form-info">{message}</p>
            <form onSubmit={onSubmit}>
                <div className="input-section">
                    <label htmlFor="title">{t('newPost.postTitle')}</label>
                    <input type="text" id="title" value={title} onChange={(e) => setTitle(e.target.value)}/>
                </div>
                <div className="input-section">
                    <label htmlFor="description">{t('newPost.desc')}</label>
                    <textarea id="description" value={description} onChange={(e) => setDescription(e.target.value)}/>
                </div>
                <button className="btn btn-primary">{t('newPost.publish')}</button>
            </form>
        </section>
    )
}