import axios from 'axios';

const API_URL = `${import.meta.env.VITE_API_BASE_URL}/teams`;
const EVENTS_API_URL = `${import.meta.env.VITE_API_BASE_URL}/events`;
const PLAYERS_API_URL = `${import.meta.env.VITE_API_BASE_URL}/players`;
const STAFF_API_URL = `${import.meta.env.VITE_API_BASE_URL}/staff`;
const STREAMS_API_URL = `${import.meta.env.VITE_API_BASE_URL}/streams`;

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || '',
 withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  }
});

api.interceptors.request.use(
  (config) => {
    // Check if we have a token in localStorage (for Bearer auth)
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    // For cookie-based auth, the cookie is automatically sent with credentials: true
    return config;
  },
  (error) => Promise.reject(error)
);

api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Clear all auth data
      localStorage.removeItem('user');
      localStorage.removeItem('token');
      document.cookie = 'token=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;';
      
      // Redirect to login
      window.location.href = "/login";
    }
    return Promise.reject(error);
  }
);

// Team operations
export const fetchTeams = async (searchQuery = '') => {
  try {
    const response = await api.get('/teams', { params: { search: searchQuery } });
    return response.data;
  } catch (error) {
    console.error('Error fetching teams:', error);
    throw error;
  }
};

export const createNewTeam = async (teamData) => {
  try {
    const response = await api.post('/teams/create', teamData);
    return response.data;
  } catch (error) {
    console.error('Error creating team:', error);
    throw error;
  }
};

export const fetchTeamById = async (teamId) => {
  try {
    const response = await api.get(`/teams/${teamId}`);
    return response.data;
  } catch (error) {
    console.error(`Error fetching team with ID ${teamId}:`, error);
    throw error;
  }
};

// Player operations
export const addPlayer = async (playerData) => {
  try {
    const response = await api.post(`${PLAYERS_API_URL}`, playerData);
    return response.data;
  } catch (error) {
    console.error('Error adding player:', error.response?.data || error.message);
    throw error;
  }
};

export const updatePlayer = async (playerId, playerData) => {
  try {
    const response = await api.put(`${PLAYERS_API_URL}/${playerId}`, playerData);
    return response.data;
  } catch (error) {
    console.error('Error updating player:', error.response?.data || error.message);
    throw error;
  }
};

export const deletePlayer = async (playerId) => {
  try {
    const response = await api.delete(`${PLAYERS_API_URL}/${playerId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting player:', error.response?.data || error.message);
    throw error;
  }
};

export const getPlayersByTeam = async (teamId) => {
  try {
    if (!teamId) throw new Error('Team ID is required');
    const response = await api.get(`${PLAYERS_API_URL}/team/${teamId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching players:', error.response?.data || error.message);
    throw error;
  }
};

// Event operations
export const addEvent = async (eventData) => {
  try {
    const response = await api.post(`${EVENTS_API_URL}`, eventData);
    return response.data;
  } catch (error) {
    console.error('Error adding event:', error.response?.data || error.message);
    throw error;
  }
};

export const getEventsByTeam = async (teamId) => {
  try {
    if (!teamId) throw new Error('Team ID is required');
    const response = await api.get(`${EVENTS_API_URL}/team/${teamId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching events:', error.response?.data || error.message);
    throw error;
  }
};

export const updateEvent = async (eventId, eventData) => {
  try {
    const response = await api.put(`${EVENTS_API_URL}/${eventId}`, eventData);
    return response.data;
  } catch (error) {
    console.error('Error updating event:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteEvent = async (eventId) => {
  try {
    const response = await api.delete(`${EVENTS_API_URL}/${eventId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting event:', error.response?.data || error.message);
    throw error;
  }
};

// Recent activities
export const getRecentActivities = async (teamId) => {
  try {
    if (!teamId) throw new Error('Team ID is required');
    const response = await api.get(`${API_URL}/${teamId}/activities`);
    return response.data;
  } catch (error) {
    console.error('Error fetching recent activities:', error.response?.data || error.message);
    throw error;
  }
};

// Stream operations
export const createStream = async (streamData) => {
  try {
    const response = await api.post(`${STREAMS_API_URL}`, streamData);
    return response.data;
  } catch (error) {
    console.error('Error creating stream:', error.response?.data || error.message);
    throw error;
  }
};

export const getStreamsByTeam = async (teamId) => {
  try {
    if (!teamId) throw new Error('Team ID is required');
    const response = await api.get(`${STREAMS_API_URL}/team/${teamId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching streams:', error.response?.data || error.message);
    throw error;
  }
};

export const endStream = async (streamId) => {
  try {
    const response = await api.put(`${STREAMS_API_URL}/${streamId}/end`);
    return response.data;
  } catch (error) {
    console.error('Error ending stream:', error.response?.data || error.message);
    throw error;
  }
};


// Staff operations
export const addStaff = async (staffData) => {
  try {
     const response = await api.post(`${STAFF_API_URL }`, staffData);
    return response.data;
  } catch (error) {
    console.error('Error adding staff:', error.response?.data || error.message);
    throw error;
  }
};

export const updateStaff = async (staffId, staffData) => {
  try {
    const response = await api.put(`${STAFF_API_URL }/${staffId}`, staffData);
    return response.data;
  } catch (error) {
    console.error('Error updating staff:', error.response?.data || error.message);
    throw error;
  }
};

export const deleteStaff = async (staffId) => {
  try {
       const response = await api.delete(`${STAFF_API_URL }/${staffId}`);
    return response.data;
  } catch (error) {
    console.error('Error deleting staff:', error.response?.data || error.message);
    throw error;
  }
};

export const getStaffByTeam = async (teamId) => {
  try {
    if (!teamId) throw new Error('Team ID is required');
     const response = await api.get(`${STAFF_API_URL }/team/${teamId}`);
    return response.data;
  } catch (error) {
    console.error('Error fetching staff:', error.response?.data || error.message);
    throw error;
  }
};

export default {
  fetchTeams,
  createNewTeam,
  fetchTeamById,
  getEventsByTeam,
  addEvent,
  updateEvent,
  deleteEvent,
  getPlayersByTeam,
  addPlayer,
  updatePlayer,
  deletePlayer,
  getRecentActivities,
  createStream,
  getStreamsByTeam,
  endStream,
  addStaff,
  updateStaff,
  deleteStaff,
  getStaffByTeam
};
