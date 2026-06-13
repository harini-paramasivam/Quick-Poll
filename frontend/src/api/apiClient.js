import axios from 'axios';

let baseURL = import.meta.env.VITE_API_URL;

if (!baseURL && import.meta.env.PROD) {
  throw new Error('VITE_API_URL must be set in production');
}

if (baseURL) {
  try {
    const parsedUrl = new URL(baseURL);
    if (!/^https?:$/.test(parsedUrl.protocol)) {
      throw new Error('VITE_API_URL must use http or https protocol');
    }
  } catch (error) {
    throw new Error('VITE_API_URL must be a valid URL');
  }
}

if (!baseURL && import.meta.env.DEV) {
  // In development, developers should set VITE_API_URL in their .env.local
  // Leaving baseURL undefined will make requests relative to the current origin.
  console.warn('VITE_API_URL is not set. API requests will be relative to the frontend origin.');
}

// Normalize baseURL (remove trailing slash) to avoid double-slash in requests
if (baseURL) {
  baseURL = baseURL.replace(/\/+$/, '');
}

const api = axios.create({
  baseURL: baseURL || undefined,
  withCredentials: true,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Retry once for transient network or 5xx errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const config = error.config || {};
    config._retry = config._retry || 0;
    const method = (config.method || '').toLowerCase();
    const isGet = method === 'get' || method === 'head';
    const status = error.response && error.response.status;
    const isServerError = !error.response || (status >= 500 && status < 600);
    const shouldRetry = isGet && isServerError && config._retry < 1;
    if (shouldRetry) {
      config._retry += 1;
      try {
        return await api(config);
      } catch (err) {
        return Promise.reject(err);
      }
    }
    return Promise.reject(error);
  }
);

export default api;
