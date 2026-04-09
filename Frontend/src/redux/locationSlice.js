import {createSlice} from "@reduxjs/toolkit";

const locationSlice = createSlice({
    name : 'locationState',
    initialState : {
        location : {address:{city : "West Bengal",state:"West Bengal"}},
        isLoading : 0,
        error : null,
    },
    reducers : {
        setLocation : (state,action) =>{
            state.location = action.payload;
            state.error = null;
        },
        setLoading : (state, action) => {
            state.isLoading = action.payload;
        },
        setError : (state, action) => {
            state.error = action.payload;
            state.isLoading = 0;
        },
    }
})
export const {setLocation,setLoading,setError} =locationSlice.actions;
export default locationSlice.reducer;