import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../../app/store';
import { fetchClients, createClient, deleteClient } from '../../features/clients/clientsThunks';
import GlobalLayout from '../../Layouts/GlobalLayout';

const StaffClientsPage: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: clients, loading, error } = useSelector((state: RootState) => state.clients);

  const [form, setForm] = useState({ name: '', email: '', phone: '', address: '' });
  const [expandedId, setExpandedId] = useState<number | null>(null);

  useEffect(() => {
    dispatch(fetchClients() as any);
  }, [dispatch]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    dispatch(createClient(form) as any);
    setForm({ name: '', email: '', phone: '', address: '' });
  };

  const handleDelete = (id: number) => {
    dispatch(deleteClient(id) as any);
  };

  return (
    <GlobalLayout>
      <div className="flex min-h-screen items-start justify-center bg-gray-800 py-12">
        <div className="w-full max-w-5xl flex flex-col md:flex-row gap-10">
          
          {/* Register Client Form */}
          <form
            onSubmit={handleSubmit}
            className="bg-gray-700 p-8 rounded-lg shadow-md w-full max-w-md "
          >
            <h2 className="text-2xl font-bold text-center text-yellow-400 mb-6">
              Register New Client
            </h2>
            {['name', 'email', 'phone', 'address'].map((field) => (
              <div key={field}>
                <input
                  type="text"
                  placeholder={field.charAt(0).toUpperCase() + field.slice(1)}
                  value={form[field as keyof typeof form]}
                  onChange={(e) => setForm({ ...form, [field]: e.target.value })}
                  className="w-full px-4 py-2 mb-6 rounded bg-gray-800 text-gray-200 placeholder-gray-400  focus:outline-none focus:ring-2 focus:ring-yellow-400"
                  required
                />
              </div>
            ))}
            <button
              type="submit"
              className="w-full bg-yellow-500 text-black font-bold py-2 rounded-lg hover:bg-yellow-600 transition"
            >
              Register Client
            </button>
          </form>

          {/* Clients List */}
          <div className="flex-1 bg-gray-700 p-6 rounded-lg shadow-md overflow-y-auto  ">
            <h2 className="text-xl font-bold text-yellow-400 mb-4">Clients List</h2>
            {loading && <p className="text-gray-300">Loading clients...</p>}
            {error && <p className="text-red-400">Error: {error}</p>}

            <div className="space-y-4">
              {clients.map((client) => (
                <div key={client.id} className="border border-gray-100 rounded-lg p-4 bg-gray-800 mb-6">
                  <div
                    className="flex justify-between items-center cursor-pointer"
                    onClick={() => setExpandedId(expandedId === client.id ? null : client.id)}
                  >
                    {/* Header: only name */}
                    <h3 className="font-bold text-yellow-400">{client.name}</h3>
                    <div className="flex items-center space-x-4">
                      <button
                        onClick={(e) => { e.stopPropagation(); handleDelete(client.id); }}
                        className="text-red-400 hover:text-red-600"
                      >
                        Delete
                      </button>
                      <span className="text-sm text-gray-400">
                        {expandedId === client.id ? '▲ Hide' : '▼ Show'}
                      </span>
                    </div>
                  </div>

                  {/* Expanded details */}
                  {expandedId === client.id && (
                    <div className="mt-2 text-gray-300 space-y-1">
                      <p><strong>Client ID:</strong> {client.id}</p>
                      <p><strong>Email:</strong> {client.email}</p>
                      <p><strong>Phone:</strong> {client.phone}</p>
                      <p><strong>Address:</strong> {client.address}</p>
                      {client.created_at && (
                        <p><strong>Created At:</strong> {new Date(client.created_at).toLocaleString()}</p>
                      )}
                      {client.updated_at && (
                        <p><strong>Updated At:</strong> {new Date(client.updated_at).toLocaleString()}</p>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </GlobalLayout>
  );
};

export default StaffClientsPage;
