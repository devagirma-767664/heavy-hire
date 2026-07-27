// src/features/users/usersSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchPendingUsers, 
  approveUser, 
  fetchActiveUsers, 
  deleteUser,
  fetchAvailableOperators,
  toggleUserStatus  
} from './usersThunks';

interface User {
  id: number;
  name: string;
  email: string;
  role: string;
  approved: boolean;
  status?: string;
}

interface UsersState {
  pending: User[];
  active: User[];
  available: User[];
  loading: boolean;
  error: string | null;
  searchTerm: string;
  filterStatus: 'all' | 'available' | 'on duty';
  roleFilter: string;
}

const initialState: UsersState = {
  pending: [],
  active: [],
  available: [],
  loading: false,
  error: null,
  searchTerm: '',
  filterStatus: 'all',
  roleFilter: '',
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    setSearchTerm(state, action) {
      state.searchTerm = action.payload;
    },
    setFilterStatus(state, action) {
      state.filterStatus = action.payload;
    },
    setRoleFilter(state, action) {
      state.roleFilter = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Pending users
      .addCase(fetchPendingUsers.fulfilled, (state, action) => {
        state.pending = action.payload;
      })
      // Approve user
      .addCase(approveUser.fulfilled, (state, action) => {
        state.pending = state.pending.filter(u => u.id !== action.payload.id);
        state.active.push(action.payload);
      })
      // Active users
      .addCase(fetchActiveUsers.fulfilled, (state, action) => {
        state.active = action.payload;
      })
      // Delete user
      .addCase(deleteUser.fulfilled, (state, action) => {
        state.pending = state.pending.filter(u => u.id !== action.payload.id);
        state.active = state.active.filter(u => u.id !== action.payload.id);
        state.available = state.available.filter(u => u.id !== action.payload.id);
      })
      // Available operators
      .addCase(fetchAvailableOperators.fulfilled, (state, action) => {
        state.available = action.payload;
      })
      // Toggle user status
      .addCase(toggleUserStatus.fulfilled, (state, action) => {
        const updatedUser = action.payload.user || action.payload;

        // Update in active list
        state.active = state.active.map(u =>
          u.id === updatedUser.id ? { ...u, status: updatedUser.status } : u
        );

        // If operator, update available list
        if (updatedUser.role === "operator") {
          if (updatedUser.status === "available") {
            const exists = state.available.find(u => u.id === updatedUser.id);
            if (!exists) state.available.push(updatedUser);
          } else {
            state.available = state.available.filter(u => u.id !== updatedUser.id);
          }
        }
      })
      .addCase(toggleUserStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { setSearchTerm, setFilterStatus, setRoleFilter } = usersSlice.actions;
export default usersSlice.reducer;
