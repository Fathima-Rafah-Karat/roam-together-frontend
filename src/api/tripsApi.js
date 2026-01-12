import api from "./axios";

export const getAllTrips = async () => {
  try {
    const response = await api.get("/api/traveler/trips");
    return response.data; // contains the trips array
  } catch (err) {
    console.error("Failed to fetch trips", err);
    throw err;
  }
};
export const getTripById = async (tripId) => {
  const res = await api.get(`/api/traveler/${tripId}`);
  return res.data.data;
};