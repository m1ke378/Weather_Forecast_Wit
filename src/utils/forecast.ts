import { WeatherData } from "@/utils/types";

type GroupedForecast = {
  [date: string]: WeatherData[];
};

/**
 * groupForecastByDay returns an array of the forecast entries grouped by day.
 *
 *
 * @param list - The list of values to group
 * @returns - The grouped values
 *
 * @example
 *
 * {
 *   "2025-04-30": [ 8 entries here],
 *   "2025-05-01": [ 8 entries here ],
 *    ...
 * }
 */

export function groupForecastByDay(list: WeatherData[]): GroupedForecast {
  return list.reduce((acc: GroupedForecast, item) => {
    const date = item.dt_txt.split(" ")[0]; // "YYYY-MM-DD"
    if (!acc[date]) {
      acc[date] = [];
    }
    acc[date].push(item);
    return acc;
  }, {});
}

/**
 * getMostFrequent returns the avg weather/icon for a given day based on the 8 entries available.
 *
 *
 * @param dayForecast - The list of entries for a given day
 * @returns - The avg value (Clouds, Rain, Clear, etc... / 10d.png, etc...  )
 *
 */

function getMostFrequent<T>(
  data: WeatherData[],
  selector: (entry: WeatherData) => string | undefined
): string | "Unknown" {
  const counts: Record<string, number> = {};

  for (const entry of data) {
    const value = selector(entry);
    if (value) {
      const key = String(value);
      counts[key] = (counts[key] || 0) + 1;
    }
  }

  let maxKey: string | null = null;
  let maxCount = 0;

  for (const key in counts) {
    if (counts[key] > maxCount) {
      maxKey = key;
      maxCount = counts[key];
    }
  }

  return maxKey || "Unknown";
}

export function getAverageWeatherIcon(dayForecast: WeatherData[]): string {
  return getMostFrequent(dayForecast, (entry) => entry.weather?.[0]?.icon);
}

export function getAverageWeatherCondition(dayForecast: WeatherData[]): string {
  return getMostFrequent(dayForecast, (entry) => entry.weather?.[0]?.main);
}

/* ##################################### */

export function getMinTemp(entries: WeatherData[]): number {
  return Math.round(Math.min(...entries.map((entry) => entry.main.temp_min)));
}

export function getMaxTemp(entries: WeatherData[]): number {
  return Math.round(Math.max(...entries.map((entry) => entry.main.temp_max)));
}

const weekdays = [
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
];

export function getWeekday(dayNumber: number): string {
  return weekdays[dayNumber];
}
