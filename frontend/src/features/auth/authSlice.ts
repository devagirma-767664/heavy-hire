// src/features/auth/authSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import type { PayloadAction } from '@reduxjs/toolkit';
import { loginUser, registerUser } from './authThunks';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
}

interface AuthState {
  token: string | null;
  user: User | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

// --- Helpers ---
const tokenFromStorage = localStorage.getItem('token');
const expiryFromStorage = localStorage.getItem('tokenExpiry');
const userFromStorage = localStorage.getItem('user');

const isValidToken = expiryFromStorage
  ? Date.now() < Number(expiryFromStorage)
  : false;

const restoredUser = (() => {
  if (tokenFromStorage && isValidToken && userFromStorage) {
    try {
      return JSON.parse(userFromStorage) as User;
    } catch {
      return null;
    }
  }
  return null;
})();

// Initial state
const initialState: AuthState = {
  token: isValidToken ? tokenFromStorage : null,
  user: restoredUser,
  loading: false,
  error: null,
  successMessage: null,
};

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    logout: (state) => {
      state.token = null;
      state.user = null;
      state.successMessage = null;
      localStorage.removeItem('token');
      localStorage.removeItem('tokenExpiry');
      localStorage.removeItem('user');
    },
    clearMessage: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // LOGIN
      .addCase(loginUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(
        loginUser.fulfilled,
        (state, action: PayloadAction<{ token: string; user: User; expiresIn: number }>) => {
          state.loading = false;
          state.token = action.payload.token;
          state.user = action.payload.user;
          state.successMessage = 'Login Successful';

          // Save token + expiry + user
          localStorage.setItem('token', action.payload.token);
          localStorage.setItem(
            'tokenExpiry',
            String(Date.now() + action.payload.expiresIn * 1000)
          );
          localStorage.setItem('user', JSON.stringify(action.payload.user));
        }
      )
      .addCase(loginUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // REGISTER
      .addCase(registerUser.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(registerUser.fulfilled, (state, action: PayloadAction<User>) => {
        state.loading = false;
        state.successMessage = 'Account created, awaiting supervisor approval.';
        state.user = action.payload;
      })
      .addCase(registerUser.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      });
  },
});

export const { logout, clearMessage } = authSlice.actions;
export default authSlice.reducer;
