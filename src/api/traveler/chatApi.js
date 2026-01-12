import api from "../axios";

// get trip details
export const getTripById = async (tripId) => {
  const res = await api.get(`/api/traveler/${tripId}`);
  return res.data.data;
};

// get participants
export const getParticipants = async (tripId) => {
  const res = await api.get(`/api/traveler/participants/${tripId}`);
  return res.data.data;
};

// get messages
export const getTripMessages = async (tripId) => {
  const res = await api.get(`/api/traveler/${tripId}/messages`);
  return res.data.data;
};
