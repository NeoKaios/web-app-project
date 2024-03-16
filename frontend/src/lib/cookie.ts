import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "./consts";

export function getAccessToken() {
  return getCookie(ACCESS_TOKEN_COOKIE);
}

export function getRefreshToken() {
  return getCookie(REFRESH_TOKEN_COOKIE);
}

export function getCookie(key: string) {
  var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : undefined;
}

export function setCookie(key: string, value: string) {
  const cookies = document.cookie.split(';');
  const index = cookies.findIndex((x) => x.match('^' + key + '=\\s*'));
  if (index === -1) return;
  cookies[index] = key + '=' + value;
  document.cookie = cookies.join(';');
}

export function removeCookie(key: string) {
  document.cookie = `${key}=;expires=Thu, 01 Jan 1970`;
}

