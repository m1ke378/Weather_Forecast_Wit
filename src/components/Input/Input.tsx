"use client";

import React, { useEffect, useState } from "react";
import { ErrorMessage, Field, Form, Formik } from "formik";
import styles from "./Input.module.css";
import * as Yup from "yup";
import { useDebounce } from "@/hooks/useDebounce";
import axios from "axios";

type CityOption = {
  name: string;
  countryCode: string;
  lat: number;
  lon: number;
};

export default function Input({
  fetchWeather,
}: {
  fetchWeather: (lat: number, lon: number) => void;
}) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 800);
  const [suggestions, setSuggestions] = useState<CityOption[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (debouncedQuery.length < 3) return;

      try {
        const response = await axios.get(
          `http://geodb-free-service.wirefreethought.com/v1/geo/places?namePrefix=${debouncedQuery}&limit=5&offset=0&sort=name&types=CITY`
        );
        const data = response.data;
        console.log(data);
        const cities = data.data.map((item: any) => ({
          name: item.name,
          countryCode: item.countryCode,
          lat: item.latitude,
          lon: item.longitude,
        }));
        setSuggestions(cities);
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
    const label = `${city.name}, ${city.countryCode}`;
    setFieldValue("city", label);
    setSuggestions([]);
    fetchWeather(city.lat, city.lon);
  };

  return (
    <div>
      <Formik
        initialValues={{ city: "" }}
        validationSchema={Yup.object({
          city: Yup.string().required("City is required"),
        })}
        validateOnChange={true}
        onSubmit={() => {}}
      >
        {({ values, setFieldValue, handleBlur }) => (
          <Form>
            <label htmlFor="city">City</label>
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
            />
            <ErrorMessage name="city" />
            {suggestions.length > 0 && (
              <ul
                style={{
                  background: "#fff",
                  border: "1px solid #ccc",
                  padding: "0.5rem",
                }}
              >
                {suggestions.map((city, i) => (
                  <li
                    key={i}
                    style={{ cursor: "pointer", padding: "0.25rem 0" }}
                    onClick={() => handleSelect(city, setFieldValue)}
                  >
                    {city.name}, {city.countryCode}
                  </li>
                ))}
              </ul>
            )}
          </Form>
        )}
      </Formik>
    </div>
  );
}
