"use client";
import { motion } from "framer-motion";
import styles from "./UnitToggle.module.css";

interface UnitToggleProps {
  unit: "metric" | "imperial";
  setUnit: (unit: "metric" | "imperial") => void;
}

export default function UnitToggle({ unit, setUnit }: UnitToggleProps) {
  return (
    <div className={styles.switchContainer}>
      <motion.div
        className={styles.slider}
        layout
        transition={{ type: "spring", stiffness: 300, damping: 30 }}
        style={{ left: unit === "metric" ? "50%" : 0 }}
      />
      <button
        className={`${styles.option} ${
          unit === "imperial" ? styles.active : ""
        }`}
        onClick={() => setUnit("imperial")}
      >
        °F
      </button>
      <button
        className={`${styles.option} ${unit === "metric" ? styles.active : ""}`}
        onClick={() => setUnit("metric")}
      >
        °C
      </button>
    </div>
  );
}
