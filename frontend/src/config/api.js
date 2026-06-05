const ENV = process.env.REACT_APP_ENV || process.env.NODE_ENV || "development";

const BASE_URL_BY_ENV = {
  local: "http://localhost:5000",
  development: "http://localhost:5000",
  uat: "https://uat-api.thezuro.com",
  production: "https://api.thezuro.com",
};

export const API_BASE_URL =
  process.env.REACT_APP_API_URL || BASE_URL_BY_ENV[ENV] || BASE_URL_BY_ENV.development;

export const API_URL = `${API_BASE_URL}/api`;
export const AUTH_API_URL = `${API_URL}/auth`;
export const CONTACT_API_URL = `${API_URL}/contact`;
