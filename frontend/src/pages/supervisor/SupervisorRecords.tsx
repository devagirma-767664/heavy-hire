// src/pages/supervisor/SupervisorRecordsPage.tsx
import React, { useEffect, useState } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useTaskForm";
import GlobalLayout from "../../Layouts/GlobalLayout";
import { fetchContracts } from "../../features/contracts/contractsThunks";
import type { RootState } from "../../app/store";

const SupervisorRecordsPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector(
    (state: RootState) => state.contracts
  );

  const [searchTerm, setSearchTerm] = useState("");

  useEffect(() => {
    dispatch(fetchContracts() as any);
  }, [dispatch]);

  // ✅ Only completed contracts
  const completedContracts = list.filter(
    (c) => c.status?.toLowerCase() === "completed"
  );

  // ✅ Search by client name
  const filteredContracts = completedContracts.filter((c) =>
    c.client_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  // ✅ Helper to format duration
  const formatDuration = (contract: any) => {
    if (contract.duration_unit === "day") {
      return `${contract.duration_days || 0} days`;
    }
    if (contract.duration_unit === "month") {
      return `${contract.duration_months || 0} months`;
    }
    if (contract.duration_unit === "hour") {
      return `${contract.duration_hours || 0} hours`;
    }
    return "N/A";
  };

  return (
    <GlobalLayout>
      <div className="p-10 max-w-5xl mx-auto">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">
          Completed Contracts Records
        </h2>

        {/* Search bar */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search by client name..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full px-4 py-2 rounded bg-gray-800 text-gray-200 border border-gray-600 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />
        </div>

        {loading && <p className="text-gray-400 mb-4">Loading contracts...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="space-y-6">
          {filteredContracts.length === 0 && !loading && (
            <p className="text-gray-400">No completed contracts found.</p>
          )}

          {filteredContracts.map((contract) => (
            <details
              key={contract.id}
              className="bg-gray-700 rounded-lg shadow-md overflow-hidden"
            >
              <summary className="flex justify-between items-center cursor-pointer px-4 py-3 bg-gray-700 hover:bg-gray-600">
                <span className="text-lg font-semibold text-yellow-300">
                  {contract.client_name || `Client #${contract.client_id}`}
                </span>
                <span className="text-sm text-gray-400">
                  Project: {contract.project_description}
                </span>
              </summary>

              <div className="px-6 py-4 text-sm text-gray-200 space-y-2 border-t border-gray-600">
                <p>
                  <strong>Contract ID:</strong> {contract.id}
                </p>
                <p>
                  <strong>Machine:</strong>{" "}
                  {contract.machine_make} {contract.machine_model} {contract.machine_type}
                </p>
                <p>
                  <strong>Operator:</strong> {contract.operator_name || "N/A"}
                </p>
                <p>
                  <strong>Location:</strong> {contract.project_location}
                </p>
                <p>
                  <strong>Start Date:</strong>{" "}
                  {contract.start_date
                    ? new Date(contract.start_date).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Completion Date:</strong>{" "}
                  {contract.end_date
                    ? new Date(contract.end_date).toLocaleDateString()
                    : "N/A"}
                </p>
                <p>
                  <strong>Duration:</strong> {formatDuration(contract)}
                </p>
                <p>
                  <strong>Status:</strong> {contract.status}
                </p>
              </div>
            </details>
          ))}
        </div>
      </div>
    </GlobalLayout>
  );
};

export default SupervisorRecordsPage;
