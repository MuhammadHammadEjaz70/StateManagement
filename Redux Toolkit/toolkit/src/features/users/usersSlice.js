import { createSlice } from "@reduxjs/toolkit"

const initialState = [
    { id: "0", name: "Hamamd" },
    { id: "1", name: "Ejaz" },
    { id: "2", name: "Gujjar" }
]

const userSlice = createSlice({
    name: "users",
    initialState,
    reducers: {

    }
})
export const selectAllUsers = (state) => state.users
export default userSlice.reducer