import { useState, useEffect } from 'react';
import { FiSave, FiPlus, FiMinus, FiUsers, FiUser, FiClock} from 'react-icons/fi';

const ScoreKeeperPage = () => {
  const [activeSport, setActiveSport] = useState('football');
  const [matchDetails, setMatchDetails] = useState({
    homeTeam: 'Lions FC',
    awayTeam: 'Sharks United',
    date: '2023-06-15',
    time: '19:45',
    venue: 'National Stadium',
    status: '1st Half',
    timer: '35:24'
  });
  
  // Sample players data
  const [players, setPlayers] = useState([
    { id: 1, name: 'John Doe', number: 10, position: 'Forward', goals: 0, assists: 0, yellowCards: 0, redCard: false },
    { id: 2, name: 'Mike Smith', number: 7, position: 'Midfielder', goals: 0, assists: 0, yellowCards: 0, redCard: false },
    { id: 3, name: 'Alex Johnson', number: 5, position: 'Defender', goals: 0, assists: 0, yellowCards: 0, redCard: false },
    { id: 4, name: 'Sam Wilson', number: 1, position: 'Goalkeeper', goals: 0, assists: 0, yellowCards: 0, redCard: false },
  ]);

  const [teamStats, setTeamStats] = useState({
    goals: 0,
    fouls: 0,
    corners: 0,
    offsides: 0,
    possession: '52%'
  });

  const [opponentStats, setOpponentStats] = useState({
    goals: 0,
    fouls: 0,
    corners: 0,
    offsides: 0
  });

  const [gameEvents, setGameEvents] = useState([]);
  const [note, setNote] = useState('');

  // Sport-specific configurations
  const sportConfigs = {
    football: {
      playerStats: ['goals', 'assists', 'yellowCards', 'redCard'],
      teamStats: ['goals', 'fouls', 'corners', 'offsides', 'possession'],
      eventTypes: ['Goal', 'Assist', 'Yellow Card', 'Red Card', 'Substitution', 'Foul', 'Corner', 'Offside', 'Injury']
    },
    basketball: {
      playerStats: ['points', 'rebounds', 'assists', 'steals', 'blocks', 'fouls'],
      teamStats: ['points', 'rebounds', 'assists', 'turnovers', 'fouls'],
      eventTypes: ['2-Pointer', '3-Pointer', 'Free Throw', 'Rebound', 'Assist', 'Steal', 'Block', 'Turnover', 'Foul', 'Timeout']
    },
    volleyball: {
      playerStats: ['kills', 'blocks', 'aces', 'digs', 'errors'],
      teamStats: ['points', 'aces', 'blocks', 'digs', 'errors'],
      eventTypes: ['Kill', 'Block', 'Ace', 'Dig', 'Error', 'Serve', 'Timeout', 'Rotation']
    }
  };

  const updatePlayerStat = (playerId, stat, value) => {
    setPlayers(players.map(player => {
      if (player.id === playerId) {
        // For toggles like red card
        if (typeof player[stat] === 'boolean') {
          return { ...player, [stat]: !player[stat] };
        }
        // For numeric values
        const newValue = player[stat] + value;
        return { ...player, [stat]: newValue >= 0 ? newValue : 0 };
      }
      return player;
    }));
  };

  const updateTeamStat = (stat, value) => {
    setTeamStats(prev => ({
      ...prev,
      [stat]: typeof prev[stat] === 'number' 
        ? (prev[stat] + value >= 0 ? prev[stat] + value : 0)
        : prev[stat]
    }));
  };

  const updateOpponentStat = (stat, value) => {
    setOpponentStats(prev => ({
      ...prev,
      [stat]: prev[stat] + value >= 0 ? prev[stat] + value : 0
    }));
  };

  const addGameEvent = (type, playerId = null) => {
    const player = playerId ? players.find(p => p.id === playerId) : null;
    const newEvent = {
      id: Date.now(),
      time: matchDetails.timer,
      type,
      player: player ? `${player.name} (#${player.number})` : null,
      note: ''
    };
    setGameEvents([newEvent, ...gameEvents]);
  };

  const saveMatchData = () => {
    // In a real app, this would send data to your backend
    console.log('Saving match data:', {
      matchDetails,
      players,
      teamStats,
      opponentStats,
      gameEvents
    });
    alert('Match data saved successfully!');
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-8">
      <div className="max-w-7xl mx-auto">
        {/* Sport Selection */}
        <div className="mb-8 bg-white rounded-xl shadow-md p-4">
          <h1 className="text-3xl font-bold text-gray-800 mb-6">Score Keeper</h1>
          <div className="flex flex-wrap gap-2 mb-4">
            {Object.keys(sportConfigs).map(sport => (
              <button
                key={sport}
                onClick={() => setActiveSport(sport)}
                className={`px-4 py-2 rounded-lg font-medium capitalize ${activeSport === sport
                  ? 'bg-green-600 text-white'
                  : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
              >
                {/* <FiSports className="inline mr-2" /> */}
                {sport}
              </button>
            ))}
          </div>
        </div>

        {/* Match Header */}
        <div className="bg-white rounded-xl shadow-md p-6 mb-8">
          <div className="flex flex-col md:flex-row justify-between items-center mb-6">
            <div className="text-center md:text-left mb-4 md:mb-0">
              <h2 className="text-2xl font-bold text-gray-800">{matchDetails.homeTeam} vs {matchDetails.awayTeam}</h2>
              <p className="text-gray-600">
                {matchDetails.date} at {matchDetails.time} | {matchDetails.venue}
              </p>
            </div>
            <div className="flex items-center space-x-4">
              <div className="bg-gray-100 px-4 py-2 rounded-lg">
                <span className="font-medium">{matchDetails.status}</span>
                <FiClock className="inline ml-2" /> {matchDetails.timer}
              </div>
              <button 
                className="bg-green-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-green-700 flex items-center"
                onClick={saveMatchData}
              >
                <FiSave className="mr-2" /> Save Match
              </button>
            </div>
          </div>

          {/* Score Display */}
          <div className="grid grid-cols-3 gap-4 text-center py-4 border-t border-b border-gray-200 my-4">
            <div>
              <h3 className="text-xl font-bold">{matchDetails.homeTeam}</h3>
              <p className="text-4xl font-bold text-green-600">{teamStats.goals}</p>
            </div>
            <div className="flex items-center justify-center">
              <span className="text-2xl font-bold text-gray-500">VS</span>
            </div>
            <div>
              <h3 className="text-xl font-bold">{matchDetails.awayTeam}</h3>
              <p className="text-4xl font-bold text-red-600">{opponentStats.goals}</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Player Stats */}
          <div className="lg:col-span-2 bg-white rounded-xl shadow-md overflow-hidden">
            <div className="p-6">
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-bold text-gray-800 flex items-center">
                  <FiUser className="mr-2" /> Player Statistics
                </h2>
                <div className="flex space-x-2">
                  <button 
                    className="bg-gray-100 text-gray-800 px-3 py-1 rounded text-sm font-medium hover:bg-gray-200"
                    onClick={() => {
                      // Reset all player stats
                      setPlayers(players.map(player => ({
                        ...player,
                        goals: 0,
                        assists: 0,
                        yellowCards: 0,
                        redCard: false
                      })));
                    }}
                  >
                    Reset All
                  </button>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">#</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Player</th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Position</th>
                      {sportConfigs[activeSport].playerStats.map(stat => (
                        <th key={stat} scope="col" className="px-6 py-3 text-center text-xs font-medium text-gray-500 uppercase tracking-wider">
                          {stat.split(/(?=[A-Z])/).join(' ')}
                        </th>
                      ))}
                      <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {players.map(player => (
                      <tr key={player.id}>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{player.number}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">{player.name}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">{player.position}</td>
                        
                        {sportConfigs[activeSport].playerStats.map(stat => (
                          <td key={stat} className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                            <div className="flex items-center justify-center space-x-2">
                              {typeof player[stat] === 'boolean' ? (
                                <button
                                  onClick={() => updatePlayerStat(player.id, stat, 0)}
                                  className={`px-2 py-1 rounded text-xs font-medium ${player[stat] ? 'bg-red-100 text-red-800' : 'bg-gray-100 text-gray-800'}`}
                                >
                                  {player[stat] ? 'Yes' : 'No'}
                                </button>
                              ) : (
                                <>
                                  <button 
                                    onClick={() => updatePlayerStat(player.id, stat, -1)}
                                    className="bg-gray-200 text-gray-800 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-300"
                                  >
                                    <FiMinus size={12} />
                                  </button>
                                  <span className="font-medium w-6 text-center">{player[stat]}</span>
                                  <button 
                                    onClick={() => updatePlayerStat(player.id, stat, 1)}
                                    className="bg-gray-200 text-gray-800 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-300"
                                  >
                                    <FiPlus size={12} />
                                  </button>
                                </>
                              )}
                            </div>
                          </td>
                        ))}
                        
                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                          <div className="flex justify-end space-x-2">
                            {sportConfigs[activeSport].eventTypes.slice(0, 3).map(event => (
                              <button
                                key={event}
                                onClick={() => addGameEvent(event, player.id)}
                                className="bg-green-50 text-green-800 px-2 py-1 rounded text-xs font-medium hover:bg-green-100"
                              >
                                {event}
                              </button>
                            ))}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Team Stats and Events */}
          <div className="space-y-8">
            {/* Team Statistics */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4 flex items-center">
                <FiUsers className="mr-2" /> Team Statistics
              </h2>
              
              <div className="space-y-4">
                {sportConfigs[activeSport].teamStats.map(stat => (
                  <div key={stat} className="flex items-center justify-between">
                    <span className="text-gray-700 capitalize">{stat.split(/(?=[A-Z])/).join(' ')}</span>
                    <div className="flex items-center space-x-2">
                      {stat !== 'possession' ? (
                        <>
                          <button 
                            onClick={() => updateTeamStat(stat, -1)}
                            className="bg-gray-200 text-gray-800 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-300"
                          >
                            <FiMinus size={12} />
                          </button>
                          <span className="font-medium w-8 text-center">{teamStats[stat]}</span>
                          <button 
                            onClick={() => updateTeamStat(stat, 1)}
                            className="bg-gray-200 text-gray-800 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-300"
                          >
                            <FiPlus size={12} />
                          </button>
                        </>
                      ) : (
                        <span className="font-medium">{teamStats[stat]}</span>
                      )}
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="mt-6 pt-4 border-t border-gray-200">
                <h3 className="text-lg font-medium text-gray-800 mb-2">Opponent Stats</h3>
                <div className="space-y-4">
                  {sportConfigs[activeSport].teamStats.filter(stat => stat !== 'possession').map(stat => (
                    <div key={`opponent-${stat}`} className="flex items-center justify-between">
                      <span className="text-gray-700 capitalize">{stat.split(/(?=[A-Z])/).join(' ')}</span>
                      <div className="flex items-center space-x-2">
                        <button 
                          onClick={() => updateOpponentStat(stat, -1)}
                          className="bg-gray-200 text-gray-800 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-300"
                        >
                          <FiMinus size={12} />
                        </button>
                        <span className="font-medium w-8 text-center">{opponentStats[stat]}</span>
                        <button 
                          onClick={() => updateOpponentStat(stat, 1)}
                          className="bg-gray-200 text-gray-800 w-6 h-6 rounded flex items-center justify-center hover:bg-gray-300"
                        >
                          <FiPlus size={12} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Game Events */}
            <div className="bg-white rounded-xl shadow-md p-6">
              <h2 className="text-2xl font-bold text-gray-800 mb-4">Game Events</h2>
              
              <div className="mb-4">
                <div className="flex space-x-2 mb-2 flex-wrap">
                  {sportConfigs[activeSport].eventTypes.map(event => (
                    <button
                      key={event}
                      onClick={() => addGameEvent(event)}
                      className="bg-green-50 text-green-800 px-3 py-1 rounded text-sm font-medium hover:bg-green-100 mb-2"
                    >
                      {event}
                    </button>
                  ))}
                </div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  placeholder="Add notes about the match..."
                  className="w-full border border-gray-300 rounded-lg p-2 text-sm"
                  rows="2"
                />
              </div>
              
              <div className="max-h-96 overflow-y-auto">
                {gameEvents.length > 0 ? (
                  <ul className="divide-y divide-gray-200">
                    {gameEvents.map(event => (
                      <li key={event.id} className="py-2">
                        <div className="flex justify-between">
                          <span className="font-medium text-gray-900">{event.type}</span>
                          <span className="text-sm text-gray-500">{event.time}'</span>
                        </div>
                        {event.player && <p className="text-sm text-gray-600">{event.player}</p>}
                        {event.note && <p className="text-sm text-gray-500 mt-1">{event.note}</p>}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-gray-500 text-center py-4">No events recorded yet</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ScoreKeeperPage;