import { createSlice } from '@reduxjs/toolkit';
import { fetchClients, createClient, updateClient, deleteClient } from './clientsThunks';

interface Client {
  id: number;
  name: string;
  email: string;
  phone: string;
  address: string;
  created_at: string;   // ISO timestamp from backend
  updated_at: string;   // ISO timestamp from backend
}

interface ClientsState {
  list: Client[];
  loading: boolean;
  error: string | null;
}

const initialState: ClientsState = {
  list: [],
  loading: false,
  error: null,
};

const clientsSlice = createSlice({
  name: 'clients',
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchClients.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchClients.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchClients.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })
      .addCase(createClient.fulfilled, (state, action) => {
        state.list.unshift(action.payload);
      })
      .addCase(updateClient.fulfilled, (state, action) => {
        state.list = state.list.map(c => c.id === action.payload.id ? action.payload : c);
      })
      .addCase(deleteClient.fulfilled, (state, action) => {
        state.list = state.list.filter(c => c.id !== action.payload.id);
      });
  },
});

export default clientsSlice.reducer;
