import axios from 'axios';

const api = axios.create({
  // use the proxy during development by calling relative /api paths
  baseURL: process.env.REACT_APP_API_URL ? `${process.env.REACT_APP_API_URL}/api` : '/api',
  headers: {
    'Content-Type': 'application/json',
  },
});

export default api;
