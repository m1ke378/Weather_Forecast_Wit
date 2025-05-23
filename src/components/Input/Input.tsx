"use client";

import React, { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import styles from "./Input.module.css";
import * as Yup from "yup";
import { useDebounce } from "@/hooks/useDebounce";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faWarning } from "@fortawesome/free-solid-svg-icons";
import { AnimatePresence, motion } from "motion/react";

type CityOption = {
  name: string;
  countryCode: string;
  state: string | null;
  lat: number;
  lon: number;
};

const API_KEY = process.env.NEXT_PUBLIC_WEATHER_API_KEY;
if (!API_KEY) {
  throw new Error("API key is not defined.");
}

export default function Input({
  fetchWeather,
  isSearching,
}: {
  fetchWeather: (lat: number, lon: number) => void;
  isSearching: boolean;
}) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [suggestions, setSuggestions] = useState<CityOption[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery) {
        setSuggestions([]);
        return;
      }

      try {
        setIsLoading(true);
        const response = await axios.get(
          `https://api.openweathermap.org/geo/1.0/direct?q=${debouncedQuery}&limit=5&appid=${API_KEY}`
        );
        const data = response.data;
        const cities = data.map((item: any) => ({
          name: item.name,
          countryCode: item.country,
          state: item.state || null,
          lat: item.lat,
          lon: item.lon,
        }));
        setSuggestions(cities);
        setIsLoading(false);
      } catch (error) {
        console.error("City search failed", error);
        setSuggestions([]);
      }
    };

    fetchSuggestions();
  }, [debouncedQuery]);

  const handleSelect = (
    city: CityOption,
    setFieldValue: (field: string, value: any) => void
  ) => {
    setFieldValue(
      "city",
      `${city.name}, ${city.countryCode}${city.state ? `, ${city.state}` : ""}`
    );
    setSuggestions([]);
    setQuery("");
    fetchWeather(city.lat, city.lon);
  };

  return (
    <Formik
      initialValues={{ city: "" }}
      validationSchema={Yup.object({
        city: Yup.string().required("City name required"),
      })}
      validateOnChange={true}
      validateOnBlur={true}
      onSubmit={() => {}}
    >
      {({ values, errors, touched, setFieldValue, handleBlur, resetForm }) => (
        <Form>
          <div
            className={`${styles.cityInputWrapper} ${
              errors.city && touched.city ? styles.errorInput : ""
            } ${!isSearching ? styles.cityInputWrapperDisabled : ""}`}
          >
            <Field
              id="city"
              name="city"
              value={values.city}
              placeholder="Enter a city name"
              onChange={(e: React.ChangeEvent<HTMLInputElement>) => {
                setFieldValue("city", e.target.value);
                setQuery(e.target.value);
              }}
              onBlur={handleBlur}
              onFocus={() => {
                if (values.city) {
                  setQuery(values.city);
                }
              }}
              className={styles.cityInput}
              style={{
                borderBottom:
                  debouncedQuery.length > 0 && query.length > 0 && !isLoading
                    ? "solid 1px rgba(255, 255, 255, 0.5)"
                    : "none",
              }}
              disabled={!isSearching}
            />
            <AnimatePresence>
              {debouncedQuery.length > 0 && query.length > 0 && !isLoading && (
                <motion.div
                  layout
                  key="dropdown"
                  initial={{ translateY: -30, opacity: 0, height: 0 }}
                  animate={{
                    translateY: 0,
                    opacity: 1,
                    height: "fit-content",
                  }}
                  exit={{ translateY: 30, opacity: 0, height: 0 }}
                  transition={{ duration: 0.1 }}
                  className={styles.dropdown}
                >
                  <ul>
                    {suggestions.length > 0 ? (
                      suggestions.map((city, index) => (
                        <li
                          key={index}
                          onClick={() => {
                            resetForm();
                            handleSelect(city, setFieldValue);
                          }}
                        >
                          {`${city.name}, ${city.countryCode}${
                            city.state ? `, ${city.state}` : ""
                          }`}
                        </li>
                      ))
                    ) : (
                      <li className={styles.liDisabled}>No results found</li>
                    )}
                  </ul>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          {errors.city && touched.city && (
            <div className={styles.errorMessage}>
              <span>
                <FontAwesomeIcon icon={faWarning} />
              </span>{" "}
              {errors.city}
            </div>
          )}
        </Form>
      )}
    </Formik>
  );
}
