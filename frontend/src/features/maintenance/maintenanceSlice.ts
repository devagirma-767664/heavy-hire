// src/features/maintenance/maintenanceSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchMaintenanceRequests, 
  fetchMaintenanceById, 
  createMaintenance, 
  updateMaintenanceStatus,
  fetchMyMaintenanceRequests,
  removeMaintenanceRequestForRole   // ✅ new thunk
} from './maintenanceThunks';

import type { MaintenanceRequest } from './maintenanceThunks';

interface MaintenanceState {
  list: MaintenanceRequest[];
  selected: MaintenanceRequest | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;   // ✅ new field
}

const initialState: MaintenanceState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
  successMessage: null,
};

const maintenanceSlice = createSlice({
  name: 'maintenance',
  initialState,
  reducers: {
    clearSuccessMessage: (state) => {
      state.successMessage = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Supervisor/Mechanic: fetch all
      .addCase(fetchMaintenanceRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchMaintenanceRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMaintenanceRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Operator: fetch own
      .addCase(fetchMyMaintenanceRequests.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchMyMaintenanceRequests.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMyMaintenanceRequests.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch single
      .addCase(fetchMaintenanceById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })

      // Create
      .addCase(createMaintenance.pending, (state) => {
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createMaintenance.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.successMessage = "Maintenance request created successfully";
      })
      .addCase(createMaintenance.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Update status
      .addCase(updateMaintenanceStatus.pending, (state) => {
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateMaintenanceStatus.fulfilled, (state, action) => {
        state.list = state.list.map(r => r.id === action.payload.id ? action.payload : r);
        state.successMessage = "Maintenance status updated";
      })
      .addCase(updateMaintenanceStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Remove request from role’s page
      .addCase(removeMaintenanceRequestForRole.pending, (state) => {
        state.error = null;
        state.successMessage = null;
      })
      .addCase(removeMaintenanceRequestForRole.fulfilled, (state, action) => {
        state.list = state.list.filter(r => r.id !== action.payload.id);
        state.successMessage = "Maintenance request removed from your page";
      })
      .addCase(removeMaintenanceRequestForRole.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearSuccessMessage, clearError } = maintenanceSlice.actions;
export default maintenanceSlice.reducer;
