import { Link } from 'react-router-dom'
import { useGetTagsQuery } from './tagsApiSlice'
import styles from './tagsList.module.css'

const TagsList = () => {

    const {
        data: tags,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetTagsQuery('getTags')

    let content;
    if (isLoading) {
        content = <p>"Loading..."</p>;
    } else if (isSuccess) {

        const renderedTags = tags.ids.map(tagId => (

            <li key={tagId} className={styles.listItem}>
                <Link to={`/tag/${tags.entities[tagId].name}`}>{tags.entities[tagId].name}</Link>
            </li>
        ))

        content = (
            <section className={styles.container}>
                <ul className={styles.tagList}>{renderedTags}</ul>
            </section>
        )
    } else if (isError) {
        content = <p>{error}</p>;
    }

    return content
}

export default TagsList