import React from 'react';
import { motion } from 'framer-motion';

const Modal = ({ isOpen, onClose, children, width = "853px", height = "540px", className }) => {
  return (
    <>
      {isOpen && (
        <motion.div
          className="fixed inset-0 bg-gray-800 bg-opacity-75 z-50 flex items-center justify-center"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className={`bg-[#131313]/95 rounded-lg shadow-lg p-6 ${className}`}
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0.8 }}
            style={{ width, height }}
            onClick={(e) => e.stopPropagation()}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </>
  );
};

export default Modal;
