import TimeAgo from "./TimeAgo";
import { Link } from 'react-router-dom';
import { useGetPostsQuery } from './postsSlice';

const PostsExcerpt = ({ postId }) => {

    const { post } = useGetPostsQuery('getPosts', {
        selectFromResult: ({ data }) => ({
            post: data?.entities[postId]
        }),
    })

    return (
        <article>
            <h2>{post.title}</h2>
            <p className="excerpt">{post.body.substring(0, 75)}...</p>
            <p className="postCredit">
                <Link to={`post/${post.id}`}>View Post</Link>
                <TimeAgo timestamp={post.date} />
            </p>
        </article>
    )
}

export default PostsExcerpt