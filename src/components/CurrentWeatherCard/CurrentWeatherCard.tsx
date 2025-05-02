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

export default function CurrentWeatherCard({
  weatherData,
  unit,
}: {
  weatherData: WeatherData;
  unit: "metric" | "imperial";
}) {
  const weekday = getWeekday(new Date(weatherData.dt * 1000).getDay());
  const description =
    weatherData.weather[0].description.charAt(0).toUpperCase() +
    weatherData.weather[0].description.slice(1);

  return (
    <div className={styles.currentWeatherCard}>
      <div
        style={{
          display: "flex",
          gap: "2rem",
          alignItems: "center",
          justifyContent: "space-between",
        }}
      >
        <div style={{ display: "flex", alignItems: "center" }}>
          <HighlightedIcon
            src={`https://openweathermap.org/img/wn/${weatherData.weather[0].icon}@2x.png`}
            alt={weatherData.weather[0].description}
            blur={5}
            height={100}
          />
          <div
            style={{
              display: "flex",
              gap: ".8rem",
              alignItems: "baseline",
            }}
          >
            <span style={{ fontSize: "50px", fontWeight: "600" }}>
              {Math.round(weatherData.main.temp)}
            </span>
            <span>{unit === "metric" ? "°C" : "°F"}</span>
          </div>
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: ".8rem",
            textAlign: "right",
            paddingRight: ".8rem",
          }}
        >
          <h3>{weekday}</h3>
          <div>{description}</div>
        </div>
      </div>
      <div
        style={{
          display: "flex",
          gap: ".8rem",
          justifyContent: "space-between",
          paddingInline: "1rem",
        }}
      >
        <div
          style={{
            display: "flex",
            gap: ".5rem",
          }}
        >
          <FontAwesomeIcon icon={faWind} />
          <span>{weatherData.wind.speed}km/h</span>
          <span>
            <FontAwesomeIcon
              icon={faArrowUp}
              style={{ transform: `rotate(${weatherData.wind.deg}deg)` }}
            />
          </span>
        </div>
        <div
          style={{
            display: "flex",
            gap: ".5rem",
          }}
        >
          <FontAwesomeIcon icon={faCloud} />
          <span>{weatherData.clouds.all}%</span>
        </div>
        <div
          style={{
            display: "flex",
            gap: ".5rem",
          }}
        >
          <FontAwesomeIcon icon={faEye} />
          <span>{weatherData.visibility}m</span>
        </div>
      </div>
    </div>
  );
}
