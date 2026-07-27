// src/pages/mechanic/MechanicSidebar.tsx
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, NavLink } from 'react-router-dom';
import { logout } from '../../features/auth/authSlice';
import type { RootState } from '../../app/store';
import { HiHome } from "react-icons/hi";
import { FaTools, FaClipboardCheck } from "react-icons/fa";
import { FaSignOutAlt } from "react-icons/fa";

const MechanicSidebar: React.FC = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/login');
  };

  const linkClasses = (isActive: boolean) =>
    `flex items-center px-3 py-2 rounded transition-colors ${
      isActive ? "bg-gray-700 text-yellow-400 font-semibold" : "text-gray-300 hover:text-yellow-400"
    }`;

  return (
    <aside className="w-64 bg-gray-900 p-4 flex flex-col justify-between h-screen">
      <div>
        {/* Profile section */}
        <div className="flex flex-col items-center mb-6">
          <img src="/avatar.png" alt="User" className="w-20 h-20 rounded-full border-2 border-yellow-400" />
          <h2 className="mt-2 text-lg font-bold text-yellow-400">{user?.name}</h2>
          <p className="text-sm text-gray-400">{user?.role}</p>
        </div>

        {/* Navigation */}
        <nav className="space-y-2">
          <NavLink to="/mechanic" className={({ isActive }) => linkClasses(isActive)}>
            <HiHome className="mr-5 text-yellow-400" /> Dashboard
          </NavLink>
          <NavLink to="/mechanic/maintenance" className={({ isActive }) => linkClasses(isActive)}>
            <FaTools className="mr-5 text-yellow-400" /> Maintenance
          </NavLink>
          <NavLink to="/mechanic/inspection" className={({ isActive }) => linkClasses(isActive)}>
            <FaClipboardCheck className="mr-5 text-yellow-400" /> Inspection
          </NavLink>
        </nav>
      </div>

      {/* Logout */}
      <button
        onClick={handleLogout}
        className="flex items-center justify-center gap-2 bg-red-600 px-3 py-2 rounded hover:bg-red-700 transition text-white"
      >
        <FaSignOutAlt /> Logout
      </button>
    </aside>
  );
};

export default MechanicSidebar;
