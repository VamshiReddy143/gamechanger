const logger = require('../utils/logger');

module.exports = (io, router) => {
  const rooms = new Map(); // roomId -> { producerTransport, consumers }

  io.on('connection', (socket) => {
    logger.info(`Socket connected: ${socket.id}`);

    // Join stream room
    socket.on('joinRoom', async ({ roomId, userId }, callback) => {
      try {
        socket.join(roomId);
        if (!rooms.has(roomId)) {
          rooms.set(roomId, { producerTransport: null, consumers: new Set() });
        }
        callback({ success: true });
      } catch (err) {
        logger.error('Error joining room:', err);
        callback({ success: false, error: err.message });
      }
    });

    // Create WebRTC transport
    socket.on('createTransport', async ({ roomId, isProducer }, callback) => {
      try {
        const transport = await router.createWebRtcTransport({
          listenIps: [{ ip: '0.0.0.0', announcedIp: process.env.PUBLIC_IP }],
          enableUdp: true,
          enableTcp: true,
          preferUdp: true,
        });
        if (isProducer) {
          rooms.get(roomId).producerTransport = transport;
        } else {
          rooms.get(roomId).consumers.add(transport);
        }
        callback({
          id: transport.id,
          iceParameters: transport.iceParameters,
          iceCandidates: transport.iceCandidates,
          dtlsParameters: transport.dtlsParameters,
        });
        transport.on('dtlsstatechange', (dtlsState) => {
          if (dtlsState === 'closed') {
            transport.close();
            if (isProducer) {
              rooms.get(roomId).producerTransport = null;
            } else {
              rooms.get(roomId).consumers.delete(transport);
            }
          }
        });
      } catch (err) {
        logger.error('Error creating transport:', err);
        callback({ error: err.message });
      }
    });

    // Connect transport
    socket.on('connectTransport', async ({ roomId, transportId, dtlsParameters }, callback) => {
      try {
        const room = rooms.get(roomId);
        const transport = room.producerTransport?.id === transportId ? room.producerTransport : Array.from(room.consumers).find(t => t.id === transportId);
        if (!transport) throw new Error('Transport not found');
        await transport.connect({ dtlsParameters });
        callback({ success: true });
      } catch (err) {
        logger.error('Error connecting transport:', err);
        callback({ error: err.message });
      }
    });

    // Produce stream
    socket.on('produce', async ({ roomId, transportId, kind, rtpParameters }, callback) => {
      try {
        const room = rooms.get(roomId);
        if (!room.producerTransport || room.producerTransport.id !== transportId) {
          throw new Error('Invalid producer transport');
        }
        const producer = await room.producerTransport.produce({ kind, rtpParameters });
        room.producer = producer;
        io.to(roomId).emit('newProducer', { producerId: producer.id, kind });
        callback({ id: producer.id });
      } catch (err) {
        logger.error('Error producing stream:', err);
        callback({ error: err.message });
      }
    });

    // Consume stream
    socket.on('consume', async ({ roomId, transportId, producerId, rtpCapabilities }, callback) => {
      try {
        const room = rooms.get(roomId);
        if (!router.canConsume({ producerId, rtpCapabilities })) {
          throw new Error('Cannot consume stream');
        }
        const consumerTransport = Array.from(room.consumers).find(t => t.id === transportId);
        if (!consumerTransport) throw new Error('Consumer transport not found');
        const consumer = await consumerTransport.consume({
          producerId,
          rtpCapabilities,
          paused: true,
        });
        callback({
          id: consumer.id,
          producerId,
          kind: consumer.kind,
          rtpParameters: consumer.rtpParameters,
        });
        consumerTransport.on('transportproduce', async ({ kind, rtpParameters }, cb) => {
          const producer = await consumerTransport.produce({ kind, rtpParameters });
          cb({ id: producer.id });
        });
      } catch (err) {
        logger.error('Error consuming stream:', err);
        callback({ error: err.message });
      }
    });

    socket.on('resume', async ({ roomId, consumerId }, callback) => {
      try {
        const room = rooms.get(roomId);
        const consumer = Array.from(room.consumers).flatMap(t => t.consumers).find(c => c.id === consumerId);
        if (consumer) await consumer.resume();
        callback({ success: true });
      } catch (err) {
        logger.error('Error resuming consumer:', err);
        callback({ error: err.message });
      }
    });

    socket.on('disconnect', () => {
      logger.info(`Socket disconnected: ${socket.id}`);
      rooms.forEach((room, roomId) => {
        if (room.producerTransport?.appData.socketId === socket.id) {
          room.producerTransport.close();
          room.producerTransport = null;
          io.to(roomId).emit('producerClosed');
        }
        room.consumers.forEach(transport => {
          if (transport.appData.socketId === socket.id) {
            transport.close();
            room.consumers.delete(transport);
          }
        });
      });
    });
  });
};