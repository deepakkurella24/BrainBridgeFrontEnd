import { createSlice } from "@reduxjs/toolkit";

const userSlice = createSlice({
    name: "user",
    initialState: {
        isLoggedIn: false,
        user: null,
        cache:{},
        cache2:{}
    },
    reducers: {
        setSuccess: (state, action) => {
            state.isLoggedIn = true;
            state.user = action.payload;
        },
        setFailure: (state) => {
            state.isLoggedIn = false;
            state.user = null;
        },
        setCache: (state,action) => {
        state.cache={...state.cache,...action.payload}

        },
        setCache2: (state,action) => {
        state.cache2={...state.cache2,...action.payload}

        }
    }
});

export const { setSuccess, setFailure,setCache,setCache2 } = userSlice.actions;
export default userSlice.reducer;
