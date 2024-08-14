import { useSelector } from "react-redux"
import PostExcerpt from './PostExcerpt'
import { selectAllPosts, selectPostIds, getPostsError, getPostsStatus } from './postsSlice'

const PostList = () => {
    // const posts = useSelector(selectAllPosts)
    const orderedPostIds = useSelector(selectPostIds)
    const postsStatus = useSelector(getPostsStatus)
    const postsError = useSelector(getPostsError)

    let content;
    if (postsStatus === "loading") {
        content = <p>"Loading..."</p>
    }
    else if (postsStatus === "succeeded") {
        // const orderedPost = posts.slice().sort((a, b) => b.date.localeCompare(a.date))
        // content = orderedPost.map(post => <PostExcerpt key={post.id} post={post} />)
        content = orderedPostIds.map(postId => <PostExcerpt key={postId} postId={postId} />)
    } else if (postsStatus === "failed") {
        content = <p>{postsError}</p>
    }

    return (
        <section>
            <h2>
                Posts ({orderedPostIds.length})
            </h2>
            {content}

        </section>
    )


}

export default PostList
