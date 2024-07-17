import React from 'react'
import PostAuthor from './PostAuthor'
import PostDate from './PostDate'
import ReactionButtons from './ReactionButtons'
const PostExcerpt = ({ post }) => {
    return (
        <article >
            <h3>{post.title}</h3>
            <p>{post.body.substring(0, 100)}</p>
            <p className='postCredit'>
                <PostAuthor userId={post.userId} />
                <PostDate timeStamp={post.date} />
            </p>
            <p><ReactionButtons post={post} /></p>
        </article>
    )
}

export default PostExcerpt