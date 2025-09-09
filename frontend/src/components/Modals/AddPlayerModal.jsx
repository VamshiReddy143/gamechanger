import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AddPlayerModal = ({ isOpen, onClose, onAddPlayer }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [jerseyNumber, setJerseyNumber] = useState('');
  const [parentEmail, setParentEmail] = useState('');
  const [position, setPosition] = useState('');
  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFirstName('');
      setLastName('');
      setJerseyNumber('');
      setParentEmail('');
      setPosition('');
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    else if (firstName.length > 50) newErrors.firstName = 'First name too long';
    
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    else if (lastName.length > 50) newErrors.lastName = 'Last name too long';
    
    if (!jerseyNumber) newErrors.jerseyNumber = 'Jersey number is required';
    else if (isNaN(jerseyNumber)) newErrors.jerseyNumber = 'Must be a number';
    else if (jerseyNumber < 0 || jerseyNumber > 99) newErrors.jerseyNumber = 'Must be 0-99';
    
    if (parentEmail && !/^\S+@\S+\.\S+$/.test(parentEmail)) {
      newErrors.parentEmail = 'Invalid email format';
    }
    
    if (position && position.length > 30) {
      newErrors.position = 'Position too long';
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onAddPlayer({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        jerseyNumber: parseInt(jerseyNumber),
        parentEmail: parentEmail.trim() || null,
        position: position.trim() || null
      });
      onClose();
    } catch (error) {
      console.error('Failed to add player:', error);
      setErrors({
        ...errors,
        form: error.message || 'Failed to add player. Please try again.'
      });
    } finally {
      setIsSubmitting(false);
    }
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
        className="bg-[#1a1a1a] p-8 rounded-xl max-w-lg w-full m-4 text-white"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="text-2xl font-bold mb-6">Add New Player</h2>
        
        {errors.form && (
          <div className="mb-4 p-3 bg-red-500/20 border border-red-500 rounded">
            <p className="text-red-400">{errors.form}</p>
          </div>
        )}
        
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 font-medium">First Name*</label>
              <input
                type="text"
                value={firstName}
                onChange={(e) => setFirstName(e.target.value)}
                className={`w-full bg-white/10 p-2 rounded text-white border ${
                  errors.firstName ? 'border-red-500' : 'border-white/20'
                }`}
                maxLength={50}
                disabled={isSubmitting}
              />
              {errors.firstName && (
                <p className="text-red-400 text-sm mt-1">{errors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block mb-2 font-medium">Last Name*</label>
              <input
                type="text"
                value={lastName}
                onChange={(e) => setLastName(e.target.value)}
                className={`w-full bg-white/10 p-2 rounded text-white border ${
                  errors.lastName ? 'border-red-500' : 'border-white/20'
                }`}
                maxLength={50}
                disabled={isSubmitting}
              />
              {errors.lastName && (
                <p className="text-red-400 text-sm mt-1">{errors.lastName}</p>
              )}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4 mb-4">
            <div>
              <label className="block mb-2 font-medium">Jersey Number*</label>
              <input
                type="number"
                value={jerseyNumber}
                onChange={(e) => setJerseyNumber(e.target.value)}
                min="0"
                max="99"
                className={`w-full bg-white/10 p-2 rounded text-white border ${
                  errors.jerseyNumber ? 'border-red-500' : 'border-white/20'
                }`}
                disabled={isSubmitting}
              />
              {errors.jerseyNumber && (
                <p className="text-red-400 text-sm mt-1">{errors.jerseyNumber}</p>
              )}
            </div>
            <div>
              <label className="block mb-2 font-medium">Position</label>
              <input
                type="text"
                value={position}
                onChange={(e) => setPosition(e.target.value)}
                className="w-full bg-white/10 p-2 rounded text-white border border-white/20"
                placeholder="Optional"
                maxLength={30}
                disabled={isSubmitting}
              />
              {errors.position && (
                <p className="text-red-400 text-sm mt-1">{errors.position}</p>
              )}
            </div>
          </div>

          <div className="mb-6">
            <label className="block mb-2 font-medium">Parent/Guardian Email</label>
            <input
              type="email"
              value={parentEmail}
              onChange={(e) => setParentEmail(e.target.value)}
              className={`w-full bg-white/10 p-2 rounded text-white border ${
                errors.parentEmail ? 'border-red-500' : 'border-white/20'
              }`}
              placeholder="Optional"
              disabled={isSubmitting}
            />
            {errors.parentEmail && (
              <p className="text-red-400 text-sm mt-1">{errors.parentEmail}</p>
            )}
          </div>

          <div className="flex justify-end gap-4">
            <button
              type="button"
              onClick={onClose}
              className="px-6 py-2 bg-gray-600 hover:bg-gray-700 rounded text-white disabled:opacity-50"
              disabled={isSubmitting}
            >
              Cancel
            </button>
            <button
              type="submit"
              className="px-6 py-2 bg-violet-600 hover:bg-violet-700 rounded text-white disabled:opacity-50"
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Adding...' : 'Add Player'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddPlayerModal;