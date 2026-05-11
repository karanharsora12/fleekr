import { get, post } from "../utils/APIClient";
import ENDPOINTS from "../utils/APIEndpoint";

/**
 * Register a new user.
 * @param {{ name: string, email: string, password: string, password_confirmation: string }} data
 */
export const registerUser = (data) => post(ENDPOINTS.AUTH_REGISTER, data);

export const loginUser = (data) => post(ENDPOINTS.AUTH_LOGIN, data);

/** Fetch the currently authenticated user. */
export const getMe = () => get(ENDPOINTS.GET_ME);
