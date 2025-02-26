import { type ReactNode } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useLocation, useOutlet, useNavigation } from "react-router-dom";
import { useEffect, useState } from "react";

const pageVariants = {
  initial: {
    opacity: 0,
  },
  animate: {
    opacity: 1,
  },
  exit: {
    opacity: 0,
  },
};

const pageTransition = {
  type: "tween",
  ease: "anticipate",
  duration: 0.2,
};

export function PageTransition() {
  const location = useLocation();
  const outlet = useOutlet();
  const navigation = useNavigation();
  const [isClient, setIsClient] = useState(false);

  // Only enable animations after hydration
  useEffect(() => {
    setIsClient(true);
  }, []);

  // During SSR or before hydration, just render the outlet
  if (!isClient) {
    return outlet;
  }

  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="animate"
        exit="exit"
        variants={pageVariants}
        transition={pageTransition}
      >
        {outlet}
      </motion.div>
    </AnimatePresence>
  );
} 