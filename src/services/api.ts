import axios, {AxiosInstance} from "axios";

// Base URL
export const API_URL: string = import.meta.env.VITE_API_URL;

export const getAuthHeader = (token: string | null) => {
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export const createAPI: AxiosInstance = axios.create({
  baseURL: API_URL,
  withCredentials: true // Send and receive cookies
})