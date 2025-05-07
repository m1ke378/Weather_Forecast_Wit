"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import styles from "./WeatherMap.module.css";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
if (!API_KEY) {
  throw new Error("API key is not defined.");
}

interface WeatherMapProps {
  centerLat: number;
  centerLon: number;
  zoom: number;
  unit: "imperial" | "metric";
}

export default function WeatherMap({
  centerLat,
  centerLon,
  zoom,
  unit,
}: WeatherMapProps) {
  const ColorScale = () => {
    return (
      <div className={styles.colorScaleContainer}>
        <div className={styles.colorGradient}></div>
        <div className={styles.colorScaleLegend}>
          {unit === "metric" ? (
            <>
              <span>-40°</span>
              <span>-20°</span>
              <span>0°</span>
              <span>10°</span>
              <span>20°</span>
              <span>30°</span>
            </>
          ) : (
            <>
              <span>-40°</span>
              <span>-4°</span>
              <span>32°</span>
              <span>50°</span>
              <span>68°</span>
              <span>86°</span>
            </>
          )}
        </div>
      </div>
    );
  };

  return (
    <div>
      <MapContainer
        center={[centerLat, centerLon]}
        zoom={zoom}
        className={styles.mapContainer}
        attributionControl={false}
      >
        <TileLayer
          url={`https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png`}
          attribution="&copy; OpenStreetMap contributors"
        />
        <TileLayer
          url={`https://tile.openweathermap.org/map/temp_new/{z}/{x}/{y}.png?appid=${API_KEY}`}
          attribution="&copy; OpenWeatherMap"
          opacity={0.5}
        />
      </MapContainer>
      <div>
        <ColorScale />
      </div>
    </div>
  );
}
