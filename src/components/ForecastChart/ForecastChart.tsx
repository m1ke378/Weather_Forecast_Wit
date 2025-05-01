import React from "react";
import styles from "./ForecastChart.module.css";
import {
  CategoryScale,
  Chart as ChartJS,
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
  Legend
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
        display: false,
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
    label: {
      display: true,
    },
  },
};

export default function ForecastChart({ chartData }: { chartData: any }) {
  console.log("Chart data:", chartData);

  const labels = chartData.map((item: any) => {
    const date = item.dt_txt.split(" ")[1]; // "HH:MM:SS"
    return date.substring(0, 5); // "HH:MM"
  });

  const data = {
    labels,
    datasets: [
      {
        borderColor: "rgba(153,207,0,1)",
        borderWidth: 1,
        pointRadius: 0,
        data: chartData.map((item: any) => item.main.temp),
        tension: 0.5,
        backgroundColor: (ctx) => {
          const canvas = ctx.chart.ctx;
          const gradient = canvas.createLinearGradient(
            0,
            0,
            0,
            ctx.chart.height
          );

          gradient.addColorStop(0, "rgba(153,207,0,1)");
          gradient.addColorStop(0.5, "rgba(153,207,0,0.5)");
          gradient.addColorStop(1, "rgba(153,207,0,0)");

          return gradient;
        },
        fill: true,
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
