// src/pages/operator/OperatorStartUsagePage.tsx
import React, { useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { startUsage } from "../../features/usage/usageThunks";
import GlobalLayout from "../../Layouts/GlobalLayout";
import { FaPaperclip } from "react-icons/fa";

const OperatorStartUsagePage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { active } = useSelector((state: RootState) => state.contracts);
  const { loading, error, successMessage } = useSelector((state: RootState) => state.usage);

  const [selectedContract, setSelectedContract] = useState<number | null>(null);
  const [startGauge, setStartGauge] = useState<number | null>(null);
  const [startPhoto, setStartPhoto] = useState<File | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContract || !startGauge || !startPhoto) return;
    const contract = active.find(c => c.id === selectedContract);
    if (!contract) return;

    const formData = new FormData();
    formData.append("operator_id", String(contract.operator_id!));
    formData.append("machine_id", String(contract.machine_id));
    formData.append("contract_id", String(contract.id));
    formData.append("start_gauge", String(startGauge));
    formData.append("start_photo", startPhoto);

    dispatch(startUsage(formData)).then((res: any) => {
      if (!res.error) {
        setSelectedContract(null);
        setStartGauge(null);
        setStartPhoto(null);
      }
    });
  };

  return (
    <GlobalLayout>
      <div className="p-10 max-w-2xl mx-auto">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">Start Usage Log</h2>

        {loading && <p className="text-gray-400 mb-4">Submitting usage log...</p>}
        {error && <p className="text-red-500 mb-4">{error}</p>}
        {successMessage && <p className="text-green-500 mb-4">{successMessage}</p>}

        <form onSubmit={handleSubmit} className="space-y-6 bg-gray-700 p-6 rounded-lg shadow-md">
          {/* Contract selector */}
          <div>
            <label className="block text-gray-200 mb-2">Assigned Contract</label>
            <select
              value={selectedContract ?? ""}
              onChange={(e) => setSelectedContract(Number(e.target.value))}
              className="bg-gray-900 text-white p-2 rounded w-full focus:ring-2 focus:ring-yellow-400"
            >
              <option value="">Select contract</option>
              {active
                .filter(c => c.status === "assigned") // ✅ only assigned contracts
                .map(c => (
                  <option key={c.id} value={c.id}>
                    Contract #{c.id} • Machine {c.machine_id}  {c.machine_type}
                  </option>
                ))}
            </select>
          </div>

          {/* Gauge input */}
          <div>
            <label className="block text-gray-200 mb-2">Starting Gauge Reading</label>
            <input
              type="number"
              placeholder="Enter starting gauge"
              value={startGauge ?? ""}
              onChange={(e) => setStartGauge(Number(e.target.value))}
              className="bg-gray-900 text-white p-2 rounded w-full focus:ring-2 focus:ring-yellow-400"
            />
          </div>

          {/* Photo upload */}
          <div>
            <label className="text-gray-200 mb-2 flex items-center gap-2">
              <span>Upload Starting Gauge Photo</span>
              <FaPaperclip className="text-yellow-400" />
            </label>
            <input
              type="file"
              accept="image/*"
              onChange={(e) => setStartPhoto(e.target.files?.[0] || null)}
              className="block w-full text-gray-300 cursor-pointer 
                        file:mr-4 file:py-2 file:px-4 
                        file:rounded-full file:border-0 
                        file:text-sm file:font-semibold 
                        file:bg-yellow-400 file:text-gray-900 
                        hover:file:bg-yellow-500"
            />
            <p className="text-sm text-gray-400 mt-2">
              Please attach a clear photo of the machine’s gauge reading before starting usage.
            </p>
          </div>

          {/* Submit button */}
          <button
            type="submit"
            className="bg-green-600 px-4 py-2 rounded hover:bg-green-700 text-white w-full font-semibold"
          >
            Start Usage
          </button>
        </form>
      </div>
    </GlobalLayout>
  );
};

export default OperatorStartUsagePage;
