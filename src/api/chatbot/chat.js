import api from "../axios";

export const chat = (data) => {
  return api.post("/api/chatbot/chat", {
    text: data.text, // ✅ match backend
  });
};