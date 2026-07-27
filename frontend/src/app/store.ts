// src/app/store.ts
import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../features/auth/authSlice';
import usersReducer from '../features/users/usersSlice';
import clientsReducer from '../features/clients/clientsSlice';
import contractsReducer from '../features/contracts/contractsSlice';
import machinesReducer from '../features/machines/machinesSlice';
import usageReducer from '../features/usage/usageSlice';
import maintenanceReducer from '../features/maintenance/maintenanceSlice';
import inspectionsReducer from '../features/inspections/inspectionSlice';
import notificationsReducer from '../features/notifications/notificationsSlice';

export const store = configureStore({
  reducer: {
    auth: authReducer,
    users: usersReducer,
    clients: clientsReducer,
    contracts: contractsReducer,
    machines: machinesReducer,
    usage: usageReducer,
    maintenance: maintenanceReducer,
    inspections: inspectionsReducer,
    notifications: notificationsReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: false, 
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

export default store;
