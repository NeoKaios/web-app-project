import { refreshSpotifyToken } from "./backend-api";
import { ACCESS_TOKEN_COOKIE, ADMIN_TOKEN_COOKIE, BACK_URL, FRONT_URL, REFRESH_TOKEN_COOKIE, USER_TOKEN_COOKIE } from "./consts";
import { getCookie, removeCookie, setCookie } from "./cookie";

export function getToken() {
  return getCookie(ACCESS_TOKEN_COOKIE);
}

export function setToken(token: string) {
  return setCookie(ACCESS_TOKEN_COOKIE, token);
}

export function login() {
  window.location.href = BACK_URL + 'login';
}

export async function refreshToken() {
  console.log('Refreshing token');
  await new Promise(r => setTimeout(r, 2000));
  const refresh_token = getCookie(REFRESH_TOKEN_COOKIE);
  const new_access_token = await refreshSpotifyToken(refresh_token || '');
  setToken(new_access_token)
  return new_access_token;
}

export function logout() {
  removeCookie(ACCESS_TOKEN_COOKIE);
  removeCookie(REFRESH_TOKEN_COOKIE);
  removeCookie(USER_TOKEN_COOKIE);
  removeCookie(ADMIN_TOKEN_COOKIE);
  window.location.href = FRONT_URL;
};

export function logoutAdmin() {
  removeCookie(ADMIN_TOKEN_COOKIE);
}
