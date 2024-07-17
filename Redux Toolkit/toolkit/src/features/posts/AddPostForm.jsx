import React, { useState } from 'react'
import { useDispatch, useSelector } from 'react-redux'
import { postAdded, addNewPost } from './postsSlice';
import { selectAllUsers } from '../users/usersSlice';
import { useNavigate } from 'react-router-dom';

const AddPostForm = () => {
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const users = useSelector(selectAllUsers)
    const [title, setTitle] = useState("")
    const [content, setContent] = useState("")
    const [userId, setUserId] = useState("")
    const [addRequestStatus, setAddRequestStatus] = useState("idle")
    const onTitleChanged = e => setTitle(e.target.value)
    const onContentChanged = e => setContent(e.target.value)
    const onAuthorChanged = e => setUserId(e.target.value)

    // const canSave = Boolean(title) && Boolean(content) && Boolean(userId)
    const canSave = [title, content, userId].every(Boolean) && addRequestStatus === 'idle'

    // const onSavePostClicked = (e) => {
    //     e.preventDefault();
    //     if (title && content && userId != "")
    //         dispatch(postAdded(title, content, userId))
    //     setTitle("")
    //     setContent("")
    //     setUserId("")
    // }

    const onSavePostClicked = (e) => {
        e.preventDefault();
        if (canSave) {
            try {
                setAddRequestStatus('pending');
                dispatch(addNewPost({ title, body: content, userId })).unwrap()
                setTitle("");
                setContent('');
                setUserId('')
                navigate('/')
            } catch (err) {
                window.alert('Failed to save the post', err);
            } finally {
                setAddRequestStatus("idle")
            }
        }
    }

    const usersOptions = users.map(user => (
        <option key={user.id} value={user.id}>{user.name}</option>
    ))
    return (
        <section>
            <h2>Add a New Post</h2>
            <form onSubmit={onSavePostClicked} >
                <label htmlFor="postTitle">Post Title: </label>
                <input type="text"
                    id="postTitle"
                    name="postTitle"
                    value={title}
                    onChange={onTitleChanged} />
                <label htmlFor="postAuthor">Author:</label>
                <select name="postAuthor" id="postAuthor"
                    value={userId} onChange={onAuthorChanged}
                >
                    <option value="">
                    </option>
                    {usersOptions}


                </select>
                <label htmlFor="postContent">Post Content: </label>
                <input type="text"
                    id="postContent"
                    name="postContent"
                    value={content}
                    onChange={onContentChanged} />
                <button

                    disabled={!canSave}>
                    Save Post
                </button>
            </form>
        </section>
    )
}

export default AddPostForm