import { get } from "../utils/APIClient";
import ENDPOINTS from "../utils/APIEndpoint";

export const getAllUsers = (page = 1, search = "") => {
  const query = new URLSearchParams({ page });
  if (search) query.append('search', search);
  return get(`${ENDPOINTS.USERS}?${query.toString()}`);
};

export const getUserById = (id) => get(`${ENDPOINTS.USERS}/${id}`);
