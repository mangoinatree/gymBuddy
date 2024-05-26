import TimeAgo from "./TimeAgo";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useGetPostsQuery } from "./postsSlice";

const SinglePostPage = () => {
    const { postId } = useParams()

    const { post, isLoading } = useGetPostsQuery('getPosts', {
        selectFromResult: ({ data, isLoading }) => ({
            post: data?.entities[postId],
            isLoading
        }),
    })

    if (isLoading) return <p>Loading...</p>

    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }

    return (
        <article>
            <h2>{post.title}</h2>
            <div>
                {post.file && <img src={post.file} alt="uploaded"></img>}
            </div>
            <p>{post.body}</p>
            <ol>
                {post.tags && post.tags.map((tag, index) => (
                    <li key={index}>{tag}</li>
                ))}
            </ol>
            <p className="postCredit">
                <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
                <TimeAgo timestamp={post.date} />
            </p>
        </article>
    )
}

export default SinglePostPage