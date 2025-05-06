interface ForecastItem {
  [key: string]: any;
}

type GroupedForecast = {
  [date: string]: ForecastItem[];
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

export function groupForecastByDay(list: ForecastItem[]): GroupedForecast {
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

export function getAverageTemp(
  list: ForecastItem[],
  code: "avg" | "min" | "max"
) {
  const temps = list.map((dt) => {
    switch (code) {
      case "avg":
        return dt.main.temp;
      case "min":
        return dt.main.temp_min;
      case "max":
        return dt.main.temp_max;
      default:
        return dt.main.temp;
    }
  });
  const avg = temps.reduce((sum, t) => sum + t, 0) / temps.length;
  return parseFloat(avg.toFixed(1));
}

/**
 * getAverageDayCondition returns the avg weather for a given day based on the 8 entries available.
 *
 *
 * @param dayForecast - The list of entries for a given day
 * @returns - The avg value (Clouds, Rain, Clear, etc...)
 *
 */

export function getAverageDayCondition(dayForecast: ForecastItem[]): string {
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

/**
 * convertToTileCoordenates converts earth coordenates (lat, lon) to a 256x256 pixel tile map coordenates.
 *
 *
 * @param lat - latitude
 * @param lon - longitude
 * @param zoom - desired room
 * @returns - Object {X coordenate, Y coordenate}
 *
 */

export function convertToTileCoordenates(
  lat: number,
  lon: number,
  zoom: number
): { tileX: number; tileY: number } {
  const latRad = (lat * Math.PI) / 180;
  const n = 2 ** zoom;
  const tileX = Math.floor(((lon + 180) / 360) * n);
  const tileY = Math.floor(
    ((1 - Math.log(Math.tan(latRad) + 1 / Math.cos(latRad)) / Math.PI) / 2) * n
  );
  return { tileX, tileY };
}
