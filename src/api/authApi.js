import api from "./axios";

export const signupUser = (data) => {
  return api.post("/api/auth/signup", data);
};

export const loginUser = (data) => {
  return api.post("/api/auth/signin", data);
};
