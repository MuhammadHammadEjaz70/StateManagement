import { useSelector } from "react-redux";
import { selectAllUsers } from "../users/usersSlice";


import React from 'react'

const PostAuthor = ({ userId }) => {
    const user = useSelector(selectAllUsers)
    const postAuthor = user.find(user => user.id === userId);
    return <span>by {postAuthor ? postAuthor.name : "Unknown Author"}</span>

}

export default PostAuthor