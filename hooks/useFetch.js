'use client';

import { useState, useEffect, useCallback, useRef } from "react";
import axios from "axios";

const useFetch = (url, method = "GET", options = {}) => {
  const [data, setData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const controllerRef = useRef(null);

  const fetchData = useCallback(async () => {
    if (!url || typeof url !== "string" || url.includes("${")) {
      return;
    }

    if (controllerRef.current) {
      controllerRef.current.abort();
    }

    const controller = new AbortController();
    controllerRef.current = controller;

    setLoading(true);
    setError(null);

    try {
      const res = await axios({
        url: url,
        method: method,
        signal: controller.signal,
        withCredentials: true, // ✅ IMPORTANT FIX
        ...options,
      });

      setData(res.data);
    } catch (err) {
      if (err.name !== "CanceledError" && err.name !== "AbortError") {
        setError(err.message || "Something went wrong");
      }
    } finally {
      setLoading(false);
    }
  }, [url, method, JSON.stringify(options)]);

  useEffect(() => {
    if (!url) return;

    fetchData();

    return () => {
      if (controllerRef.current) {
        controllerRef.current.abort();
      }
    };
  }, [url]);

  return {
    data,
    loading,
    error,
    refetch: fetchData,
  };
};

export default useFetch;