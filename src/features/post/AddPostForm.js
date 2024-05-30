import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAddNewPostMutation } from "./postsSlice";
import { useGetTagsQuery, useAddTagMutation } from "../tags/tagsSlice";

const AddPostForm = () => {
    const [addNewPost, { isLoading }] = useAddNewPostMutation()
    const [addTagMutation] = useAddTagMutation()


    const navigate = useNavigate()

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
            addTagMutation(value);
        }
    }

    function removeTag(index){
        setTags(tags.filter((el, i) => i !== index))

    }

    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)


    const canSave = [title, content].every(Boolean) && tags.length > 0 && !isLoading;

    const onSavePostClicked = async () => {
        if (canSave) {
            try {
                let formData = new FormData();
                formData.append('image', image.raw)
                await addNewPost({ title, body: content , tags, image: image.raw}).unwrap()

                setTitle('')
                setContent('')
                setTags([])
                navigate('/')
            } catch (err) {
                console.error('Failed to save the post', err)
            }
        }
    }


    return (
        <section>
            <h2>Add a New Post</h2>
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
                >Save Post</button>
            </form>
        </section>
    )
}
export default AddPostForm