import api from "./axios";

export const getAllTrips = async () => {
  const response = await api.get("/api/traveler/trips");
  return response.data;
};
