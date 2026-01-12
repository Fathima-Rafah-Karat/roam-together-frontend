import api from "../axios";

// Get dashboard counts
export const getOrganizerDashboardCount = async () => {
  const res = await api.get("/api/organizer/count");
  return res.data?.data || res.data;
};