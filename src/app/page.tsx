"use client";
import CurrentWeatherCard from "@/components/CurrentWeatherCard/CurrentWeatherCard";
import styles from "./page.module.css";
import Input from "@/components/Input/Input";
import {
  getAverageWeatherCondition,
  groupForecastByDay,
} from "@/utils/forecast";
import axios from "axios";
import { useState, useEffect } from "react";
import ForecastChart from "@/components/ForecastChart/ForecastChart";
import { backgroundStyles } from "@/utils/weatherBackground";
import AnimatedBackground from "@/components/AnimatedBackground";
import ForecastDayCard from "@/components/ForecastDayCard/ForecastDayCard";
import AnimatedIcon from "@/components/AnimatedIcon";
import HighlightedIcon from "@/components/HighlightedIcon/HighlightedIcon";
import { AnimatePresence, motion } from "motion/react";
import dynamic from "next/dynamic";
import Card from "@/components/Card/Card";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft } from "@fortawesome/free-solid-svg-icons";
import UnitToggle from "@/components/UnitToggle/UnitToggle";
import Intro from "@/components/Intro/Intro";
import ErrorMessage from "@/components/ErrorMessage/ErrorMessage";

// Disable SSR of leaflet map
const WeatherMap = dynamic(
  () => import("../components/WeatherMap/WeatherMap"),
  {
    ssr: false,
  }
);

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
if (!API_KEY) {
  throw new Error("API key is not defined.");
}

export default function Home() {
  const [error, setError] = useState<string | null>(null);
  const [unit, setUnit] = useState<"metric" | "imperial">("metric");
  const [groupedForecast, setGroupedForecast] = useState<any>(null);
  const [currentWeather, setCurrentWeather] = useState<any>(null);
  const [selectedDayKey, setSelectedDayKey] = useState<string | null>(null);
  const [dynamicBackground, setDynamicBackground] = useState<string>(
    backgroundStyles.Default
  );
  const [isSearching, setIsSearching] = useState<boolean>(true);

  useEffect(() => {
    if (selectedDayKey && groupedForecast) {
      const weatherCondition = getAverageWeatherCondition(
        groupedForecast[selectedDayKey]
      );

      console.log("Changing background to: ", weatherCondition);
      setDynamicBackground(
        backgroundStyles[weatherCondition] || backgroundStyles.Default
      );
    } else {
      setDynamicBackground(backgroundStyles.Default);
    }
  }, [selectedDayKey, groupedForecast]);

  useEffect(() => {
    if (currentWeather) {
      const { lat, lon } = currentWeather.coord;
      fetchWeather(lat, lon);
    }
  }, [unit]);

  const fetchWeather = async (lat: number, lon: number) => {
    try {
      const currentRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`
      );
      const forecastRes = await axios.get(
        `https://api.openweathermap.org/data/2.5/forecast?lat=${lat}&lon=${lon}&units=${unit}&appid=${API_KEY}`
      );

      setCurrentWeather(currentRes.data);
      const groupedData = groupForecastByDay(forecastRes.data.list);
      setGroupedForecast(groupedData);
      if (!selectedDayKey) setSelectedDayKey(Object.keys(groupedData)[0]);
      setIsSearching(false);
    } catch (err: any) {
      console.error("Error fetching weather:", err.message);
      setError("Failed to fetch weather data. Please try again.");
      setTimeout(() => {
        setError("");
      }, 4000);
      throw new Error("Failed to fetch weather data.");
    }
  };

  const getChartData = () => {
    if (!selectedDayKey || !groupedForecast) return [];

    const dayKeys = Object.keys(groupedForecast);
    const firstKey = dayKeys[0];
    const lastKey = dayKeys[dayKeys.length - 1];
    const maxEntriesPerDay = 8;

    if (selectedDayKey === firstKey) {
      const current = groupedForecast[firstKey];
      const next = groupedForecast[dayKeys[1]] || [];
      return current.concat(next.slice(0, maxEntriesPerDay - current.length));
    } else if (selectedDayKey === lastKey) {
      const current = groupedForecast[lastKey];
      const prev = groupedForecast[dayKeys[dayKeys.length - 2]] || [];
      const missing = maxEntriesPerDay - current.length;
      return (missing > 0 ? prev.slice(-missing) : []).concat(current);
    }

    return groupedForecast[selectedDayKey];
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
      <AnimatePresence>{isSearching && <Intro />}</AnimatePresence>
      <motion.div
        layout
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ type: "spring", bounce: 0.25, duration: 0.3 }}
        className={styles.formWrapper}
      >
        {!isSearching && (
          <button
            className={styles.backButton}
            onClick={() => {
              handleEraseState();
            }}
          >
            <FontAwesomeIcon icon={faArrowLeft} />
          </button>
        )}
        <Input fetchWeather={fetchWeather} isSearching={isSearching} />
        <AnimatePresence>
          {error && <ErrorMessage message={error} />}
        </AnimatePresence>
      </motion.div>

      {currentWeather && groupedForecast && selectedDayKey && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ type: "spring", bounce: 0.25, duration: 0.3 }}
          className={styles.layout}
        >
          <>
            <div className={styles.firstTitleWrapper}>
              <h3>Current Weather</h3>
              <div className={styles.unitToggle}>
                <UnitToggle unit={unit} setUnit={setUnit} />
              </div>
            </div>
            <Card>
              <CurrentWeatherCard weatherData={currentWeather} unit={unit} />
            </Card>
            <WeatherMap
              centerLat={currentWeather.coord.lat}
              centerLon={currentWeather.coord.lon}
              zoom={10}
              unit={unit}
            />
            <h3>Week forecast</h3>
            <Card>
              <div className={styles.chartWrapper}>
                <ForecastChart chartData={getChartData()} />
                <div className={styles.forecastContainer}>
                  {Object.keys(groupedForecast).map((dayKey) => (
                    <ForecastDayCard
                      key={dayKey}
                      weatherData={groupedForecast[dayKey]}
                      onClick={() => setSelectedDayKey(dayKey)}
                      selected={selectedDayKey === dayKey}
                    />
                  ))}
                </div>
              </div>
            </Card>
          </>
        </motion.div>
      )}
    </main>
  );
}
