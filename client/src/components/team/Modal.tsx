// import { motion } from "framer-motion";

// interface ModalProps {
//   isOpen: boolean;
//   onClose: () => void;
//   children: React.ReactNode;
// }

// export default function Modal({ isOpen, onClose, children }: ModalProps) {
//   if (!isOpen) return null;

//   return (
//     <motion.div
//       initial={{ opacity: 0 }}
//       animate={{ opacity: 1 }}
//       exit={{ opacity: 0 }}
//       className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
//       onClick={onClose} // Close modal when clicking outside
//     >
//       <motion.div
//         initial={{ scale: 0.9 }}
//         animate={{ scale: 1 }}
//         exit={{ scale: 0.9 }}
//         className="bg-white rounded-lg p-6 max-w-md w-full mx-4"
//         onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
//       >
//         {children}
//         <button
//           onClick={onClose}
//           className="mt-4 text-sm text-[#F59C7D] hover:text-[#F59C7D]/80"
//         >
//           Close
//         </button>
//       </motion.div>
//     </motion.div>
//   );
// }

import { motion } from "framer-motion";

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
}

export default function Modal({ isOpen, onClose, children }: ModalProps) {
  if (!isOpen) return null;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50"
      onClick={onClose} // Close modal when clicking outside
    >
      <motion.div
        initial={{ scale: 0.9 }}
        animate={{ scale: 1 }}
        exit={{ scale: 0.9 }}
        className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()} // Prevent clicks inside the modal from closing it
      >
        {children}
        <button
          onClick={onClose}
          className="mt-4 text-sm text-[#F59C7D] hover:text-[#F59C7D]/80"
        >
          Close
        </button>
      </motion.div>
    </motion.div>
  );
}