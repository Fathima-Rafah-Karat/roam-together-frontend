import api from "../axios"; // your axios instance

/**
 * Cancel / remove a trip by ID
 * @param {string} tripId
 * @returns {Promise<{ success: boolean, message: string }>}
 */
export const cancelTrip = async (tripId) => {
  try {
    const token = localStorage.getItem("token");
    if (!token) throw new Error("Unauthorized — please login again");

    const res = await api.delete(`/api/traveler/remove-trip/${tripId}`, {
      headers: { Authorization: `Bearer ${token}` },
    });

    return res.data; // { success: true, message: "Trip canceled" }
  } catch (err) {
    console.error("Error cancelling trip:", err);
    throw err;
  }
};
