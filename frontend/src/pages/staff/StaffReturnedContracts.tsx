import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../app/store';
import { fetchReturnedContracts, updateContract } from '../../features/contracts/contractsThunks';
import GlobalLayout from '../../Layouts/GlobalLayout';
import Toast from '../../Components/Toast';
import { clearMessage } from '../../features/contracts/contractsSlice'; // ✅ use contracts slice

const StaffReturnedContractsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { returned, loading, error, successMessage } = useSelector((state: RootState) => state.contracts);

  const [selectedContract, setSelectedContract] = useState<any | null>(null);

  useEffect(() => {
    dispatch(fetchReturnedContracts() as any);
  }, [dispatch]);

  const handleUpdate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedContract) return;
    dispatch(updateContract(selectedContract) as any);
  };

  return (
    <GlobalLayout>
      <div className="p-6 bg-gray-800 min-h-screen">
        <h2 className="text-2xl font-bold text-yellow-400 mb-6">Update Returned Contracts</h2>

        {loading && <p className="text-gray-400">Loading contracts...</p>}
        {error && <p className="text-red-400">Error: {error}</p>}

        {returned.length === 0 ? (
          <p className="text-gray-400">No contracts awaiting update.</p>
        ) : (
          <div className="space-y-4">
            {returned.map(contract => (
              <div
                key={contract.id}
                className="mt-6 ml-50 bg-gray-700 p-8 rounded-lg shadow-md w-full max-w-xl cursor-pointer"
                onClick={() => setSelectedContract(contract)}
              >
                <p className="text-yellow-400 font-semibold">Contract #{contract.id}</p>
                <p className="text-gray-300">Machine: {contract.make} {contract.model}</p>
                <p className="text-red-400">Supervisor Comment: {contract.comments}</p>
              </div>
            ))}
          </div>
        )}

        {/* Update Form */}
        {selectedContract && (
          <form
            onSubmit={handleUpdate}
            className="mt-6 ml-50 bg-gray-700 p-8 rounded-lg shadow-md w-full max-w-xl"
          >
            <h3 className="text-lg font-bold text-yellow-400 mb-4">
              Update Contract #{selectedContract.id}
            </h3>

            {/* Project Description */}
            <label className="block text-gray-300 mb-2">Project Description</label>
            <textarea
              value={selectedContract.project_description}
              onChange={(e) =>
                setSelectedContract({ ...selectedContract, project_description: e.target.value })
              }
              className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 mb-4"
            />

            {/* Project Location */}
            <label className="block text-gray-300 mb-2">Project Location</label>
            <input
              type="text"
              value={selectedContract.project_location}
              onChange={(e) =>
                setSelectedContract({ ...selectedContract, project_location: e.target.value })
              }
              className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 mb-4"
            />

            {/* Rate */}
            <label className="block text-gray-300 mb-2">Rate</label>
            <input
              type="number"
              value={selectedContract.fixed_cost}
              onChange={(e) =>
                setSelectedContract({ ...selectedContract, fixed_cost: Number(e.target.value) })
              }
              className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 mb-4"
            />

            {/* Duration Unit */}
            <label className="block text-gray-300 mb-2">Duration Unit</label>
            <select
              value={selectedContract.duration_unit}
              onChange={(e) =>
                setSelectedContract({ ...selectedContract, duration_unit: e.target.value })
              }
              className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 mb-4"
            >
              <option value="day">Day</option>
              <option value="month">Month</option>
              <option value="hour">Hour</option>
            </select>

            {/* Conditional fields */}
            {selectedContract.duration_unit === 'day' && (
              <>
                <label className="block text-gray-300 mb-2">Start Date</label>
                <input
                  type="date"
                  value={selectedContract.start_date || ''}
                  onChange={(e) =>
                    setSelectedContract({ ...selectedContract, start_date: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 mb-4"
                />

                <label className="block text-gray-300 mb-2">End Date</label>
                <input
                  type="date"
                  value={selectedContract.end_date || ''}
                  onChange={(e) =>
                    setSelectedContract({ ...selectedContract, end_date: e.target.value })
                  }
                  className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 mb-4"
                />
              </>
            )}

            {selectedContract.duration_unit === 'month' && (
              <>
                <label className="block text-gray-300 mb-2">Duration (Months)</label>
                <input
                  type="number"
                  value={selectedContract.duration_months || ''}
                  onChange={(e) =>
                    setSelectedContract({ ...selectedContract, duration_months: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 mb-4"
                />
              </>
            )}

            {selectedContract.duration_unit === 'hour' && (
              <>
                <label className="block text-gray-300 mb-2">Duration (Hours)</label>
                <input
                  type="number"
                  value={selectedContract.duration_hours || ''}
                  onChange={(e) =>
                    setSelectedContract({ ...selectedContract, duration_hours: Number(e.target.value) })
                  }
                  className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 mb-4"
                />
              </>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-yellow-500 text-black font-bold py-2 rounded-lg hover:bg-yellow-600 transition"
            >
              {loading ? 'Updating...' : 'Update Contract'}
            </button>
          </form>
        )}

        {/* Toast notifications */}
        {successMessage && (
          <Toast
            message={successMessage}
            type="success"
            onClose={() => dispatch(clearMessage())}
          />
        )}
        {error && (
          <Toast
            message={error}
            type="error"
            onClose={() => dispatch(clearMessage())}
          />
        )}
      </div>
    </GlobalLayout>
  );
};

export default StaffReturnedContractsPage;
