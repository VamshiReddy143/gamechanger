// backend/services/socketService.js
const logger = require('../utils/logger');

module.exports = (io) => {
  io.on('connection', (socket) => {
    logger.info(`New client connected: ${socket.id}`);

    // Example: Join team room
    socket.on('joinTeam', (teamId) => {
      socket.join(`team_${teamId}`);
      logger.info(`Client ${socket.id} joined team room: ${teamId}`);
    });

    // Example: Leave team room
    socket.on('leaveTeam', (teamId) => {
      socket.leave(`team_${teamId}`);
      logger.info(`Client ${socket.id} left team room: ${teamId}`);
    });

    // Handle disconnection
    socket.on('disconnect', () => {
      logger.info(`Client disconnected: ${socket.id}`);
    });

    // Error handling
    socket.on('error', (err) => {
      logger.error('Socket error:', err);
    });
  });

  // Add any custom socket events here
};