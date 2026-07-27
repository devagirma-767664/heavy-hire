import React from 'react';
import GlobalLayout from '../../Layouts/GlobalLayout';
import MachinesSection from '../../Layouts/MachinesSection';

const StaffDashboard: React.FC = () => {
  return (
    <GlobalLayout>
      {/* Machines section directly below Navbar */}
      <MachinesSection />
    </GlobalLayout>
  );
};

export default StaffDashboard;
