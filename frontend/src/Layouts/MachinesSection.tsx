import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import type { RootState, AppDispatch } from '../app/store';
import { createMachine, fetchMachines, deleteMachine } from '../features/machines/machinesThunks';

const MachinesSection: React.FC = () => {
  const [filter, setFilter] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({
    make: '',
    model: '',
    serial_number: '',
    type: '',
    year: '',
    rental_price: 0,
    status: 'available',
    notes: '',
    imageFile: null as File | null,
  });
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const user = useSelector((state: RootState) => state.auth.user);
  const machines = useSelector((state: RootState) => state.machines.list);
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchMachines() as any);
  }, [dispatch]);

  useEffect(() => {
    if (form.imageFile) {
      const url = URL.createObjectURL(form.imageFile);
      setPreviewUrl(url);
      return () => URL.revokeObjectURL(url);
    } else {
      setPreviewUrl(null);
    }
  }, [form.imageFile]);

  const filteredMachines = machines.filter(m =>
    m.type.toLowerCase().includes(filter.toLowerCase()) &&
    (statusFilter === '' || m.status.toLowerCase() === statusFilter.toLowerCase())
  );

  const statusColor = (status: string) => {
    switch (status) {
      case 'available': return 'text-green-400';
      case 'under_maintenance': return 'text-yellow-400';
      case 'assigned': return 'text-red-400';
      default: return 'text-gray-400';
    }
  };


  const handleFormChange = (
  e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>
  ) => {
  const { name, value } = e.target;
  setForm(prev => ({ ...prev, [name]: value }));
  };


  const handleFormSubmit = (e: React.FormEvent) => {
  e.preventDefault();
  const formData = new FormData();
  formData.append("make", form.make);
  formData.append("model", form.model);
  formData.append("serial_number", form.serial_number);
  formData.append("type", form.type);
  formData.append("year", form.year.toString());
  formData.append("rental_price", form.rental_price.toString());
  formData.append("status", form.status);
  formData.append("notes", form.notes);

  if (form.imageFile) {
    formData.append("image", form.imageFile);
  }

  dispatch(createMachine(formData) as any)
    .unwrap()
    .then(() => {
      dispatch(fetchMachines() as any);
      setShowForm(false); // ✅ close popup after success
      setForm({
        make: '',
        model: '',
        serial_number: '',
        type: '',
        year: '',
        rental_price: 0,
        status: 'available',
        notes: '',
        imageFile: null,
      });
    })
    .catch((err: any) => console.error("❌ Error adding machine:", err));
};


  return (
    <section className="p-15">
      {/* Header with Add Machine + Filters */}
      <div className="flex justify-between items-center mb-6 bg-gray-700 px-4 py-3 rounded-lg shadow-2xl">
        {user?.role === 'supervisor' && (
          <button
            onClick={() => setShowForm(true)}
            className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600 transition"
          >
            + Add Machine
          </button>
        )}

        {/* Status Filters */}
        <div className="flex gap-1 justify-center text-gray-200">
          {['', 'available', 'assigned'].map(status => (
            <label key={status} className="flex items-center gap-2 cursor-pointer px-3 py-1 rounded-lg transition hover:bg-gray-700">
              <input
                type="radio"
                name="statusFilter"
                value={status}
                checked={statusFilter === status}
                onChange={() => setStatusFilter(status)}
                className="appearance-none h-4 w-4 border-2 border-yellow-400 rounded-full
                  checked:bg-yellow-500 checked:border-yellow-500 focus:outline-none
                  focus:ring-2 focus:ring-yellow-400"
              />
              <span className="capitalize">{status === '' ? 'All' : status.replace('_', ' ')}</span>
            </label>
          ))}
        </div>

        {/* Text filter */}
        <input
          type="text"
          placeholder="Filter by type..."
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="w-64 px-3 py-2 rounded bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
        />
      </div>

      {/* Machines Grid */}
      <div className="grid grid-cols-2 gap-20 mt-15">
        {filteredMachines.map(machine => (
          <div
  key={machine.id}
  className="bg-gray-700 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition flex flex-col h-90"
>
  <div className="flex">
    {/* Image Section */}
    <div className="w-2/3">
      {machine.image_url ? (
        <img
          src={`http://localhost:5000${machine.image_url}`}
          alt={machine.make}
          className="w-full h-full object-cover"
        />
      ) : (
        <div className="w-full h-full bg-gray-600 flex items-center justify-center text-gray-300">
          No Image
        </div>
      )}
    </div>

    {/* Details Section */}
    <div className="w-1/3 p-3 flex flex-col justify-between h-full">
      <div className="space-y-2">
        <h3 className="text-yellow-400 text-lg font-semibold mb-10">
          {machine.make} {machine.model}
        </h3>
        <p className="text-gray-100 text-m">ID: {machine.id}</p>
        <p className="text-gray-100 text-m">Type: {machine.type}</p>
        <p className="text-gray-100 text-m">Price: ${machine.rental_price}/hour</p>
      </div>
      
      {/* Status Badge */}
      <div className="mt-2 mb-20 flex flex-col gap-2">
        <div className={`px-2 py-1 rounded text-sm font-semibold ${statusColor(machine.status)}`}>
          Status: <span className="capitalize">{machine.status.replace('_', ' ')}</span>
        </div>

        {/* Assign to Client (staff only, available machines) */}
        {user?.role === 'staff' && machine.status === 'available' && (
          <button
            onClick={() =>
              navigate('/staff/contracts/create', { state: { machine } })
            }
            className="bg-blue-600 text-white px-2 py-1 rounded text-xs hover:bg-blue-700 transition"
          >
            Assign to Client
          </button>
          )}

        {/* Remove Button */}
        {user?.role === 'supervisor' && (
          <button
            onClick={() => dispatch(deleteMachine(machine.id) as any)}
            className="bg-red-600 text-white px-2 py-1 rounded text-xs hover:bg-red-700 transition"
          >
            Remove Machine
          </button>
        )}
      </div>
    </div>
  </div>
</div>

        ))}
      </div>

            {/* Popup Form */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <form onSubmit={handleFormSubmit} className="bg-gray-800 p-6 rounded-lg shadow-lg w-96 space-y-3">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">Register Machine</h2>
            <input name="make" value={form.make} onChange={handleFormChange} placeholder="Make" className="w-full p-2 rounded bg-gray-700 text-gray-200" />
            <input name="model" value={form.model} onChange={handleFormChange} placeholder="Model" className="w-full p-2 rounded bg-gray-700 text-gray-200" />
            <input name="serial_number" value={form.serial_number} onChange={handleFormChange} placeholder="Serial Number" className="w-full p-2 rounded bg-gray-700 text-gray-200" />
            <input name="type" value={form.type} onChange={handleFormChange} placeholder="Type" className="w-full p-2 rounded bg-gray-700 text-gray-200" />
            <input name="year" value={form.year} onChange={handleFormChange} placeholder="Year" className="w-full p-2 rounded bg-gray-700 text-gray-200" />
            <input name="rental_price" type="number" value={form.rental_price} onChange={handleFormChange} placeholder="Rental Price" className="w-full p-2 rounded bg-gray-700 text-gray-200" />
            <input
              type="file"
              name="image"
              accept="image/*"
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  setForm(prev => ({ ...prev, imageFile: e.target.files![0] }));
                }
              }}
              className="w-full p-2 rounded bg-gray-700 text-gray-200"
            />
            {previewUrl && (
              <img src={previewUrl} alt="Preview" className="w-full h-40 object-cover rounded mt-2" />
            )}
            <textarea name="notes" value={form.notes} onChange={handleFormChange} placeholder="Notes" className="w-full p-2 rounded bg-gray-700 text-gray-200" />
            <div className="flex justify-end gap-2">
              <button type="button" onClick={() => setShowForm(false)} className="bg-gray-600 text-white px-4 py-2 rounded">Cancel</button>
              <button type="submit" className="bg-yellow-500 text-black px-4 py-2 rounded hover:bg-yellow-600">Add</button>
            </div>
          </form>
        </div>
      )}
    </section>
  );
};

export default MachinesSection;

