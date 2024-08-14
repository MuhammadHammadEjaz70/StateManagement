import React from 'react'
import PostAuthor from './PostAuthor'
import PostDate from './PostDate'
import ReactionButtons from './ReactionButtons'
import { Link } from 'react-router-dom'

import { useSelector } from 'react-redux';
import { selectPostById } from './postsSlice'


// This let is used for react memo
// let PostExcerpt = ({ post }) => { 
// const PostExcerpt = ({ post }) => {
const PostExcerpt = ({ postId }) => {
    const post = useSelector(state => selectPostById(state, postId))
    return (
        <article >
            <h3>{post.title}</h3>
            <p className='excerpt' >{post.body.substring(0, 75)}...</p>
            <p className='postCredit'>
                <Link to={`post/${post.id}`}>View Post </Link>
                <PostAuthor userId={post.userId} />
                <PostDate timeStamp={post.date} />
            </p>
            <p><ReactionButtons post={post} /></p>
        </article>
    )
}

// PostExcerpt = React.memo(PostExcerpt)
// //It will allow this componenet to not re-render if the props it recieved is not changed
export default PostExcerpt