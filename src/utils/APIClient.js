import apiClient from "./api";

export const get = (url, config) => {
  return apiClient.get(url, config);
};

export const post = (url, data, config) => {
  return apiClient.post(url, data, {
    headers: {
      "Content-Type": "application/json",
    },
    ...config,
  });
};

export const put = (url, data, config) => {
  return apiClient.put(url, data, config);
};

export const del = (url, data, config) => {
  return apiClient.delete(url, data, config);
};
