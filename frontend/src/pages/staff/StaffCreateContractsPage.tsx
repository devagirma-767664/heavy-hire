import React, { useState, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../app/store';
import { createContract } from '../../features/contracts/contractsThunks';
import GlobalLayout from '../../Layouts/GlobalLayout';
import { fetchClients } from '../../features/clients/clientsThunks';
import Toast from '../../Components/Toast';
import { clearMessage } from '../../features/auth/authSlice';

const StaffCreateContractsPage: React.FC = () => {
  const location = useLocation();
  const { machine } = location.state || {}; // ✅ read machine object

  const dispatch = useDispatch<AppDispatch>();
  const { loading, error, successMessage } = useSelector((state: RootState) => state.contracts);
  const { list: clients, loading: clientsLoading } = useSelector((state: RootState) => state.clients);

  useEffect(() => {
    dispatch(fetchClients() as any);
  }, [dispatch]);

  useEffect(() => {
    if (successMessage) {
      setClientId('');
      setProjectDescription('');
      setProjectLocation('');
      setStartDate('');
      setEndDate('');
      setFixedCost('');
      setRateType('fixed');
      setDurationUnit('hour');
      setDurationValue('');
    }
  }, [successMessage]);

  // ✅ Prefill machine details
  const [machineId] = useState(machine?.id?.toString() || '');
  const [machineName] = useState(`${machine?.make || ''} ${machine?.model || ''}`);
  const [machineMake] = useState(machine?.make || '');
  const [machineType] = useState(machine?.type || '');
  const [rentalRate] = useState(machine?.rental_price?.toString() || '');

  // Contract form states
  const [clientId, setClientId] = useState('');
  const [projectDescription, setProjectDescription] = useState('');
  const [projectLocation, setProjectLocation] = useState('');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [fixedCost, setFixedCost] = useState('');
  const [rateType, setRateType] = useState('fixed');
  const [durationUnit, setDurationUnit] = useState<'hour' | 'day' | 'month'>('hour');
  const [durationValue, setDurationValue] = useState('');

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toISOString().split('T')[0];
  };

  const currentUser = useSelector((state: RootState) => state.auth.user)

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (durationUnit === 'day' && (!startDate || !endDate)) {
      alert('Please select both start and end dates.');
      return;
    }

    dispatch(createContract({
      machine_id: Number(machineId),
      client_id: Number(clientId),
      staffId: currentUser.id,
      project_description: projectDescription,
      project_location: projectLocation,
      start_date: durationUnit === 'day' ? formatDate(startDate) : startDate,
      end_date: durationUnit === 'day' ? formatDate(endDate) : endDate,
      duration_unit: durationUnit,
      duration_months: durationUnit === 'month' ? Number(durationValue) : null,
      duration_hours: durationUnit === 'hour' ? Number(durationValue) : null,
      fixed_cost: Number(fixedCost),
      rate_type: rateType,
      status: 'pending',
      machine_name: machineName,
      machine_make: machineMake,
      machine_type: machineType,
      rental_rate: Number(rentalRate),
    }) as any);
  };


    return (
    <GlobalLayout>
      <div className="flex min-h-screen items-center justify-center bg-gray-800">
        <form
          onSubmit={handleSubmit}
          className="bg-gray-700 p-8 rounded-lg shadow-md w-full max-w-xl"
        >
          <h2 className="text-2xl font-bold text-center text-yellow-400 mb-6">
            Create Contract
          </h2>

          {/* Machine ID */}
          <div>
            <label className="block text-gray-300 mb-2">Machine ID</label>
            <input
              type="text"
              value={machineId}
              readOnly
              className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-6"
            />
          </div>

          {/* Machine Name */}
          <div>
            <label className="block text-gray-300 mb-2">Machine Name</label>
            <input
              type="text"
              value={machineName}
              readOnly
              className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-6"
            />
          </div>

          {/* Machine Make */}
          <div>
            <label className="block text-gray-300 mb-2">Make</label>
            <input
              type="text"
              value={machineMake}
              readOnly
              className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-6"
            />
          </div>

          {/* Machine Type */}
          <div>
            <label className="block text-gray-300 mb-2">Type</label>
            <input
              type="text"
              value={machineType}
              readOnly
              className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-6"
            />
          </div>

          {/* Rental Rate */}
          <div>
            <label className="block text-gray-300 mb-2">Rate</label>
            <input
              type="text"
              value={`$${rentalRate}/hour`}
              readOnly
              className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-6"
            />
          </div>

          {/* Client ID */}
          <div>
            <label className="block text-gray-300 mb-1">Client</label>
            <select
              value={clientId}
              onChange={(e) => setClientId(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-6"
              required
            >
              <option value="">Select a client...</option>
              {clients.map((client) => (
                <option key={client.id} value={client.id}>
                  {client.name} ({client.email})
                </option>
              ))}
            </select>
            {clientsLoading && <p className="text-gray-400 text-sm">Loading clients...</p>}
          </div>


          {/* Project Description */}
          <div>
            <label className="block text-gray-300 mb-1">Project Description</label>
            <textarea
              value={projectDescription}
              onChange={(e) => setProjectDescription(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-6 resize-y min-h-[100px]"
              placeholder="Enter project details..."
            />
          </div>

          {/* Project Location */}
          <div>
            <label className="block text-gray-300 mb-1">Project Location</label>
            <input
              type="text"
              value={projectLocation}
              onChange={(e) => setProjectLocation(e.target.value)}
              className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 
                         focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-6"
            />
          </div>

          {/* Duration Unit */}
          <div>
            <label className="block text-gray-300 mb-1">Duration Unit</label>
            <select
              value={durationUnit}
              onChange={(e) => setDurationUnit(e.target.value as 'hour' | 'day' | 'month')}
              className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 
                        focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-6"
            >
              <option value="hour">Hours</option>
              <option value="day">Days</option>
              <option value="month">Months</option>
            </select>
          </div>

          {/* Duration Inputs */}
          {durationUnit === 'day' ? (
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-gray-300 mb-1">Start Date</label>
                <input
                  type="date"
                  value={startDate}
                  onChange={(e) => setStartDate(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 
                            focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-6"
                />
              </div>
              <div>
                <label className="block text-gray-300 mb-1">End Date</label>
                <input
                  type="date"
                  value={endDate}
                  onChange={(e) => setEndDate(e.target.value)}
                  className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 
                            focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-6"
                />
                {!endDate && <p className="text-red-400 text-sm">End date is required.</p>}
              </div>
            </div>
          ) : (
            <div>
              <label className="block text-gray-300 mb-1">
                Duration ({durationUnit === 'month' ? 'Months' : 'Hours'})
              </label>
              <input
                type="number"
                min="1"
                value={durationValue}
                onChange={(e) => setDurationValue(e.target.value)}
                className="w-full px-3 py-2 rounded bg-gray-800 text-gray-200 
                          focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-2"
              />
              {!durationValue && (
                <p className="text-red-400 text-sm">
                  {durationUnit === 'month' ? 'Months required.' : 'Hours required.'}
                </p>
              )}
            </div>
          )}

          {/* Rate */}
          <div>
            <label className="block text-gray-300 mb-1">Rate</label>
            <div className="flex gap-3">
              <input
                type="number"
                value={fixedCost}
                onChange={(e) => setFixedCost(e.target.value)}
                className="flex-1 px-3 py-2 rounded bg-gray-800 text-gray-200 
                           focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-6"
                placeholder="Enter amount"
              />
              <select
                value={rateType}
                onChange={(e) => setRateType(e.target.value)}
                className="px-3 py-2 rounded bg-gray-800 text-gray-200 
                           focus:outline-none focus:ring-2 focus:ring-yellow-400 mb-6"
              >
                <option value="hour">Per Hour</option>
                <option value="day">Per Day</option>
                <option value="fixed">Fixed Rate</option>
              </select>
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-yellow-500 text-black font-bold py-2 rounded-lg hover:bg-yellow-600 transition mt-4"
          >
            {loading ? 'Creating...' : 'Create Contract'}
          </button>

          {error && <p className="text-red-400 mt-2">Error: {error}</p>}
        </form>

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

export default StaffCreateContractsPage;
