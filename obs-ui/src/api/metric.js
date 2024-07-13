import axios from "axios";
import interceptors from "./interceptors";

const baseV1 = "/api/v1/metrics";
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
instanceV1.interceptors.request.use(
  interceptors.useProject,
  interceptors.useError,
);

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
