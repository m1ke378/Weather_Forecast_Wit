type WeatherData = {
  main: {
    temp: number;
    feels_like: number;
    temp_min: number;
    temp_max: number;
    pressure: number;
    humidity: number;
  };
  weather: {
    id: number;
    main: string;
    description: string;
    icon: string;
  }[];
  wind: {
    speed: number;
    deg: number;
  };
  clouds: {
    all: number;
  };
};

export default function CurrentWeatherCard({
  weatherData,
}: {
  weatherData: WeatherData;
}) {
  return (
    <div>
      <h2>Current Weather</h2>
      <pre>{JSON.stringify(weatherData, null, 2)}</pre>
    </div>
  );
}
