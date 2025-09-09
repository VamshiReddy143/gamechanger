import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import DatePicker from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import { FiX } from "react-icons/fi";

const AddEventModal = ({ isOpen, onClose, onSubmit, event }) => {
  const [eventType, setEventType] = useState('game');
  const [title, setTitle] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [allDay, setAllDay] = useState(false);
  const [durationHours, setDurationHours] = useState(1);
  const [durationMinutes, setDurationMinutes] = useState(30);
  const [arriveTime, setArriveTime] = useState(new Date());
  const [repeats, setRepeats] = useState('Never');
  const [location, setLocation] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (event) {
      setEventType(event.eventType);
      setTitle(event.title || '');
      setStartDate(new Date(event.startDate));
      setAllDay(event.allDay || false);
      setDurationHours(event.durationHours || 1);
      setDurationMinutes(event.durationMinutes || 0);
      setArriveTime(event.arriveTime ? new Date(event.arriveTime) : new Date());
      setRepeats(event.repeats || 'Never');
      setLocation(event.location || '');
    } else {
      resetForm();
    }
  }, [event]);

  const resetForm = () => {
    setEventType('game');
    setTitle('');
    setStartDate(new Date());
    setAllDay(false);
    setDurationHours(1);
    setDurationMinutes(30);
    setArriveTime(new Date());
    setRepeats('Never');
    setLocation('');
    setErrors({});
  };

  const validateForm = () => {
    const newErrors = {};
    if (!eventType) newErrors.eventType = 'Event type is required';
    if (eventType === 'other' && !title.trim()) newErrors.title = 'Title is required';
    if (!location.trim()) newErrors.location = 'Location is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    const eventData = {
      eventType,
      title: eventType === 'other' ? title : undefined,
      startDate,
      allDay,
      durationHours,
      durationMinutes,
      arriveTime,
      repeats,
      location
    };

    await onSubmit(eventData);
    resetForm();
  };

  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 overflow-y-auto"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.95, opacity: 0 }}
        className="bg-[#1a1a1a] p-8 rounded-xl max-w-lg w-full m-4 text-white max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl font-bold">{event ? 'Edit Event' : 'Add New Event'}</h2>
          <button 
            onClick={onClose}
            className="text-gray-400 hover:text-white"
          >
            <FiX size={24} />
          </button>
        </div>
        
        <form onSubmit={handleSubmit}>
          <div className="space-y-4">
            <div>
              <label className="block mb-2 font-medium">Event Type</label>
              <select 
                value={eventType} 
                onChange={(e) => setEventType(e.target.value)} 
                className={`w-full bg-white/90 p-2 rounded text-black border ${
                  errors.eventType ? 'border-red-500' : 'border-white/10'
                }`}
                required
              >
                <option value="game">Game</option>
                <option value="practice">Practice</option>
                <option value="other">Other</option>
              </select>
              {errors.eventType && (
                <p className="text-red-400 text-sm mt-1">{errors.eventType}</p>
              )}
            </div>

            <div>
              <label className="block mb-2 font-medium">Start Date {eventType !== 'other' && 'and Time'}</label>
              <DatePicker 
                selected={startDate} 
                onChange={(date) => setStartDate(date)} 
                showTimeSelect={eventType !== 'other' && !allDay}
                timeIntervals={15}
                dateFormat={allDay ? "MMMM d, yyyy" : "MMMM d, yyyy h:mm aa"}
                className="w-full bg-white/10 p-2 rounded text-white border border-white/20"
                required
              />
            </div>

            {(eventType === 'game' || eventType === 'practice') && (
              <>
                <div className="flex items-center">
                  <input 
                    type="checkbox" 
                    id="allDay" 
                    checked={allDay} 
                    onChange={(e) => setAllDay(e.target.checked)} 
                    className="mr-2"
                  />
                  <label htmlFor="allDay" className="font-medium">All Day</label>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <label className="block mb-2 font-medium">Duration Hours</label>
                    <input 
                      type="number" 
                      value={durationHours} 
                      onChange={(e) => setDurationHours(e.target.value)} 
                      min={0} 
                      className="w-full bg-white/10 p-2 rounded text-white border border-white/20" 
                      required 
                    />
                  </div>
                  <div>
                    <label className="block mb-2 font-medium">Minutes</label>
                    <input 
                      type="number" 
                      value={durationMinutes} 
                      onChange={(e) => setDurationMinutes(e.target.value)} 
                      min={0} 
                      max={59} 
                      className="w-full bg-white/10 p-2 rounded text-white border border-white/20" 
                      required 
                    />
                  </div>
                </div>

                <div>
                  <label className="block mb-2 font-medium">Arrive Time</label>
                  <DatePicker 
                    selected={arriveTime} 
                    onChange={(date) => setArriveTime(date)} 
                    showTimeSelect
                    showTimeSelectOnly
                    timeIntervals={15}
                    dateFormat="h:mm aa"
                    className="w-full bg-white/10 p-2 rounded text-white border border-white/20"
                    required
                  />
                </div>

                <div>
                  <label className="block mb-2 font-medium">Repeats</label>
                  <select 
                    value={repeats} 
                    onChange={(e) => setRepeats(e.target.value)} 
                    className="w-full bg-white/90 p-2 rounded text-black border border-white/20"
                  >
                    <option>Never</option>
                    <option>Daily</option>
                    <option>Weekly</option>
                    <option>Monthly</option>
                  </select>
                </div>
              </>
            )}

            {eventType === 'other' && (
              <div>
                <label className="block mb-2 font-medium">Event Title</label>
                <input 
                  type="text" 
                  value={title} 
                  onChange={(e) => setTitle(e.target.value)} 
                  className={`w-full bg-white/90 p-2 rounded text-black border ${
                    errors.title ? 'border-red-500' : 'border-white/10'
                  }`}
                  required 
                />
                {errors.title && (
                  <p className="text-red-400 text-sm mt-1">{errors.title}</p>
                )}
              </div>
            )}

            <div>
              <label className="block mb-2 font-medium">Location</label>
              <input 
                type="text" 
                value={location} 
                onChange={(e) => setLocation(e.target.value)} 
                placeholder="Enter location (e.g., Main Stadium, Field 2, etc.)"
                className={`w-full bg-white/90 p-2 rounded text-black border ${
                  errors.location ? 'border-red-500' : 'border-white/10'
                }`}
                required
              />
              {errors.location && (
                <p className="text-red-400 text-sm mt-1">{errors.location}</p>
              )}
            </div>
          </div>

          <div className="flex justify-end gap-4 mt-6">
            <motion.button 
              type="button" 
              onClick={onClose} 
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              Cancel
            </motion.button>
            <motion.button 
              type="submit" 
              className="px-6 py-2 bg-violet-600 hover:bg-violet-700 rounded text-white"
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
            >
              {event ? 'Update Event' : 'Save Event'}
            </motion.button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddEventModal;