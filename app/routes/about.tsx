import { Article } from "../components/Article";
import { motion } from "framer-motion";

export default function About() {
  return (
    <>
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: 50 }}
        transition={{ duration: 0.5 }}
      >
        <title>About Me</title>
        <Article path="Pages/about" />
      </motion.div>
    </>
  );
}
