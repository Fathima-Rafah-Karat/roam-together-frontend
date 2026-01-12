import api from "../axios";

export const getAllReview = async () => {
  const res = await api.get(
    "/api/traveler/review&rating/rateandreview",
    { withCredentials: true }
  );

  // ✅ always return an array
  return Array.isArray(res.data?.data) ? res.data.data : [];
};
