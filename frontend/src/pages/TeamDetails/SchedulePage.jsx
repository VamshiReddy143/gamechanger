import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import Lottie from "lottie-react";
import { FiPlus, FiEdit2, FiTrash2, FiX, FiCheck } from "react-icons/fi";
import eventAnimation from "../../animations/event.json";
import { getEventsByTeam, addEvent, updateEvent, deleteEvent } from '../../api/teamApi';
import AddEventModal from '../../components/Modals/AddEventModal';
import { format, parseISO } from 'date-fns';
import { toast } from 'react-toastify';

const SchedulePage = () => {
  const [showModal, setShowModal] = useState(false);
  const [events, setEvents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [editingEvent, setEditingEvent] = useState(null);
  const [confirmDeleteId, setConfirmDeleteId] = useState(null);
  const { id: teamId } = useParams();

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        setLoading(true);
        const eventsData = await getEventsByTeam(teamId);
        setEvents(eventsData);
        setError(null);
      } catch (err) {
        console.error('Failed to fetch events:', err);
        setError('Failed to load events. Please try again.');
        toast.error('Failed to load events');
      } finally {
        setLoading(false);
      }
    };
    
    fetchEvents();
  }, [teamId]);

  const handleAddEvent = async (eventData) => {
    try {
      const eventWithTeam = { 
        ...eventData, 
        teamId,
        endDate: new Date(eventData.startDate.getTime() + 
          (eventData.durationHours * 60 * 60 * 1000) + 
          (eventData.durationMinutes * 60 * 1000))
      };
      
      const savedEvent = await addEvent(eventWithTeam);
      setEvents([...events, savedEvent]);
      setShowModal(false);
      toast.success('Event added successfully');
    } catch (error) {
      console.error('Failed to add event:', error);
      toast.error('Failed to add event');
    }
  };

  const handleUpdateEvent = async (eventData) => {
    try {
      const updatedEvent = await updateEvent(editingEvent._id, eventData);
      setEvents(events.map(event => 
        event._id === updatedEvent._id ? updatedEvent : event
      ));
      setEditingEvent(null);
      toast.success('Event updated successfully');
    } catch (error) {
      console.error('Failed to update event:', error);
      toast.error('Failed to update event');
    }
  };

  const handleDeleteEvent = async (eventId) => {
    try {
      await deleteEvent(eventId);
      setEvents(events.filter(event => event._id !== eventId));
      setConfirmDeleteId(null);
      toast.success('Event deleted successfully');
    } catch (error) {
      console.error('Failed to delete event:', error);
      toast.error('Failed to delete event');
    }
  };

  const getEventColor = (eventType) => {
    switch (eventType) {
      case 'game': return 'bg-blue-500/20 border-blue-500';
      case 'practice': return 'bg-green-500/20 border-green-500';
      default: return 'bg-purple-500/20 border-purple-500';
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
        <h3 className="text-xl font-bold text-white mb-2">Error Loading Events</h3>
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

  return (
    <div className="p-8 text-white">
      <div className="flex items-center justify-between mb-6">
        <h2 className="text-2xl font-bold">Schedule</h2>
        <motion.button 
          onClick={() => {
            setEditingEvent(null);
            setShowModal(true);
          }}
          className="flex items-center gap-2 bg-violet-600 hover:bg-violet-700 px-4 py-2 rounded-lg"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
        >
          <FiPlus />
          <span>Add Event</span>
        </motion.button>
      </div>

      {events.length > 0 ? (
        <div className="space-y-4">
          {events.map((event) => (
            <motion.div 
              key={event._id}
              className={`border-l-4 rounded-lg p-4 relative overflow-hidden ${getEventColor(event.eventType)}`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              whileHover={{ scale: 1.01 }}
            >
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <h3 className="text-lg font-bold capitalize">{event.eventType}</h3>
                    {event.repeats !== 'Never' && (
                      <span className="text-xs bg-white/10 px-2 py-1 rounded-full">
                        {event.repeats}
                      </span>
                    )}
                  </div>
                  {event.title && <p className="text-gray-300">{event.title}</p>}
                  <p className="text-sm text-gray-400 mt-1">
                    {format(parseISO(event.startDate), 'MMMM d, yyyy h:mm a')} -{' '}
                    {format(parseISO(event.endDate), 'h:mm a')}
                  </p>
                  <p className="text-sm text-gray-400">{event.location}</p>
                </div>
                
                <div className="flex gap-2">
                  {confirmDeleteId === event._id ? (
                    <div className="flex gap-1 bg-red-500/20 rounded-lg overflow-hidden">
                      <button 
                        onClick={() => handleDeleteEvent(event._id)}
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
                          setEditingEvent(event);
                          setShowModal(true);
                        }}
                        className="p-2 text-blue-400 hover:bg-blue-500/20 rounded-lg"
                        title="Edit event"
                      >
                        <FiEdit2 />
                      </button>
                      <button 
                        onClick={() => setConfirmDeleteId(event._id)}
                        className="p-2 text-red-400 hover:bg-red-500/20 rounded-lg"
                        title="Delete event"
                      >
                        <FiTrash2 />
                      </button>
                    </>
                  )}
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      ) : (
        <div className="flex flex-col items-center justify-center min-h-[400px]">
          <Lottie
            animationData={eventAnimation}
            loop={true}
            style={{ width: 250, height: 250 }}
          />
          <p className="font-bold text-xl text-gray-400 mt-4">No scheduled events yet</p>
          <p className="text-gray-500">Add your first event to get started</p>
        </div>
      )}

      <AnimatePresence>
        {showModal && (
          <AddEventModal 
            isOpen={showModal} 
            onClose={() => {
              setShowModal(false);
              setEditingEvent(null);
            }}
            onSubmit={editingEvent ? handleUpdateEvent : handleAddEvent}
            event={editingEvent}
          />
        )}
      </AnimatePresence>
    </div>
  );
};

export default SchedulePage;