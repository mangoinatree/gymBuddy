import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetPostsQuery } from './postsApiSlice';
import { useUpdatePostMutation, useDeletePostMutation } from "./postsApiSlice";
import { useGetTagsQuery, useAddTagMutation } from '../tags/tagsApiSlice'
import styles from './postForm.module.css'

const EditPostForm = () => {
    const { postId } = useParams()
    const navigate = useNavigate()

    const [updatePost, { isLoading }] = useUpdatePostMutation()
    const [deletePost] = useDeletePostMutation()
    const [addTag] = useAddTagMutation()



    const { post, isLoading: isLoadingPosts, isSuccess } = useGetPostsQuery('getPosts', {
        selectFromResult: ({ data, isLoading, isSuccess }) => ({
            post: data?.entities[postId],
            isLoading,
            isSuccess
        }),
    })



    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState([])
    const [file, setFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        setFile(file);
        if (file) {
            const reader = new FileReader();
            reader.onloadend = () => {
                setPreviewUrl(reader.result);
            };
            reader.readAsDataURL(file);
        } else {
            setPreviewUrl(null);
        }
    };


    const {
        data: existingTags,
    } = useGetTagsQuery('getTags')

    function handleKeyDown(e) {
        if (e.key !== 'Enter') return
        const value = e.target.value.trim().toLowerCase()
        if (!value) return
        setTags([...tags, value])
        e.target.value = ''
        const isExistingTag = existingTags.ids.some(tagId => existingTags.entities[tagId].name === value);
        if (!isExistingTag) {
            addTag(value);
        }
    }

    function removeTag(index) {
        setTags(tags.filter((el, i) => i !== index))

    }

    useEffect(() => {
        if (isSuccess) {
            setTitle(post.title)
            setContent(post.body)
            setTags(post.tags)
            setPreviewUrl(`http://localhost:3500${post.filePath.replace('/public', '')}`)
            

        }
    }, [isSuccess, post?.title, post?.body, post?.tags])

    if (isLoadingPosts) return <p>Loading...</p>

    if (!post) {
        return (
            <section>
                <h2>Post not found!</h2>
            </section>
        )
    }



    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)

    const canSave = [title, content].every(Boolean) && !isLoading;

    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                await updatePost({ id: post?.id, title, body: content, tags, file }).unwrap()

                setTitle('')
                setContent('')
                navigate(`/post/${postId}`)
            } catch (err) {
                console.error('Failed to save the post', err)
            }
        }
    }


    const onDeletePostClicked = async () => {
        try {
            await deletePost({ id: post?.id }).unwrap()

            setTitle('')
            setContent('')
            navigate('/')
        } catch (err) {
            console.error('Failed to delete the post', err)
        }
    }

    const onCancelClicked = () => {
        navigate(-1); // Go back to the previous page
    };

    return (
        <section>
            <form>
                <h3 className={styles.title}>edit post</h3>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                    placeholder='title'
                />
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                    placeholder='description...'
                />
                <div className='tags-input-container'>
                    {tags.map((tag, index) => (
                        <div className='tag-item' key={index}>
                            <span className='text'>{tag}</span>
                            <span
                                className='close'
                                onClick={() => removeTag(index)}
                            >&times;</span>
                        </div>
                    ))}
                    <input
                        type='text'
                        className={styles.tagInput}
                        onKeyDown={handleKeyDown}
                        placeholder='#tag'
                    ></input>
                </div>

                <label>Add Image:</label>
                {previewUrl && (
                        
                        <img
                            src={previewUrl}
                            alt="Image Preview"
                            className={styles.imagePreview}
                        />
                   
                )}
                <input
                    name="image"
                    type="file"
                    onChange={handleFileChange}
                />
                <div className={styles.cancelSave}>
                    <button
                        type="button"
                        onClick={onSavePostClicked}
                        disabled={!canSave}
                        className={styles.saveButton}

                    >
                        Save
                    </button>
                    <button
                        type="button"
                        onClick={onCancelClicked}
                        className={styles.cancelButton}
                    >
                        Cancel
                    </button>
                </div>

                <button className={styles.deleteButton}
                    type="button"
                    onClick={onDeletePostClicked}
                >
                    Delete Post
                </button>
            </form>
        </section>
    )
}

export default EditPostForm