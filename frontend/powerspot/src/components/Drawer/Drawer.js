import React from 'react';
import { motion } from 'framer-motion';

const Drawer = ({ isOpen, onClose, children }) => {
  return (
    <>
      <motion.div
        className="fixed inset-0 bg-gray-800 bg-opacity-75 z-40"
        initial={{ opacity: 0 }}
        animate={{ opacity: isOpen ? 1 : 0 }}
        transition={{ duration: 0.3 }}
        onClick={onClose}
        style={{ pointerEvents: isOpen ? 'auto' : 'none' }}
      ></motion.div>
      <motion.div
        className="fixed inset-y-0 left-0 w-[400px] bg-white shadow-lg z-50"
        initial={{ x: '-100%' }}
        animate={{ x: isOpen ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.3 }}
      >
        <div className="flex justify-between items-center p-4 bg-gray-800 text-white">
          <h2 className="text-xl font-bold">Station Info</h2>
          <button onClick={onClose} className="text-white">
            <svg
              className="w-6 h-6"
              fill="none"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        <div className="">{children}</div>
      </motion.div>
    </>
  );
};

export default Drawer;
