import { faCircleExclamation } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import styles from "./ErrorMessage.module.css";
import { useRouter } from "next/navigation";
import { motion } from "motion/react";

export default function ErrorMessage({ message }: { message: string }) {
  const router = useRouter();

  return (
    <motion.div
      className={styles.errorContainer}
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      exit={{ y: 10, opacity: 0 }}
      transition={{ type: "spring", bounce: 0.25, duration: 0.3 }}
    >
      <FontAwesomeIcon icon={faCircleExclamation} size="2x" />
      <p>{message}</p>
    </motion.div>
  );
}
