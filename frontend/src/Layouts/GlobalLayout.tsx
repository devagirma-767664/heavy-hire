import React from 'react';
import { useSelector } from 'react-redux';
import type { RootState } from '../app/store';
import StaffSidebar from '../pages/staff/StaffSidebar';
import SupervisorSidebar from '../pages/supervisor/SupervisorSidebar';
import OperatorSidebar from '../pages/operator/OperatorSidebar';
import MechanicSidebar from '../pages/mechanic/MechanicSidebar';
import Navbar from '../Layouts/Navbar';

const GlobalLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const user = useSelector((state: RootState) => state.auth.user);

  return (
    <div className="flex h-screen bg-gray-800 text-gray-200">
      {/* Sidebar changes based on role */}
      {user?.role === 'staff' && <StaffSidebar />}
      {user?.role === 'supervisor' && <SupervisorSidebar />}
      {user?.role === 'operator' && <OperatorSidebar />}
      {user?.role === 'mechanic' && <MechanicSidebar />}

      {/* Main content area */}
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="flex-1 p-6 overflow-y-auto">{children}</main>
      </div>
    </div>
  );
};

export default GlobalLayout;
