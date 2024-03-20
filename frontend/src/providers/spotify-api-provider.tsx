import { createContext, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "./auth-provider";
import { SpotifyAPI } from "../lib/spotify-api";

const SpotifyAPIContext = createContext<SpotifyAPI>(new SpotifyAPI({}));

export function SpotifyAPIProvider() {
  const auth = useAuth();

  if (!auth.token) return <Navigate to="/" />;

  const spotifyAPI = new SpotifyAPI(auth);
  return (
    <SpotifyAPIContext.Provider value={ spotifyAPI }>
      <Outlet />
    </SpotifyAPIContext.Provider>);
}

export function useSpotifyAPI() {
  if (!useAuth().token) throw new Error("Impossible to use spotifyAPI if not logged in")
  return useContext(SpotifyAPIContext);
}
