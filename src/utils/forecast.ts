interface ForecastItem {
  dt_txt: string;
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

function getDailyAverage(list: ForecastItem[]) {
  const temps = list.map((i) => i.main.temp);
  const avg = temps.reduce((sum, t) => sum + t, 0) / temps.length;
  return parseFloat(avg.toFixed(1));
}
