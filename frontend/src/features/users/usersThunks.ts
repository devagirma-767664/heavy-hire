// src/features/users/usersThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  approved: boolean;
}

// Fetch all pending users
export const fetchPendingUsers = createAsyncThunk(
  'users/fetchPending',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/users/pending');
      return res.data.pending as User[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch pending users');
    }
  }
);

// Approve a user
export const approveUser = createAsyncThunk(
  'users/approve',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/users/approve/${id}`);
      return res.data.user as User;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to approve user');
    }
  }
);

// Fetch all active users
export const fetchActiveUsers = createAsyncThunk(
  'users/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/users/active');
      return res.data.active as User[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch active users');
    }
  }
);

// Delete a user
export const deleteUser = createAsyncThunk(
  'users/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/users/delete/${id}`);
      return res.data.user; // ✅ return deleted user object
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete user');
    }
  }
);


// Fetch available operators
export const fetchAvailableOperators = createAsyncThunk(
  'users/fetchAvailableOperators',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/users/operators/available');
      return res.data.users as User[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch available operators');
    }
  }
);

export const toggleUserStatus = createAsyncThunk(
  'users/toggleStatus',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/users/${id}/toggle-status`);
      return res.data.user;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to toggle user status');
    }
  }
);


