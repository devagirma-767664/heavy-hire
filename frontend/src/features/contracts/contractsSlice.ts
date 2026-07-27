import { createSlice } from '@reduxjs/toolkit';
import { 
  createContract,
  fetchContracts, 
  fetchContractById, 
  approveContract, 
  deleteContract,
  rejectContract,
  returnContract,
  assignOperator,
  fetchPendingContracts,
  fetchActiveContracts,
  fetchReturnedContracts,   // ✅ include returned contracts
  updateContract,
  completeContract, 
  acceptAssignment,
  requestChange  
} from './contractsThunks';

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
}

interface ContractsState {
  list: Contract[];
  pending: Contract[];
  active: Contract[];
  returned: Contract[];     // ✅ new slice field
  selected: Contract | null;
  loading: boolean;
  error: string | null;
  successMessage: string | null;
}

const initialState: ContractsState = {
  list: [],
  pending: [],
  active: [],
  returned: [],             // ✅ initialize
  selected: null,
  loading: false,
  error: null,
  successMessage: null,
};

const contractsSlice = createSlice({
  name: 'contracts',
  initialState,
  reducers: {
    clearMessage: (state) => {
      state.successMessage = null;
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // Create contract
      .addCase(createContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(createContract.fulfilled, (state, action) => {
        state.loading = false;
        const newContract = action.payload;
        state.list.push(newContract);
        if (newContract.status === 'pending') {
          state.pending.push(newContract);
        }
        state.successMessage = 'Contract created successfully!';
      })
      .addCase(createContract.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch all
      .addCase(fetchContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchContracts.fulfilled, (state, action) => {
        state.loading = false;
        state.list = action.payload;
      })
      .addCase(fetchContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch pending
      .addCase(fetchPendingContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchPendingContracts.fulfilled, (state, action) => {
        state.loading = false;
        state.pending = action.payload;
      })
      .addCase(fetchPendingContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Fetch active
      .addCase(fetchActiveContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchActiveContracts.fulfilled, (state, action) => {
        state.loading = false;
        state.active = action.payload;
      })
      .addCase(fetchActiveContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // ✅ Fetch returned
      .addCase(fetchReturnedContracts.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchReturnedContracts.fulfilled, (state, action) => {
        state.loading = false;
        state.returned = action.payload;
      })
      .addCase(fetchReturnedContracts.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Fetch single
      .addCase(fetchContractById.fulfilled, (state, action) => {
        state.selected = action.payload;
      })

      // Approve
      .addCase(approveContract.fulfilled, (state, action) => {
        const approved = action.payload;
        state.pending = state.pending.filter(c => c.id !== approved.id);
        const idx = state.list.findIndex(c => c.id === approved.id);
        if (idx !== -1) {
          state.list[idx] = approved;
        } else {
          state.list.push(approved);
        }
      })

      // Reject
      .addCase(rejectContract.fulfilled, (state, action) => {
        state.list = state.list.map(c => c.id === action.payload.id ? action.payload : c);
        state.pending = state.pending.filter(c => c.id !== action.payload.id);
      })

      // Return
      .addCase(returnContract.fulfilled, (state, action) => {
        state.list = state.list.map(c => c.id === action.payload.id ? action.payload : c);
        state.pending = state.pending.filter(c => c.id !== action.payload.id);
      })

      // Assign operator
      .addCase(assignOperator.fulfilled, (state, action) => {
        const updated = action.payload;
        state.list = state.list.map(c => c.id === action.payload.id ? action.payload : c);
        state.successMessage = `New assignment received: Contract #${action.payload.id}`;

        const exists = state.active.find(c => c.id === updated.id);
        if (!exists) {
          state.active.push(updated);
        } else {
          state.active = state.active.map(c => c.id === updated.id ? updated : c);
        }
      })

      // Delete
      .addCase(deleteContract.fulfilled, (state, action) => {
        state.list = state.list.filter(c => c.id !== action.payload.id);
        state.pending = state.pending.filter(c => c.id !== action.payload.id);
      })

      // Complete
      .addCase(completeContract.fulfilled, (state, action) => {
        const updated = action.payload;
        state.list = state.list.map(c => c.id === updated.id ? updated : c);
        state.pending = state.pending.filter(c => c.id !== updated.id);
        if (state.selected?.id === updated.id){
          state.selected = updated;
        }
      })

      // Update contract
      .addCase(updateContract.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(updateContract.fulfilled, (state, action) => {
        state.loading = false;
        const contract = action.payload;
        state.list = state.list.map(c => c.id === contract.id ? contract : c);
        if (contract.status === 'pending') {
          const exists = state.pending.find(c => c.id === contract.id);
          if (!exists) {
            state.pending.push(contract);
          } else {
            state.pending = state.pending.map(c => c.id === contract.id ? contract : c);
          }
        }
        state.successMessage = 'Contract updated successfully!';
      })
      .addCase(updateContract.rejected, (state, action) => {
        state.loading = false;
        state.error = action.payload as string;
      })

      // Accept Assignment
      .addCase(acceptAssignment.fulfilled, (state, action) => {
        const updated = action.payload;
        state.list = state.list.map(c => c.id === updated.id ? updated : c);
        if (state.selected?.id === updated.id) {
          state.selected = updated;
        }
        state.successMessage = `Assignment accepted: Contract #${updated.id}`;
      })
      .addCase(acceptAssignment.rejected, (state, action) => {
        state.error = action.payload as string;
      })

      // Request Change
      .addCase(requestChange.fulfilled, (state, action) => {
        const updated = action.payload;
        state.list = state.list.map(c => c.id === updated.id ? updated : c);
        if (state.selected?.id === updated.id) {
          state.selected = updated;
        }
        state.successMessage = `Change request sent for Contract #${updated.id}`;
      })
      .addCase(requestChange.rejected, (state, action) => {
        state.error = action.payload as string;
      });
  },
});

export const { clearMessage } = contractsSlice.actions;
export default contractsSlice.reducer;
