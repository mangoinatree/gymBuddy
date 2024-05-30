import { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { useGetPostsQuery } from './postsSlice';
import { useUpdatePostMutation, useDeletePostMutation } from "./postsSlice";
import { useGetTagsQuery, useAddTagMutation } from '../tags/tagsSlice';

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
    const [image, setImage] = useState({
        preview: '',
        raw: '',
      });

    function handleImageChange(e) {
        if (e.target.files.length) {
            const rawImage = e.target.files[0];
    
            const reader = new FileReader();
    
            reader.onload = function(event) {
                // Convert image data to base64
                const base64Data = event.target.result;
    
                // Set base64 data to the 'raw' key
                setImage({
                    preview: URL.createObjectURL(rawImage),
                    raw: base64Data
                });
            };
    
            // Read the file as data URL (base64)
            reader.readAsDataURL(rawImage);
        } else {
            // If no image is selected, reset the image state
            setImage({
                preview: '', // Reset preview to an empty string
                raw: '',
            });
        }
    }

    const {
        data: existingTags,
    } = useGetTagsQuery('getTags')

    function handleKeyDown(e){
        if(e.key !== 'Enter') return 
        const value = e.target.value.trim().toLowerCase()
        if(!value) return 
        setTags([...tags, value])
        e.target.value = ''
        const isExistingTag = existingTags.ids.some(tagId => existingTags.entities[tagId].name === value);
        if (!isExistingTag) {
            addTag(value);
        }
    }

    function removeTag(index){
        setTags(tags.filter((el, i) => i !== index))

    }

    useEffect(() => {
        if (isSuccess) {
            setTitle(post.title)
            setContent(post.body)
            setTags(post.tags)
            if (post.image) {
                setImage({
                    preview: post.image.preview || '', // Add additional check for image preview
                    raw: post.image.raw || '',
                });
            }
            
        }
    }, [isSuccess, post?.title, post?.body, post?.tags, post?.image])

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
                await updatePost({ id: post?.id, title, body: content, tags, image: image.raw}).unwrap()

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

    return (
        <section>
            <h2>Edit Post</h2>
            <form>
                <label htmlFor="postTitle">Post Title:</label>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                />
                <label htmlFor="postContent">Content:</label>
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                />
                <label>Enter some tags: </label>
                <div className='tags-input-container'>  
                    { tags.map((tag, index) => (
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
                        className='tags-input'
                        onKeyDown={handleKeyDown}
                    ></input>
                </div>

                <label>Add Image:</label>
                <img 
                    src={image.preview} 
                    alt="dummy"
                />
                <input 
                    name="image"
                    type="file" 
                    onChange={handleImageChange} 
                />

                <button
                    type="button"
                    onClick={onSavePostClicked}
                    disabled={!canSave}
                >
                    Save Post
                </button>
                <button className="deleteButton"
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