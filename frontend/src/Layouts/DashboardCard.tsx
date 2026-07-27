import React from 'react';

const DashboardCards: React.FC = () => {
  return (
    <section className="p-15 py-10">
      <div className="grid grid-cols-3 gap-16">
        {/* Pending Users */}
        <div className="bg-gray-700 rounded-lg shadow-md p-6 hover:shadow-2xl transition cursor-pointer hover:bg-gray-600">
          <h3 className="text-yellow-400 text-lg font-semibold mb-2">Pending Users</h3>
          <p className="text-gray-300">Users awaiting supervisor approval.</p>
          <div className="mt-4 text-3xl font-bold text-yellow-400">12</div>
        </div>

        {/* Active Contracts */}
        <div className="bg-gray-700 rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer hover:bg-gray-600">
          <h3 className="text-yellow-400 text-lg font-semibold mb-2">Active Contracts</h3>
          <p className="text-gray-300">Contracts currently in progress.</p>
          <div className="mt-4 text-3xl font-bold text-yellow-400">8</div>
        </div>

        {/* Follow-up Tasks */}
        <div className="bg-gray-700 rounded-lg shadow-md p-6 hover:shadow-lg transition cursor-pointer hover:bg-gray-600">
          <h3 className="text-yellow-400 text-lg font-semibold mb-2">Follow-up Tasks</h3>
          <p className="text-gray-300">Tasks requiring supervisor action.</p>
          <div className="mt-4 text-3xl font-bold text-yellow-400">5</div>
        </div>
      </div>
    </section>
  );
};

export default DashboardCards;
