// src/features/clients/clientsThunks.ts
import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../api/axios';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
}

export const fetchClients = createAsyncThunk(
  'clients/fetchAll',
  async (_, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.get('/clients');
      return res.data.clients as Client[];
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to fetch clients');
    }
  }
);

export const createClient = createAsyncThunk(
  'clients/create',
  async (data: Omit<Client, 'id'>, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.post('/clients', data);
      return res.data.client as Client;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to create client');
    }
  }
);

export const updateClient = createAsyncThunk(
  'clients/update',
  async (client: Client, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.put(`/clients/${client.id}`, client);
      return res.data.client as Client;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to update client');
    }
  }
);

export const deleteClient = createAsyncThunk(
  'clients/delete',
  async (id: number, { rejectWithValue }) => {
    try {
      const res = await axiosInstance.delete(`/clients/${id}`);
      return res.data.client as Client;
    } catch (err: any) {
      return rejectWithValue(err.response?.data?.error || 'Failed to delete client');
    }
  }
);
