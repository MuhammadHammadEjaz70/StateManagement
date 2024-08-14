import {
    createSlice,
    createAsyncThunk,
    createSelector,
    createEntityAdapter
} from "@reduxjs/toolkit"
import { sub } from "date-fns"
import axios from "axios";

const POST_URL = "https://jsonplaceholder.typicode.com/posts";

const postsAdapter = createEntityAdapter({
    sortComparer: (a, b) => b.date.localeCompare(a.date)
})

const initialState = postsAdapter.getInitialState({
    status: "idle", // 'idle' 'loading' 'succeeded' 'failed'
    error: null,
    count: 0,
})

export const fetchPosts = createAsyncThunk('posts/fetchPosts', async () => {
    try {
        const response = await axios.get(POST_URL)
        const limitedPost = response.data.slice(0, 99);
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
        // postAdded: {
        //     reducer(state, action) {
        //         state.posts.push(action.payload)
        //     },
        //     prepare(title, content, userId) {
        //         return {
        //             payload: {
        //                 id: nanoid(),
        //                 title,
        //                 content,
        //                 date: new Date().toISOString(),
        //                 userId,
        //                 reactions: {
        //                     thumbsUp: 0,
        //                     hooray: 0,
        //                     heart: 0,
        //                     rocket: 0,
        //                     coffee: 0
        //                 }
        //             }
        //         }
        //     }
        // },
        reactionAdded(state, action) {
            const { postId, reaction } = action.payload;
            // const existingPost = state.posts.find(post => post.id === postId);
            const existingPost = state.entities[postId]
            if (existingPost) {
                existingPost.reactions[reaction]++
            }
        },
        increaseCount(state, action) {
            state.count = state.count + 1;
        }
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
                // state.posts = state.posts.concat(loadedPosts)
                postsAdapter.upsertMany(state, loadedPosts)
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
                // state.posts.push(action.payload)
                postsAdapter.addOne(state, action.payload)
            })
            .addCase(updatePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log("Update could not complete")
                    console.log(action.payload)
                    return;
                }
                // const { id } = action.payload;
                action.payload.date = new Date().toISOString();
                //filter the post and add the new data with same post id
                // const posts = state.posts.filter(post => post.id !== id);
                // state.posts = [...posts, action.payload]

                postsAdapter.updateOne(state, action.payload)

            })
            .addCase(deletePost.fulfilled, (state, action) => {
                if (!action.payload?.id) {
                    console.log("delete could not complete")
                    console.log(action.payload)
                    return;
                }
                const { id } = action.payload;
                // const posts = state.posts.filter(post => post.id !== id);
                // state.posts = posts
                postsAdapter.removeOne(state, id)

            })
    },
})

export const getPostsStatus = (state) => state.posts.status
export const getPostsError = (state) => state.posts.error
export const getCount = (state) => state.posts.count

// getSelectors creates these selectors and we rename them aliases using destucturing
export const {
    selectAll: selectAllPosts,
    selectById: selectPostById,
    selectIds: selectPostIds
    // Pass in a selectors that returns the posts slice of state
} = postsAdapter.getSelectors(state => state.posts)

// export const selectAllPosts = (state) => state.posts.posts
// export const selectPostById = (state, postId) => state.posts.posts.find(post => post.id === postId);

export const selectPostByUser = createSelector([selectAllPosts, (state, userId) => userId], (posts, userId) => posts.filter(post => post.userId === userId))
export const { increaseCount, reactionAdded } = postsSlice.actions;
export default postsSlice.reducer;