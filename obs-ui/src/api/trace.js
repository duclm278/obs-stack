import axios from "axios";

// const VITE_HOST_API = import.meta.env.VITE_HOST_API;
// const baseURL = VITE_HOST_API + "/user";
// console.log("VITE_HOST_API", import.meta.env.VITE_HOST_API);
const baseV1 = "/api/v1/traces";
const instanceV1 = axios.create({
  baseURL: baseV1,
  headers: {
    "Content-Type": "application/json",
  },
});

const baseV2 = "/api/v2/traces";
const instanceV2 = axios.create({
  baseURL: baseV2,
  headers: {
    "Content-Type": "application/json",
  },
});

const getTrace = async (traceID, params) => {
  const url = `traces/${traceID}`;
  const response = await instanceV1.get(url, { params });
  return response.data;
};

const getTraces = async (params) => {
  const url = "search";
  const response = await instanceV1.get(url, { params });
  return response.data;
};

const getTagsV2 = async (params) => {
  const url = "search/tags";
  const response = await instanceV2.get(url, { params });
  return response.data;
};

const getTagValuesV2 = async (tag, params) => {
  const url = `search/tag/${tag}/values`;
  const response = await instanceV2.get(url, { params });
  return response.data;
};

export default { getTrace, getTraces, getTagsV2, getTagValuesV2 };
