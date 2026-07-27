import { createSlice } from '@reduxjs/toolkit';
import {
  fetchInspections,
  fetchInspectionById,
  createInspection,
  deleteInspection,
  bookInspection,
  updateInspection
} from './inspectionThunks';

// Define state interface
interface InspectionState {
  list: any[];
  selected: any | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

// Initial state
const initialState: InspectionState = {
  list: [],
  selected: null,
  loading: false,
  error: null,
  successMessage: null,
};

// ✅ Create the slice
const inspectionSlice = createSlice({
  name: 'inspections',
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.successMessage = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchInspections.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchInspections.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchInspections.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchInspectionById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })
      .addCase(createInspection.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.successMessage = 'Inspection created successfully!';
      })
      .addCase(deleteInspection.fulfilled, (state, action) => {
        state.list = state.list.filter((i) => i.id !== action.payload.id);
        state.successMessage = 'Inspection deleted!';
      })
      .addCase(bookInspection.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
        state.successMessage = 'Inspection booked successfully!';
      })
      .addCase(updateInspection.fulfilled, (state, action) => {
        state.list = state.list.map((i) => i.id === action.payload.id ? action.payload : i);
        state.successMessage = 'Inspection updated successfully!';
      });
  },
});

// ✅ Export actions and reducer
export const { clearMessage } = inspectionSlice.actions;
export default inspectionSlice.reducer;
