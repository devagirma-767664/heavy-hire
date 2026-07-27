// src/pages/mechanic/MechanicDashboard.tsx
import React from 'react';
import GlobalLayout from '../../Layouts/GlobalLayout';
import MachinesSection from '../../Layouts/MachinesSection';

const MechanicDashboard: React.FC = () => {
  return (
    <GlobalLayout>
      {/* Machines section directly below Navbar */}
      <MachinesSection />

      {/* 🔧 Mechanic-specific sections will go here */}
      {/* Example: <MechanicMaintenanceSection /> */}
      {/* Example: <MechanicInspectionSection /> */}
    </GlobalLayout>
  );
};

export default MechanicDashboard;
