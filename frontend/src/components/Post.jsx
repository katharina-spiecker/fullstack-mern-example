export default function Post({post}) {
    return (
        <div className="post-wrapper">
            <h3 className="post-wrapper-title">{post.title}</h3>
            <p>{post.description}</p>
        </div>
    )
}