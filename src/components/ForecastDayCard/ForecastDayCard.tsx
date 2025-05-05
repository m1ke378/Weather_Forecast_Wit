import { getAverageTemp, getWeekday } from "@/utils/forecast";
import { WeatherData } from "@/utils/types";
import styles from "./ForecastDayCard.module.css";

export default function ForecastDayCard({
  weatherData,
  onClick,
  selected,
}: {
  weatherData: WeatherData[];
  onClick: () => void;
  selected: boolean;
}) {
  console.log("Day card data: ", weatherData);
  console.log("Icon Index: ", Math.round(weatherData.length / 2) - 1);
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
        src={`https://openweathermap.org/img/wn/${weatherData[
          Math.round(weatherData.length / 2) - 1
        ].weather[0].icon.substring(0, 2)}d.png`}
        alt={
          weatherData[Math.round(weatherData.length / 2) - 1].weather[0]
            .description
        }
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
