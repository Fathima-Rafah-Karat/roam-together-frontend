import api from "./axios";

export const getAllReviews = async () => {
  const response = await api.get(
    "/api/traveler/review&rating/rateandreview"
  );
  return response.data;
};
