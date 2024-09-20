import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";

// Async thunk for login
export const loginUser = createAsyncThunk(
  "auth/loginUser",
  async (userCredentials, thunkAPI) => {
    axios.defaults.withCredentials = true;
    const res = await axios.post(
      "http://localhost:3000/api/v1/users/login",
      userCredentials,
    );
    const response = await res.data.data;
    console.log("response -->", response);
    localStorage.setItem("user", JSON.stringify(response));
    return response;
  },
);

//Async thunk for update user details
export const updateUsername = createAsyncThunk(
  "auth/updateUsername",
  async (userCredentials, thunkAPI) => {
    axios.defaults.withCredentials = true;
    const res = await axios.post(
      "http://localhost:3000/api/v1/users/update-username",
      userCredentials,
    );
    const response = await res.data.data;
    console.log("response -->", response);
    localStorage.setItem("user", JSON.stringify(response));
    return response;
  },
);

//Async thunk for update user details
export const updateEmail = createAsyncThunk(
  "auth/updateEmail",
  async (userCredentials, thunkAPI) => {
    axios.defaults.withCredentials = true;
    const res = await axios.post(
      "http://localhost:3000/api/v1/users/update-email",
      userCredentials,
    );
    const response = await res.data.data;
    console.log("response -->", response);
    localStorage.setItem("user", JSON.stringify(response));
    return response;
  },
);

//Async thunk for update user details
export const changePassword = createAsyncThunk(
  "auth/changePassword",
  async (userCredentials, thunkAPI) => {
    axios.defaults.withCredentials = true;
    const res = await axios.post(
      "http://localhost:3000/api/v1/users/change-password",
      userCredentials,
    );
    return res.data;
  },
);

// Async thunk for logout
export const logoutUser = createAsyncThunk(
  "auth/logoutUser",
  async (_, thunkAPI) => {
    localStorage.removeItem("user"); // Clear token from localStorage
    axios.defaults.withCredentials = true;
    await axios.post("http://localhost:3000/api/v1/users/logout").then(() => {
      return true;
    });
    return false;
  },
);

function getUser(type) {
  let user = localStorage.getItem("user");
  if (user === "undefined" && type === "isAuthenticated") return false;
  if (user === "undefined") {
    return null;
  }
  if (user) {
    user = JSON.parse(user);
  } else {
    if (type === "isAuthenticated") return false;
    return null;
  }
  if (type === "id") return user.user._id;
  if (type === "user") return user.user.username;
  if (type === "email") return user.user.email;
  if (type === "accessToken") return user.accessToken;
  if (type === "refreshToken") return user.refreshToken;
  if (type === "isAuthenticated") return true;
}

// Auth slice
const authSlice = createSlice({
  name: "auth",
  initialState: {
    _id: getUser("id"),
    user: getUser("user"),
    email: getUser("email"),
    accessToken: getUser("accessToken"), // Load token from localStorage
    refreshToken: getUser("refreshToken"),
    isAuthenticated: getUser("isAuthenticated"),
    status: "idle", // loading status
    error: null,
  },
  extraReducers(builder) {
    builder
      .addCase(loginUser.pending, (state) => {
        state.status = "loading";
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.status = "succeeded";
        state._id = action.payload.user._id;
        state.user = action.payload.user.username; // Store user info
        state.email = action.payload.user.email;
        state.accessToken = action.payload.accessToken; // Store token
        state.refreshToken = action.payload.refreshToken;
        state.isAuthenticated = true;
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.status = "failed";
        state.isAuthenticated = false;
        console.log(action.error);
        if (action.error.message === "Request failed with status code 401") {
          state.error = "Access Denied! Invalid Credentials";
        } else {
          state.error = action.error.message;
        }
      })
      //update username
      .addCase(updateUsername.fulfilled, (state, action) => {
        console.log("update username action.payload -->", action);
        state.user = action.payload.user.username;
      })
      .addCase(updateEmail.fulfilled, (state, action) => {
        console.log("update username action.payload -->", action);
        state.email = action.payload.user.email;
      })
      .addCase(changePassword.fulfilled, (state, action) => {
        state.error = null;
      })
      .addCase(changePassword.rejected, (state, action) => {
        state.error = action.error.message;
      })
      // Logout user
      .addCase(logoutUser.fulfilled, (state) => {
        state._id = null;
        state.user = null;
        state.email = null;
        state.accessToken = null;
        state.accessToken = null;
        state.isAuthenticated = false;
      });
  },
});

export default authSlice.reducer;
