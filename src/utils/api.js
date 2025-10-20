import axios from 'axios';

const getBaseURL = () => {
  return process.env.NODE_ENV === 'production' 
    ? 'https://temple-token-management-system.onrender.com'
    : '';
};

export const apiClient = axios.create({
  baseURL: getBaseURL(),
});

export { getBaseURL };
