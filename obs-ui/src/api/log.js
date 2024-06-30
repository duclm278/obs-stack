import axios from "axios";

// const VITE_HOST_API = import.meta.env.VITE_HOST_API;
// const baseURL = VITE_HOST_API + "/users";
// console.log("VITE_HOST_API", import.meta.env.VITE_HOST_API);
const baseV1 = "/api/v1/logs";
const instanceV1 = axios.create({
  baseURL: baseV1,
  headers: {
    "Content-Type": "application/json",
  },
});

const getQueryRange = async (params) => {
  const url = "query_range";
  const response = await instanceV1.get(url, { params });
  return response.data;
};

const getLabels = async (params) => {
  const url = "labels";
  const response = await instanceV1.get(url, { params });
  return response.data;
};

const getLabelValues = async (name, params) => {
  const url = `label/${name}/values`;
  const response = await instanceV1.get(url, { params });
  return response.data;
};

export default { getQueryRange, getLabels, getLabelValues };
