import { div } from "motion/react-client";
import { getAverageTemp } from "@/utils/forecast";
import { WeatherData } from "@/utils/types";

export default function ForecastDayCard({
  weatherData,
}: {
  weatherData: WeatherData[];
}) {
  return (
    <div>
      <img
        src={`https://openweathermap.org/img/wn/${
          weatherData[weatherData.length > 3 ? 3 : 0].weather[0].icon
        }.png`}
        alt={weatherData[0].weather[0].description}
      />
      <p>{getAverageTemp(weatherData, "avg")}º</p>
      <p>{getAverageTemp(weatherData, "min")}º</p>
      <p>{getAverageTemp(weatherData, "max")}º</p>
    </div>
  );
}
