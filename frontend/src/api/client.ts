import axios from 'axios';

const VID_STORAGE_KEY = 'ivao-booking-vid';
const RATING_STORAGE_KEY = 'ivao-booking-rating';

// Relative baseURL: the CRA dev server (package.json "proxy") forwards these
// requests to the NestJS backend, so the browser only ever talks to port 3000.
export const apiClient = axios.create({
  baseURL: process.env.REACT_APP_API_URL ?? '/',
});

apiClient.interceptors.request.use((config) => {
  const vid = localStorage.getItem(VID_STORAGE_KEY);
  if (vid) {
    config.headers.set('x-vid', vid);
  }
  const rating = localStorage.getItem(RATING_STORAGE_KEY);
  if (rating) {
    config.headers.set('x-rating', rating);
  }
  return config;
});
