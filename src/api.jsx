import axios from "axios";

const BASE_URL = "http://localhost:5000"; // replace with your backend URL

export const api = axios.create({
  baseURL: BASE_URL,
});
