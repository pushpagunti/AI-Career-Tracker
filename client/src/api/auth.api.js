import axiosInstance from "./axiosInstance";

export const registerUser = (data) =>
  axiosInstance.post("/auth/register", data).then((res) => res.data);

export const loginUser = (data) =>
  axiosInstance.post("/auth/login", data).then((res) => res.data);

export const logoutUser = () =>
  axiosInstance.post("/auth/logout").then((res) => res.data);

export const getCurrentUser = () =>
  axiosInstance.get("/auth/me").then((res) => res.data);