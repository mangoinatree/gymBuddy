import { Link, useParams } from 'react-router-dom'
import React from 'react'
import { useGetPostsQuery } from '../post/postsSlice'
import TimeAgo from '../post/TimeAgo'
import styles from './tagPage.module.css'


const TagPage = () => {
    const { tagName } = useParams()

    const {
        data: posts,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostsQuery('getPosts')



    let content;
    if (isLoading) {
        content = <p>Loading...</p>
    } else if (isSuccess ) {
        // Filter posts based on tagName
        const { ids, entities } = posts
        const filteredPosts = ids.filter(id => entities[id].tags && entities[id].tags.includes(tagName));

        if (filteredPosts.length === 0) {
            content = <p>No posts found for {tagName}</p>;
        } else{
            content = (
                <section className={styles.container}>
                    <h2 className={styles.title}>#{tagName}</h2>
                    <ol className={styles.postList}>
                        {filteredPosts.map(id => (
                            <li key={id} className={styles.listItem}>
                                <Link to={`/post/${id}`}>
                                    {entities[id].title}
                                </Link>
                                <p className={styles.time}>
                                   <TimeAgo timestamp={entities[id].date} /> 
                                </p>
                                
                            </li>
                        ))}
                    </ol>
                </section>
            )
        }
        
        
    } else if (isError ) {
        content = <p>{error.message}</p>;
    }

    return content
}

export default TagPage
