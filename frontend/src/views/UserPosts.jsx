import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.js";
import Post from "../components/Post.jsx";


export default function UserPosts() {
    const [posts, setPosts] = useState([]);
    const { getToken } = useContext(AuthContext);

    const jwt = getToken();

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/user/posts`, {
            headers: {
              'Authorization': `Bearer ${jwt}`
            }
        })
        .then(res => {
            if (!res.ok) {
                throw new Error("Posts could not be loaded");
            }
            return res.json();
        })
        .then(data => {
            setPosts(data);
        })
    }, [])

    return (
        <div>
        {
            posts.map((post) => <Post key={post._id} post={post}/>)
        }
        </div>
    )
}