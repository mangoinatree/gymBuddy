import TimeAgo from "./TimeAgo";
import { Link } from 'react-router-dom';
import { useGetPostsQuery } from './postsSlice'
import { useState } from "react";
import styles from './postExcerpt.module.css'
import React from "react";

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
        <article className={styles.post}>
            <div className={styles.postText}>
                <p className={styles.title}>{post.title} </p>
                
                <p className="excerpt">
                    {showFullMessage ? post.body : post.body.substring(0, 75)}
                    {post.body.length > 75 && !showFullMessage && (
                        <span>
                            <button onClick={toggleMessage}>...view more</button>
                        </span>
                    )}
                    {showFullMessage && (
                        <span>
                            <button onClick={toggleMessage}>hide</button>
                        </span>
                    )}
                </p>
                <p className={styles.tags}>
                    {post.tags && post.tags.map((tag, index) => (
                        <React.Fragment key={index}>
                            <Link to={`tag/${tag}`}>#{tag}</Link>
                            {index !== post.tags.length - 1 && ' '}
                        </React.Fragment>
                    ))}
                </p>

            </div>

            <div>
                {post.image && <img src={post.image.raw} alt="uploaded"></img>}
            </div>


            <p className={styles.postCredit}>
                <Link to={`post/${post.id}`}>View Post</Link>
                <TimeAgo timestamp={post.date} />
            </p>
        </article>
    )
}

export default PostsExcerpt