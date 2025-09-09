import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiHome, FiCalendar, FiUsers, FiBarChart2, FiFlag, FiSettings, FiLogOut } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";
import Lottie from "lottie-react";
import trophyAnimation from "../../animations/trophy.json";
import { sports } from '../../constants/sports';

const LeftSidebar = ({ activeTab, setActiveTab, team }) => {
  const [teamScore, setTeamScore] = useState({ wins: 0, losses: 0 });
  const [isPremium, setIsPremium] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  const sportIcon = sports.find((s) => s.name === team?.sport)?.icons || "/bb.svg";

  useEffect(() => {
    // Simulate data loading
    const timer = setTimeout(() => {
      setTeamScore({ wins: 12, losses: 5 });
      setIsPremium(true);
    }, 1500);

    return () => clearTimeout(timer);
  }, []);

  const tabs = [
    { id: "HOME", icon: <FiHome />, label: "Home" },
    { id: "SCHEDULE", icon: <FiCalendar />, label: "Schedule" },
    { id: "TEAM", icon: <FiUsers />, label: "Team" },
    { id: "STATS", icon: <FiBarChart2 />, label: "Stats" },
    { id: "OPPONENTS", icon: <FiFlag />, label: "Opponents" },
    { id: "TOOLS", icon: <FiSettings />, label: "Tools" },
  ];

  return (
    <motion.div 
      className="bg-gradient-to-b from-violet-900 to-violet-700 p-6 w-[280px] h-screen fixed flex flex-col shadow-xl overflow-y-auto"
      initial={{ x: -300 }}
      animate={{ x: 0 }}
      transition={{ type: "spring", stiffness: 100 }}
    >
      {/* Team Header */}
      <motion.div 
        className="flex items-center gap-4 mb-8"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.2 }}
      >
        <motion.div 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="relative"
        >
          <img 
            src={sportIcon} 
            className="h-16 w-16 bg-white rounded-full p-2 border-2 border-white shadow-lg" 
            alt="Team Logo"
          />
          {isPremium && (
            <motion.div
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              transition={{ delay: 0.5 }}
              className="absolute -top-2 -right-2 bg-yellow-400 rounded-full p-1 shadow-md"
            >
              <FaCrown className="text-yellow-800 text-xs" />
            </motion.div>
          )}
        </motion.div>
        <div>
          <h1 className="text-xl font-bold text-white">{team?.teamName || "Team"}</h1>
          <p className="text-sm text-violet-200">
            <span className="font-medium">Coach:</span> {team?.createdBy?.name}
          </p>
        </div>
      </motion.div>

      {/* Season Record */}
      <motion.div 
        className="bg-white/10 backdrop-blur-sm rounded-xl p-4 mb-6 border border-white/20 shadow-lg"
        whileHover={{ y: -2 }}
        transition={{ type: "spring", stiffness: 300 }}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
     
      >
        <div className="flex justify-between items-center mb-2">
          <span className="text-sm font-medium text-violet-200">{team?.season}</span>
          <span className="text-xs bg-violet-600 text-white px-2 py-1 rounded-full">
            Active
          </span>
        </div>
        <div className="flex items-center justify-center gap-2 mb-2">
          <Lottie
            animationData={trophyAnimation}
            loop={true}
            style={{ width: 60, height: 60 }}
          />
        </div>
        <div className="flex justify-between">
          <div className="text-center">
            <motion.p 
              className="text-3xl font-bold text-white"
              key={`wins-${teamScore.wins}`}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              {teamScore.wins}
            </motion.p>
            <p className="text-xs text-violet-200">Wins</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold text-white opacity-50">-</p>
          </div>
          <div className="text-center">
            <motion.p 
              className="text-3xl font-bold text-white"
              key={`losses-${teamScore.losses}`}
              initial={{ scale: 0.5 }}
              animate={{ scale: 1 }}
              transition={{ type: "spring", stiffness: 500 }}
            >
              {teamScore.losses}
            </motion.p>
            <p className="text-xs text-violet-200">Losses</p>
          </div>
        </div>
      </motion.div>

      {/* Location */}
      <motion.div 
        className="bg-white/5 rounded-lg p-3 mb-6 text-center"
        whileHover={{ scale: 1.02 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.4 }}
      >
        <p className="text-sm text-violet-200 font-medium">
         {team?.location}
        </p>
      </motion.div>

      {/* Navigation Tabs */}
      <nav className="flex-1">
        <ul className="space-y-2">
          {tabs.map((tab) => (
            <motion.li 
              key={tab.id}
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 * tabs.indexOf(tab) + 0.5 }}
            >
              <motion.button
                className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all ${
                  activeTab === tab.id
                    ? "bg-white/20 text-white shadow-md"
                    : "text-violet-200 hover:bg-white/10"
                }`}
                onClick={() => setActiveTab(tab.id)}
                whileHover={{ x: 5 }}
                whileTap={{ scale: 0.98 }}
              >
                <span className="text-lg">{tab.icon}</span>
                <span className="font-medium">{tab.label}</span>
                {activeTab === tab.id && (
                  <motion.span
                    className="ml-auto h-2 w-2 bg-white rounded-full"
                    layoutId="activeTabIndicator"
                    transition={{ type: "spring", stiffness: 500 }}
                  />
                )}
              </motion.button>
            </motion.li>
          ))}
        </ul>
      </nav>

      {/* Upgrade Button */}
      <AnimatePresence>
        {!isPremium && (
          <motion.div
            className="mt-auto mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ delay: 1 }}
          >
            <motion.button
              className="w-full bg-gradient-to-r from-yellow-500 to-yellow-600 text-white font-medium py-3 px-4 rounded-lg flex items-center justify-center gap-2 shadow-lg relative"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onHoverStart={() => setIsHovered(true)}
              onHoverEnd={() => setIsHovered(false)}
            >
              <FaCrown />
              <span>Upgrade to Premium</span>
              {isHovered && (
                <motion.span 
                  className="absolute -top-2 -right-2 bg-white text-yellow-600 text-xs font-bold px-2 py-1 rounded-full shadow-md"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                >
                  +10 Features
                </motion.span>
              )}
            </motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Logout */}
      <motion.button
        className="flex items-center gap-2 text-violet-300 hover:text-white mt-4 text-sm mb-6"
        whileHover={{ x: 3 }}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.2 }}
      >
        <FiLogOut />
        <span>Sign Out</span>
      </motion.button>
    </motion.div>
  );
};

export default LeftSidebar;