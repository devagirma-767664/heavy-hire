import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { logout } from '../features/auth/authSlice';
import type { RootState } from '../app/store';
import { HiHome, HiUserGroup } from "react-icons/hi";
import { FaPlusCircle, FaEdit, FaFolderOpen } from "react-icons/fa";

const Sidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const linkClasses = (isActive: boolean) =>
    `flex items-center px-3 py-2 rounded transition-colors ${
      isActive
        ? "bg-gray-700 text-yellow-400"
        : "text-gray-300 hover:text-yellow-400"
    }`;

  return (
    <aside className="w-64 bg-gray-900 p-4 flex flex-col justify-between h-screen">
      {/* Profile */}
      <div>
        <div className="flex flex-col items-center mb-15">
          <img
            src="/avatar.png"
            alt="User"
            className="w-20 h-20 rounded-full border-2 border-yellow-400"
          />
          <h2 className="mt-2 text-lg font-bold text-yellow-400">{user?.name}</h2>
          <p className="text-sm text-gray-400">{user?.role}</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          {/* Dashboard */}
          <NavLink
            to="/staff"
            className={({ isActive }) => linkClasses(isActive)}
          >
            <HiHome className="mr-5 text-yellow-400" /> Dashboard
          </NavLink>

          {/* Clients */}
          <NavLink
            to="/staff/clients"
            className={({ isActive }) => linkClasses(isActive)}
          >
            <HiUserGroup className="mr-5 text-yellow-400" /> Clients
          </NavLink>

          {/* Create Contract */}
          <NavLink
            to="/staff/contracts/create"
            className={({ isActive }) => linkClasses(isActive)}
          >
            <FaPlusCircle className="mr-5 text-yellow-400" /> Create Contract
          </NavLink>

          {/* Update Returned Contracts */}
          <NavLink
            to="/staff/contracts/returned"
            className={({ isActive }) => linkClasses(isActive)}
          >
            <FaEdit className="mr-5 text-yellow-400" /> Update Returned
          </NavLink>

          {/* Active Contracts */}
          <NavLink
            to="/staff/contracts/active"
            className={({ isActive }) => linkClasses(isActive)}
          >
            <FaFolderOpen className="mr-5 text-yellow-400" /> Active Contracts
          </NavLink>
        </nav>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="bg-red-600 px-3 py-2 rounded hover:bg-red-700 transition"
      >
        Logout
      </button>
    </aside>
  );
};

export default Sidebar;
