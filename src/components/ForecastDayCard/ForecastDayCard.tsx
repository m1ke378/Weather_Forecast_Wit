import {
  getAverageWeatherIcon,
  getMaxTemp,
  getMinTemp,
  getWeekday,
} from "@/utils/forecast";
import { WeatherData } from "@/utils/types";
import styles from "./ForecastDayCard.module.css";

interface ForecastDayCardProps {
  weatherData: WeatherData[];
  onClick: () => void;
  selected: boolean;
}

export default function ForecastDayCard({
  weatherData,
  onClick,
  selected,
}: ForecastDayCardProps) {
  const weekday = getWeekday(
    new Date(weatherData[0].dt * 1000).getDay()
  ).substring(0, 3);
  return (
    <div
      className={`${styles.forecastDayCard} ${selected && styles.selected}`}
      onClick={onClick}
    >
      <h4>{weekday}</h4>
      <img
        src={`https://openweathermap.org/img/wn/${getAverageWeatherIcon(
          weatherData
        ).substring(0, 2)}d.png`}
        alt={
          weatherData[Math.round(weatherData.length / 2) - 1].weather[0]
            .description
        }
      />
      <div className={styles.tempGroup}>
        <p>{getMinTemp(weatherData)}°</p>
        <p>{getMaxTemp(weatherData)}°</p>
      </div>
    </div>
  );
}
