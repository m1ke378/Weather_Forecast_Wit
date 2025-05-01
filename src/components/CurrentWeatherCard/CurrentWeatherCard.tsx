import Image from "next/image";
import styles from "./CurrentWeatherCard.module.css";
import { WeatherData } from "@/utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HighlightedIcon from "../HighlightedIcon/HighlightedIcon";

export default function CurrentWeatherCard({
  weatherData,
}: {
  weatherData: WeatherData;
}) {
  return (
    <div className={styles.currentWeatherCard}>
      <h2>Current Weather</h2>
      <HighlightedIcon
        src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@4x.png`}
        alt={weatherData.weather[0].description}
        blur={10}
      />
      <p>
        wind: {weatherData.wind.speed}km/h {weatherData.wind.deg}º
      </p>
      <p>clouds: {weatherData.clouds.all}%</p>
      <p>temperature: {weatherData.main.temp}º</p>
      <p>visibility: {weatherData.visibility}m</p>
    </div>
  );
}
