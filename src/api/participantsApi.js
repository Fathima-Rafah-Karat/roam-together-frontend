import api from "./axios";

export const getParticipantCount = async (tripId) => {
  const res = await api.get(
    `/api/traveler/participants/${tripId}`
  );

  return res.data;
};
export const getParticipants = async (tripId) => {
  const res = await api.get(`/api/traveler/participants/${tripId}`);
  return res.data; 
};