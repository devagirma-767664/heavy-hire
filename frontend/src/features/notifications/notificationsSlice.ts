// src/features/notifications/notificationsSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { fetchNotifications, markNotificationRead, deleteNotification, sendNotification } from './notificationsThunks';

interface Notification {
  id: number;
  user_id: number;
  message: string;
  type: string;        // ✅ added type
  created_at: string;
  read: boolean;
}

interface NotificationsState {
  list: Notification[];
  loading: boolean;
  error: string | null;
}

const initialState: NotificationsState = {
  list: [],
  loading: false,
  error: null,
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      // Fetch
      .addCase(fetchNotifications.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchNotifications.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchNotifications.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Mark read
      .addCase(markNotificationRead.fulfilled, (state, action) => {
        state.list = state.list.map(n => n.id === action.payload.id ? action.payload : n);
      })
      // Delete
      .addCase(deleteNotification.fulfilled, (state, action) => {
        state.list = state.list.filter(n => n.id !== action.payload.id);
      })
      // Send
      .addCase(sendNotification.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      });
  },
});

export default notificationsSlice.reducer;
