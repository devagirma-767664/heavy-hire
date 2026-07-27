// src/pages/UsersPage.tsx
import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import type { RootState } from "../../app/store";
import { fetchPendingUsers, fetchActiveUsers, approveUser, deleteUser, toggleUserStatus } from "../../features/users/usersThunks";
import { setSearchTerm, setFilterStatus, setRoleFilter } from "../../features/users/usersSlice";
import GlobalLayout from "../../Layouts/GlobalLayout";


const UsersPage: React.FC = () => {
  const dispatch = useDispatch();
  const { pending, active, searchTerm, filterStatus, roleFilter } = useSelector(
    (state: RootState) => state.users
  );

  useEffect(() => {
    dispatch(fetchPendingUsers() as any);
    dispatch(fetchActiveUsers() as any);
  }, [dispatch]);

  const handleApprove = (id: number) => {
    dispatch(approveUser(id) as any);
  };

  const handleDelete = (id: number) => {
  if (window.confirm("Are you sure you want to delete this user?")) {
    console.log("🟡 Attempting to delete user with ID:", id);

    dispatch(deleteUser(id) as any)
      .unwrap() // unwraps the thunk promise
      .then((deletedUser) => {
        console.log("✅ User deleted successfully:", deletedUser);
        // Refresh lists so UI updates immediately
        dispatch(fetchActiveUsers() as any)
      })
      .catch((err: any) => {
        console.error("❌ Error deleting user:", err);

        // Print full backend response if available
        if (err.response) {
          console.error("📦 Backend error response:", err.response.data);
        } else {
          console.error("📦 Raw error object:", err);
        }
      });
  }
};

  return (
    <GlobalLayout>
      <div className="p-20 py-5">
        {/* Pending Users */}
        <h2 className="text-xl font-bold text-yellow-400 mb-8">Pending Users</h2>
        <table className="w-full bg-gray-700 rounded-lg shadow-md mb-8">
          <thead>
            <tr className="text-yellow-400 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {pending.map((user) => (
              <tr key={user.id} className="border-t border-gray-700 text-gray-300">
                <td className="p-3">{user.name}</td>
                <td className="p-3">{user.email}</td>
                <td className="p-3 capitalize">{user.role}</td>
                <td className="p-3 capitalize">{user.status || "—"}</td>
                <td className="p-3 space-x-2">
                  <button
                    onClick={() => handleApprove(user.id)}
                    className="bg-green-600 px-3 py-1 rounded hover:bg-green-700"
                  >
                    Approve
                  </button>
                  <button
                    onClick={() => handleDelete(user.id)}
                    className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                  >
                    Reject
                  </button>
                </td>
              </tr>
            ))}
            {pending.length === 0 && (
              <tr>
                <td colSpan={4} className="p-3 text-center text-gray-400">
                  No pending users 🎉
                </td>
              </tr>
            )}
          </tbody>
        </table>

        {/* Active Users */}
        <h2 className="text-xl font-bold text-yellow-400 mb-6 mt-10">Active Users</h2>

        {/* Unified Search + Filters */}
        <div className="flex justify-between items-center mb-8 text-gray-200">
          {/* Search */}
          <input
            type="text"
            placeholder="Search by name or email..."
            value={searchTerm}
            onChange={(e) => dispatch(setSearchTerm(e.target.value))}
            className="px-3 py-1 border rounded-md w-64 bg-gray-800 text-gray-200 placeholder-gray-400 
                       focus:outline-none focus:ring-2 focus:ring-yellow-400"
          />

          {/* Status Filter */}
          <div className="flex gap-1 justify-center">
            {["", "available", "on duty"].map((status) => (
              <label
                key={status}
                className="flex items-center gap-2 cursor-pointer px-3 py-1 rounded-lg transition hover:bg-gray-700"
              >
                <input
                  type="radio"
                  name="filterStatus"
                  value={status}
                  checked={filterStatus === (status === "" ? "all" : status)}
                  onChange={() =>
                    dispatch(setFilterStatus(status === "" ? "all" : (status as "available" | "on duty")))
                  }
                  className="appearance-none h-4 w-4 border-2 border-yellow-400 rounded-full
                             checked:bg-yellow-500 checked:border-yellow-500 focus:outline-none
                             focus:ring-2 focus:ring-yellow-400"
                />
                <span className="capitalize">{status === "" ? "All" : status}</span>
              </label>
            ))}
          </div>

          {/* Role Filter */}
          <select
            value={roleFilter}
            onChange={(e) => dispatch(setRoleFilter(e.target.value))}
            className="px-3 py-1 border rounded-md bg-gray-800 text-gray-200 focus:outline-none focus:ring-2 focus:ring-yellow-400"
          >
            <option value="">All Roles</option>
            <option value="supervisor">Supervisor</option>
            <option value="operator">Operator</option>
            <option value="mechanic">Mechanic</option>
            <option value="logistics">Logistics</option>
          </select>
        </div>

        <table className="w-full bg-gray-700 rounded-lg shadow-md">
          <thead>
            <tr className="text-yellow-400 text-left">
              <th className="p-3">Name</th>
              <th className="p-3">Email</th>
              <th className="p-3">Role</th>
              <th className="p-3">Status</th>
              <th className="p-3">Approved</th>
              <th className="p-3">Actions</th>
            </tr>
          </thead>
          <tbody>
            {active
              .filter((user) => {
                const matchesSearch =
                  user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                  user.email.toLowerCase().includes(searchTerm.toLowerCase());

                const matchesStatus =
                  filterStatus === "all" || user.status?.toLowerCase() === filterStatus;

                const matchesRole =
                  roleFilter === "" || user.role.toLowerCase() === roleFilter.toLowerCase();

                return matchesSearch && matchesStatus && matchesRole;
              })
              .map((user) => (
                <tr key={user.id} className="border-t border-gray-700 text-gray-300">
                  <td className="p-3">{user.name}</td>
                  <td className="p-3">{user.email}</td>
                  <td className="p-3 capitalize">{user.role}</td>
                  <td className="p-3 capitalize">{user.status || "—"}</td>
                  <td className="p-3">{user.approved ? "✅" : "❌"}</td>
                  <td className="p-3 space-x-2">

                    {/* ✅ Toggle button only if user is on duty */}
                    {user.status === "on duty" && (
                      <button
                        onClick={() => dispatch(toggleUserStatus(user.id) as any)}
                        className="bg-blue-600 px-3 py-1 rounded hover:bg-blue-700"
                      >
                        Set Available
                      </button>
                    )}
                    <button
                      onClick={() => handleDelete(user.id)}
                      className="bg-red-600 px-3 py-1 rounded hover:bg-red-700"
                    >
                      Remove User
                    </button>
                  </td>
                </tr>
              ))}
            {active.length === 0 && (
              <tr>
                <td colSpan={5} className="p-3 text-center text-gray-400">
                  No active users
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </GlobalLayout>
  );
};

export default UsersPage;
