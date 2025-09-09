import { useState, useEffect, useRef } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import io from 'socket.io-client';
import Peer from 'simple-peer';
import { createStream, endStream } from '../../api/teamApi';

const StreamPage = () => {
  const { teamId, roomId } = useParams();
  const navigate = useNavigate();
  const location = useLocation(); // Added to debug URL
  const [isStreaming, setIsStreaming] = useState(false);
  const [streamTitle, setStreamTitle] = useState('');
  const [error, setError] = useState(null);
  const videoRef = useRef(null);
  const socketRef = useRef(null);
  const peerRef = useRef(null);
  const streamRef = useRef(null);

  // Debug teamId and URL
  useEffect(() => {
    console.log('Current URL:', location.pathname);
    console.log('useParams:', { teamId, roomId });
    if (!teamId || !/^[0-9a-fA-F]{24}$/.test(teamId)) {
      setError('Invalid or missing team ID');
      console.error('Invalid teamId from useParams:', teamId);
    } else {
      console.log('Valid teamId:', teamId);
    }
  }, [teamId, roomId, location.pathname]);

  useEffect(() => {
    socketRef.current = io(import.meta.env.VITE_API_BASE_URL, { path: '/ws' });

    if (roomId) {
      // Viewer mode
      socketRef.current.emit('joinRoom', { roomId, userId: 'viewer' }, ({ success, error }) => {
        if (!success) setError(error);
      });

      socketRef.current.on('newProducer', async ({ producerId, kind }) => {
        const transport = await createConsumerTransport();
        socketRef.current.emit('consume', {
          roomId,
          transportId: transport.id,
          producerId,
          rtpCapabilities: peerRef.current.options.rtpCapabilities,
        }, ({ id, producerId, kind, rtpParameters }) => {
          peerRef.current.addConsumer(id, { producerId, kind, rtpParameters });
          socketRef.current.emit('resume', { roomId, consumerId: id });
        });
      });

      socketRef.current.on('producerClosed', () => {
        setError('Stream ended');
        peerRef.current.destroy();
      });
    }

    return () => {
      if (peerRef.current) peerRef.current.destroy();
      socketRef.current.disconnect();
    };
  }, [roomId]);

  const createProducerTransport = async () => {
    return new Promise((resolve) => {
      socketRef.current.emit('createTransport', { roomId, isProducer: true }, (response) => {
        if (response.error) return setError(response.error);
        const transport = new Peer({
          initiator: true,
          trickle: false,
          config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] },
        });
        transport.on('signal', (data) => {
          socketRef.current.emit('connectTransport', {
            roomId,
            transportId: response.id,
            dtlsParameters: data,
          });
        });
        transport.on('connect', () => {
          navigator.mediaDevices.getUserMedia({ video: true, audio: true })
            .then((stream) => {
              streamRef.current = stream;
              videoRef.current.srcObject = stream;
              videoRef.current.play();
              const [videoTrack] = stream.getVideoTracks();
              socketRef.current.emit('produce', {
                roomId,
                transportId: response.id,
                kind: 'video',
                rtpParameters: videoTrack.getSettings(),
              });
            })
            .catch((err) => setError('Failed to access camera/mic'));
        });
        resolve(transport);
      });
    });
  };

  const createConsumerTransport = async () => {
    return new Promise((resolve) => {
      socketRef.current.emit('createTransport', { roomId, isProducer: false }, (response) => {
        if (response.error) return setError(response.error);
        const transport = new Peer({
          initiator: false,
          trickle: false,
          config: { iceServers: [{ urls: 'stun:stun.l.google.com:19302' }] },
        });
        transport.on('signal', (data) => {
          socketRef.current.emit('connectTransport', {
            roomId,
            transportId: response.id,
            dtlsParameters: data,
          });
        });
        transport.on('stream', (stream) => {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
        });
        resolve(transport);
      });
    });
  };

  const handleStartStream = async () => {
    if (!teamId || !/^[0-9a-fA-F]{24}$/.test(teamId)) {
      setError('Invalid or missing team ID');
      console.error('Attempted to start stream with invalid teamId:', teamId);
      return;
    }
    if (!streamTitle.trim()) {
      setError('Stream title is required');
      return;
    }

    try {
      console.log('Creating stream with teamId:', teamId, 'and title:', streamTitle);
      const stream = await createStream({ teamId, title: streamTitle });
      socketRef.current.emit('joinRoom', { roomId: stream.roomId, userId: 'streamer' }, async ({ success, error }) => {
        if (!success) return setError(error);
        peerRef.current = await createProducerTransport();
        setIsStreaming(true);
      });
    } catch (err) {
      console.error('Stream creation failed:', err.response?.data || err.message);
      setError(err.response?.data?.error || 'Failed to start stream');
    }
  };

  const handleEndStream = async () => {
    try {
      await endStream(roomId);
      if (peerRef.current) peerRef.current.destroy();
      if (streamRef.current) {
        streamRef.current.getTracks().forEach(track => track.stop());
      }
      socketRef.current.disconnect();
      navigate(`/team/${teamId}`);
    } catch (err) {
      setError('Failed to end stream');
    }
  };

  return (
    <div className="p-8 text-white">
      <h2 className="text-2xl font-bold mb-4">{roomId ? 'Watch Stream' : 'Start a Stream'}</h2>
      {error && (
        <div className="text-red-400 mb-4">{error}</div>
      )}
      {!roomId && !isStreaming && (
        <div className="mb-4">
          <input
            type="text"
            value={streamTitle}
            onChange={(e) => setStreamTitle(e.target.value)}
            placeholder="Stream Title"
            className="w-full p-2 bg-white/10 rounded text-white"
          />
          <motion.button
            onClick={handleStartStream}
            className="mt-2 px-4 py-2 bg-violet-600 hover:bg-violet-700 rounded"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={!teamId || !/^[0-9a-fA-F]{24}$/.test(teamId)}
          >
            Start Stream
          </motion.button>
        </div>
      )}
      <video ref={videoRef} autoPlay playsInline className="w-full max-w-4xl rounded-lg" />
      {isStreaming && (
        <motion.button
          onClick={handleEndStream}
          className="mt-4 px-4 py-2 bg-red-600 hover:bg-red-700 rounded"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          End Stream
        </motion.button>
      )}
    </div>
  );
};

export default StreamPage;