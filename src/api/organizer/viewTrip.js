import api from "../axios";

export const getOrganizerTrips = async () => {
  const res = await api.get("/api/organizer/viewtrip");
  return Array.isArray(res.data) ? res.data : res.data?.data || [];
};