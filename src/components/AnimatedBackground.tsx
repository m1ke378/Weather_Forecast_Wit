import { AnimatePresence, motion } from "motion/react";

export default function AnimatedBackground({
  dynamicBackground,
}: {
  dynamicBackground: string;
}) {
  return (
    <motion.div
      key={dynamicBackground}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      transition={{ duration: 0.6 }}
      style={{
        position: "fixed",
        inset: 0,
        zIndex: -1,
        background: dynamicBackground,
      }}
    ></motion.div>
  );
}
