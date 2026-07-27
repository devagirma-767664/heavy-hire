// src/features/machines/machinesThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

// Form type for creating/editing machines
export interface MachineForm {
  id?: number;
  make: string;
  model: string;
  serial_number: string;
  type: string;
  year: string | number;
  rental_price: string | number;
  status: string;
  notes?: string;
  imageFile?: File | null;
}

// Machine type returned from backend
export interface Machine {
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

// ✅ Create machine (Supervisor only)
export const createMachine = createAsyncThunk(
  'machines/create',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/machines', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.machine as Machine;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to create machine');
    }
  }
);

// ✅ Edit machine (Supervisor only)
export const editMachine = createAsyncThunk(
  'machines/edit',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const id = formData.get('id');
      const res = await axiosInstance.put(`/machines/${id}`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.machine as Machine;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to edit machine');
    }
  }
);

// ✅ Fetch all machines
export const fetchMachines = createAsyncThunk(
  'machines/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/machines');
      return res.data.machines as Machine[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch machines');
    }
  }
);

// ✅ Fetch single machine
export const fetchMachineById = createAsyncThunk(
  'machines/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/machines/${id}`);
      return res.data.machine as Machine;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch machine');
    }
  }
);

// ✅ Update machine status
export const updateMachineStatus = createAsyncThunk(
  'machines/updateStatus',
  async ({ id, status }: { id: number; status: string }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/machines/${id}/status`, { status });
      return res.data.machine as Machine;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update machine status');
    }
  }
);

// ✅ Delete machine
export const deleteMachine = createAsyncThunk(
  'machines/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/machines/${id}`);
      return res.data.machine as Machine;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete machine');
    }
  }
);



export const fetchAvailableMechanics = createAsyncThunk(
  'maintenance/fetchAvailableMechanics',
  async (_, { rejectWithValue }) => {
    try {
      const response = await axiosInstance.get('/users/mechanics/available');
      return response.data.mechanics;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch mechanics');
    }
  }
);

