import api from "../axios";

// Update a trip by ID
export const updateTrip = async (tripId, formData, token) => {
  const res = await api.put(`/api/organizer/trip/${tripId}`, formData, {
    headers: {
      Authorization: `Bearer ${token}`,
      "Content-Type": "multipart/form-data",
    },
  });
  return res.data;
};
