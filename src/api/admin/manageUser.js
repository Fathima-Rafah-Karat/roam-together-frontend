import api from "../axios";

//  Get all users (for Manageuser page)
export const getAllUsers = async () => {
  const res = await api.get("/api/auth/viewsignup");
  return res.data.data;
};
