// src/pages/mechanic/MechanicMaintenancePage.tsx
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useTaskForm";
import GlobalLayout from "../../Layouts/GlobalLayout";
import {
  fetchMaintenanceRequests,
  updateMaintenanceStatus,
  removeMaintenanceRequestForRole,
} from "../../features/maintenance/maintenanceThunks";
import type { RootState } from "../../app/store";
import { FaTrashAlt } from "react-icons/fa";

const MechanicMaintenancePage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, loading, error, successMessage } = useAppSelector(
    (state: RootState) => state.maintenance
  );

  useEffect(() => {
    dispatch(fetchMaintenanceRequests() as any);
  }, [dispatch]);

  const handleComplete = (id: number) => {
    dispatch(updateMaintenanceStatus({ id, status: "completed" }) as any);
  };

  const handleRemove = (id: number) => {
    dispatch(removeMaintenanceRequestForRole({ id, role: "mechanic" }) as any);
  };

  return (
    <GlobalLayout>
      <div className="p-10 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">
          Maintenance Requests
        </h2>

        {loading && <p className="text-gray-400 mb-4">Loading requests...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && (
          <p className="text-green-500 mb-4">{successMessage}</p>
        )}

        <div className="space-y-6">
          {list.length === 0 && !loading && (
            <p className="text-gray-400">No maintenance requests found.</p>
          )}

          {list.map((req) => (
            <details
              key={req.id}
              open
              className="bg-gray-700 rounded-lg shadow-md overflow-hidden"
            >
              {/* Header */}
              <summary className="flex justify-between items-center cursor-pointer px-4 py-3 bg-gray-800 hover:bg-gray-600">
                <span className="text-lg font-semibold text-yellow-300">
                  {req.machine_name || `Machine #${req.machine_id}`}
                </span>
                <span className="text-sm text-gray-400">
                  Status: {req.status}
                </span>
              </summary>

              {/* Expanded details */}
              <div className="px-6 py-4 text-sm text-gray-200 space-y-2 border-t border-gray-600">
                <p>
                  <strong>Machine ID:</strong> {req.machine_id}
                </p>
                <p>
                  <strong>Operator:</strong> {req.operator_name || "N/A"}
                </p>
                <p>
                  <strong>Supervisor:</strong> {req.supervisor_name || "N/A"}
                </p>
                <p>
                  <strong>Mechanic:</strong> {req.mechanic_name || "Unassigned"}
                </p>
                <p>
                  <strong>Notes:</strong> {req.notes || "None"}
                </p>
                <p>
                  <strong>Created:</strong>{" "}
                  {new Date(req.created_at).toLocaleString()}
                </p>
                {req.updated_at && (
                  <p>
                    <strong>Last Updated:</strong>{" "}
                    {new Date(req.updated_at).toLocaleString()}
                  </p>
                )}

                {/* Mechanic actions */}
                <div className="mt-4 flex gap-3">
                  {/* Mark Completed button */}
                  <button
                    onClick={() => handleComplete(req.id)}
                    disabled={req.status?.toLowerCase() !== "approved"}
                    className={`px-4 py-2 rounded font-semibold transition ${
                      req.status?.toLowerCase() === "approved"
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-500 text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Mark Completed
                  </button>

                  {/* Remove button for completed or rejected */}
                  {["completed", "rejected"].includes(
                    req.status?.toLowerCase()
                  ) && (
                    <button
                      onClick={() => handleRemove(req.id)}
                      className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-800 px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-800 text-white font-semibold shadow-md transition-all"
                    >
                      <FaTrashAlt /> Remove from My Page
                    </button>
                  )}
                </div>
              </div>
            </details>
          ))}
        </div>
      </div>
    </GlobalLayout>
  );
};

export default MechanicMaintenancePage;
