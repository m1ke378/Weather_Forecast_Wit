import { getAverageTemp, getWeekday } from "@/utils/forecast";
import { WeatherData } from "@/utils/types";
import styles from "./ForecastDayCard.module.css";

export default function ForecastDayCard({
  weatherData,
  onClick,
}: {
  weatherData: WeatherData[];
  onClick: () => void;
}) {
  console.log(weatherData);
  const weekday = getWeekday(
    new Date(weatherData[0].dt * 1000).getDay()
  ).substring(0, 3);
  return (
    <div className={styles.forecastDayCard} onClick={onClick}>
      <h4>{weekday}</h4>
      <img
        src={`https://openweathermap.org/img/wn/${
          weatherData[weatherData.length > 3 ? 3 : 0].weather[0].icon
        }.png`}
        alt={weatherData[0].weather[0].description}
      />
      <div
        style={{
          display: "flex",
          gap: "0.5rem",
        }}
      >
        <p>{Math.round(getAverageTemp(weatherData, "min"))}º</p>
        <p>{Math.round(getAverageTemp(weatherData, "max"))}º</p>
      </div>
    </div>
  );
}
