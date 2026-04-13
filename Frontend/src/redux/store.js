import {configureStore} from "@reduxjs/toolkit";
import locationReducer from "./locationSlice";
import userReducer from "./userSlice";
import signInModal from "./signInSlice";

const store = configureStore({
    reducer : {
        location : locationReducer,
        user : userReducer,
        isSignInModalOpen : signInModal,
    }
})

export default store;