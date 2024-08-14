import AddPostForm from './features/post/AddPostForm'
import PostsList from './features/post/PostsList'
import SinglePostPage from './features/post/SinglePostPage'
import EditPostForm from './features/post/EditPostForm'
import { Routes, Route, Navigate } from 'react-router-dom'
import Layout from "./components/Layout"
import TagsList from './features/tags/TagsList'
import TagPage from './features/tags/TagPage'

function App() {
  return (
    <Routes>
      <Route path="/" element={<Layout/>}>
        <Route index element={<PostsList />} />
        <Route path="post">
          <Route index element={<AddPostForm />}/>
          <Route path=":postId" element={<SinglePostPage />}/>
          <Route path="edit/:postId" element={<EditPostForm />}/>
        </Route>
        <Route path="tag">
          <Route index element={<TagsList />} />
          <Route path=':tagName' element={<TagPage />} />
        </Route>

        {/* Catch all, replace with 404 */}
        <Route path="*" element={<Navigate to="/" replace />} />

      </Route>
    </Routes>
  );
}

export default App;
