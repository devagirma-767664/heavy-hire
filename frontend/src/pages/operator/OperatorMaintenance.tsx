// src/pages/operator/OperatorMaintenanceRequestPage.tsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { createMaintenance, fetchMyMaintenanceRequests, removeMaintenanceRequestForRole } from "../../features/maintenance/maintenanceThunks";
import { fetchOperatorUsageLogs } from "../../features/usage/usageThunks";
import GlobalLayout from "../../Layouts/GlobalLayout";
import { FaTrashAlt } from "react-icons/fa";

const OperatorMaintenanceRequestPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { operatorLogs } = useSelector((state: RootState) => state.usage);
  const { list, loading, error } = useSelector((state: RootState) => state.maintenance);

  const [selectedLog, setSelectedLog] = useState<number | null>(null);
  const [notes, setNotes] = useState("");
  const [urgency, setUrgency] = useState("medium");

  useEffect(() => {
    dispatch(fetchOperatorUsageLogs());
    dispatch(fetchMyMaintenanceRequests());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLog || !notes) return;

    const usageLog = operatorLogs.find(l => l.id === selectedLog);
    if (!usageLog) return;
    console.log("Usage log selected:", usageLog);

    dispatch(createMaintenance({
      machine_id: usageLog.machine_id,
      operator_id: usageLog.operator_id,
      supervisor_id: usageLog.supervisor_id,
      notes: `${notes} (Urgency: ${urgency})`
    }));

    setSelectedLog(null);
    setNotes("");
    setUrgency("medium");
  };

  const handleRemove = (id: number) => {
    dispatch(removeMaintenanceRequestForRole({ id, role: "operator" }) as any);
  };

  const renderStatus = (status: string) => {
    switch (status.toLowerCase()) {
      case "pending": return <span className="bg-yellow-700 text-yellow-300 px-2 py-1 rounded-full text-xs">Pending</span>;
      case "approved": return <span className="bg-green-700 text-green-300 px-2 py-1 rounded-full text-xs">Approved</span>;
      case "rejected": return <span className="bg-red-700 text-red-300 px-2 py-1 rounded-full text-xs">Rejected</span>;
      case "completed": return <span className="bg-blue-700 text-blue-300 px-2 py-1 rounded-full text-xs">Completed</span>;
      default: return <span className="text-gray-400">—</span>;
    }
  };

  // Separate active vs history
  const activeRequests = list.filter(req => ["pending","approved"].includes(req.status.toLowerCase()));
  const historyRequests = list.filter(req => ["rejected","completed"].includes(req.status.toLowerCase()));

  return (
    <GlobalLayout>
      <div className="p-10 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">Maintenance Request</h2>

        {loading && <p className="text-gray-400 mb-4">Processing...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        {/* Request form */}
        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-700 p-6 rounded-lg shadow-md mb-8">
          <div>
            <label className="block text-gray-200 mb-2">Active Usage Log</label>
            <select
              value={selectedLog ?? ""}
              onChange={(e) => setSelectedLog(Number(e.target.value))}
              className="bg-gray-900 text-white p-2 rounded w-full focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select usage log</option>
              {operatorLogs
                .filter(l => l.activated && (!l.end_time || l.approved === false))
                .map(l => (
                  <option key={l.id} value={l.id}>
                    Contract #{l.contract_id} • Machine {l.machine_id}
                  </option>
                ))}
            </select>
          </div>

          <div>
            <label className="block text-gray-200 mb-2">Problem Description</label>
            <textarea
              placeholder="Briefly describe the issue"
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              className="bg-gray-900 text-white p-2 rounded w-full focus:ring-2 focus:ring-yellow-400"
              rows={4}
            />
          </div>

          <div>
            <label className="block text-gray-200 mb-2">Urgency Level</label>
            <div className="flex gap-6 text-gray-200">
              {["low", "medium", "high"].map(level => (
                <label key={level} className="flex items-center gap-2">
                  <input
                    type="radio"
                    name="urgency"
                    value={level}
                    checked={urgency === level}
                    onChange={() => setUrgency(level)}
                  />
                  {level.charAt(0).toUpperCase() + level.slice(1)}
                </label>
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-white w-full font-semibold"
          >
            Submit Maintenance Request
          </button>
        </form>

        {/* Active Requests */}
        <h3 className="text-xl font-semibold text-yellow-400 mb-4">Active Requests</h3>
        <div className="space-y-4 mb-8">
          {activeRequests.map(req => (
            <div key={req.id} className="bg-gray-700 p-4 rounded-lg shadow-md">
              <p className="text-white font-semibold">{req.machine_name || `Machine #${req.machine_id}`}</p>
              <p className="text-gray-300">Notes: {req.notes}</p>
              <p className="text-gray-300">Supervisor: {req.supervisor_name || "N/A"}</p>
              <p className="text-gray-300">Created: {new Date(req.created_at).toLocaleString()}</p>
              <div className="mt-2">{renderStatus(req.status)}</div>
            </div>
          ))}
          {activeRequests.length === 0 && (
            <p className="text-gray-400">No active requests.</p>
          )}
        </div>

        {/* History Requests */}
        <h3 className="text-xl font-semibold text-yellow-400 mb-4">History</h3>
        <div className="space-y-4">
          {historyRequests.map(req => (
            <div key={req.id} className="bg-gray-700 p-4 rounded-lg shadow-md flex justify-between items-center">
              <div>
                <p className="text-white font-semibold">{req.machine_name || `Machine #${req.machine_id}`}</p>
                <p className="text-gray-300">Notes: {req.notes}</p>
                <p className="text-gray-300">Supervisor: {req.supervisor_name || "N/A"}</p>
                <p className="text-gray-300">Created: {new Date(req.created_at).toLocaleString()}</p>
                <div className="mt-2">{renderStatus(req.status)}</div>
              </div>
              <button
                onClick={() => handleRemove(req.id)}
                className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-800 px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-800 text-white font-semibold shadow-md transition-all"
              >
                <FaTrashAlt /> Remove
              </button>
            </div>
          ))}
          {historyRequests.length === 0 && (
            <p className="text-gray-400">No past requests yet.</p>
          )}
        </div>
      </div>
    </GlobalLayout>
  );
};

export default OperatorMaintenanceRequestPage;
