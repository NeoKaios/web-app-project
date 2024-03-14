export function getCookie(key: string) {
  var b = document.cookie.match("(^|;)\\s*" + key + "\\s*=\\s*([^;]+)");
  return b ? b.pop() : undefined;
}
export function removeCookie(key: string) {
  document.cookie = `${key}=;expires=Thu, 01 Jan 1970`;
}

