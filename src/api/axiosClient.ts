import axios from 'axios';

/**
 * The base URL for the Fetch Rewards take-home API.
 * Please verify this is the correct endpoint.
 */
const API_BASE_URL = 'https://frontend-take-home-service.fetch.com';

const axiosClient = axios.create({
  baseURL: API_BASE_URL,
  withCredentials: true,
});

export default axiosClient;
