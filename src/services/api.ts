
// Base URL
export const API_URL: string = import.meta.env.VITE_API_URL;

export const getAuthHeader = (token: string | null) => {
  return token ? { Authorization: `Bearer ${token}` } : {}
}