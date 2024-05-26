import { Link } from 'react-router-dom'
import { useGetTagsQuery } from './tagsSlice';

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
            <li key={tagId}>
                <Link to={`/tag/${tags.entities[tagId].name}`}>{tags.entities[tagId].name}</Link>
            </li>
        ))

        content = (
            <section>
                <h2>Tags</h2>

                <ul>{renderedTags}</ul>
            </section>
        )
    } else if (isError) {
        content = <p>{error}</p>;
    }

    return content
}

export default TagsList