import React from 'react'
import { useSelector } from 'react-redux'
import usersSlice, { selectUserById } from './usersSlice'
import { selectAllPosts, selectPostByUser } from "../posts/postsSlice"
import { Link, useParams } from "react-router-dom"

const User = () => {
    const { userId } = useParams();
    const user = useSelector(state => selectUserById(state, Number(userId)));

    // **** NOT MEMOIZE AND SLOW VERSION ****
    // const postsForUser = useSelector(state => {
    //     console.log("called");
    //     const allPost = selectAllPosts(state)
    //     return allPost.filter(post => post.userId === Number(userId))
    // })

    // ****  MEMOIZE AND OPTIMIZED VERSION ****
    const postsForUser = useSelector(state => selectPostByUser(state, Number(userId)))

    const postTitles = postsForUser.map(post => (
        <li key={post.id}>
            <Link to={`/post/${post.id}`}>
                {post.title}
            </Link>
        </li>
    ))
    return (
        <section>
            <h2>{user.name}</h2>
            <ol>
                {postTitles}
            </ol>
        </section>
    )
}

export default User