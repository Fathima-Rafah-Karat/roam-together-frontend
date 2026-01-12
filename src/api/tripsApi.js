import api from "./axios";

export const getAllTrips = async () => {
  const response = await api.get("/api/traveler/trips");
  return response.data;
};
export const getTripById = async (tripId) => {
  const res = await api.get(`/api/traveler/${tripId}`);
  return res.data.data;
};