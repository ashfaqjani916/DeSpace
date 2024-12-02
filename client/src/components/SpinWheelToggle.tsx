import React, { Dispatch, SetStateAction } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import WheelSpinner from './SpinningWheel';
import { X } from 'lucide-react';

interface SpinWheelToggleProps {
  isOpen: boolean;
  toggleModal: Dispatch<SetStateAction<boolean>>;
}

const SpinWheelToggle: React.FC<SpinWheelToggleProps> = ({ isOpen, toggleModal }) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            exit={{ scale: 0.9, opacity: 0 }}
            transition={{ type: "spring", stiffness: 300, damping: 20 }}
            className="relative w-full max-w-xl bg-white dark:bg-neutral-800 rounded-2xl shadow-2xl overflow-hidden"
          >
            {/* Modal Header */}
            <div className="flex justify-between items-center p-4 border-b dark:border-neutral-700 bg-gray-100 dark:bg-neutral-900">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                Spin the Wheel
              </h3>
              <button
                onClick={() => toggleModal(false)}
                className="text-gray-400 bg-transparent hover:bg-gray-200 dark:hover:bg-neutral-700 rounded-lg text-sm p-2 inline-flex items-center"
                aria-label="Close"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Content */}
            <div className="p-6">
              <WheelSpinner />
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default SpinWheelToggle;
