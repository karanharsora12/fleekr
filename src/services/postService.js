import { get, post } from "../utils/APIClient";
import apiClient from "../utils/api";
import ENDPOINTS from "../utils/APIEndpoint";

/**
 * Upload a single media file to the server.
 * @param {File} file
 * @returns {Promise<{ success: boolean, media_url: string, media_type: string }>}
 */
export const uploadMedia = (file) => {
  const formData = new FormData();
  formData.append("file", file);

  return apiClient.post(ENDPOINTS.POSTS_UPLOAD_MEDIA, formData, {
    headers: { "Content-Type": "multipart/form-data" },
  });
};

/**
 * Create a new post.
 * @param {{ caption: string|null, privacy: string, media: Array<{ media_url: string, media_type: string }> }} data
 * @returns {Promise<{ success: boolean, message: string, data: object }>}
 */
export const createPost = (data) => post(ENDPOINTS.POSTS_CREATE, data);

/**
 * Get user's own posts.
 * @returns {Promise<{ success: boolean, data: Array<object> }>}
 */
export const getUserPosts = () => get(ENDPOINTS.GET_USER_POSTS);
export const getPostsByUserId = (id) => get(`${ENDPOINTS.POSTS_BY_USER}/${id}`);
export const getExplorePosts = (page = 1) => get(`${ENDPOINTS.EXPLORE_POSTS}?page=${page}`);
