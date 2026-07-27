import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../app/store';
import { fetchActiveContracts } from '../../features/contracts/contractsThunks';
import GlobalLayout from '../../Layouts/GlobalLayout';

const StaffActiveContractsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { active, loading, error } = useSelector((state: RootState) => state.contracts);

  useEffect(() => {
    dispatch(fetchActiveContracts() as any);
  }, [dispatch]);

  return (
    <GlobalLayout>
      <div className="p-6 bg-gray-800 min-h-screen">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">Active Contracts</h2>

        {loading && <p className="text-gray-400">Loading contracts...</p>}
        {error && <p className="text-red-400">Error: {error}</p>}

        {active.length === 0 ? (
          <p className="text-gray-400">No active contracts found.</p>
        ) : (
          <table className="w-full bg-gray-700 rounded-lg shadow overflow-hidden">
            <thead className="bg-gray-600 text-yellow-400">
              <tr>
                <th className="px-4 py-2 text-left">Contract ID</th>
                <th className="px-4 py-2 text-left">Machine</th>
                <th className="px-4 py-2 text-left">Client</th>
                <th className="px-4 py-2 text-left">Project</th>
                <th className="px-4 py-2 text-left">Location</th>
                <th className="px-4 py-2 text-left">Cost</th>
                <th className="px-4 py-2 text-left">Duration Unit</th>
                <th className="px-4 py-2 text-left">Duration</th>
                <th className="px-4 py-2 text-left">Operator</th>
                <th className="px-4 py-2 text-left">Created At</th>
              </tr>
            </thead>
            <tbody>
              {active.map(contract => (
                <tr key={contract.id} className="border-b border-gray-600 hover:bg-gray-600">
                  <td className="px-4 py-2 text-gray-200">#{contract.id}</td>
                  <td className="px-4 py-2 text-gray-200">
                    {contract.make} {contract.model}
                  </td>
                  <td className="px-4 py-2 text-gray-200">{contract.client_name}</td>
                  <td className="px-4 py-2 text-gray-200">{contract.project_description}</td>
                  <td className="px-4 py-2 text-gray-200">{contract.project_location}</td>
                  <td className="px-4 py-2 text-gray-200">${contract.fixed_cost}</td>
                  <td className="px-4 py-2 text-gray-200">{contract.duration_unit}</td>
                  <td className="px-4 py-2 text-gray-200">
                    {contract.duration_unit === 'day' && contract.duration_days}
                    {contract.duration_unit === 'month' && contract.duration_months}
                    {contract.duration_unit === 'hour' && contract.duration_hours}
                  </td>
                  <td className="px-4 py-2 text-gray-200">{contract.operator_name || 'Not assigned'}</td>
                  <td className="px-4 py-2 text-gray-200">
                    {new Date(contract.created_at).toLocaleString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </GlobalLayout>
  );
};

export default StaffActiveContractsPage;
