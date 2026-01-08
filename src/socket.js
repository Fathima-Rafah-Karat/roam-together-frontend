import { io } from "socket.io-client";

// Before: localhost
// const socket = io("http://localhost:5000");

// After: Render backend URL
const socket = io("https://roamtogether.onrender.com", {
  transports: ["websocket", "polling"],
});
