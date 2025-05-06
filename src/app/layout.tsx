import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { AnimatePresence } from "motion/react";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "5-day Weather Forecast",
  description:
    "Technical chalenge for applying to a web developer role at Wit Software",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={`${geistSans.variable} ${geistMono.variable}`}>
        <AnimatePresence>{children}</AnimatePresence>
      </body>
      <footer>
        <p>Powered by OpenWeatherMap | OpenStreetMap | Leaflet</p>
        <p>Developed by Miguel Saraiva</p>
      </footer>
    </html>
  );
}
