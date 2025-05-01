"use client";
import CurrentWeatherCard from "@/components/CurrentWeatherCard/CurrentWeatherCard";
import styles from "./page.module.css";
import Input from "@/components/Input/Input";
import { groupForecastByDay } from "@/utils/forecast";
import axios from "axios";
import { useState } from "react";
import ForecastChart from "@/components/ForecastChart/ForecastChart";

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
    } catch (err: any) {
      setGroupedForecast(null);
      setError("Failed to fetch weather data. Please try again later.");
    }
  };

  return (
    <div className={styles.page}>
      <h1>5-day weather</h1>
      <Input fetchWeather={fetchWeather} />
      {currentWeather && <CurrentWeatherCard weatherData={currentWeather} />}
      {groupedForecast && selectedDayKey && (
        <ForecastChart chartData={groupedForecast[selectedDayKey]} />
      )}
    </div>
  );
}
