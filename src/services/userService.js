import { get } from "../utils/APIClient";
import ENDPOINTS from "../utils/APIEndpoint";

export const getAllUsers = () => get(ENDPOINTS.USERS);
