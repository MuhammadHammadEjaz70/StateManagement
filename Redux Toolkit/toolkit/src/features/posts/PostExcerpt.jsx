import React from 'react'
import PostAuthor from './PostAuthor'
import PostDate from './PostDate'
import ReactionButtons from './ReactionButtons'
import { Link } from 'react-router-dom'

const PostExcerpt = ({ post }) => {
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

export default PostExcerpt