import { io } from "socket.io-client";

// Use your deployed backend URL in production
const BACKEND_URL =
  import.meta.env.VITE_BACKEND_URL || "http://localhost:5000";

const socket = io(BACKEND_URL, {
  withCredentials: true,
  transports: ["websocket", "polling"], // ensures compatibility
});

export default socket;
