import { ADMIN_TOKEN_COOKIE, BACK_URL, ERROR_NOT_ADMIN } from "./consts";
import { getCookie } from "./cookie";

function getAdminToken() {
  return getCookie(ADMIN_TOKEN_COOKIE);
}

export async function submitRequest(url: string) {
  console.log(url)
  await fetch(BACK_URL + 'reqstore?req_url=' + url)
}

export async function fetchRequests() {
  console.log("Fetching requests");
  const response = await fetch(BACK_URL + 'reqfetch?token=' + getCookie(ADMIN_TOKEN_COOKIE))
  const data: string[] = await response.json();
  return data;
}

export function backendAPILoader() {
  console.log('API Loading...');
  const token = getAdminToken();
  if (!token) {
    throw new Error(ERROR_NOT_ADMIN);
  }
  return null; // Cannot be void function
}
