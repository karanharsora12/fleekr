const ENDPOINTS = {
  AUTH_REGISTER: "/register",
  AUTH_LOGIN: "/login",
  AUTH_LOGOUT: "/logout",

  GET_ME: "/user",

  POSTS_UPLOAD_MEDIA: "/posts/upload-media",
  POSTS_CREATE: "/posts/create",
  GET_USER_POSTS: "/posts/my",
} as const;

export default ENDPOINTS;
