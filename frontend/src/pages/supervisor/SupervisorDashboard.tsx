import React, { useEffect } from "react";
import { useAppDispatch, useAppSelector } from "../../hooks/useTaskForm";
import GlobalLayout from "../../Layouts/GlobalLayout";
import { fetchContracts } from "../../features/contracts/contractsThunks";
import { fetchMachines } from "../../features/machines/machinesThunks";
import { fetchActiveUsers } from "../../features/users/usersThunks";
import type { RootState } from "../../app/store";
import { motion } from "framer-motion";
import { FaCogs, FaFileContract, FaUsers, FaClipboardCheck } from "react-icons/fa";
import { GiBulldozer } from "react-icons/gi"; // ✅ Bulldozer only
import MachinesSection from "../../Layouts/MachinesSection";

const SupervisorDashboard: React.FC = () => {
  const dispatch = useAppDispatch();

  // ✅ Pull data from slices
  const { list: contracts } = useAppSelector((state: RootState) => state.contracts);
  const { list: machines } = useAppSelector((state: RootState) => state.machines);
  const { active: users } = useAppSelector((state: RootState) => state.users);

  useEffect(() => {
    // ✅ Dispatch all thunks so slices are populated
    dispatch(fetchContracts() as any);
    dispatch(fetchMachines() as any);
    dispatch(fetchActiveUsers() as any);
  }, [dispatch]);

  // ✅ Correct counts
  const totalMachines = machines.length;
  const activeContracts = contracts.filter((c) => c.status?.toLowerCase() === "active").length;
  const completedContracts = contracts.filter(
    (c) => c.status?.toLowerCase() === "completed" || c.status?.toLowerCase() === "complete"
  ).length;
  const totalEmployees = users.filter((u) => u.approved).length;

  const summaryCards = [
    { label: "Total Machines", value: totalMachines, icon: <FaCogs /> },
    { label: "Active Contracts", value: activeContracts, icon: <FaFileContract /> },
    { label: "Completed Contracts", value: completedContracts, icon: <FaClipboardCheck /> },
    { label: "Active Employees", value: totalEmployees, icon: <FaUsers /> },
  ];

  return (
    <GlobalLayout>
      <div className="p-10 max-w-6xl mx-auto">
        {/* ✅ Shared background block */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2 }}
          className="bg-gradient-to-r from-gray-700 via-gray-800 to-gray-700 rounded-xl shadow-xl p-8 mb-10"
        >
          {/* 🚜 Bulldozer animation */}
          <motion.div
            initial={{ x: -250, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 1, ease: "easeOut" }}
            className="flex justify-center mb-6"
          >
            <GiBulldozer className="text-yellow-400 text-6xl drop-shadow-lg" />
          </motion.div>

          {/* Animated Title */}
          <motion.h2
            initial={{ opacity: 0, y: -40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1, delay: 0.5 }}
            className="text-4xl font-extrabold text-center mb-8 bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent drop-shadow-lg tracking-wide"
          >
            ABYSINIA HEAVY HIRE
          </motion.h2>

          {/* Summary Cards */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            {summaryCards.map((card, idx) => (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 40 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.8, delay: 1 + idx * 0.2 }}
                className="bg-gray-600 rounded-lg shadow-md p-6 flex flex-col items-center hover:scale-105 transition-transform"
              >
                <div className="text-3xl text-yellow-400 mb-2">{card.icon}</div>
                <div className="text-2xl font-bold text-white">{card.value}</div>
                <p className="text-gray-400 mt-1">{card.label}</p>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* ✅ Keep everything else below as it is */}
        <MachinesSection />
      </div>
    </GlobalLayout>
  );
};

export default SupervisorDashboard;
