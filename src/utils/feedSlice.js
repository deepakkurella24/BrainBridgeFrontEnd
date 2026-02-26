import { createSlice } from "@reduxjs/toolkit";

const feedSlice = createSlice({
    name: "feed",
    initialState: {
        feed:[],
        hasMore:true,
        loading:true

    },
    reducers: {
        setFeed: (state, action) => {
            const map = new Map();

            [...state.feed, ...action.payload].forEach((user) => {
                map.set(user._id, user);
            });

            state.feed = Array.from(map.values());
        },
        setHasMore:(state,action)=>{
            state.hasMore=action.payload;
        },
        setShowReqButton:(state,action)=>{
            const {id,bool}=action.payload;
            const newFeed=state.feed.map((user)=>{
                if(user._id===id){
                    user.status=bool;
                }
                return user;
            })
            state.feed=newFeed;
        },
        setLoading:(state,action)=>{
            state.loading=action.payload
        }
    }
});

export const { setFeed,setHasMore,setShowReqButton,setLoading } = feedSlice.actions;
export default feedSlice.reducer;
