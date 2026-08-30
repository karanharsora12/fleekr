export const mediaUrl = (url) =>
  url?.startsWith("http") ? url : `${import.meta.env.VITE_STORAGE_BASE}${url}`;
