const baseURL =
  import.meta.env.MODE === 'production'
    ? import.meta.env.VITE_API_PROD
    : import.meta.env.VITE_API_DEV;

export default baseURL;