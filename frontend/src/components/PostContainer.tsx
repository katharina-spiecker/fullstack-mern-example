import styles from "./Post.module.scss";
import { Post } from "../types";

type Props = {
    post: Post
}

export default function PostContainer({post}: Props) {
    return (
        <div className={styles.postWrapper}>
            <h3 className={styles.postWrapperTitle}>{post.title}</h3>
            <p>{post.description}</p>
        </div>
    )
}