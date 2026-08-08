// src/pages/operator/OperatorEndUsagePage.tsx
import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { endUsage, fetchOperatorUsageLogs } from "../../features/usage/usageThunks";
import GlobalLayout from "../../Layouts/GlobalLayout";
import { FaPaperclip } from "react-icons/fa";

const OperatorEndUsagePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { operatorLogs, loading, error, successMessage } = useSelector((state: RootState) => state.usage);

  const [selectedLog, setSelectedLog] = useState<number | null>(null);
  const [endGauge, setEndGauge] = useState<number | null>(null);
  const [endPhoto, setEndPhoto] = useState<File | null>(null);

  // ✅ Fetch operator logs on mount
  useEffect(() => {
    dispatch(fetchOperatorUsageLogs());
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedLog || !endGauge || !endPhoto) return;

    const usageLog = operatorLogs.find(l => l.id === selectedLog);
    if (!usageLog) return;

    const formData = new FormData();
    formData.append("end_gauge", String(endGauge));
    formData.append("end_photo", endPhoto);

    dispatch(endUsage({ id: usageLog.id, formData })).then((res: any) => {
      if (!res.error) {
        setSelectedLog(null);
        setEndGauge(null);
        setEndPhoto(null);
      }
    });
  };

  return (
    <GlobalLayout>
      <div className="p-10 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">End Usage Log</h2>

        {loading && <p className="text-gray-400 mb-4">Submitting usage log...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-700 p-6 rounded-lg shadow-md">
          {/* Usage log selector */}
          <div>
            <label className="block text-gray-200 mb-2">Active Usage Log</label>
            {(() => {
              const eligibleLogs = operatorLogs.filter(
                l => l.activated && (!l.end_time || l.approved === false)
              ); // ✅ only activated logs not yet ended

              if (!loading && eligibleLogs.length === 0) {
                return (
                  <p className="text-gray-400 bg-gray-900 p-3 rounded">
                    No active usage logs right now. Once you start usage and your
                    supervisor activates it, it'll show up here.
                  </p>
                );
              }

              return (
                <select
                  value={selectedLog ?? ""}
                  onChange={(e) => setSelectedLog(Number(e.target.value))}
                  className="bg-gray-900 text-white p-2 rounded w-full focus:ring-2 focus:ring-yellow-400"
                >
                  <option value="">Select usage log</option>
                  {eligibleLogs.map(l => (
                    <option key={l.id} value={l.id}>
                      Contract #{l.contract_id} • Machine {l.machine_id}
                    </option>
                  ))}
                </select>
              );
            })()}
          </div>

          {/* Gauge input */}
          <div>
            <label className="block text-gray-200 mb-2">Ending Gauge Reading</label>
            <input
              type="number"
              placeholder="Enter ending gauge"
              value={endGauge ?? ""}
              onChange={(e) => setEndGauge(Number(e.target.value))}
              className="bg-gray-900 text-white p-2 rounded w-full focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Photo upload */}
          <div>
            <label className="text-gray-200 mb-2 flex items-center gap-2">
              <span>Upload Ending Gauge Photo</span>
              <FaPaperclip className="text-yellow-400" />
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setEndPhoto(e.target.files?.[0] || null)}
              className="block w-full text-gray-300 cursor-pointer 
                        file:mr-4 file:py-2 file:px-4 
                        file:rounded-full file:border-0 
                        file:text-sm file:font-semibold 
                        file:bg-yellow-400 file:text-gray-900 
                        hover:file:bg-yellow-500"
            />
            <p className="text-sm text-gray-400 mt-2">
              Please attach a clear photo of the machine’s gauge reading after completing usage.
            </p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700 text-white w-full font-semibold"
          >
            End Usage
          </button>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default OperatorEndUsagePage;
