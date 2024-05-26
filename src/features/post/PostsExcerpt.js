import TimeAgo from "./TimeAgo";
import { Link } from 'react-router-dom';
import { useGetPostsQuery } from './postsSlice'
import { useState } from "react";

const PostsExcerpt = ({ postId }) => {

    const { post } = useGetPostsQuery('getPosts', {
        selectFromResult: ({ data }) => ({
            post: data?.entities[postId]
        }),
    })

    const [showFullMessage, setShowFullMessage] = useState(false);

    const toggleMessage = () => {
        setShowFullMessage(!showFullMessage);
    };


    return (
        <article>
            <h2>{post.title}</h2>
            <div>
                {post.file && <img src={post.file} alt="uploaded"></img>}
            </div>
            <p className="excerpt">
                {showFullMessage ? post.body : post.body.substring(0, 75)}
                {post.body.length > 75 && !showFullMessage && (
                    <span>
                        <button onClick={toggleMessage}>...</button>
                    </span>
                )}
                {showFullMessage && (
                    <span>
                        <button onClick={toggleMessage}>hide</button>
                    </span>
                )}
            </p>
            <ol>
                {post.tags && post.tags.map((tag, index) => (
                    <li key={index}>{tag}</li>
                ))}
            </ol>
            <p className="postCredit">
                <Link to={`post/${post.id}`}>View Post</Link>
                <TimeAgo timestamp={post.date} />
            </p>
        </article>
    )
}

export default PostsExcerpt