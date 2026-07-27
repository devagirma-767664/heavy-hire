// src/features/contracts/contractsThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

export interface Contract {
  id: number;
  machine_id: number;
  client_id: number;
  staff_id: number;
  supervisor_id: number;
  operator_id?: number;
  project_description: string;
  project_location: string;
  start_date?: string | null;
  end_date?: string | null;
  duration_days?: number | null;
  duration_months?: number | null;
  duration_hours?: number | null;
  duration_unit: 'day' | 'month' | 'hour';
  fixed_cost: number;
  status: string;
  comments?: string | null;
  created_at: string;
  updated_at: string;
  // ✅ Enriched fields
  make?: string;
  model?: string;
  serial_number?: string;
  machine_type?: string;
  year?: number;
  rental_price?: number;
  client_name?: string;
  client_email?: string;
  client_phone?: string;
  client_address?: string;
  operator_name?: string;
  usage_started?: boolean;
}

// ✅ Create contract
export const createContract = createAsyncThunk(
  'contracts/create',
  async (contractData: any, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/contracts', contractData);
      return res.data.contract as Contract;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to create contract');
    }
  }
);

// ✅ Fetch all contracts
export const fetchContracts = createAsyncThunk(
  'contracts/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/contracts');
      console.log('Contracts API response:', res.data);
      return res.data.contracts as Contract[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch contracts');
    }
  }
);

// ✅ Fetch pending contracts
export const fetchPendingContracts = createAsyncThunk(
  'contracts/fetchPending',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/contracts/pending');
      return res.data.contracts as Contract[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch pending contracts');
    }
  }
);

// ✅ Fetch active contracts
export const fetchActiveContracts = createAsyncThunk(
  'contracts/fetchActive',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/contracts/active');
      return res.data.contracts as Contract[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch active contracts');
    }
  }
);

// ✅ Fetch returned contracts
export const fetchReturnedContracts = createAsyncThunk(
  'contracts/fetchReturned',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/contracts/returned');
      return res.data.contracts as Contract[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch returned contracts');
    }
  }
);



// ✅ Fetch single contract
export const fetchContractById = createAsyncThunk(
  'contracts/fetchById',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get(`/contracts/${id}`);
      return res.data.contract as Contract;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch contract');
    }
  }
);

// ✅ Approve contract
export const approveContract = createAsyncThunk(
  'contracts/approve',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/contracts/${id}/approve`);
      return res.data.contract as Contract;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to approve contract');
    }
  }
);

// ✅ Reject contract
export const rejectContract = createAsyncThunk(
  'contracts/reject',
  async ({ id, comments }: { id: number; comments: string }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/contracts/${id}/reject`, { comments });
      return res.data.contract as Contract;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to reject contract');
    }
  }
);

// ✅ Return contract
export const returnContract = createAsyncThunk(
  'contracts/return',
  async ({ id, comments }: { id: number; comments: string }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/contracts/${id}/return`, { comments });
      return res.data.contract as Contract;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to return contract');
    }
  }
);

// ✅ Assign operator
export const assignOperator = createAsyncThunk(
  'contracts/assignOperator',
  async ({ id, operator_id }: { id: number; operator_id: number }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/contracts/${id}/assign-operator`, { operator_id });
      return res.data.contract as Contract;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to assign operator');
    }
  }
);

// ✅ Delete contract
export const deleteContract = createAsyncThunk(
  'contracts/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/contracts/${id}`);
      return res.data.contract as Contract;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete contract');
    }
  }
);

// ✅ Complete contract
export const completeContract = createAsyncThunk(
  'contracts/complete',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/contracts/${id}/complete`);
      return res.data.contract as Contract;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to complete contract');
    }
  }
);

// ✅ Update contract
export const updateContract = createAsyncThunk(
  'contracts/update',
  async (contractData: any, { rejectWithValue }) => {
    try {
      const payload = {
        project_description: contractData.project_description,
        project_location: contractData.project_location,
        fixed_cost: contractData.fixed_cost,
        start_date: contractData.start_date,
        end_date: contractData.end_date,
        comments: contractData.comments,
        duration_unit: contractData.duration_unit,
        duration_months: contractData.duration_months,
        duration_hours: contractData.duration_hours,
      };
      const res = await axiosInstance.put(`/contracts/${contractData.id}`, payload);
      return res.data.contract as Contract;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update contract');
    }
  }
);

// ✅ Fetch available operators
export const fetchAvailableOperators = createAsyncThunk(
  'users/fetchAvailableOperators',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/users?role=operator&status=available');
      return res.data.users || res.data || [];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch operators');
    }
  }
);

// ✅ Operator accepts assignment
export const acceptAssignment = createAsyncThunk(
  'contracts/acceptAssignment',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/contracts/${id}/accept-assignment`);
      return res.data.contract as Contract;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to accept assignment');
    }
  }
);

// ✅ Operator requests change
export const requestChange = createAsyncThunk(
  'contracts/requestChange',
  async ({ id, comments }: { id: number; comments: string }, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/contracts/${id}/request-change`, { comments });
      return res.data.contract as Contract;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to request change');
    }
  }
);
