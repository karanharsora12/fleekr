const ENDPOINTS = {
  AUTH_REGISTER: "/register",
  AUTH_LOGIN: "/login",
  AUTH_GENERATE_OTP: "/login/generate-otp",
  AUTH_VERIFY_OTP: "/login/verify-otp",
  AUTH_LOGOUT: "/logout",

  GET_ME: "/user",
  USERS: "/users",

  POSTS_UPLOAD_MEDIA: "/posts/upload-media",
  POSTS_CREATE: "/posts/create",
  GET_USER_POSTS: "/posts/my",
  POSTS_BY_USER: "/posts", // will append /{id}
  EXPLORE_POSTS: "/posts/explore",
} as const;

export default ENDPOINTS;
