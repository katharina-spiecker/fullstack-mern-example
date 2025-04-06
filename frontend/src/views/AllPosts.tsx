import { useEffect, useState, useContext } from "react";
import { AuthContext } from "../context/AuthContext.ts";
import PostContainer from "../components/PostContainer.tsx";
import { Post } from "../types.ts";

export default function AllPosts() {
    const [posts, setPosts] = useState<Post[]>([]);
    const { token } = useContext(AuthContext);

    useEffect(() => {
        fetch(`${import.meta.env.VITE_API_BASE_URL}/api/posts`, {
            headers: {
              'Authorization': `Bearer ${token}`
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
    }, [token])

    return (
        <div>
            <section>
                {
                    posts.map((post) => <PostContainer key={post._id} post={post}/>)
                }
            </section>
        </div>
    )
}