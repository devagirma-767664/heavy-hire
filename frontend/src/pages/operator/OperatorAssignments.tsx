import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../app/store';
import { fetchContracts, acceptAssignment, requestChange } from '../../features/contracts/contractsThunks';
import type { Contract } from '../../features/contracts/contractsThunks';
import GlobalLayout from '../../Layouts/GlobalLayout';

const OperatorAssignmentsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.auth.user);
  const contracts = useSelector((state: RootState) => state.contracts.list);
  const [expandedContractId, setExpandedContractId] = useState<number | null>(null);
  const [showRequestBox, setShowRequestBox] = useState<number | null>(null);
  const [requestMessage, setRequestMessage] = useState<string>("");

  useEffect(() => {
    dispatch(fetchContracts() as any);
  }, [dispatch]);

  const myContracts = contracts.filter(
    (c: Contract) =>
      c.operator_id === user?.id &&
      (c.status === 'approved' || c.status === 'assigned')
  );

  const handleAccept = (contractId: number) => {
    dispatch(acceptAssignment(contractId) as any);
  };

  const handleRequestChange = (contractId: number) => {
    if (requestMessage.trim()) {
      dispatch(requestChange({ id: contractId, comments: requestMessage }) as any);
      setRequestMessage("");
      setShowRequestBox(null);
    }
  };

  return (
    <GlobalLayout>
      <h1 className="text-2xl font-bold text-yellow-400 mb-4">My Assignments</h1>
      {myContracts.length === 0 ? (
        <p className="text-gray-400">No assignments yet.</p>
      ) : (
        <div className="space-y-4">
          {myContracts.map((contract) => (
            <div key={contract.id} className="bg-gray-700 rounded-lg shadow">
              {/* Header */}
              <div
                className="flex justify-between items-center p-4 cursor-pointer"
                onClick={() =>
                  setExpandedContractId(
                    expandedContractId === contract.id ? null : contract.id
                  )
                }
              >
                <h2 className="text-lg font-semibold text-yellow-400">
                  Contract #{contract.id} — {contract.make} {contract.model} ({contract.machine_type})
                </h2>
                <span className="text-gray-400">
                  {expandedContractId === contract.id ? "▲" : "▼"}
                </span>
              </div>

              {/* Dropdown */}
              {expandedContractId === contract.id && (
                <div className="p-4 border-t border-gray-600 space-y-2">
                  <p className="text-gray-200"><strong>Client:</strong> {contract.client_name}</p>
                  <p className="text-gray-200"><strong>Project:</strong> {contract.project_description}</p>
                  <p className="text-gray-200"><strong>Location:</strong> {contract.project_location}</p>
                  <p className="text-gray-200">
                    <strong>Duration:</strong>{" "}
                    {contract.duration_unit === "day" && contract.duration_days}
                    {contract.duration_unit === "month" && contract.duration_months}
                    {contract.duration_unit === "hour" && contract.duration_hours}{" "}
                    {contract.duration_unit}
                  </p>
                  <p className="text-gray-200"><strong>Created:</strong> {new Date(contract.created_at).toLocaleString()}</p>

                  {/* Actions */}
                  <div className="flex space-x-4 mt-4">
                    <button
                      onClick={() => handleAccept(contract.id)}
                      disabled={contract.status === 'assigned'}
                      className={`px-4 py-2 rounded text-white ${
                        contract.status === 'assigned'
                          ? 'bg-gray-500 cursor-not-allowed text-green-500'
                          : 'bg-green-600 hover:bg-green-700'
                      }`}
                    >
                      {contract.status === 'assigned' ? 'Assignment Accepted' : 'Accept Assignment'}
                    </button>

                    {/* Hide Request Change if accepted */}
                    {contract.status !== 'assigned' && (
                      <button
                        onClick={() =>
                          setShowRequestBox(showRequestBox === contract.id ? null : contract.id)
                        }
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded"
                      >
                        Request Change
                      </button>
                    )}
                  </div>

                  {/* Request Change Box */}
                  {showRequestBox === contract.id && contract.status !== 'assigned' && (
                    <div className="mt-4">
                      <textarea
                        value={requestMessage}
                        onChange={(e) => setRequestMessage(e.target.value)}
                        placeholder="Describe your change request..."
                        className="w-full p-2 rounded bg-gray-800 text-gray-200 mb-2"
                        rows={3}
                      />
                      <button
                        onClick={() => handleRequestChange(contract.id)}
                        className="bg-yellow-500 hover:bg-yellow-600 text-black px-4 py-2 rounded"
                      >
                        Send
                      </button>
                    </div>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>
      )}
    </GlobalLayout>
  );
};

export default OperatorAssignmentsPage;
