import { Routes, Route } from 'react-router-dom';
import Login from './Components/Login';
import Register from './Components/Register';
import Welcome from './Components/Welcome';
import SupervisorDashboard from './pages/supervisor/SupervisorDashboard';
import StaffDashboard from './pages/staff/StaffDashboard';
import SupervisorContractsPage from './pages/supervisor/SupervisorContractsPage';
import UsersPage from './pages/supervisor/SupervisorUsersPage';
import SupervisorUsagePage from './pages/supervisor/SupervisorUsage';
import SupervisorMaintenancePage from './pages/supervisor/SupervisorMaintenance';
import SupervisorRecordsPage from './pages/supervisor/SupervisorRecords';


// ✅ Staff imports
import StaffCreateContractsPage from './pages/staff/StaffCreateContractsPage';  
import StaffActiveContractsPage from './pages/staff/StaffActiceContracts';   // ✅ active contracts
import StaffReturnedContractsPage from './pages/staff/StaffReturnedContracts'; // ✅ returned contracts
import StaffClientsPage from './pages/staff/StaffClientsPage';
import ProtectedRoute from './Components/ProtectedRoute';


// ✅ Operator imports
import OperatorDashboard from './pages/operator/OperatorDashboard';
import OperatorAssignmentsPage from './pages/operator/OperatorAssignments';
import OperatorStartUsagePage from './pages/operator/OperatorStartUsage';
import OperatorEndUsagePage from './pages/operator/OperatorEndUsage';
import OperatorMaintenanceRequestPage from './pages/operator/OperatorMaintenance';

// ✅ Mechanic imports
import MechanicDashboard from './pages/mechanic/MechanicDashboard';
import MechanicMaintenancePage from './pages/mechanic/MechanicMaintenance';
import MechanicInspectionPage from './pages/mechanic/MechanicInspection';

const AppRouter = () => {
  return (
    <Routes>
      {/* Root route */}
      <Route path="/" element={<Welcome />} />

      {/* Auth routes */}
      <Route path="/login" element={<Login />} />
      <Route path="/register" element={<Register />} />

      {/* Supervisor dashboard */}
      <Route
        path="/supervisor"
        element={
          <ProtectedRoute allowedRoles={['supervisor']}>
            <SupervisorDashboard />
          </ProtectedRoute>
        }
      />

      {/* Staff dashboard */}
      <Route
        path="/staff"
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffDashboard />
          </ProtectedRoute>
        }
      />

      {/* Supervisor contracts */}
      <Route
        path="/contracts"
        element={
          <ProtectedRoute allowedRoles={['supervisor']}>
            <SupervisorContractsPage />
          </ProtectedRoute>
        }
      />

      {/* ✅ Supervisor usage logs */}
      <Route
        path="/usage-logs"
        element={
          <ProtectedRoute allowedRoles={['supervisor']}>
            <SupervisorUsagePage />
          </ProtectedRoute>
        }
      />

      {/* ✅ Supervisor maintenace*/}
      <Route
        path="/maintenance"
        element={
          <ProtectedRoute allowedRoles={['supervisor']}>
            <SupervisorMaintenancePage />
          </ProtectedRoute>
        }
      />

       {/* ✅ Supervisor Records*/}
      <Route
        path="/records"
        element={
          <ProtectedRoute allowedRoles={['supervisor']}>
            <SupervisorRecordsPage />
          </ProtectedRoute>
        }
      />


      {/* Staff contracts */}
      <Route
        path="/staff/contracts/create"
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffCreateContractsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/contracts/active"
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffActiveContractsPage />
          </ProtectedRoute>
        }
      />
      <Route
        path="/staff/contracts/returned"
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffReturnedContractsPage />
          </ProtectedRoute>
        }
      />

      {/* Staff clients */}
      <Route
        path="/staff/clients"
        element={
          <ProtectedRoute allowedRoles={['staff']}>
            <StaffClientsPage />
          </ProtectedRoute>
        }
      />

      {/* Users management (supervisor only) */}
      <Route
        path="/users"
        element={
          <ProtectedRoute allowedRoles={['supervisor']}>
            <UsersPage />
          </ProtectedRoute>
        }
      />

      {/* ✅ Operator dashboard and assignments */}
      <Route
        path="/operator"
        element={
          <ProtectedRoute allowedRoles={['operator']}>
            <OperatorDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/operator/assignments"
        element={
          <ProtectedRoute allowedRoles={['operator']}>
            <OperatorAssignmentsPage />
          </ProtectedRoute>
        }
      />

      {/* ✅ Operator start usage log */}
      <Route
        path="/operator/start-log"
        element={
          <ProtectedRoute allowedRoles={['operator']}>
            <OperatorStartUsagePage />
          </ProtectedRoute>
        }
      />

      {/* ✅ Operator end usage log */}
      <Route
        path="/operator/end-log"
        element={
          <ProtectedRoute allowedRoles={['operator']}>
            <OperatorEndUsagePage />
          </ProtectedRoute>
        }
      />

      {/* ✅ Operator maintenance request */}
      <Route
        path="/operator/maintenance"
        element={
          <ProtectedRoute allowedRoles={['operator']}>
            <OperatorMaintenanceRequestPage />
          </ProtectedRoute>
        }
      />

      {/* ✅ Mechanic routes */}
      <Route
        path="/mechanic"
        element={
          <ProtectedRoute allowedRoles={['mechanic']}>
            <MechanicDashboard />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mechanic/maintenance"
        element={
          <ProtectedRoute allowedRoles={['mechanic']}>
            <MechanicMaintenancePage />
          </ProtectedRoute>
        }
      />

      <Route
        path="/mechanic/inspection"
        element={
          <ProtectedRoute allowedRoles={['mechanic']}>
            <MechanicInspectionPage />
          </ProtectedRoute>
        }
      />


    </Routes>
  );
};

export default AppRouter;
