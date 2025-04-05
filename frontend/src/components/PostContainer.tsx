import { Post } from "../types";

type Props = {
    post: Post
}

export default function PostContainer({post}: Props) {
    return (
        <div className="card w-96 bg-base-100 card-md shadow-sm mb-5">
            <div className="card-body">
                <h2 className="card-title">{post.title}</h2>
                <p>{post.description}</p>
            </div>
        </div>
    )
}