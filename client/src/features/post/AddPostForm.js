import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewPostMutation } from "./postsApiSlice";
import { useGetTagsQuery, useAddTagMutation } from "../tags/tagsApiSlice"
import styles from './postForm.module.css'

const AddPostForm = () => {
    const [addNewPost, { isLoading }] = useAddNewPostMutation()
    const [addTagMutation] = useAddTagMutation()


    const navigate = useNavigate()

    const [title, setTitle] = useState('')
    const [content, setContent] = useState('')
    const [tags, setTags] = useState([])
    const [file, setFile] = useState(null)
    const [previewUrl, setPreviewUrl] = useState(null)

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
            addTagMutation(value);
        }
    }

    function removeTag(index){
        setTags(tags.filter((el, i) => i !== index))

    }

    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)

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


    const canSave = [title, content].every(Boolean) && tags.length > 0 && !isLoading;

    const onSavePostClicked = async () => {
        
        if (canSave) {
            console.log(file)
            try {
                // Create a FormData object
                const formData = new FormData()
                formData.append('title', title)
                formData.append('body', content)
                formData.append('tags', JSON.stringify(tags))

                // Append file if it exists
                if (file) {
                    formData.append('file', file)
                }

                const newPostData = await addNewPost(formData).unwrap()
                console.log(newPostData)
                setTitle('')
                setContent('')
                setTags([])
                setFile(null)
                navigate('/')
            } catch (err) {
                console.error('Failed to save the post', err)
            }
        }
    }


    return (
        <section>
            <form>
                <h3 className={styles.title}>new post</h3>
                <input
                    type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged}
                    placeholder="title"
                />
                <textarea
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged}
                    placeholder="description..."
                />
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
                        className={styles.tagInput}
                        onKeyDown={handleKeyDown}
                        placeholder="#tag"
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
                <div>
                    <input 
                        type="file" 
                        onChange={handleFileChange}
                    />
                </div>

                <button
                    type="button"
                    className={styles.saveButton}
                    onClick={onSavePostClicked}
                    disabled={!canSave}
                >Post</button>
            </form>
        </section>
    )
}
export default AddPostForm