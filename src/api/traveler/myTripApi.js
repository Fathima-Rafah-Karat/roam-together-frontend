import api from "../axios";

/* ======================
   TRIPS
====================== */

// Fetch user's trips (upcoming + past)
export const getMyTrips = async () => {
  const res = await api.get("/api/traveler/mytrip/view");

  return {
    upcoming: res.data.upcoming ?? [],
    past: res.data.past ?? [],
  };
};

/* ======================
   REVIEWS
====================== */

// Get all reviews and filter by tripId
export const getTripReviews = async (tripId) => {
  const res = await api.get(
    "/api/traveler/review&rating/rateandreview"
  );

  const reviews = res.data?.data ?? [];

  return reviews.filter(
    (r) => String(r.tripId) === String(tripId)
  );
};

// Create review
export const createTripReview = async (data) => {
  const res = await api.post(
    "/api/traveler/review&rating",
    data
  );

  return res.data;
};
