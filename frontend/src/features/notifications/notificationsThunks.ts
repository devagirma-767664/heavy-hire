// src/features/notifications/notificationsThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

export interface Notification {
  id: number;
  user_id: number;
  message: string;
  type: string;        // ✅ new field
  created_at: string;
  read: boolean;
}

// Fetch notifications for current user
export const fetchNotifications = createAsyncThunk(
  'notifications/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/notifications');
      return res.data.notifications as Notification[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch notifications');
    }
  }
);

// Mark notification as read
export const markNotificationRead = createAsyncThunk(
  'notifications/markRead',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/notifications/${id}/read`);
      return res.data.notification as Notification;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to mark notification as read');
    }
  }
);

// Delete notification
export const deleteNotification = createAsyncThunk(
  'notifications/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/notifications/${id}`);
      return res.data.notification as Notification;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete notification');
    }
  }
);

// Send notification (admin/supervisor only)
export const sendNotification = createAsyncThunk(
  'notifications/send',
  async (data: { user_id: number; message: string; type?: string }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/notifications', data);
      return res.data.notification as Notification;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to send notification');
    }
  }
);
