import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

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
  contract_duration?: number;  
  start_photo?: string;
  end_photo?: string;
  supervisor_reviewed: boolean;
  supervisor_id?: number;
  approved?: boolean; // track approve/reject
  activated?: boolean;
}

// Fetch all usage logs
export const fetchUsageLogs = createAsyncThunk(
  'usage/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/usage');
      // ✅ Explicit mapping to include supervisor_id
      return res.data.logs.map((log: any) => ({
        id: log.id,
        operator_id: log.operator_id,
        operator_name: log.operator_name,
        machine_id: log.machine_id,
        machine_name: log.machine_name,
        serial_number: log.serial_number,
        contract_id: log.contract_id,
        start_time: log.start_time,
        end_time: log.end_time,
        start_gauge: log.start_gauge,
        end_gauge: log.end_gauge,
        duration: log.duration,
        contract_duration: log.contract_duration,
        start_photo: log.start_photo,
        end_photo: log.end_photo,
        supervisor_reviewed: log.supervisor_reviewed,
        supervisor_id: log.supervisor_id,   // ✅ include supervisor_id
        approved: log.approved,
        activated: log.activated,
      })) as UsageLog[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch usage logs');
    }
  }
);

// Fetch usage logs for the current operator
export const fetchOperatorUsageLogs = createAsyncThunk(
  'usage/fetchOperator',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/usage/operator');
      // ✅ Explicit mapping to include supervisor_id
      return res.data.logs.map((log: any) => ({
        id: log.id,
        operator_id: log.operator_id,
        operator_name: log.operator_name,
        machine_id: log.machine_id,
        machine_name: log.machine_name,
        serial_number: log.serial_number,
        contract_id: log.contract_id,
        start_time: log.start_time,
        end_time: log.end_time,
        start_gauge: log.start_gauge,
        end_gauge: log.end_gauge,
        duration: log.duration,
        start_photo: log.start_photo,
        end_photo: log.end_photo,
        supervisor_reviewed: log.supervisor_reviewed,
        supervisor_id: log.supervisor_id,   // ✅ include supervisor_id
        approved: log.approved,
        activated: log.activated,
      })) as UsageLog[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch operator usage logs');
    }
  }
);


// Start usage
export const startUsage = createAsyncThunk(
  'usage/start',
  async (formData: FormData, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/usage/start', formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.usageLog as UsageLog;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to start usage');
    }
  }
);

// ✅ Activate usage (supervisor)
export const activateUsage = createAsyncThunk(
  'usage/activate',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/usage/${id}/activate`);
      return res.data.usageLog as UsageLog;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to activate usage');
    }
  }
);

// End usage
export const endUsage = createAsyncThunk(
  'usage/end',
  async ({ id, formData }: { id: number; formData: FormData }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/usage/${id}/end`, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      return res.data.usageLog as UsageLog;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to end usage');
    }
  }
);

// Approve usage
export const approveUsage = createAsyncThunk(
  'usage/approve',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/usage/${id}/approve`);
      return res.data.usageLog as UsageLog;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to approve usage');
    }
  }
);

// Reject usage
export const rejectUsage = createAsyncThunk(
  'usage/reject',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/usage/${id}/reject`);
      return res.data.usageLog as UsageLog;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to reject usage');
    }
  }
);

// Delete usage
export const deleteUsage = createAsyncThunk(
  'usage/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/usage/${id}`);
      return res.data.log as UsageLog;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete usage');
    }
  }
);

// Book inspection (supervisor assigns mechanic after approval)
export const bookInspection = createAsyncThunk(
  'usage/bookInspection',
  async (
    { id, mechanic_id, notes }: { id: number; mechanic_id: number; notes?: string },
    { rejectWithValue }
  ) => {
    try {
      const res = await axiosInstance.post(`/usage/${id}/book-inspection`, {
        mechanic_id,
        notes,
      });
      return res.data.inspection; // backend returns inspection object
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to book inspection');
    }
  }
);

