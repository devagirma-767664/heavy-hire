// src/pages/supervisor/SupervisorMaintenancePage.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { 
  fetchMaintenanceRequests, 
  updateMaintenanceStatus, 
  removeMaintenanceRequestForRole 
} from "../../features/maintenance/maintenanceThunks";
import axiosInstance from "../../api/axios"; // ✅ to fetch mechanics
import GlobalLayout from "../../Layouts/GlobalLayout";
import { FaChevronDown, FaChevronUp, FaTrashAlt } from "react-icons/fa";

interface Mechanic {
  id: number;
  name: string;
}

const SupervisorMaintenancePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, error } = useSelector((state: RootState) => state.maintenance);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [mechanicId, setMechanicId] = useState<number | null>(null);
  const [mechanics, setMechanics] = useState<Mechanic[]>([]);

  useEffect(() => {
    dispatch(fetchMaintenanceRequests());

    // ✅ Fetch available mechanics
    const fetchMechanics = async () => {
      try {
        const res = await axiosInstance.get("/users/mechanics/available");
        setMechanics(res.data.mechanics);
      } catch (err) {
        console.error("Failed to fetch mechanics", err);
      }
    };
    fetchMechanics();
  }, [dispatch]);

  const toggleExpand = (id: number) => {
    setExpanded(expanded === id ? null : id);
  };

  const handleStatusChange = (id: number, status: string) => {
    dispatch(updateMaintenanceStatus({ id, status, mechanic_id: mechanicId || undefined }) as any);
    setMechanicId(null);
  };

  const handleRemove = (id: number) => {
    dispatch(removeMaintenanceRequestForRole({ id, role: "supervisor" }) as any);
  };

  const renderStatus = (req: any) => {
    switch (req.status.toLowerCase()) {
      case "pending":
        return <span className="bg-yellow-700 text-yellow-300 px-2 py-1 rounded-full text-xs">Pending</span>;
      case "approved":
        return <span className="bg-green-700 text-green-300 px-2 py-1 rounded-full text-xs">Approved</span>;
      case "rejected":
        return <span className="bg-red-700 text-red-300 px-2 py-1 rounded-full text-xs">Rejected</span>;
      case "completed":
        return <span className="bg-blue-700 text-blue-300 px-2 py-1 rounded-full text-xs">Completed</span>;
      default:
        return <span className="text-gray-400">—</span>;
    }
  };

  const renderActions = (req: any) => {
    if (req.status.toLowerCase() === "pending") {
      return (
        <>
          {/* ✅ Dropdown for mechanic names */}
          <select
            value={mechanicId ?? ""}
            onChange={(e) => setMechanicId(Number(e.target.value))}
            className="bg-gray-900 text-white px-2 py-1 rounded w-48"
          >
            <option value="">Select Mechanic</option>
            {mechanics.map((mech) => (
              <option key={mech.id} value={mech.id}>
                {mech.name}
              </option>
            ))}
          </select>

          <button
            onClick={() => handleStatusChange(req.id, "approved")}
            className="bg-green-600 px-3 py-1 rounded hover:bg-green-700 text-white"
          >
            Approve & Assign
          </button>
          <button
            onClick={() => handleStatusChange(req.id, "rejected")}
            className="bg-red-600 px-3 py-1 rounded hover:bg-red-700 text-white"
          >
            Reject
          </button>
        </>
      );
    }

    if (["completed", "rejected"].includes(req.status.toLowerCase())) {
      return (
        <button
          onClick={() => handleRemove(req.id)}
          className="flex items-center gap-2 bg-gradient-to-r from-gray-600 to-gray-800 px-4 py-2 rounded-lg hover:from-red-600 hover:to-red-800 text-white font-semibold shadow-md transition-all"
        >
          <FaTrashAlt /> Remove from My Page
        </button>
      );
    }

    return null;
  };

  return (
    <GlobalLayout>
      <div className="p-10">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">Maintenance Requests</h2>

        {loading && <p className="text-gray-400">Loading requests...</p>}
        {error && <p className="text-red-500">{error}</p>}

        <div className="space-y-4">
          {list.map((req) => (
            <div key={req.id} className="bg-gray-700 rounded-lg shadow-md">
              {/* Card Header */}
              <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() => toggleExpand(req.id)}
              >
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    {req.machine_name || `Machine #${req.machine_id}`} • Operator: {req.operator_name || `#${req.operator_id}`}
                  </h3>
                  <p className="text-sm text-gray-400">Supervisor: {req.supervisor_name || `#${req.supervisor_id}`}</p>
                  {req.mechanic_name && (
                    <p className="text-sm text-gray-400">Mechanic: {req.mechanic_name}</p>
                  )}
                </div>
                <div className="flex items-center gap-3">
                  {renderStatus(req)}
                  {expanded === req.id ? (
                    <FaChevronUp className="text-yellow-400" />
                  ) : (
                    <FaChevronDown className="text-yellow-400" />
                  )}
                </div>
              </div>

              {/* Dropdown Details */}
              {expanded === req.id && (
                <div className="p-4 border-t border-gray-700 space-y-3">
                  <p className="text-gray-300">Notes: {req.notes}</p>
                  <p className="text-gray-300">Created At: {new Date(req.created_at).toLocaleString()}</p>
                  {req.updated_at && <p className="text-gray-300">Updated At: {new Date(req.updated_at).toLocaleString()}</p>}

                  <div className="flex gap-2 items-center">
                    {renderActions(req)}
                  </div>
                </div>
              )}
            </div>
          ))}

          {list.length === 0 && (
            <p className="text-center text-gray-400">No maintenance requests found</p>
          )}
        </div>
      </div>
    </GlobalLayout>
  );
};

export default SupervisorMaintenancePage;
