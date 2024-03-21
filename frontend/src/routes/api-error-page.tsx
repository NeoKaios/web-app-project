import { Navigate, useRouteError } from "react-router-dom";
import { ERROR_NOT_LOGGED_IN, ACCESS_TOKEN_COOKIE } from "../lib/consts";
import { getCookie } from "../lib/cookie";
import { SpotifyAPI } from "../lib/spotify-api";

export function loader() {
  console.log('called spoapi load');
  const token = getCookie(ACCESS_TOKEN_COOKIE);
  if(!token) {
    throw new Error(ERROR_NOT_LOGGED_IN);
  }
  SpotifyAPI.setToken(token)
  return null;
}

export function APIErrorPage() {
  const error: any = useRouteError();

  console.warn("ERROR MSG: ", error.message);
  if (error.message === ERROR_NOT_LOGGED_IN) {
    return <Navigate to='/' />;
  }
  return <div>Its an error: {error.message}</div>;
}
