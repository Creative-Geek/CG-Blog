import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

interface ToastProps {
  message: string;
  duration?: number;
  isVisible: boolean;
  onClose: () => void;
}

export function Toast({ message, duration = 2000, isVisible, onClose }: ToastProps) {
  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        onClose();
      }, duration);
      
      return () => clearTimeout(timer);
    }
  }, [isVisible, duration, onClose]);

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ opacity: 0, y: 50 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 50 }}
          className="fixed bottom-4 left-1/2 transform -translate-x-1/2 bg-black border border-input bg-background shadow-sm hover:bg-accent hover:text-accent-foreground  text-white px-4 py-2 rounded-md shadow-md z-50"
        >
          {message}
        </motion.div>
      )}
    </AnimatePresence>
  );
}

// Create a global toast context to manage toast state
import { createContext, useContext, type ReactNode } from 'react';

interface ToastContextType {
  showToast: (message: string, duration?: number) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export function ToastProvider({ children }: { children: ReactNode }) {
  const [toastMessage, setToastMessage] = useState('');
  const [isVisible, setIsVisible] = useState(false);
  const [toastDuration, setToastDuration] = useState(2000);

  const showToast = (message: string, duration = 2000) => {
    setToastMessage(message);
    setToastDuration(duration);
    setIsVisible(true);
  };

  const hideToast = () => {
    setIsVisible(false);
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <Toast 
        message={toastMessage} 
        duration={toastDuration} 
        isVisible={isVisible} 
        onClose={hideToast} 
      />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (context === undefined) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
