import styles from "./CurrentWeatherCard.module.css";
import { WeatherData } from "@/utils/types";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import HighlightedIcon from "../HighlightedIcon/HighlightedIcon";
import {
  faArrowUp,
  faCloud,
  faEye,
  faWind,
} from "@fortawesome/free-solid-svg-icons";
import { getWeekday } from "@/utils/forecast";

interface CurrentWeatherCardProps {
  weatherData: WeatherData;
  unit: "metric" | "imperial";
}

export default function CurrentWeatherCard({
  weatherData,
  unit,
}: CurrentWeatherCardProps) {
  const weekday = getWeekday(new Date(weatherData.dt * 1000).getDay());
  const description =
    weatherData.weather[0].description.charAt(0).toUpperCase() +
    weatherData.weather[0].description.slice(1);

  return (
    <div className={styles.currentWeatherCard}>
      <div className={styles.topSection}>
        <div className={styles.iconTempGroup}>
          <HighlightedIcon
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
            blur={5}
            height={100}
          />
          <div className={styles.tempGroup}>
            <span className={styles.temp}>
              {Math.round(weatherData.main.temp)}
            </span>
            <span>{unit === "metric" ? "°C" : "°F"}</span>
          </div>
        </div>
        <div className={styles.descriptionGroup}>
          <h3>{weekday}</h3>
          <div>{description}</div>
        </div>
      </div>
      <div className={styles.detailsGroup}>
        <div className={styles.detailItem}>
          <FontAwesomeIcon icon={faWind} />
          <span>
            {`${weatherData.wind.speed} ${unit === "metric" ? "m/s" : "mph"}`}
          </span>
          <span>
            <FontAwesomeIcon
              icon={faArrowUp}
              style={{ transform: `rotate(${weatherData.wind.deg}deg)` }}
            />
          </span>
        </div>
        <div className={styles.detailItem}>
          <FontAwesomeIcon icon={faCloud} />
          <span>{weatherData.clouds.all}%</span>
        </div>
        <div className={styles.detailItem}>
          <FontAwesomeIcon icon={faEye} />
          <span>{`${
            weatherData.visibility > 1000
              ? weatherData.visibility / 1000
              : weatherData.visibility
          } ${unit === "metric" ? "km" : "mi"}`}</span>
        </div>
      </div>
    </div>
  );
}
