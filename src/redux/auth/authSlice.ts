import { createSlice } from "@reduxjs/toolkit";
import type { AuthState } from "./authTypes";
import { loginThunk, registerThunk, refreshSessionThunk, getProfileThunk } from "../../features/auth/authThunk";

const initialState: AuthState = {
  user: null,
  token: null,
  isLoading: false,
  error: null,
};

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    setCredentials(state, action) {
      state.user = action.payload.user;
      state.token = action.payload.token;
      state.error = null;
    },
    logout(state) {
      state.user = null;
      state.token = null;
      state.error = null;
      localStorage.removeItem("auth");
    },
    clearError(state) {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    const pending = (state: AuthState) => {
      state.isLoading = true;
      state.error = null;
    };
    const rejected = (state: AuthState, action: { payload: unknown }) => {
      state.isLoading = false;
      state.error = (action.payload as string | undefined) ?? "Something went wrong";
    };

    builder
      .addCase(loginThunk.pending, pending)
      .addCase(loginThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(loginThunk.rejected, rejected)
      .addCase(registerThunk.pending, pending)
      .addCase(registerThunk.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(registerThunk.rejected, rejected)
      .addCase(refreshSessionThunk.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(refreshSessionThunk.rejected, () => {
        // Don't clear credentials on refresh failure — they may still be valid.
        // The axios interceptor handles actual 401 errors.
      })
      .addCase(getProfileThunk.fulfilled, (state, action) => {
        state.user = action.payload;
      });
  },
});

export const { setCredentials, logout, clearError } = authSlice.actions;
export default authSlice.reducer;