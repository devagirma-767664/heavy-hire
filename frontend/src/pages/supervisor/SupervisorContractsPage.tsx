import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../../app/store";
import { 
  fetchPendingContracts,  
  approveContract, 
  rejectContract, 
  returnContract, 
  assignOperator, 
  deleteContract,
  fetchActiveContracts

} from "../../features/contracts/contractsThunks";
import GlobalLayout from "../../Layouts/GlobalLayout";
import { fetchAvailableOperators } from "../../features/users/usersThunks";
import Toast from "../../Components/Toast"; // ✅ import your custom Toast

const ContractsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { pending, loading, error, active } = useSelector(
    (state: RootState) => state.contracts
  );

  const [expandedId, setExpandedId] = useState<number | null>(null);
  const [availableOperators, setAvailableOperators] = useState<any[]>([]);
  const [assigningContractId, setAssigningContractId] = useState<number | null>(null);
  const [selectedOperator, setSelectedOperator] = useState<number | null>(null);
  const [assignedContractIds, setAssignedContractIds] = useState<number[]>([]);
  const [assignedOperators, setAssignedOperators] = useState<Record<number, string>>({});



  // Toast state
  const [toastMessage, setToastMessage] = useState<string | null>(null);
  const [toastType, setToastType] = useState<"success" | "error">("success");

  useEffect(() => {
    dispatch(fetchPendingContracts());
    dispatch(fetchActiveContracts());
  }, [dispatch]);

  const toggleExpand = (id: number) => {
    setExpandedId(expandedId === id ? null : id);
  };

  const handleApprove = (id: number) => dispatch(approveContract(id));
  const handleReject = (id: number) => {
    const comments = prompt("Enter rejection comments:");
    if (comments) dispatch(rejectContract({ id, comments }));
  };
  const handleReturn = (id: number) => {
    const comments = prompt("Enter return comments:");
    if (comments) dispatch(returnContract({ id, comments }));
  };

  const handleAssignOperatorClick = (id: number) => {
    setAssigningContractId(id);
    setSelectedOperator(null);
    dispatch(fetchAvailableOperators() as any).then((res: any) => {
      if (Array.isArray(res.payload)) {
        setAvailableOperators(res.payload);
      } else {
        setAvailableOperators([]);
      }
    });
    
  };

  const handleAssignOperator = (contractId: number) => {
  if (!selectedOperator) {
    setToastMessage("Please select an operator first");
    setToastType("error");
    return;
  }
  dispatch(assignOperator({ id: contractId, operator_id: selectedOperator }) as any)
    .then(() => {
      dispatch(fetchActiveContracts());
      const operator = availableOperators.find(op => op.id === selectedOperator);
      if(operator) {
        setAssignedOperators(prev => ({...prev, [contractId]: operator.name}));
      };

      setToastMessage("Operator assigned successfully 🎉");
      setToastType("success");
      setAssigningContractId(null);
      setSelectedOperator(null);
      setAssignedContractIds((prev) => [...prev, contractId]); 
    })
    .catch(() => {
      setToastMessage("Failed to assign operator");
      setToastType("error");
    });
};


  const handleDelete = (id: number) => {
    if (window.confirm("Are you sure you want to delete this contract?")) {
      dispatch(deleteContract(id) as any).then(() => {
        dispatch(fetchAvailableOperators() as any)
      });
    }
  };


  const renderContractCard = (contract: any) => (
    <div key={contract.id} className="bg-gray-700 rounded-lg shadow-md mb-4">
      {/* Header row */}
      <div
        className="flex justify-between items-center p-4 cursor-pointer"
        onClick={() => toggleExpand(contract.id)}
      >
        <div>
          <p className="text-yellow-400 font-bold">Machine: {contract.machine_id}</p>
          <p className="text-gray-300 font-bold">
            Contract #{contract.id} • Client {contract.client_name}
          </p>
          {contract.status === "pending" && contract.updated_at !== contract.created_at && (
            <span className="inline-block mt-2 px-3 py-1 text-xs font-semibold bg-blue-600 text-white rounded-full">
              Updated by Staff
            </span>
          )}
        </div>
        <button className="text-yellow-400 hover:text-yellow-500">
          {expandedId === contract.id ? "Hide Details ▲" : "See Details ▼"}
        </button>
      </div>

      {/* Expanded details */}
      {expandedId === contract.id && (
         <div className="border-t border-gray-700 p-4 space-y-2">
          {/* Contract details grid */}
          <div className="grid grid-cols-2 gap-4 text-gray-300">
            <p><span className="font-semibold text-gray-100">Machine Make:</span> {contract.make}</p>
            <p><span className="font-semibold text-gray-100">Machine Model:</span> {contract.model}</p>
            <p><span className="font-semibold text-gray-100">Serial Number:</span> {contract.serial_number}</p>
            <p><span className="font-semibold text-gray-100">Type:</span> {contract.machine_type}</p>
            <p><span className="font-semibold text-gray-100">Year:</span> {contract.year}</p>
            <p><span className="font-semibold text-gray-100">Client Name:</span> {contract.client_name}</p>
            <p><span className="font-semibold text-gray-100">Client Email:</span> {contract.client_email}</p>
            <p><span className="font-semibold text-gray-100">Client Phone:</span> {contract.client_phone}</p>
            <p><span className="font-semibold text-gray-100">Client Address:</span> {contract.client_address}</p>
            <p><span className="font-semibold text-gray-100">Project:</span> {contract.project_description}</p>
            <p><span className="font-semibold text-gray-100">Location:</span> {contract.project_location}</p>
            <p><span className="font-semibold text-gray-100">Start:</span> {contract.start_date || "—"}</p>
            <p><span className="font-semibold text-gray-100">End:</span> {contract.end_date || "—"}</p>
            <p><span className="font-semibold text-gray-100">Duration Unit:</span> {contract.duration_unit}</p>
            {contract.duration_unit === "day" && (
              <p><span className="font-semibold text-gray-100">Duration (Days):</span> {contract.duration_days}</p>
            )}
            {contract.duration_unit === "month" && (
              <p><span className="font-semibold text-gray-100">Duration (Months):</span> {contract.duration_months}</p>
            )}
            {contract.duration_unit === "hour" && (
              <p><span className="font-semibold text-gray-100">Duration (Hours):</span> {contract.duration_hours}</p>
            )}
            <p><span className="font-semibold">Rate:</span> {contract.fixed_cost}</p>
            <p><span className="font-semibold text-gray-100">Status:</span> {contract.status}</p>
            {assignedOperators[contract.id] ? (
            <p>
              <span className="font-semibold text-gray-100">Assigned Operator:</span> {assignedOperators[contract.id]}
            </p>
             ) : contract.status === "approved" ? (
            <p>
              <span className="font-semibold text-gray-100">Assigned Operator:</span> Operator not assigned yet
            </p>
              ) : (
            <p>
              <span className="font-semibold text-gray-100">Comments:</span> {contract.comments || "—"}
            </p>
              )};
            <p><span className="font-semibold text-gray-100">Created At:</span> {contract.created_at}</p>
            <p><span className="font-semibold text-gray-100">Updated At:</span> {contract.updated_at}</p>
          </div>

          {/* Action buttons */}
          <div className="flex flex-row gap-2 mt-4">
            {contract.status === "pending" ? (
              <>
                <button onClick={() => handleApprove(contract.id)} className="bg-green-600 px-3 py-1 rounded hover:bg-green-700">Approve</button>
                <button onClick={() => handleReject(contract.id)} className="bg-red-600 px-3 py-1 rounded hover:bg-red-700">Reject</button>
                <button onClick={() => handleReturn(contract.id)} className="bg-yellow-600 px-3 py-1 rounded hover:bg-yellow-700">Return With Comment</button>
                
              </>
            ) : contract.status === "approved" ? (
              <>
                {assignedContractIds.includes(contract.id) ? (
                  <button
                    className="bg-green-600 px-3 py-1 rounded text-white cursor-default"
                    disabled
                  >
                    Operator Assigned
                  </button>
                ) : assigningContractId === contract.id ? (
                  <div className="space-y-2 w-full">
                    {availableOperators.length === 0 ? (
                      <p className="text-red-500">No available operators.</p>
                    ) : (
                      <>
                        <select
                          value={selectedOperator ?? ""}
                          onChange={(e) => setSelectedOperator(Number(e.target.value))}
                          className="bg-gray-800 text-white p-2 rounded w-full"
                        >
                          <option value="">Select an operator</option>
                          {availableOperators.map((op) => (
                            <option key={op.id} value={op.id}>
                              {op.name} ({op.email})
                            </option>
                          ))}
                        </select>
                        <button
                          onClick={() => handleAssignOperator(contract.id)}
                          className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 text-white"
                          disabled={!selectedOperator} // ✅ disable until operator selected
                        >
                          Assign
                        </button>
                      </>
                    )}
                  </div>
                ) : (
                  <button
                    onClick={() => handleAssignOperatorClick(contract.id)}
                    className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700 text-white"
                  >
                    Assign Operator
                  </button>
                )}

                {/* ✅ Delete contract button for approved contracts */}
                  <button
                    onClick={() => handleDelete(contract.id)}
                    className="bg-red-700 px-3 py-1 rounded hover:bg-red-800 text-white"
                  >
                    Delete Contract
                  </button>
              </>

            ) : contract.status === "assigned" || contract.status === "active" ? (
              <>
                <p className="text-green-400 font-semibold">
                  Contract is {contract.status}. Operator: {contract.operator_name || "—"}
                </p>
                <button
                  onClick={() => handleDelete(contract.id)}
                  className="bg-red-700 px-3 py-1 rounded hover:bg-red-800 text-white"
                >
                  Delete Contract
                </button>
              </>
            ) : null}
          </div>
        </div>
      )}
    </div>
  );

  return (
    <GlobalLayout>
      <div className="p-20 py-5">
        {loading && <p className="text-gray-400 mb-4">Loading contracts...</p>}
        {error && <p className="text-red-400 mb-4">Error: {error}</p>}

        <h2 className="text-xl font-bold text-yellow-400 mb-8">Pending Contracts</h2>
        {pending.length > 0 ? pending.map(renderContractCard) : (
          <p className="text-gray-400">No pending contracts 🎉</p>
        )}

        <h2 className="text-xl font-bold text-yellow-400 mb-6 mt-10">All Contracts</h2>
        {active.filter(c => c.status === "approved" || c.status === "assigned").length > 0 ? (
          active.filter(c => c.status === "approved" || c.status === "assigned").map(renderContractCard)
        ) : (
          <p className="text-gray-400">No approved contracts found</p>
        )}
      </div>

      {/* ✅ Toast notification */}
      {toastMessage && (
        <Toast
          message={toastMessage}
          type={toastType}
          onClose={() => setToastMessage(null)}
        />
      )}
    </GlobalLayout>
  );
};

export default ContractsPage;
