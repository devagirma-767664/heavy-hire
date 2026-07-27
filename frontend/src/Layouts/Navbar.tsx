import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import type { RootState, AppDispatch } from '../app/store';
import { fetchNotifications, markNotificationRead, deleteNotification } from '../features/notifications/notificationsThunks';

const Navbar: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const { list: notifications } = useSelector((state: RootState) => state.notifications);
  const user = useSelector((state: RootState) => state.auth.user);

  const unreadCount = notifications.filter(n => !n.read).length;
  const [open, setOpen] = useState(false);
  

  useEffect(() => {
  dispatch(fetchNotifications());
  const interval = setInterval(() => {
    dispatch(fetchNotifications());
  }, 30000); 
  return () => clearInterval(interval);
  }, [dispatch]);


  useEffect(() => {
  if (open) {
    notifications
      .filter(n => !n.read)
      .forEach(n => dispatch(markNotificationRead(n.id)));
  }
}, [open, notifications, dispatch]);



  return (
    <header className="flex items-center justify-between bg-gray-900 px-6 py-3 shadow-lg ml-0">
      {/* Left: Welcome + Name */}
      <h1 className="text-2xl font-bold text-yellow-400">
        👋 Welcome, {user?.name || 'Guest'}
      </h1>

      {/* Right: Notifications */}
      <div className="flex items-center space-x-6 mr-10">
        <div className="relative">
          <button
            className="relative text-2xl"
            onClick={() => setOpen(!open)}
          >
            🔔
            {unreadCount > 0 && !open && (
              <span className="absolute -top-1 -right-2 bg-red-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Dropdown */}
          {open && (
            <div className="absolute right-0 mt-2 w-80 max-h-96 overflow-y-auto bg-gray-900 rounded-lg shadow-lg p-4 z-50">
              {notifications.length === 0 ? (
                <p className="text-gray-400 text-sm">No notifications</p>
              ) : (
                notifications.map((n) => (
                  <div
                    key={n.id}
                    className="flex justify-between items-center border-b border-gray-700 py-2"
                  >
                    <p
                      className={`text-sm ${
                        n.type === 'contract_approved'
                          ? 'text-green-400 font-semibold'
                          : n.type === 'contract_rejected'
                          ? 'text-red-400 font-semibold'
                          : n.type === 'contract_returned'
                          ? 'text-yellow-400 font-semibold'
                          : n.type === 'operator_assigned'
                          ? 'text-blue-400 font-semibold'
                          : 'text-gray-300'
                      }`}
                    >
                      {n.message}
                    </p>
                    <div className="space-x-2">
                      
                      <button
                        onClick={() => dispatch(deleteNotification(n.id))}
                        className="bg-red-500 text-black px-2 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                ))
              )}
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
