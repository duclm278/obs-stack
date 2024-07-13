const useError = (error) => {
  return Promise.reject(error);
};

const useProject = (config) => {
  const project = localStorage.getItem("project");
  if (project) {
    config.headers["X-ProjectID"] = project;
  }
  return config;
};

const useToken = (config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

export default { useError, useProject, useToken };
