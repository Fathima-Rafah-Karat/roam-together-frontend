import api from "../axios";

// 🔹 Get all organizer verification requests
export const getOrganizerVerifications = async () => {
  const res = await api.get("/api/admin/viewverify");
  return res.data.data;
};

// 🔹 Approve or Reject organizer verification
export const updateOrganizerVerification = async (id, status) => {
  const res = await api.put(`/api/admin/verify/${id}`, { status });
  return res.data.data;
};

export const getVerificationStatus = (organizerId) => {
  return api.get(`/api/verify/viewverify/${organizerId}`);
};

/**
 * Submit or resubmit verification
 */
export const submitVerification = (formData) => {
  return api.post("/api/verify/verification", formData, {
    headers: {
      "Content-Type": "multipart/form-data",
    },
  });
};