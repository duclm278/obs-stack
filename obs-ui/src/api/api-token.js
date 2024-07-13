import axios from "axios";
import interceptors from "./interceptors";

const baseV1 = "/api/v1/api-tokens";
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

const getAll = async (params) => {
  const url = "";
  const response = await instanceV1.get(url, { params });
  return response.data;
};

const getOne = async (id) => {
  const url = `${id}`;
  const response = await instanceV1.get(url);
  return response.data;
};

const create = async (data) => {
  const url = "";
  const response = await instanceV1.post(url, data);
  return response.data;
};

const update = async (id, data) => {
  const url = `${id}`;
  const response = await instanceV1.patch(url, data);
  return response.data;
};

const remove = async (id) => {
  const url = `${id}`;
  const response = await instanceV1.delete(url);
  return response.data;
};

export default { getAll, getOne, create, update, remove };
