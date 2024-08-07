import { createSlice, nanoid, createAsyncThunk } from "@reduxjs/toolkit"
import { sub } from "date-fns"
import axios from "axios";

const POST_URL = "https://jsonplaceholder.typicode.com/posts";
const initialState = {
    posts: [],
    status: "idle", // 'idle' 'loading' 'succeeded' 'failed'
    error: null
}

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    try {
        const response = await axios.get(POST_URL)
        const limitedPost = response.data.slice(0, 5);
        return limitedPost;
    }
    catch (err) {
        return err.message;
    }
})

export const addNewPost = createAsyncThunk("posts/addNewPost", async (initialPost) => {
    try {
        const res = await axios.post(POST_URL, initialPost);
        return res.data
    }
    catch (err) {
        return err.message
    }
})

export const updatePost = createAsyncThunk("posts/updatePost", async (post) => {
    const { id } = post;
    try {
        const res = await axios.put(`${POST_URL}/${id}`, post)
        return res.data
    } catch (err) {
        // return err.message;
        return post; // for testing redux with fake api
    }
})
export const deletePost = createAsyncThunk("posts/deletePost", async (post) => {
    const { id } = post;
    try {
        const res = await axios.delete(`${POST_URL}/${id}`)
        if (res?.status === 200) return post;
        return `${res?.status}: ${res.statusText}`;
    }
    catch (err) {
        return err.message
    }
})
const postsSlice = createSlice({
    name: "posts",
    initialState,
    reducers: {
        postAdded: {
            reducer(state, action) {
                state.posts.push(action.payload)
            },
            prepare(title, content, userId) {
                return {
                    payload: {
                        id: nanoid(),
                        title,
                        content,
                        date: new Date().toISOString(),
                        userId,
                        reactions: {
                            thumbsUp: 0,
                            hooray: 0,
                            heart: 0,
                            rocket: 0,
                            coffee: 0
                        }
                    }
                }
            }
        },
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload;
            const existingPost = state.posts.find(post => post.id === postId);
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        },
    },
    extraReducers(builder) {
        builder
            .addCase(fetchPosts.pending, (state, action) => {
                state.status = "loading"
            })
            .addCase(fetchPosts.fulfilled, (state, action) => {
                state.status = "succeeded"

                let min = 1;
                const loadedPosts = action.payload.map(post => {
                    post.date = sub(new Date(), { minutes: min++ }).toISOString();
                    post.reactions = {
                        thumbsUp: 0,
                        hooray: 0,
                        heart: 0,
                        rocket: 0,
                        coffee: 0,
                    }
                    return post;
                })
                //Add any fetched posts to the Array
                state.posts = state.posts.concat(loadedPosts)
            })
            .addCase(fetchPosts.rejected, (state, action) => {
                state.status = "failed"
                state.error = action.error.message
            })
            .addCase(addNewPost.fulfilled, (state, action) => {
                action.payload.userId = Number(action.payload.userId);
                action.payload.date = new Date().toISOString();
                action.payload.reactions = {
                    thumbsUp: 0,
                    hooray: 0,
                    heart: 0,
                    rocket: 0,
                    coffee: 0,
                }
                state.posts.push(action.payload)
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log("Update could not complete")
                    console.log(action.payload)
                    return;
                }
                const { id } = action.payload;
                action.payload.date = new Date().toISOString();
                //filter the post and add the new data with same post id
                const posts = state.posts.filter(post => post.id !== id);
                state.posts = [...posts, action.payload]

            })
            .addCase(deletePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log("delete could not complete")
                    console.log(action.payload)
                    return;
                }
                const { id } = action.payload;
                const posts = state.posts.filter(post => post.id !== id);
                state.posts = posts

            })
    },
})

export const selectAllPosts = (state) => state.posts.posts
export const getPostsStatus = (state) => state.posts.status
export const getPostsError = (state) => state.posts.error

export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId);
export const { postAdded, reactionAdded } = postsSlice.actions;
export default postsSlice.reducer;