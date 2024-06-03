import axios from "axios";

const VITE_HOST_API = import.meta.env.VITE_HOST_API;
const baseURL = VITE_HOST_API + "/users";
console.log("VITE_HOST_API", import.meta.env.VITE_HOST_API);

const login = async (email, password) => {
  const response = await axios.post(`${baseURL}/login`, { email, password });
  return response.data;
};

const signup = async (data) => {
  const response = await axios.post(`${baseURL}/signup`, data);
  return response.data;
};

export default { login, signup };
