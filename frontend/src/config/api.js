const ENV = process.env.REACT_APP_ENV || process.env.NODE_ENV || "development";

const BASE_URL_BY_ENV = {
  local: "http://localhost:5000",
  development: "http://localhost:5000",
  uat: "https://uat-api.thezuro.com",
  production: "https://api.thezuro.com",
};

const resolveApiBaseUrl = () => {
  if (process.env.REACT_APP_API_URL) return process.env.REACT_APP_API_URL;

  const isBrowser = typeof window !== "undefined";
  const host = isBrowser ? window.location.hostname : "";
  const isLocalHost = host === "localhost" || host === "127.0.0.1";

  // On deployed hosts, default to production API even if build env is misconfigured.
  if (isBrowser && !isLocalHost) return BASE_URL_BY_ENV.production;

  return BASE_URL_BY_ENV[ENV] || BASE_URL_BY_ENV.development;
};

export const API_BASE_URL = resolveApiBaseUrl();

export const API_URL = `${API_BASE_URL}/api`;
export const AUTH_API_URL = `${API_URL}/auth`;
export const CONTACT_API_URL = `${API_URL}/contact`;
