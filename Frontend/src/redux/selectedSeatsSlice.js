import { createSlice } from "@reduxjs/toolkit";

const selectedSeatsSlice = createSlice({
    name : 'selectedSeats',
    initialState : [],
    reducers : {
        setSelectedSeats: (state,action)=>{
            return action.payload;
        }
    }
})

export const {setSelectedSeats} = selectedSeatsSlice.actions;
export default selectedSeatsSlice.reducer