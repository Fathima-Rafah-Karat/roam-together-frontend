import api from "../axios";

export const sendNotification = async (data) => {
  const res = await api.post(
    "/api/organizer/notification",
    data
  );

  return res.data;
};
