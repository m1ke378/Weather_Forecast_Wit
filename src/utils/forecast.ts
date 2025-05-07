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

/**
 * getAverageDayCondition / getAverageDayIcon returns the avg weather/icon for a given day based on the 8 entries available.
 *
 *
 * @param dayForecast - The list of entries for a given day
 * @returns - The avg value (Clouds, Rain, Clear, etc... / 10d.png, etc...  )
 *
 */

export function getAverageDayIcon(dayForecast: WeatherData[]): string {
  const counts: Record<string, number> = {};

  for (const entry of dayForecast) {
    const icon = entry.weather?.[0]?.icon;
    if (icon) {
      counts[icon] = (counts[icon] || 0) + 1;
    }
  }

  let maxIcon = null;
  let maxCount = 0;

  for (const icon in counts) {
    if (counts[icon] > maxCount) {
      maxIcon = icon;
      maxCount = counts[icon];
    }
  }

  return maxIcon || "Unknown";
}

export function getAverageDayCondition(dayForecast: WeatherData[]): string {
  const counts: Record<string, number> = {};

  for (const entry of dayForecast) {
    const condition = entry.weather?.[0]?.main;
    if (condition) {
      counts[condition] = (counts[condition] || 0) + 1;
    }
  }

  let maxCondition = null;
  let maxCount = 0;

  for (const condition in counts) {
    if (counts[condition] > maxCount) {
      maxCondition = condition;
      maxCount = counts[condition];
    }
  }

  return maxCondition || "Unknown";
}

export function getAverageTemp(entries: WeatherData[]): number {
  if (!entries || entries.length === 0) return 0;

  const total = entries.reduce((sum, entry) => sum + entry.main.temp, 0);
  return Math.round(total / entries.length);
}
