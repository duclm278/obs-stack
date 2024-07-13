import axios from "axios";

// const VITE_HOST_API = import.meta.env.VITE_HOST_API;
// const baseURL = VITE_HOST_API + "/users";
// console.log("VITE_HOST_API", import.meta.env.VITE_HOST_API);
const baseV1 = "/api/v1/auth";
const instanceV1 = axios.create({
  baseURL: baseV1,
  headers: {
    "Content-Type": "application/json",
  },
});

const login = async (username, password) => {
  const url = "login";
  const response = await instanceV1.post(url, { username, password });
  return response.data;
};

const signup = async (data) => {
  const url = "signup";
  const response = await instanceV1.post(url, data);
  return response.data;
};

export default { login, signup };
