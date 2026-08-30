import { get } from "../utils/APIClient";
import ENDPOINTS from "../utils/APIEndpoint";

export const followUser = (userId) => get(`${ENDPOINTS.FOLLOW_USER}/${userId}/follow`);

export const unfollowUser = (userId) => get(`${ENDPOINTS.UNFOLLOW_USER}/${userId}/unfollow`);

export const isFollowingUser = (userId) => get(`${ENDPOINTS.IS_FOLLOWING}/${userId}/is-following`);

export const getFollowers = (userId) => get(`${ENDPOINTS.GET_FOLLOWERS}/${userId}/get-follower`);

export const getFollowing = (userId) => get(`${ENDPOINTS.GET_FOLLOWING}/${userId}/get-following`);
