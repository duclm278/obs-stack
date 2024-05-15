import axios from "axios";

// const VITE_HOST_API = import.meta.env.VITE_HOST_API;
// const url = VITE_HOST_API + "/users";
// console.log("VITE_HOST_API", import.meta.env.VITE_HOST_API);
const url = "http://localhost:3100/loki/api/v1/query_range";

const queryRange = async (query, start, end) => {
  const response = await axios.get(
    `${url}?query=${query}&start=${start}&end=${end}`,
  );
  return response.data;
};

export default { queryRange };
