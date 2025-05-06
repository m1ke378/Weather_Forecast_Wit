import { motion } from "motion/react";
import AnimatedIcon from "../AnimatedIcon";
import HighlightedIcon from "../HighlightedIcon/HighlightedIcon";
import styles from "./Intro.module.css";

export default function Intro() {
  return (
    <motion.div
      key="intro"
      layout
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95, height: 0 }}
      transition={{ duration: 0.3 }}
      className={styles.intro}
    >
      <AnimatedIcon>
        <HighlightedIcon
          src={`https://openweathermap.org/img/wn/10d@4x.png`}
          alt="Animated weather icon"
          blur={20}
          height={200}
        />
      </AnimatedIcon>
      <div style={{ textAlign: "center" }}>
        <h1>Weather</h1>
        <h2>Forecast</h2>
        <br />
        <p>5 day weather forecast for any city in the world</p>
      </div>
    </motion.div>
  );
}
