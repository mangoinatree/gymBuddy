import PostsExcerpt from "./PostsExcerpt";
import { useGetPostsQuery } from './postsApiSlice';
import QuotesPage from '../quotes/QuotePage'

const PostsList = () => {
    const {
        data: posts,
        isLoading,
        isSuccess,
        isError,
        error
    } = useGetPostsQuery('getPosts')

    let content;
    if (isLoading) {
        content = <p>"Loading..."</p>;
    } else if (isSuccess) {
        content = posts.ids.map(postId => <PostsExcerpt key={postId} postId={postId} />)
    } else if (isError) {
        content = <p>{error}</p>;
    }

    return (
        <section>
            <QuotesPage />
            {content}
        </section>
    )
}
export default PostsList