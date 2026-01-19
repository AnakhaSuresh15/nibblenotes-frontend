// src/lib/api.js
import axios from "axios";

const api = axios.create({
  baseURL: "http://localhost:4000/api", // use proxy (vite) OR change to http://localhost:4000/api
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export default api;
