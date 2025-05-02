"use client";
import CurrentWeatherCard from "@/components/CurrentWeatherCard/CurrentWeatherCard";
import styles from "./page.module.css";
import Input from "@/components/Input/Input";
import { groupForecastByDay } from "@/utils/forecast";
import axios from "axios";
import { useState, useEffect } from "react";
import ForecastChart from "@/components/ForecastChart/ForecastChart";
import { backgroundStyles } from "@/utils/weatherBackground";
import AnimatedBackground from "@/components/AnimatedBackground";
import ForecastDayCard from "@/components/ForecastDayCard/ForecastDayCard";
import AnimatedIcon from "@/components/AnimatedIcon";
import HighlightedIcon from "@/components/HighlightedIcon/HighlightedIcon";
import { AnimatePresence, motion, spring } from "motion/react";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
if (!API_KEY) {
  throw new Error("API key is not defined.");
}

export default function Home() {
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [error, setError] = useState<string | null>(null);
  const [groupedForecast, setGroupedForecast] = useState<any>(null);
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
  const [dynamicBackground, setDynamicBackground] = useState<string>(
    backgroundStyles.Default
  );
  const [isSearching, setIsSearching] = useState<boolean>(true);

  useEffect(() => {
    if (selectedDayKey && groupedForecast) {
      const weatherCondition =
        groupedForecast[selectedDayKey][0].weather[0].main;
      console.log(weatherCondition);
      setDynamicBackground(
        backgroundStyles[weatherCondition] || backgroundStyles.Default
      );
    } else {
      setDynamicBackground(backgroundStyles.Default);
    }
  }, [selectedDayKey, groupedForecast]);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      setError(null);
      // Fetch the current weather from OpenWeatherMap API
      await axios
        .get(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`
        )
        .then((res) => {
          console.log(res.data);
          setCurrentWeather(res.data);
        })
        .catch((err) => {
          console.error("Error fetching current weather:", err);
          setError("Failed to fetch current weather. Please try again later.");
        });

      // Fetch the weather forecats from OpenWeatherMap API
      await axios
        .get(
          `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`
        )
        .then((res) => {
          const groupedData = groupForecastByDay(res.data.list);
          setGroupedForecast(groupedData);
          const firstKey = Object.keys(groupedData)[0];
          setSelectedDayKey(firstKey);
          console.log(groupedData);
        })
        .catch((err) => {
          console.error("Error fetching weather forecast:", err);
          setError("Failed to fetch weather forecast. Please try again later.");
        });
      setIsSearching(false);
    } catch (err: any) {
      setGroupedForecast(null);
      setError("Failed to fetch weather data. Please try again later.");
    }
  };

  const handleEraseState = () => {
    setCurrentWeather(null);
    setGroupedForecast(null);
    setSelectedDayKey(null);
    setIsSearching(true);
  };

  return (
    <main>
      <AnimatedBackground dynamicBackground={dynamicBackground} />
      <AnimatePresence>
        {isSearching && (
          <motion.div
            key="intro"
            layout
            initial={{ y: -100, opacity: 0 }}
            animate={{
              y: 0,
              opacity: 1,
            }}
            exit={{
              height: 0,
              opacity: 0,
            }}
            transition={{ type: "spring", bounce: 0.25 }}
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "2rem",
              alignItems: "center",
            }}
          >
            <AnimatedIcon>
              <HighlightedIcon
                src={`https://openweathermap.org/img/wn/10d@4x.png`}
                alt="Animated weather icon"
                blur={20}
                height={200}
              />
            </AnimatedIcon>
            <div className={styles.titleWrapper}>
              <h1>Weather</h1>
              <h2>Forecast</h2>
              <br />
              <p>5 day weather forecast for any city in the world</p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
      <motion.div
        layout
        initial={{ y: 30, opacity: 0 }}
        animate={{
          y: 0,
          opacity: 1,
        }}
        transition={{ type: "spring", bounce: 0.25 }}
      >
        <Input
          fetchWeather={fetchWeather}
          handleEraseState={handleEraseState}
          isSearching={isSearching}
        />
      </motion.div>

      <motion.div
        layout
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={spring}
        style={{ display: "flex", flexDirection: "column", gap: "2rem" }}
      >
        {currentWeather && (
          <CurrentWeatherCard weatherData={currentWeather} unit={unit} />
        )}
        {groupedForecast && selectedDayKey && (
          <>
            <ForecastChart chartData={groupedForecast[selectedDayKey]} />
            <div className={styles.forecastContainer}>
              {Object.keys(groupedForecast).map((dayKey) => (
                <div key={dayKey} onClick={() => setSelectedDayKey(dayKey)}>
                  <ForecastDayCard weatherData={groupedForecast[dayKey]} />
                </div>
              ))}
            </div>
          </>
        )}
      </motion.div>
    </main>
  );
}
