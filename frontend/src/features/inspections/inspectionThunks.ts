import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

// ✅ Extended Inspection interface to match backend joins
export interface Inspection {
  id: number;
  machine_id: number;
  mechanic_id: number;
  contract_id: number;
  supervisor_id: number | null;
  result: string;
  notes: string;
  inspection_date: string;

  // Enriched fields from joins
  machine_make?: string;
  machine_model?: string;
  serial_number?: string;
  machine_type?: string;
  mechanic_name?: string;
  supervisor_name?: string;
  project_description?: string;
  staff_id?: number;
}

// Fetch all inspections
// Fetch inspections for a specific mechanic
export const fetchInspections = createAsyncThunk(
  'inspections/fetchAll',
  async (mechanicId: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/inspections?mechanic_id=${mechanicId}`);
      return res.data.inspections as Inspection[];
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || 'Failed to fetch inspections'
      );
    }
  }
);


// Fetch single inspection
export const fetchInspectionById = createAsyncThunk(
  'inspections/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/inspections/${id}`);
      return res.data.inspection as Inspection;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || 'Failed to fetch inspection'
      );
    }
  }
);

// Create inspection (supports pending)
export const createInspection = createAsyncThunk(
  'inspections/create',
  async (
    data: {
      machine_id: number;
      mechanic_id: number;
      contract_id: number;
      supervisor_id?: number;
      result?: string;
      notes?: string;
    },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post('/inspections', {
        ...data,
        result: data.result || 'pending',
        notes: data.notes || '',
      });
      return res.data.inspection as Inspection;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || 'Failed to create inspection'
      );
    }
  }
);

// Delete inspection
export const deleteInspection = createAsyncThunk(
  'inspections/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/inspections/${id}`);
      return res.data.inspection as Inspection;
    } catch (err: any) {
      return rejectWithValue(
        err.response?.data?.error || 'Failed to delete inspection'
      );
    }
  }
);

// Supervisor books inspection (assigns mechanic after usage approval)
export const bookInspection = createAsyncThunk(
  'inspections/book',
  async (
    { usageId, mechanic_id, notes }: { usageId: number; mechanic_id: number; notes?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post(`/usage/${usageId}/book-inspection`, {
        mechanic_id,
        notes,
      });
      return res.data.inspection as Inspection;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to book inspection');
    }
  }
);

// Mechanic updates inspection (submits result + notes)
export const updateInspection = createAsyncThunk(
  'inspections/update',
  async (
    { id, result, notes }: { id: number; result: string; notes?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.put(`/inspections/${id}`, {
        result,
        notes,
      });
      return res.data.inspection as Inspection;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update inspection');
    }
  }
);
