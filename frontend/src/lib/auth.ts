import { ACCESS_TOKEN_COOKIE, ADMIN_TOKEN_COOKIE, BACK_URL, FRONT_URL, REFRESH_TOKEN_COOKIE } from "./consts";
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

export async function adminCheck() {
  console.log(getCookie(ADMIN_TOKEN_COOKIE))
  const response = await fetch(BACK_URL + 'checkadmin?admin_token=' + getCookie(ADMIN_TOKEN_COOKIE))
  //const response = await fetch(BACK_URL + 'checkadmin')
  console.log(response);
  return response.status == 200;
}

export async function refreshToken() {
  console.log('Refreshing token');
  await new Promise(r => setTimeout(r, 2000));
  const refresh_token = getCookie(REFRESH_TOKEN_COOKIE);
  const res = await fetch(BACK_URL + 'refresh_token?refresh_token=' + refresh_token);
  console.log('Refreshed token');
  const new_access_token = await res.text();
  setToken(new_access_token)
  return new_access_token;
}

export function logout() {
  removeCookie(ACCESS_TOKEN_COOKIE);
  removeCookie(REFRESH_TOKEN_COOKIE);
  window.location.href = FRONT_URL;
};
