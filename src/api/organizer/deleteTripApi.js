import api from "../axios";

// Delete a trip by ID
export const deleteTrip = async (tripId, token) => {
  const res = await api.delete(`/api/organizer/deletetrip/${tripId}`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  return res.data; 
};
