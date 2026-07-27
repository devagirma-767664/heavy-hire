// src/features/machines/machinesSlice.ts
import { createSlice } from '@reduxjs/toolkit';
import { 
  fetchMachines, 
  fetchMachineById, 
  updateMachineStatus, 
  deleteMachine, 
  createMachine, 
  editMachine 
} from '../machines/machinesThunks';   // ✅ matches your thunks file

// Machine type from backend
interface Machine {
  id: number;
  make: string;
  model: string;
  serial_number: string;
  type: string;
  year: number;
  rental_price: number;
  status: string;
  notes?: string;
  image_url?: string;
  created_at?: string;
}

interface MachinesState {
  list: Machine[];
  selected: Machine | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: MachinesState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
  successMessage: null,
};

const machinesSlice = createSlice({
  name: 'machines',
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
      // Fetch all
      .addCase(fetchMachines.pending, (state) => {
        state.loading = true;
        state.error = null;
        state.successMessage = null;
      })
      .addCase(fetchMachines.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchMachines.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      // Fetch single
      .addCase(fetchMachineById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      // Create machine
      .addCase(createMachine.pending, (state) => {
        state.error = null;
        state.successMessage = null;
      })
      .addCase(createMachine.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.error = null;
        state.successMessage = "Machine created successfully";
      })
      .addCase(createMachine.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Edit machine
      .addCase(editMachine.pending, (state) => {
        state.error = null;
        state.successMessage = null;
      })
      .addCase(editMachine.fulfilled, (state, action) => {
        state.list = state.list.map(m => m.id === action.payload.id ? action.payload : m);
        if (state.selected?.id === action.payload.id) {
          state.selected = action.payload;
        }
        state.error = null;
        state.successMessage = "Machine updated successfully";
      })
      .addCase(editMachine.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Update status
      .addCase(updateMachineStatus.pending, (state) => {
        state.error = null;
        state.successMessage = null;
      })
      .addCase(updateMachineStatus.fulfilled, (state, action) => {
        state.list = state.list.map(m => m.id === action.payload.id ? action.payload : m);
        state.successMessage = "Machine status updated";
      })
      .addCase(updateMachineStatus.rejected, (state, action) => {
        state.error = action.payload as string;
      })
      // Delete
      .addCase(deleteMachine.pending, (state) => {
        state.error = null;
        state.successMessage = null;
      })
      .addCase(deleteMachine.fulfilled, (state, action) => {
        state.list = state.list.filter(m => m.id !== action.payload.id);
        state.successMessage = "Machine deleted successfully";
      })
      .addCase(deleteMachine.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearSuccessMessage, clearError } = machinesSlice.actions;
export default machinesSlice.reducer;
