import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

// Define User type inline
interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  approve: boolean;
  status: string;
}

export const loginUser = createAsyncThunk(
  'auth/login',
  async (credentials: { email: string; password: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/users/login', credentials);
      return { 
        token: response.data.token, 
        user: response.data.user as User,
        expiresIn: response.data.expiresIn
      };

    } catch (err: any) {
      return rejectWithValue(err.response?.data?.message || 'Login failed');
    }
  }
);

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: { name: string; email: string; password: string; role: string }, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.post('/users/register', data);
      return response.data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Registration failed');
    }
  }
);
