import React from 'react'
import { useSelector } from "react-redux"
import { selectAllPosts } from './postsSlice'
import PostAuthor from './PostAuthor'
import PostDate from './PostDate'
import ReactionButtons from './ReactionButtons'
const PostList = () => {
    const posts = useSelector(selectAllPosts)
    const orderedPost = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
    const renderedPosts = orderedPost.map(post => (
        <article key={post.id}>
            <h3>{post.title}</h3>
            <p>{post.content.substring(0, 100)}</p>
            <p className='postCredit'>
                <PostAuthor userId={post.userId} />
                <PostDate timeStamp={post.date} />
            </p>
            <p><ReactionButtons post={post} /></p>
        </article>
    ))


    return (
        <section>
            <h2>
                Posts
            </h2>
            {renderedPosts}
        </section>
    )


}

export default PostList
