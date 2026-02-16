import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        isLoggedIn: false,
        user: null
    },
    reducers: {
        setSuccess: (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload;
        },
        setFailure: (state) => {
            state.isLoggedIn = false;
            state.user = null;
        }
    }
});

export const { setSuccess, setFailure } = userSlice.actions;
export default userSlice.reducer;
