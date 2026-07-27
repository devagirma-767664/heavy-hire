// src/features/maintenance/maintenanceThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

// Maintenance Request type
export interface MaintenanceRequest {
  id: number;
  machine_id: number;
  machine_name?: string;
  operator_id: number;
  operator_name?: string;
  supervisor_id: number;
  supervisor_name?: string;
  mechanic_id?: number;
  mechanic_name?: string;
  status: string;
  notes?: string;
  created_at: string;
  updated_at?: string;
}

// ✅ Fetch all requests (Supervisor/Mechanic)
export const fetchMaintenanceRequests = createAsyncThunk(
  'maintenance/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/maintenance');
      return res.data.requests as MaintenanceRequest[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch maintenance requests');
    }
  }
);

// ✅ Fetch operator’s own requests
export const fetchMyMaintenanceRequests = createAsyncThunk(
  'maintenance/fetchMine',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/maintenance/my');
      return res.data.requests as MaintenanceRequest[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch your maintenance requests');
    }
  }
);

// ✅ Fetch single request
export const fetchMaintenanceById = createAsyncThunk(
  'maintenance/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/maintenance/${id}`);
      return res.data.request as MaintenanceRequest;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch maintenance request');
    }
  }
);

// ✅ Create request (Operator)
export const createMaintenance = createAsyncThunk(
  'maintenance/create',
  async (
    data: { machine_id: number; operator_id: number; supervisor_id: number; notes?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post('/maintenance', data);
      return res.data.request as MaintenanceRequest;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to create maintenance request');
    }
  }
);

// ✅ Update status (Supervisor approves/rejects, Mechanic completes)
export const updateMaintenanceStatus = createAsyncThunk(
  'maintenance/updateStatus',
  async (
    { id, status, mechanic_id }: { id: number; status: string; mechanic_id?: number },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.put(`/maintenance/${id}/status`, { status, mechanic_id });
      return res.data.request as MaintenanceRequest;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update maintenance status');
    }
  }
);

// ✅ Remove request from role’s page (soft delete visibility)
export const removeMaintenanceRequestForRole = createAsyncThunk(
  'maintenance/removeForRole',
  async (
    { id, role }: { id: number; role: 'operator' | 'supervisor' | 'mechanic' },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.put(`/maintenance/${id}/remove`, { role });
      return res.data.request as MaintenanceRequest;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to remove maintenance request');
    }
  }
);
