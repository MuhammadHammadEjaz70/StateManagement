import { useSelector } from "react-redux";
import { selectPostById } from "./postsSlice";
import PostAuthor from "./PostAuthor";
import PostDate from "./PostDate";
import ReactionButtons from "./ReactionButtons";
import { useParams, Link } from "react-router-dom";



const SinglePostPage = () => {
    const { postId } = useParams();
    const post = useSelector((state) => selectPostById(state, Number(postId)))
    if (!post) {
        return (
            <section>
                <h2>Post Not Found</h2>
            </section>
        )
    }
    return (
        <article>
            <h3>{post.title}</h3>
            <p>{post.body}</p>
            <p className='postCredit'>
                <Link to={`/post/edit/${post.id}`}>Edit Post</Link>
                <PostAuthor userId={post.userId} />
                <PostDate timeStamp={post.date} />
            </p>
            <p><ReactionButtons post={post} /></p>
        </article>
    )

}

export default SinglePostPage