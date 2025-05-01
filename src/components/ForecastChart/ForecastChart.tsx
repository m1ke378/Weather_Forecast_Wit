import React from "react";
import styles from "./ForecastChart.module.css";
import {
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Title,
  Tooltip,
} from "chart.js";
import { Line } from "react-chartjs-2";

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
  Filler
);

export const options = {
  responsive: true,
  maintainAspectRatio: true,
  scales: {
    y: {
      ticks: {
        display: true,
      },
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
    },
    x: {
      ticks: {
        display: true,
      },
      grid: {
        display: false,
      },
      border: {
        display: false,
      },
    },
  },
  plugins: {
    legend: {
      display: false,
    },
  },
};

export default function ForecastChart({ chartData }: { chartData: any }) {
  const data = {
    labels: chartData.map((item: any) => {
      const date = item.dt_txt.split(" ")[1]; // "HH:MM:SS"
      return date.split(":")[0]; // "HH";
    }),
    datasets: [
      {
        fill: true,
        tension: 0.5,
        data: chartData.map((item: any) => item.main.temp),
        pointRadius: 0,
        backgroundColor: (ctx) => {
          const canvas = ctx.chart.ctx;
          const gradient = canvas.createLinearGradient(
            0,
            0,
            0,
            ctx.chart.height
          );

          gradient.addColorStop(0, "rgba(255,255,255,1)");
          gradient.addColorStop(1, "rgba(255,255,255,0)");

          return gradient;
        },
      },
    ],
  };
  return (
    <div>
      <h2>Forecast Chart</h2>
      <p>Chart will be displayed here.</p>
      <Line options={options} data={data} />
    </div>
  );
}
