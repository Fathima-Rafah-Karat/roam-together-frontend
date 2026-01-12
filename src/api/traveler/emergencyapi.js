import api from "../axios";

// Get all emergency contacts
export const getEmergencyContacts = async () => {
  const res = await api.get("/api/traveler/viewemergency");
  return res.data;
};

// Add emergency contact
export const addEmergencyContact = async (data) => {
  const res = await api.post("/api/traveler/emergency", data);
  return res.data;
};

// Delete emergency contact
export const deleteEmergencyContact = async (id) => {
  const res = await api.delete(`/api/traveler/emergency/${id}`);
  return res.data;
};
