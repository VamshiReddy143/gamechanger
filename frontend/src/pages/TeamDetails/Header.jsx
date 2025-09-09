import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { fetchTeamById } from '../../api/teamApi';
import LeftSidebar from './LeftSidebar';
import HomePage from './HomePage';
import SchedulePage from './SchedulePage';
import TeamPage from './TeamPage';
import StatsPage from './StatsPage';
import OpponentsPage from './OpponentsPage';
import ToolsPage from './ToolsPage';
import { motion } from "framer-motion";

// ====================== MAIN COMPONENT ====================== //

const Header = () => {
  const { id } = useParams();
  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState("HOME");

  useEffect(() => {
    const loadTeamData = async () => {
      try {
        const response = await fetchTeamById(id);
        console.log(response.data)
        setTeam(response.data);
      } catch (err) {
        setError(err.message || "Failed to load team data");
      } finally {
        setLoading(false);
      }
    };

    loadTeamData();
  }, [id]);

  if (loading) {
    return <div>Loading team data...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  if (!team) {
    return <div>Team not found</div>;
  }

  const tabContents = {
    HOME: <HomePage />,
    SCHEDULE: <SchedulePage />,
    TEAM: <TeamPage />,
    STATS: <StatsPage />,
    OPPONENTS: <OpponentsPage />,
    TOOLS: <ToolsPage />,
  };

  return (
    <div className="flex h-screen overflow-hidden bg-gradient-to-b from-violet-900 to-violet-700">
      <LeftSidebar activeTab={activeTab} setActiveTab={setActiveTab} team={team}/>
      
      {/* Main content area */}
      <div className="flex-1 ml-[280px] overflow-y-auto bg-[#1a1a1a]">
        {tabContents[activeTab]}
      </div>
    </div>
  );
};

export default Header;