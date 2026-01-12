import api from "../axios";

export const getUserRegistrations = async () => {
  const res = await api.get("/api/traveler/registered");
  return res.data; // { success, data }
};


export const registerForTrip = async (formData) => {
  const res = await api.post(
    "/api/traveler/register",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};