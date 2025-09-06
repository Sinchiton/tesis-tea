import axios from "axios";

export const api = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL,
  withCredentials: true, // no estorba; la cookie de acceso la pone el front
});

export const setAccessToken = (t: string | null) => {
  if (t) {
    api.defaults.headers.common.Authorization = `Bearer ${t}`;
    document.cookie = `access_token=${t}; Path=/; Max-Age=86400; SameSite=Lax`;
    localStorage.setItem("access_token", t);
  } else {
    delete api.defaults.headers.common.Authorization;
    document.cookie = `access_token=; Path=/; Max-Age=0`;
    localStorage.removeItem("access_token");
  }
};

export const loadAccessToken = () => {
  const t = localStorage.getItem("access_token");
  if (t) api.defaults.headers.common.Authorization = `Bearer ${t}`;
  return t;
};
