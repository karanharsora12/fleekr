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
  POSTS_BY_USER: "/posts",
  EXPLORE_POSTS: "/posts/explore",

  FOLLOW_USER: "/users",
  UNFOLLOW_USER: "/users",
  IS_FOLLOWING: "/users",
  GET_FOLLOWERS: "/users",
  GET_FOLLOWING: "/users",

  CONVERSATIONS: "/conversations",
  MESSAGES: "/conversations",
} as const;

export default ENDPOINTS;
