import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchUsageLogs, 
  fetchOperatorUsageLogs,   
  startUsage, 
  activateUsage,            // ✅ new
  endUsage, 
  approveUsage,   
  rejectUsage,    
  deleteUsage,
  bookInspection 
} from './usageThunks';

export interface UsageLog {
  id: number;
  operator_id?: number;
  operator_name: string;
  machine_id?: number;
  machine_name: string;
  serial_number?: string;
  contract_id?: number;
  start_time: string;
  end_time?: string;
  start_gauge: number;
  end_gauge?: number;
  duration?: number;
  start_photo?: string;
  end_photo?: string;
  supervisor_reviewed: boolean;
  supervisor_id?: number;
  approved?: boolean;
}

interface UsageState {
  list: UsageLog[];
  operatorLogs: UsageLog[];
  selected: UsageLog | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
  inspection?: any; 
}

const initialState: UsageState = {
  list: [],
  operatorLogs: [],
  selected: null,
  loading: false,
  error: null,
  successMessage: null,
   inspection: null,
};

const usageSlice = createSlice({
  name: 'usage',
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.successMessage = null;
      state.error = null;
    },
    setSelectedLog: (state, action) => {
      state.selected = action.payload;
    }
  },
  extraReducers: (builder) => {
    builder
      // Fetch all logs
      .addCase(fetchUsageLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchUsageLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchUsageLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch operator logs
      .addCase(fetchOperatorUsageLogs.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchOperatorUsageLogs.fulfilled, (state, action) => {
        state.loading = false;
        state.operatorLogs = action.payload;
      })
      .addCase(fetchOperatorUsageLogs.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Start usage
      .addCase(startUsage.pending, (state) => {
        state.loading = true;
      })
      .addCase(startUsage.fulfilled, (state, action) => {
        state.loading = false;
        state.list.unshift(action.payload);
        state.operatorLogs.unshift(action.payload);
        state.successMessage = 'Usage started successfully!';
      })
      .addCase(startUsage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // ✅ Activate usage
      .addCase(activateUsage.fulfilled, (state, action) => {
        const updated = { ...action.payload, activated: true };
        state.list = state.list.map(u => u.id === updated.id ? updated : u);
        state.operatorLogs = state.operatorLogs.map(u => u.id === updated.id ? updated : u);
        state.successMessage = 'Usage activated successfully!';
      })
      .addCase(activateUsage.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // End usage
      .addCase(endUsage.pending, (state) => {
        state.loading = true;
      })
      .addCase(endUsage.fulfilled, (state, action) => {
        state.loading = false;
        state.list = state.list.map(u => u.id === action.payload.id ? action.payload : u);
        state.operatorLogs = state.operatorLogs.map(u => u.id === action.payload.id ? action.payload : u);
        state.successMessage = 'Usage ended successfully!';
      })
      .addCase(endUsage.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Approve usage
      .addCase(approveUsage.fulfilled, (state, action) => {
      // ✅ Remove the approved log from the list
      state.list = state.list.filter(log => log.id !== action.payload.id);

      // If you also keep operatorLogs, update them too
      state.operatorLogs = state.operatorLogs.filter(log => log.id !== action.payload.id);

      state.successMessage = 'Usage approved successfully!';
    })

      .addCase(approveUsage.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Reject usage
      .addCase(rejectUsage.fulfilled, (state, action) => {
        state.list = state.list.map(u => u.id === action.payload.id ? action.payload : u);
        state.operatorLogs = state.operatorLogs.map(u => u.id === action.payload.id ? action.payload : u);
        state.successMessage = 'Usage rejected. Operator must resubmit.';
      })
      .addCase(rejectUsage.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Delete usage
      .addCase(deleteUsage.fulfilled, (state, action) => {
        state.list = state.list.filter(u => u.id !== action.payload.id);
        state.operatorLogs = state.operatorLogs.filter(u => u.id !== action.payload.id);
        state.successMessage = 'Usage log deleted!';
      })
      .addCase(deleteUsage.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      .addCase(bookInspection.fulfilled, (state, action) => {
        state.inspection = action.payload;
        state.successMessage = 'Inspection booked successfully!';
      })
      .addCase(bookInspection.rejected, (state, action) => {
        state.error = action.payload
      });
      
  },
});

export const { clearMessage, setSelectedLog } = usageSlice.actions;
export default usageSlice.reducer;
