import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";

const AddStaffModal = ({ isOpen, onClose, onAddStaff,staff }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');

  const [staffEmail, setStaffEmail] = useState('');

  const [errors, setErrors] = useState({});
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setFirstName('');
      setLastName('');
      setStaffEmail('');
      setErrors({});
    }
  }, [isOpen]);

  const validateForm = () => {
    const newErrors = {};
    
    if (!firstName.trim()) newErrors.firstName = 'First name is required';
    else if (firstName.length > 50) newErrors.firstName = 'First name too long';
    
    if (!lastName.trim()) newErrors.lastName = 'Last name is required';
    else if (lastName.length > 50) newErrors.lastName = 'Last name too long';
    


    
    if (staffEmail && !/^\S+@\S+\.\S+$/.test(staffEmail)) {
      newErrors.staffEmail = 'Invalid email format';
    }

    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsSubmitting(true);
    try {
      await onAddStaff({
        firstName: firstName.trim(),
        lastName: lastName.trim(),
        staffEmail: staffEmail.trim() || null,
      });
      onClose();
    } catch (error) {
      console.error('Failed to add staff:', error);
      setErrors({
        ...errors,
        form: error.message || 'Failed to add staff. Please try again.'
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


          <div className="mb-6">
            <label className="block mb-2 font-medium">Email</label>
            <input
              type="email"
              value={staffEmail}
              onChange={(e) => setStaffEmail(e.target.value)}
              className={`w-full bg-white/10 p-2 rounded text-white border ${
                errors.parentEmail ? 'border-red-500' : 'border-white/20'
              }`}
              placeholder="Email address"
              disabled={isSubmitting}
            />
            {errors.staffEmail && (
              <p className="text-red-400 text-sm mt-1">{errors.staffEmail}</p>
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
              {isSubmitting ? 'Adding...' : 'Add staff'}
            </button>
          </div>
        </form>
      </motion.div>
    </motion.div>
  );
};

export default AddStaffModal;