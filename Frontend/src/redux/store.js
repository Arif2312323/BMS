import {configureStore} from "@reduxjs/toolkit";
import locationReducer from "./locationSlice";
import userReducer from "./userSlice";
import signInModal from "./signInSlice";
import selectedSeats from "./selectedSeatsSlice"

const store = configureStore({
    reducer : {
        location : locationReducer,
        user : userReducer,
        isSignInModalOpen : signInModal,
        selectedSeats : selectedSeats,
    }
})

export default store;