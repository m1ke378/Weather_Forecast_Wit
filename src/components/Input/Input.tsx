"use client";

import React, { useEffect, useState } from "react";
import { Field, Form, Formik } from "formik";
import styles from "./Input.module.css";
import * as Yup from "yup";
import { useDebounce } from "@/hooks/useDebounce";
import axios from "axios";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faArrowLeft, faWarning } from "@fortawesome/free-solid-svg-icons";

type CityOption = {
  name: string;
  countryCode: string;
  lat: number;
  lon: number;
};

export default function Input({
  fetchWeather,
  handleEraseState,
  isSearching,
}: {
  fetchWeather: (lat: number, lon: number) => void;
  handleEraseState: () => void;
  isSearching: boolean;
}) {
  const [query, setQuery] = useState("");
  const debouncedQuery = useDebounce(query, 500);
  const [suggestions, setSuggestions] = useState<CityOption[]>([]);

  useEffect(() => {
    const fetchSuggestions = async () => {
      if (!debouncedQuery) {
        setSuggestions([]);
        return;
      }

      try {
        const response = await axios.get(
          `http://geodb-free-service.wirefreethought.com/v1/geo/places?namePrefix=${debouncedQuery}&limit=5&offset=0&types=CITY&sort=-name`
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
    setFieldValue("city", city.name);
    setSuggestions([]);
    fetchWeather(city.lat, city.lon);
  };

  return (
    <div>
      <Formik
        initialValues={{ city: "" }}
        validationSchema={Yup.object({
          city: Yup.string().required("City name required"),
        })}
        validateOnChange={true}
        validateOnBlur={true}
        onSubmit={() => {}}
      >
        {({
          values,
          errors,
          touched,
          setFieldValue,
          handleBlur,
          resetForm,
        }) => (
          <div className={styles.formWrapper}>
            {!isSearching && (
              <button
                className={styles.backButton}
                onClick={() => {
                  resetForm();
                  setSuggestions([]);
                  handleEraseState(); // optionally notify parent
                }}
              >
                <FontAwesomeIcon icon={faArrowLeft} />
              </button>
            )}
            <Form>
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
                className={`${styles.cityInput} ${
                  errors.city && touched.city ? styles.errorInput : ""
                }`}
                disabled={!isSearching}
              />
              {errors.city && touched.city && (
                <div className={styles.errorMessage}>
                  <span>
                    <FontAwesomeIcon icon={faWarning} />
                  </span>{" "}
                  {errors.city}
                </div>
              )}
              {suggestions.length > 0 && (
                <div>
                  <ul
                    style={{
                      background: "#fff",
                      border: "1px solid #ccc",
                      padding: "0.5rem",
                    }}
                  >
                    {suggestions.map((city, index) => (
                      <li
                        key={index}
                        style={{ cursor: "pointer", padding: "0.25rem 0" }}
                        onClick={() => handleSelect(city, setFieldValue)}
                      >
                        {city.name}, {city.countryCode}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </Form>
          </div>
        )}
      </Formik>
    </div>
  );
}
