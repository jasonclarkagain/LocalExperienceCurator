import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

export default function FloatingARButton() {
  const [isARMode, setIsARMode] = useState(false);
  const { toast } = useToast();

  const toggleARMode = () => {
    setIsARMode(!isARMode);
    
    if (!isARMode) {
      toast({
        title: "AR Mode Activated",
        description: "Point your camera at surroundings to discover hidden experiences",
      });
      
      // In a real implementation, this would activate the camera
      setTimeout(() => {
        setIsARMode(false);
        toast({
          title: "AR Mode Deactivated",
          description: "Returned to normal view",
        });
      }, 5000);
    }
  };

  return (
    <>
      <motion.button
        onClick={toggleARMode}
        className="fixed bottom-20 right-4 w-14 h-14 bg-gradient-to-r from-coral to-sky rounded-full shadow-lg flex items-center justify-center text-white z-40"
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        animate={isARMode ? { scale: [1, 1.1, 1] } : {}}
        transition={isARMode ? { repeat: Infinity, duration: 1 } : {}}
      >
        <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
        </svg>
        
        <div className="absolute -top-1 -right-1 w-4 h-4 bg-limited rounded-full flex items-center justify-center">
          <span className="text-white text-xs font-bold">AR</span>
        </div>
      </motion.button>

      {/* AR Mode Overlay */}
      <AnimatePresence>
        {isARMode && (
          <motion.div
            className="fixed inset-0 bg-black bg-opacity-80 z-50 flex items-center justify-center"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="text-center text-white">
              <motion.div
                className="w-32 h-32 border-4 border-white border-dashed rounded-lg mx-auto mb-4"
                animate={{ rotate: 360 }}
                transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
              />
              <h3 className="text-xl font-bold mb-2">AR Mode Active</h3>
              <p className="text-sm opacity-75">Scanning for hidden experiences...</p>
              
              {/* Mock AR Elements */}
              <motion.div
                className="absolute top-1/4 left-1/4 w-4 h-4 bg-coral rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity }}
              />
              <motion.div
                className="absolute top-1/3 right-1/3 w-4 h-4 bg-teal rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 0.5 }}
              />
              <motion.div
                className="absolute bottom-1/3 left-1/2 w-4 h-4 bg-sky rounded-full"
                animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                transition={{ duration: 1, repeat: Infinity, delay: 1 }}
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
