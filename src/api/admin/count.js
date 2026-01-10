import api from "../axios";

// ✅ Get main dashboard stats
export const getDashboardCount = async () => {
  const res = await api.get("/api/admin/count");
  return res.data.data;
};

// ✅ Get verification stats for Pie chart
export const getVerificationStats = async () => {
  const res = await api.get("/api/admin/verification-stats");
  return res.data.data;
};

// ✅ Get platform growth for Line chart
export const getGrowthData = async () => {
  const res = await api.get("/api/admin/growth");
  return res.data.data;
};
