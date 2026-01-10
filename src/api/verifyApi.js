import api from "./axios";

export const getVerificationStatus = (userId) => {
  return api.get(`/verify/viewverify/${userId}`);
};
