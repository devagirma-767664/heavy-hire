// src/pages/supervisor/SupervisorUsagePage.tsx
import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { fetchUsageLogs, approveUsage, rejectUsage, activateUsage } from "../../features/usage/usageThunks";
import { bookInspection } from "../../features/inspections/inspectionThunks"; // ✅ new
import GlobalLayout from "../../Layouts/GlobalLayout";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";
import axiosInstance from "../../api/axios"; // ✅ fetch mechanics

const SupervisorUsagePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list, loading, error, successMessage } = useSelector((state: RootState) => state.usage);
  const [expanded, setExpanded] = useState<number | null>(null);
  const [modalImage, setModalImage] = useState<string | null>(null);

  const [bookInspectionChoice, setBookInspectionChoice] = useState<"yes" | "no" | null>(null);
  const [selectedMechanic, setSelectedMechanic] = useState<number | null>(null);
  const [mechanics, setMechanics] = useState<{ id: number; name: string }[]>([]);

  useEffect(() => {
  dispatch(fetchUsageLogs());
  axiosInstance.get("/users/mechanics/available")
    .then((res) => {
      console.log("Mechanics response:", res.data);
      setMechanics(res.data.mechanics || []); // ✅ always an array
    })
    .catch((err) => {
      console.error("Failed to fetch mechanics", err);
      setMechanics([]);
    });
}, [dispatch]);

  const toggleExpand = (id: number) => {
    setExpanded(expanded === id ? null : id);
    setBookInspectionChoice(null);
    setSelectedMechanic(null);
  };

  const handleApprove = async (id: number) => {
  try {
    await dispatch(approveUsage(id));

    if (bookInspectionChoice === "yes") {
      if (!selectedMechanic) {
        alert("Please select a mechanic before approving.");
        return;
      }

      await dispatch(
        bookInspection({
          usageId: id,
          mechanic_id: selectedMechanic,
          notes: "Inspection required after approval",
        }) as any
      );
    }
  } catch (err) {
    console.error("Approval failed:", err);
  }
};


  const handleReject = (id: number) => dispatch(rejectUsage(id));
  const handleActivate = (id: number) => dispatch(activateUsage(id));

  const renderStatus = (log: any) => {
    if (!log.supervisor_reviewed && !log.end_gauge && !log.activated)
      return <span className="bg-yellow-700 text-yellow-300 px-2 py-1 rounded-full text-xs">Pending Activation</span>;
    if (log.activated && !log.supervisor_reviewed && !log.end_gauge)
      return <span className="bg-blue-700 text-blue-300 px-2 py-1 rounded-full text-xs">Activated</span>;
    if (log.activated && log.end_gauge && !log.supervisor_reviewed)
      return <span className="bg-purple-700 text-purple-300 px-2 py-1 rounded-full text-xs">Usage Ended</span>;
    if (log.supervisor_reviewed && log.approved)
      return <span className="bg-green-700 text-green-300 px-2 py-1 rounded-full text-xs">Approved</span>;
    if (log.supervisor_reviewed && log.approved === false)
      return <span className="bg-red-700 text-red-300 px-2 py-1 rounded-full text-xs">Rejected</span>;
    return <span className="text-gray-400">—</span>;
  };

  const visibleLogs = list.filter((log) => log.approved !== true);

  const buildImageUrl = (path: string | null) => {
    if (!path) return null;
    return `${import.meta.env.VITE_API_URL}${path}`;
  };

  return (
    <GlobalLayout>
      <div className="p-10">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">Usage Logs</h2>

        {loading && <p className="text-gray-400">Loading logs...</p>}
        {error && <p className="text-red-500">{error}</p>}
        {successMessage && <p className="text-green-500">{successMessage}</p>}

        <div className="space-y-6">
          {visibleLogs.map((log) => (
            <div key={log.id} className="bg-gray-800 rounded-lg shadow-lg hover:shadow-xl transition-shadow">
              {/* Card Header */}
              <div
                className="flex justify-between items-center p-5 cursor-pointer"
                onClick={() => toggleExpand(log.id)}
              >
                <div>
                  <h3 className="text-lg font-semibold text-white">
                    Machine: {log.machine_name} • Contract #{log.contract_id}
                  </h3>
                  <p className="text-sm text-gray-400">Operator: {log.operator_name}</p>
                </div>
                <div className="flex items-center gap-3">
                  {renderStatus(log)}
                  {expanded === log.id ? (
                    <FaChevronUp className="text-yellow-400" />
                  ) : (
                    <FaChevronDown className="text-yellow-400" />
                  )}
                </div>
              </div>

              {/* Dropdown Details */}
              {expanded === log.id && (
                <div className="p-6 border-t border-gray-700 space-y-5 bg-gray-900 rounded-b-lg">
                  <div className="grid grid-cols-2 gap-6 text-gray-300">
                    <div>
                      <p className="font-semibold text-yellow-400">Starting Gauge Reading</p>
                      <p>{log.start_gauge}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-yellow-400">Ending Gauge Reading</p>
                      <p>{log.end_gauge ?? "—"}</p>
                    </div>
                    <div>
                      <p className="font-semibold text-yellow-400">Contract Duration</p>
                      <p>{log.contract_duration ?? "—"} hours</p>
                    </div>
                    <div>
                      <p className="font-semibold text-yellow-400">Actual Duration</p>
                      <p
                        className={
                          log.contract_duration && log.duration > log.contract_duration
                            ? "text-red-400 font-bold"
                            : "text-green-400 font-bold"
                        }
                      >
                        {log.duration ?? "—"} hours
                      </p>
                    </div>
                  </div>

                  <div className="flex space-x-6 mt-4">
                    {log.start_photo && (
                      <div className="text-center">
                        <img
                          src={buildImageUrl(log.start_photo)}
                          alt="Start usage photo"
                          className="w-28 h-28 object-cover rounded-lg shadow-lg border border-gray-600 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => setModalImage(buildImageUrl(log.start_photo))}
                        />
                        <p className="text-xs text-gray-400 mt-2">Starting Gauge Reading</p>
                      </div>
                    )}
                    {log.end_photo && (
                      <div className="text-center">
                        <img
                          src={buildImageUrl(log.end_photo)}
                          alt="End usage photo"
                          className="w-28 h-28 object-cover rounded-lg shadow-lg border border-gray-600 cursor-pointer hover:scale-105 transition-transform"
                          onClick={() => setModalImage(buildImageUrl(log.end_photo))}
                        />
                        <p className="text-xs text-gray-400 mt-2">Ending Gauge Reading</p>
                      </div>
                    )}
                  </div>

                  <div className="flex gap-3 mt-5">
                    {!log.activated && !log.end_gauge && !log.supervisor_reviewed && (
                      <button
                        onClick={() => handleActivate(log.id)}
                        className="bg-blue-600 px-4 py-2 rounded-lg hover:bg-blue-700 text-white font-semibold shadow-md"
                      >
                        Activate
                      </button>
                    )}
                    {log.activated && log.end_gauge && !log.supervisor_reviewed && (
                      <>
                      {/* ✅ Book Inspection Option */}
                        <div className="flex gap-4 items-center">
                          <label className="text-gray-300">Book Inspection?</label>
                          <label>
                            <input type="radio" name={`inspect-${log.id}`} value="yes" onChange={() => setBookInspectionChoice("yes")} /> Yes
                          </label>
                          <label>
                            <input type="radio" name={`inspect-${log.id}`} value="no" onChange={() => setBookInspectionChoice("no")} /> No
                          </label>
                        </div>

                        {bookInspectionChoice === "yes" && (
                          <select
                            value={selectedMechanic ?? ""}
                            onChange={(e) => setSelectedMechanic(Number(e.target.value))}
                            className="bg-gray-900 text-white px-2 py-1 rounded w-48"
                          >
                            <option value="">Select Mechanic</option>
                            {Array.isArray(mechanics) && mechanics.map((mech) => (
                              <option key={mech.id} value={mech.id}>
                                {mech.name}
                              </option>
                            ))}
                          </select>

                        )}

                        <div className="flex gap-3 mt-4"></div>
                        <button
                          onClick={() => handleApprove(log.id)}
                          className="bg-green-600 px-4 py-2 rounded-lg hover:bg-green-700 text-white font-semibold shadow-md"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleReject(log.id)}
                          className="bg-red-600 px-4 py-2 rounded-lg hover:bg-red-700 text-white font-semibold shadow-md"
                        >
                          Reject
                        </button>
                      </>
                    )}
                  </div>
                </div>
              )}
            </div>
          ))}

          {visibleLogs.length === 0 && (
            <p className="text-center text-gray-400">No usage logs found</p>
          )}
        </div>

        {/* ✅ Modal for enlarged photo with close button */}
        {modalImage && (
          <div
            className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50"
            onClick={() => setModalImage(null)}
          >
            <div
              className="relative max-w-3xl max-h-[90vh] flex flex-col items-center"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={() => setModalImage(null)}
                className="absolute top-2 right-2 bg-red-600 text-white px-3 py-1 rounded hover:bg-red-700 shadow-md"
              >
                Close ✕
              </button>
              <img
                src={modalImage}
                alt="Enlarged usage photo"
                className="max-w-3xl max-h-[90vh] object-contain rounded shadow-lg"
              />
            </div>
          </div>
        )}
      </div>
    </GlobalLayout>
  );
};

export default SupervisorUsagePage;
