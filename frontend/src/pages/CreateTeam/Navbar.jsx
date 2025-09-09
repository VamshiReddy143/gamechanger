import { motion } from "framer-motion";
import { FiHome, FiHelpCircle, FiDownload, FiUser } from "react-icons/fi";
import { FaCrown } from "react-icons/fa";

const Navbar = ({ isPremium = false }) => {
  return (
    <motion.div 
      className="bg-gradient-to-b from-violet-900 to-violet-700 px-6 py-3 flex items-center justify-between shadow-lg"
      initial={{ y: -100 }}
      animate={{ y: 0 }}
      transition={{ type: "spring", stiffness: 120 }}
    >
      {/* Logo with Premium Badge */}
      <div className="flex items-center gap-2">
        <motion.h1 
          className="font-extrabold text-3xl text-white tracking-tight cursor-pointer"
          whileHover={{ scale: 1.05 }}
        >
          PLAYMAKER
        </motion.h1>
        {isPremium && (
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="bg-yellow-400 rounded-full p-1 flex items-center justify-center"
          >
            <FaCrown className="text-yellow-800 text-xs" />
          </motion.div>
        )}
      </div>

      {/* Navigation Items */}
      <div className="hidden md:flex items-center gap-8">
        {/* Navigation Links */}
        <div className="flex items-center gap-6">
          <motion.div 
            className="relative group"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-1 text-violet-200 font-medium cursor-pointer hover:text-white">
              <FiHome className="text-lg" />
              <span>Home</span>
            </div>
            <div className="absolute bottom-0 left-0 h-0.5 bg-violet-400 w-0 group-hover:w-full transition-all duration-300" />
          </motion.div>

          <motion.div 
            className="relative group"
            whileHover={{ y: -2 }}
          >
            <div className="flex items-center gap-1 text-violet-200 font-medium cursor-pointer hover:text-white">
              <FiHelpCircle className="text-lg" />
              <span>Support</span>
            </div>
            <div className="absolute bottom-0 left-0 h-0.5 bg-violet-400 w-0 group-hover:w-full transition-all duration-300" />
          </motion.div>
        </div>

        {/* User Profile */}
        <motion.div 
          className="flex items-center gap-2 bg-white/10 backdrop-blur-sm px-3 py-1.5 rounded-full cursor-pointer"
          whileHover={{ backgroundColor: "rgba(255,255,255,0.2)" }}
        >
          <div className="bg-black p-2 rounded-full">
            <h1 className="text-white font-semibold text-sm">VM</h1>
          </div>
          <p className="font-medium text-violet-200 text-sm hidden lg:block hover:text-white">
            vamshireddy19421@gmail.com
          </p>
          <FiUser className="text-violet-200 ml-1 hover:text-white" />
        </motion.div>

        {/* Action Buttons */}
        <div className="flex items-center gap-3">
          <motion.button 
            className="font-medium text-sm border border-violet-400 text-violet-200 bg-white/10 px-4 py-1.5 rounded-full hover:bg-white/20 hover:text-white transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            <div className="flex items-center gap-1">
              <FiDownload />
              <span>Get the App</span>
            </div>
          </motion.button>

          <motion.button 
            className="font-medium text-sm border border-violet-400 text-violet-900 bg-violet-400 px-4 py-1.5 rounded-full hover:bg-violet-300 transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            Try for free
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button className="md:hidden text-violet-200 hover:text-white">
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
    </motion.div>
  );
};

export default Navbar;