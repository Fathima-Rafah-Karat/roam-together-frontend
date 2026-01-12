import api from "../axios";

/**
 * Get all notifications for traveler
 */
export const getNotifications = async () => {
  const res = await api.get(
    "/api/traveler/notification/notify"
  );
  return res.data;
};

/**
 * Get single notification by ID
 */
export const getNotificationById = async (id) => {
  const res = await api.get(
    `/api/traveler/notification/notify/${id}`
  );
  return res.data;
};

/**
 * Mark notification as read
 */
export const markNotificationAsRead = async (id) => {
  const res = await api.put(
    `/api/traveler/notification/mark/${id}`
  );
  return res.data;
};
