import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck, FiUser } from "react-icons/fi";
import { getPlayersByTeam, addPlayer, updatePlayer, deletePlayer } from '../../api/teamApi';
import { getStaffByTeam, addStaff, updateStaff, deleteStaff } from '../../api/teamApi';
import teamAnimation from "../../animations/empty1.json";
import AddPlayerModal from "../../components/Modals/AddPlayerModal";
import AddStaffModal from "../../components/Modals/AddStaffModal";
import { toast } from 'react-toastify';

const TeamPage = () => {
  const [showAddPlayerModal, setShowAddPlayerModal] = useState(false);
  const [showAddStaffModal, setShowAddStaffModal] = useState(false);
  const [players, setPlayers] = useState([]);
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingPlayer, setEditingPlayer] = useState(null);
  const [editingStaff, setEditingStaff] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const [activeTab, setActiveTab] = useState('players');
  const { id: teamId } = useParams();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        if (activeTab === 'players') {
          const playersData = await getPlayersByTeam(teamId);
          setPlayers(playersData);
        } else {
          const staffData = await getStaffByTeam(teamId);
          setStaff(staffData);
        }
        setError(null);
      } catch (err) {
        console.error(`Failed to fetch ${activeTab}:`, err);
        setError(`Failed to load ${activeTab}. Please try again.`);
        toast.error(`Failed to load ${activeTab}`);
      } finally {
        setLoading(false);
      }
    };
    
    fetchData();
  }, [teamId, activeTab]);

  const handleAddPlayer = async (newPlayer) => {
    try {
      const playerWithTeam = { ...newPlayer, teamId };
      const savedPlayer = await addPlayer(playerWithTeam);
      setPlayers([...players, savedPlayer]);
      setShowAddPlayerModal(false);
      toast.success('Player added successfully');
    } catch (error) {
      console.error('Failed to add player:', error);
      toast.error('Failed to add player');
    }
  };

  const handleUpdatePlayer = async (playerData) => {
    try {
      const updatedPlayer = await updatePlayer(editingPlayer._id, playerData);
      setPlayers(players.map(player => 
        player._id === updatedPlayer._id ? updatedPlayer : player
      ));
      setEditingPlayer(null);
      toast.success('Player updated successfully');
    } catch (error) {
      console.error('Failed to update player:', error);
      toast.error('Failed to update player');
    }
  };

  const handleDeletePlayer = async (playerId) => {
    try {
      await deletePlayer(playerId);
      setPlayers(players.filter(player => player._id !== playerId));
      setConfirmDeleteId(null);
      toast.success('Player deleted successfully');
    } catch (error) {
      console.error('Failed to delete player:', error);
      toast.error('Failed to delete player');
    }
  };

  const handleAddStaff = async (newStaff) => {
    try {
      const staffWithTeam = { ...newStaff, teamId };
      const savedStaff = await addStaff(staffWithTeam);
      setStaff([...staff, savedStaff]);
      setShowAddStaffModal(false);
      toast.success('Staff added successfully');
    } catch (error) {
      console.error('Failed to add staff:', error);
      toast.error('Failed to add staff');
    }
  };

  const handleUpdateStaff = async (staffData) => {
    try {
      const updatedStaff = await updateStaff(editingStaff._id, staffData);
      setStaff(staff.map(staffMember => 
        staffMember._id === updatedStaff._id ? updatedStaff : staffMember
      ));
      setEditingStaff(null);
      toast.success('Staff updated successfully');
    } catch (error) {
      console.error('Failed to update staff:', error);
      toast.error('Failed to update staff');
    }
  };

  const handleDeleteStaff = async (staffId) => {
    try {
      await deleteStaff(staffId);
      setStaff(staff.filter(staffMember => staffMember._id !== staffId));
      setConfirmDeleteId(null);
      toast.success('Staff deleted successfully');
    } catch (error) {
      console.error('Failed to delete staff:', error);
      toast.error('Failed to delete staff');
    }
  };

  if (loading) {
    return (
      <div className="p-8 text-white flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-8 text-white flex flex-col items-center justify-center min-h-[400px]">
        <div className="text-red-400 mb-4">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
        </div>
        <h3 className="text-xl font-bold text-white mb-2">Error Loading {activeTab === 'players' ? 'Players' : 'Staff'}</h3>
        <p className="text-white/80 mb-4">{error}</p>
        <button 
          onClick={() => window.location.reload()}
          className="px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded text-white"
        >
          Try Again
        </button>
      </div>
    );
  }

  const renderPlayersTab = () => (
    <>
      {players.length > 0 ? (
        <div className="bg-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/20">
                <tr>
                  <th className="py-3 px-4 text-left">Player</th>
                  <th className="py-3 px-4 text-left">Position</th>
                  <th className="py-3 px-4 text-center">Jersey</th>
                  <th className="py-3 px-4 text-left">Contact</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {players.map((player) => (
                  <tr key={player._id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/20 p-2 rounded-full">
                          <FiUser className="text-violet-400" />
                        </div>
                        <div>
                          <p className="font-medium">{player.firstName} {player.lastName}</p>
                          <p className="text-sm text-gray-400">{player.birthDate}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="bg-blue-500/20 text-blue-400 px-2 py-1 rounded-full text-xs">
                        {player.position || '-'}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-center">
                      {player.jerseyNumber ? (
                        <span className="bg-white/10 px-2.5 py-1 rounded-full font-medium">
                          {player.jerseyNumber}
                        </span>
                      ) : (
                        '-'
                      )}
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm">{player.parentEmail || '-'}</p>
                      {player.parentPhone && (
                        <p className="text-sm text-gray-400">{player.parentPhone}</p>
                      )}
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        {confirmDeleteId === player._id ? (
                          <div className="flex gap-1 bg-red-500/20 rounded-lg overflow-hidden">
                            <button 
                              onClick={() => handleDeletePlayer(player._id)}
                              className="p-2 text-red-400 hover:bg-red-500/30"
                              title="Confirm delete"
                            >
                              <FiCheck />
                            </button>
                            <button 
                              onClick={() => setConfirmDeleteId(null)}
                              className="p-2 text-gray-300 hover:bg-gray-500/30"
                              title="Cancel"
                            >
                              <FiX />
                            </button>
                          </div>
                        ) : (
                          <>
                            <button 
                              onClick={() => {
                                setEditingPlayer(player);
                                setShowAddPlayerModal(true);
                              }}
                              className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg"
                              title="Edit player"
                            >
                              <FiEdit2 />
                            </button>
                            <button 
                              onClick={() => setConfirmDeleteId(player._id)}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                              title="Delete player"
                            >
                              <FiTrash2 />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Lottie
            animationData={teamAnimation}
            loop={true}
            style={{ width: 250, height: 250 }}
          />
          <p className="font-bold text-xl text-gray-400 mt-4">No players added yet</p>
          <p className="text-gray-500">Add your first player to get started</p>
        </div>
      )}
    </>
  );

  const renderStaffTab = () => (
    <>
      {staff.length > 0 ? (
        <div className="bg-white/10 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-white/20">
                <tr>
                  <th className="py-3 px-4 text-left">Staff Member</th>
                  <th className="py-3 px-4 text-left">Email</th>
                  <th className="py-3 px-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody>
                {staff.map((staffMember) => (
                  <tr key={staffMember._id} className="border-b border-white/10 hover:bg-white/5">
                    <td className="py-3 px-4">
                      <div className="flex items-center gap-3">
                        <div className="bg-primary/20 p-2 rounded-full">
                          <FiUser className="text-violet-400" />
                        </div>
                        <div>
                          <p className="font-medium">{staffMember.firstName} {staffMember.lastName}</p>
                        </div>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <p className="text-sm">{staffMember.staffEmail || '-'}</p>
                    </td>
                    <td className="py-3 px-4 text-right">
                      <div className="flex justify-end gap-2">
                        {confirmDeleteId === staffMember._id ? (
                          <div className="flex gap-1 bg-red-500/20 rounded-lg overflow-hidden">
                            <button 
                              onClick={() => handleDeleteStaff(staffMember._id)}
                              className="p-2 text-red-400 hover:bg-red-500/30"
                              title="Confirm delete"
                            >
                              <FiCheck />
                            </button>
                            <button 
                              onClick={() => setConfirmDeleteId(null)}
                              className="p-2 text-gray-300 hover:bg-gray-500/30"
                              title="Cancel"
                            >
                              <FiX />
                            </button>
                          </div>
                        ) : (
                          <>
                            <button 
                              onClick={() => {
                                setEditingStaff(staffMember);
                                setShowAddStaffModal(true);
                              }}
                              className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg"
                              title="Edit staff"
                            >
                              <FiEdit2 />
                            </button>
                            <button 
                              onClick={() => setConfirmDeleteId(staffMember._id)}
                              className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                              title="Delete staff"
                            >
                              <FiTrash2 />
                            </button>
                          </>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Lottie
            animationData={teamAnimation}
            loop={true}
            style={{ width: 250, height: 250 }}
          />
          <p className="font-bold text-xl text-gray-400 mt-4">No staff members added yet</p>
          <p className="text-gray-500">Add your first staff member to get started</p>
        </div>
      )}
    </>
  );

  return (
    <div className="p-8 text-white">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h2 className="text-2xl font-bold">Team</h2>
          <div className="flex gap-4 mt-2">
            <button 
              className={`${activeTab === 'players' ? 'text-violet-400 font-medium border-b-2 border-violet-400' : 'text-gray-400 hover:text-white'} pb-1`}
              onClick={() => setActiveTab('players')}
            >
              Players
            </button>
            <button 
              className={`${activeTab === 'staff' ? 'text-violet-400 font-medium border-b-2 border-violet-400' : 'text-gray-400 hover:text-white'} pb-1`}
              onClick={() => setActiveTab('staff')}
            >
              Staff
            </button>
          </div>
        </div>
        <motion.button 
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          onClick={() => {
            if (activeTab === 'players') {
              setEditingPlayer(null);
              setShowAddPlayerModal(true);
            } else {
              setEditingStaff(null);
              setShowAddStaffModal(true);
            }
          }}
        >
          <FiPlus />
          <span>Add {activeTab === 'players' ? 'Player' : 'Staff'}</span>
        </motion.button>
      </div>

      {activeTab === 'players' ? renderPlayersTab() : renderStaffTab()}

      <AnimatePresence>
        {showAddPlayerModal && (
          <AddPlayerModal
            isOpen={showAddPlayerModal}
            onClose={() => {
              setShowAddPlayerModal(false);
              setEditingPlayer(null);
            }}
            onAddPlayer={editingPlayer ? handleUpdatePlayer : handleAddPlayer}
            player={editingPlayer}
          />
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddStaffModal && (
          <AddStaffModal
            isOpen={showAddStaffModal}
            onClose={() => {
              setShowAddStaffModal(false);
              setEditingStaff(null);
            }}
            onAddStaff={editingStaff ? handleUpdateStaff : handleAddStaff}
            staff={editingStaff}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default TeamPage;