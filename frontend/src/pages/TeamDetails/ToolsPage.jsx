import { motion } from "framer-motion";
import { FiSettings, FiBarChart2, FiUpload, FiDownload, FiFileText, FiEye } from "react-icons/fi";
import { FaVideo, FaChartBar } from "react-icons/fa";

const ToolsPage = () => {
  const tools = [
    {
      id: 1,
      title: "Game Video Upload",
      description: "Upload game footage for analysis and sharing",
      icon: <FaVideo />,
      action: "Upload",
      color: "bg-blue-500",
    },
    {
      id: 2,
      title: "Data Export",
      description: "Export team statistics to Excel or CSV",
      icon: <FiDownload />,
      action: "Export",
      color: "bg-green-500",
    },
    {
      id: 3,
      title: "Data Import",
      description: "Import player rosters from external sources",
      icon: <FiUpload />,
      action: "Import",
      color: "bg-purple-500",
    },
    {
      id: 4,
      title: "Report Generator",
      description: "Create custom performance reports",
      icon: <FaChartBar />,
      action: "Generate",
      color: "bg-yellow-500",
    },
    {
      id: 5,
      title: "Opponent Scouting",
      description: "Analyze upcoming opponents",
      icon: <FiEye />,
      action: "Scout",
      color: "bg-red-500",
    },
    {
      id: 6,
      title: "Practice Planner",
      description: "Create and share practice plans",
      icon: <FiFileText />,
      action: "Plan",
      color: "bg-indigo-500",
    },
  ];

  return (
    <div className="p-8 text-white">
      <h2 className="text-2xl font-bold mb-6">Team Management Tools</h2>
      
      <div className="flex flex-col md:flex-row gap-6 mb-8">
        <div className="bg-white/10 rounded-lg p-6 flex-1">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FiSettings /> Quick Actions
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {tools.map((tool) => (
              <motion.div 
                key={tool.id} 
                className="bg-white/5 rounded-lg p-4 hover:bg-white/10 transition-colors"
                whileHover={{ y: -3 }}
              >
                <div className={`${tool.color} w-12 h-12 rounded-full flex items-center justify-center mb-3`}>
                  {tool.icon}
                </div>
                <h4 className="font-bold text-lg mb-1">{tool.title}</h4>
                <p className="text-gray-400 text-sm mb-3">{tool.description}</p>
                <button className="text-sm bg-white/10 hover:bg-white/20 px-4 py-2 rounded-lg transition-colors">
                  {tool.action}
                </button>
              </motion.div>
            ))}
          </div>
        </div>
        
        <div className="bg-white/10 rounded-lg p-6 w-full md:w-80">
          <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
            <FiBarChart2 /> Recent Activity
          </h3>
          <div className="space-y-4">
            {[
              { icon: <FiUpload />, text: "New game data imported", time: "2 hours ago", color: "text-green-400" },
              { icon: <FaVideo />, text: "Game video uploaded", time: "1 day ago", color: "text-blue-400" },
              { icon: <FaChartBar />, text: "Performance report generated", time: "3 days ago", color: "text-yellow-400" },
            ].map((item, index) => (
              <motion.div 
                key={index}
                className="flex items-start gap-3"
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
              >
                <div className="bg-white/10 p-2 rounded-full">
                  <span className={item.color}>{item.icon}</span>
                </div>
                <div>
                  <p className="font-medium">{item.text}</p>
                  <p className="text-sm text-gray-400">{item.time}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white/10 rounded-lg p-6">
        <h3 className="text-xl font-bold mb-4">Advanced Tools</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {[
            {
              title: "Custom Analytics Dashboard",
              description: "Create a custom dashboard with key metrics",
              button: "Configure Dashboard",
            },
            {
              title: "Player Development Tracker",
              description: "Monitor individual player progress",
              button: "Set Up Tracking",
            },
            {
              title: "Team Communication Hub",
              description: "Centralized messaging for your team",
              button: "Open Communication",
            },
            {
              title: "Season Planning Calendar",
              description: "Plan your entire season with scheduling",
              button: "View Calendar",
            },
          ].map((tool, index) => (
            <motion.div
              key={index}
              className="border border-white/20 rounded-lg p-5 hover:bg-white/5 transition-colors"
              whileHover={{ y: -2 }}
            >
              <h4 className="font-bold mb-2">{tool.title}</h4>
              <p className="text-gray-400 mb-4">{tool.description}</p>
              <button className="bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg transition-colors">
                {tool.button}
              </button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default ToolsPage;