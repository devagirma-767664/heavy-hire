// src/pages/mechanic/MechanicInspectionPage.tsx
import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useTaskForm";
import GlobalLayout from "../../Layouts/GlobalLayout";
import {
  fetchInspections,
  updateInspection,   // ✅ mechanics update assigned inspections
  deleteInspection,
} from "../../features/inspections/inspectionThunks";
import type { RootState } from "../../app/store";
import { FaTrashAlt } from "react-icons/fa";

const MechanicInspectionPage: React.FC = () => {
  const dispatch = useAppDispatch();
  const { list, loading, error } = useAppSelector(
    (state: RootState) => state.inspections
  );
  const {user} = useAppSelector((state: RootState) => state.auth)

  useEffect(() => {
  if (user?.id) {
    dispatch(fetchInspections(user.id) as any);
  }
}, [dispatch, user?.id]);


  const handleMarkClear = (id: number) => {
    dispatch(
      updateInspection({
        id,
        result: "clear",
        notes: "Inspection passed, machine available.",
      }) as any
    );
  };

  const handleMarkNeedsMaintenance = (id: number) => {
    dispatch(
      updateInspection({
        id,
        result: "needs_maintenance",
        notes: "Inspection failed, machine requires maintenance.",
      }) as any
    );
  };

  const handleRemove = (id: number) => {
    dispatch(deleteInspection(id) as any);
  };

  return (
    <GlobalLayout>
      <div className="p-10 max-w-4xl mx-auto">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">
          Inspection Requests
        </h2>

        {loading && <p className="text-gray-400 mb-4">Loading inspections...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}

        <div className="space-y-6">
          {list.length === 0 && !loading && (
            <p className="text-gray-400">No inspections found.</p>
          )}

          {list.map((insp) => (
            <details
              key={insp.id}
              open
              className="bg-gray-700 rounded-lg shadow-md overflow-hidden"
            >
              {/* Header */}
              <summary className="flex justify-between items-center cursor-pointer px-4 py-3 bg-gray-800 hover:bg-gray-600">
                <span className="text-lg font-semibold text-yellow-300">
                  {insp.machine_make
                    ? `${insp.machine_make} ${insp.machine_model}`
                    : `Machine #${insp.machine_id}`}
                </span>
                <span className="text-sm text-gray-400">
                  Result: {insp.result || "Pending"}
                </span>
              </summary>

              {/* Expanded details */}
              <div className="px-6 py-4 text-sm text-gray-200 space-y-2 border-t border-gray-600">
                <p><strong>Inspection ID:</strong> {insp.id}</p>
                <p><strong>Contract ID:</strong> {insp.contract_id}</p>
                <p><strong>Mechanic:</strong> {insp.mechanic_name || insp.mechanic_id}</p>
                <p><strong>Supervisor:</strong> {insp.supervisor_name || insp.supervisor_id || "N/A"}</p>
                <p><strong>Notes:</strong> {insp.notes || "None"}</p>
                <p><strong>Date:</strong> {new Date(insp.inspection_date).toLocaleString()}</p>

                {/* Mechanic actions */}
                <div className="mt-4 flex gap-3">
                  {/* Mark Clear */}
                  <button
                    onClick={() => handleMarkClear(insp.id)}
                    disabled={insp.result?.toLowerCase() !== "pending"}
                    className={`px-4 py-2 rounded font-semibold transition ${
                      insp.result?.toLowerCase() === "pending"
                        ? "bg-green-600 hover:bg-green-700 text-white"
                        : "bg-gray-500 text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Mark Clear
                  </button>

                  {/* Mark Needs Maintenance */}
                  <button
                    onClick={() => handleMarkNeedsMaintenance(insp.id)}
                    disabled={insp.result?.toLowerCase() !== "pending"}
                    className={`px-4 py-2 rounded font-semibold transition ${
                      insp.result?.toLowerCase() === "pending"
                        ? "bg-yellow-600 hover:bg-yellow-700 text-white"
                        : "bg-gray-500 text-gray-300 cursor-not-allowed"
                    }`}
                  >
                    Needs Maintenance
                  </button>

                  {/* Remove button for completed inspections */}
                  {["clear", "needs_maintenance"].includes(insp.result?.toLowerCase()) && (
                    <button
                      onClick={() => handleRemove(insp.id)}
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

export default MechanicInspectionPage;
