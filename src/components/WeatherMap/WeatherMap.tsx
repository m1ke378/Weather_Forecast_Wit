"use client";

import { MapContainer, TileLayer } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { convertToTileCoordenates } from "@/utils/forecast";
import styles from "./WeatherMap.module.css";

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
if (!API_KEY) {
  throw new Error("API key is not defined.");
}

const ColorScale = ({ unit }: { unit: "imperial" | "metric" }) => {
  return (
    <div className={styles.colorScaleContainer}>
      <div className={styles.colorGradient}></div>
      <div className={styles.colorScaleLegend}>
        {unit === "metric" ? (
          <>
            <span>-40°</span>
            <span>0°</span>
            <span>20°</span>
            <span>40°</span>
            <span>60°</span>
          </>
        ) : (
          <>
            <span>-40°</span>
            <span>32°</span>
            <span>68°</span>
            <span>104°</span>
            <span>140°</span>
          </>
        )}
      </div>
    </div>
  );
};

export default function WeatherMap({
  centerLat,
  centerLon,
  zoom,
  unit,
}: {
  centerLat: number;
  centerLon: number;
  zoom: number;
  unit: "imperial" | "metric";
}) {
  const { tileX, tileY } = convertToTileCoordenates(centerLat, centerLon, zoom);

  return (
    <div>
      <MapContainer
        center={[centerLat, centerLon]}
        zoom={zoom}
        className={styles.mapContainer}
        scrollWheelZoom={false}
        dragging={false}
        doubleClickZoom={false}
        zoomControl={false}
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
        <ColorScale unit={unit} />
      </div>
    </div>
  );
}
