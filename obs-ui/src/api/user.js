import axios from "axios";
import interceptors from "./interceptors";

const baseV1 = "/api/v1/users";
const instanceV1 = axios.create({
  baseURL: baseV1,
  headers: {
    "Content-Type": "application/json",
  },
});
instanceV1.interceptors.request.use(
  interceptors.useToken,
  interceptors.useError,
);

const getMe = async () => {
  const url = "me";
  const response = await instanceV1.get(url);
  return response.data;
};

const updateMe = async (data) => {
  const url = "me";
  const response = await instanceV1.patch(url, data);
  return response.data;
};

export default { getMe, updateMe };
