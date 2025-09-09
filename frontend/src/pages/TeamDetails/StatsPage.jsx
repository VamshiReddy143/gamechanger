import { useState } from "react";
import { motion } from "framer-motion";
import Lottie from "lottie-react";
import { FaFutbol, FaBasketballBall, FaRunning } from "react-icons/fa";
import { Bar, Pie } from "react-chartjs-2";
import { Chart, registerables } from "chart.js";
import statsAnimation from "../../animations/stats.json";

// Register Chart.js components
Chart.register(...registerables);

const StatsPage = () => {
  const [activeStatsTab, setActiveStatsTab] = useState("TEAM");

  // Sample data - replace with API calls in production
  const teamStats = {
    wins: 12,
    losses: 5,
    draws: 3,
    goalsScored: 42,
    goalsConceded: 18,
    cleanSheets: 8,
    avgPossession: 58.3,
    shotsPerGame: 14.2,
    passingAccuracy: 82.7,
  };

  const playerStats = [
    {
      id: 1,
      name: "John Doe",
      position: "Forward",
      goals: 15,
      assists: 8,
      shots: 62,
      shotsOnTarget: 34,
      passingAccuracy: 78.2,
      tackles: 12,
      yellowCards: 2,
      redCards: 0,
    },
    {
      id: 2,
      name: "Mike Smith",
      position: "Midfielder",
      goals: 5,
      assists: 12,
      shots: 28,
      shotsOnTarget: 14,
      passingAccuracy: 85.6,
      tackles: 42,
      yellowCards: 3,
      redCards: 0,
    },
    {
      id: 3,
      name: "David Johnson",
      position: "Defender",
      goals: 2,
      assists: 4,
      shots: 8,
      shotsOnTarget: 3,
      passingAccuracy: 83.1,
      tackles: 58,
      yellowCards: 5,
      redCards: 1,
    },
  ];

  // Chart configurations
  const resultsChartData = {
    labels: ["Wins", "Losses", "Draws"],
    datasets: [{
      data: [teamStats.wins, teamStats.losses, teamStats.draws],
      backgroundColor: [
        "rgba(75, 192, 192, 0.6)",
        "rgba(255, 99, 132, 0.6)",
        "rgba(255, 206, 86, 0.6)",
      ],
      borderColor: [
        "rgba(75, 192, 192, 1)",
        "rgba(255, 99, 132, 1)",
        "rgba(255, 206, 86, 1)",
      ],
      borderWidth: 1,
    }],
  };

  const goalsChartData = {
    labels: ["Goals Scored", "Goals Conceded"],
    datasets: [{
      data: [teamStats.goalsScored, teamStats.goalsConceded],
      backgroundColor: [
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 99, 132, 0.6)",
      ],
      borderColor: [
        "rgba(54, 162, 235, 1)",
        "rgba(255, 99, 132, 1)",
      ],
      borderWidth: 1,
    }],
  };

  const topScorersData = {
    labels: playerStats.map(p => p.name),
    datasets: [{
      data: playerStats.map(p => p.goals),
      backgroundColor: [
        "rgba(255, 99, 132, 0.6)",
        "rgba(54, 162, 235, 0.6)",
        "rgba(255, 206, 86, 0.6)",
      ],
      borderColor: [
        "rgba(255, 99, 132, 1)",
        "rgba(54, 162, 235, 1)",
        "rgba(255, 206, 86, 1)",
      ],
      borderWidth: 1,
    }],
  };

  const renderStatCard = (icon, title, value, unit = "", color = "violet") => {
    const colors = {
      violet: "bg-primary",
      green: "bg-green-500",
      blue: "bg-blue-500",
      red: "bg-red-500",
      yellow: "bg-yellow-500",
    };

    return (
      <motion.div 
        className="bg-white/10 rounded-lg p-4 flex items-center gap-4"
        whileHover={{ y: -2 }}
      >
        <div className={`${colors[color]} p-3 rounded-full`}>{icon}</div>
        <div>
          <p className="text-sm text-gray-300">{title}</p>
          <p className="text-2xl font-bold">
            {value}
            {unit && <span className="text-sm ml-1">{unit}</span>}
          </p>
        </div>
      </motion.div>
    );
  };

  if (playerStats.length === 0) {
    return (
      <div className="p-8 text-white flex flex-col items-center justify-center">
        <h2 className="text-2xl font-bold mb-4">Statistics</h2>
        <Lottie animationData={statsAnimation} loop={true} style={{ width: 250, height: 250 }} />
        <p className="font-bold text-[20px] text-gray-600 mt-4">
          NO STATISTICS AVAILABLE YET
        </p>
        <p className="text-gray-500 mt-2">
          Statistics will appear after your first game
        </p>
      </div>
    );
  }

  return (
    <div className="p-8 text-white">
      <h2 className="text-2xl font-bold mb-6">Statistics</h2>
      
      <div className="flex gap-4 mb-8 border-b border-white/20 pb-2">
        {["TEAM", "PLAYERS"].map((tab) => (
          <motion.button
            key={tab}
            onClick={() => setActiveStatsTab(tab)}
            className={`pb-1 px-3 font-medium relative ${
              activeStatsTab === tab ? "text-violet-400" : "text-gray-400 hover:text-white"
            }`}
            whileHover={{ scale: 1.05 }}
          >
            {tab}
            {activeStatsTab === tab && (
              <motion.div 
                className="absolute bottom-0 left-0 right-0 h-0.5 bg-violet-400"
                layoutId="statsTabIndicator"
              />
            )}
          </motion.button>
        ))}
      </div>

      {activeStatsTab === "TEAM" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-bold mb-4">Season Overview</h3>
          
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
            {renderStatCard(<FaFutbol />, "Wins", teamStats.wins, "", "green")}
            {renderStatCard(<FaFutbol />, "Losses", teamStats.losses, "", "red")}
            {renderStatCard(<FaFutbol />, "Draws", teamStats.draws, "", "yellow")}
            {renderStatCard(<FaBasketballBall />, "Goals Scored", teamStats.goalsScored, "", "green")}
            {renderStatCard(<FaBasketballBall />, "Goals Conceded", teamStats.goalsConceded, "", "red")}
            {renderStatCard(<FaRunning />, "Clean Sheets", teamStats.cleanSheets, "", "blue")}
            {renderStatCard(<FaRunning />, "Avg. Possession", teamStats.avgPossession, "%", "violet")}
            {renderStatCard(<FaRunning />, "Shots/Game", teamStats.shotsPerGame, "", "violet")}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <div className="bg-white/10 p-4 rounded-lg">
              <h4 className="font-bold mb-4">Match Results</h4>
              <Pie data={resultsChartData} />
            </div>
            <div className="bg-white/10 p-4 rounded-lg">
              <h4 className="font-bold mb-4">Goals</h4>
              <Bar data={goalsChartData} />
            </div>
          </div>

          <div className="bg-white/10 rounded-lg overflow-hidden">
            <table className="w-full">
              <thead className="bg-white/20">
                <tr>
                  <th className="py-3 px-4 text-left">Statistic</th>
                  <th className="py-3 px-4 text-right">Value</th>
                </tr>
              </thead>
              <tbody>
                {Object.entries(teamStats).map(([key, value]) => (
                  <tr key={key} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-4 capitalize">
                      {key.replace(/([A-Z])/g, " $1").trim()}
                    </td>
                    <td className="py-3 px-4 text-right">
                      {typeof value === "number" && key.includes("Accuracy")
                        ? `${value}%`
                        : value}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}

      {activeStatsTab === "PLAYERS" && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
        >
          <h3 className="text-xl font-bold mb-4">Player Statistics</h3>
          
          <div className="bg-white/10 p-4 rounded-lg mb-8">
            <h4 className="font-bold mb-4">Top Scorers</h4>
            <Bar data={topScorersData} />
          </div>

          <div className="overflow-x-auto">
            <table className="w-full bg-white/10 rounded-lg overflow-hidden">
              <thead className="bg-white/20">
                <tr>
                  <th className="py-3 px-4 text-left">Player</th>
                  <th className="py-3 px-4 text-left">Position</th>
                  <th className="py-3 px-4 text-right">Goals</th>
                  <th className="py-3 px-4 text-right">Assists</th>
                  <th className="py-3 px-4 text-right">Shots</th>
                  <th className="py-3 px-4 text-right">SOT</th>
                  <th className="py-3 px-4 text-right">Pass %</th>
                  <th className="py-3 px-4 text-right">Tackles</th>
                </tr>
              </thead>
              <tbody>
                {playerStats.map((player) => (
                  <tr key={player.id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-4 font-medium">{player.name}</td>
                    <td className="py-3 px-4">{player.position}</td>
                    <td className="py-3 px-4 text-right">{player.goals}</td>
                    <td className="py-3 px-4 text-right">{player.assists}</td>
                    <td className="py-3 px-4 text-right">{player.shots}</td>
                    <td className="py-3 px-4 text-right">{player.shotsOnTarget}</td>
                    <td className="py-3 px-4 text-right">{player.passingAccuracy}%</td>
                    <td className="py-3 px-4 text-right">{player.tackles}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default StatsPage;