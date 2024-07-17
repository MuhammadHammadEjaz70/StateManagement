import React, { useEffect } from 'react'
import { useSelector, useDispatch } from "react-redux"
import PostExcerpt from './PostExcerpt'
import { selectAllPosts, getPostsError, getPostsStatus, fetchPosts } from './postsSlice'

const PostList = () => {
    const dispatch = useDispatch();
    const posts = useSelector(selectAllPosts)
    const postsStatus = useSelector(getPostsStatus)
    const postsError = useSelector(getPostsError)


    let content;
    if (postsStatus === "loading") {
        content = <p>"Loading..."</p>
    }
    else if (postsStatus === "succeeded") {
        const orderedPost = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
        content = orderedPost.map(post => <PostExcerpt key={post.id} post={post} />)
    } else if (postsStatus === "failed") {
        content = <p>{postsError}</p>
    }

    useEffect(() => {
        if (postsStatus === 'idle') {
            dispatch(fetchPosts())
        }
    }, [postsStatus, dispatch])
    return (
        <section>
            <h2>
                Posts ({posts.length})
            </h2>
            {content}

        </section>
    )


}

export default PostList
