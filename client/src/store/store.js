import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice.js"; // Import auth slice

const store = configureStore({
  reducer: {
    auth: authReducer, // Add auth reducer
  },
});

export default store;
