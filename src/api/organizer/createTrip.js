import api from "../axios";
export const createTrip = async (formData) => {
  const res = await api.post(
    "/api/organizer/createtrip",
    formData,
    {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    }
  );

  return res.data;
};