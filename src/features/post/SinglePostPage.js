import TimeAgo from "./TimeAgo";
import { useParams } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { useGetPostsQuery } from "./postsSlice";
import styles from './postExcerpt.module.css'
import React from "react";

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
        <article className={styles.post}>
            <div className={styles.postText}>
                <h2 className={styles.title}>{post.title}</h2>
                <p>{post.body}</p>
                <p className={styles.tags}>
                    {post.tags && post.tags.map((tag, index) => (
                        <React.Fragment key={index}>
                            #{tag} {index !== post.tags.length - 1 && ' '}
                        </React.Fragment>
                    ))}
                </p>
            </div>
            <div>
                {post.image && <img src={post.image} alt="uploaded"></img>}
            </div>
            <p className={styles.postCredit}>
                <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
                <TimeAgo timestamp={post.date} />
            </p>
        </article>
    )
}

export default SinglePostPage