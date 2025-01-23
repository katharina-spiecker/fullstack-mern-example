import styles from "./Post.module.scss";

export default function Post({post}) {
    return (
        <div className={styles.postWrapper}>
            <h3 className={styles.postWrapperTitle}>{post.title}</h3>
            <p>{post.description}</p>
        </div>
    )
}