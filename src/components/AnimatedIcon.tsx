import { motion } from "motion/react";

export default function AnimatedIcon({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <motion.div
      key="icon"
      initial={{ scale: 0.8, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      exit={{ scale: 0 }}
      transition={{ duration: 0.3 }}
      style={{ width: "min-content" }}
    >
      {children}
    </motion.div>
  );
}
