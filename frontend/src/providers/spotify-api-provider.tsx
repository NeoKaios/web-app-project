import { createContext, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./auth-provider";
import { SpotifyAPI } from "../lib/spotify-api";
import { getCookie } from "../lib/cookie";
import { ACCESS_TOKEN_COOKIE } from "../lib/consts";

export function loader() {
  console.log('called spoapi load');
  SpotifyAPI.setAuth({token: getCookie(ACCESS_TOKEN_COOKIE)})
  return null;
}

const SpotifyAPIContext = createContext<SpotifyAPI>(new SpotifyAPI());

export function SpotifyAPIProvider() {
  const auth = useAuth();

  if (!auth.token) return <Navigate to="/" />;

  console.log('rendered spotify-api-pro')
  SpotifyAPI.setAuth(auth);
  return <Outlet/>;
  // return (
  //   <SpotifyAPIContext.Provider value={ spotifyAPI }>
  //     <Outlet />
  //   </SpotifyAPIContext.Provider>);
}

export function useSpotifyAPI() {
  if (!useAuth().token) throw new Error("Impossible to use spotifyAPI if not logged in")
  return useContext(SpotifyAPIContext);
}
