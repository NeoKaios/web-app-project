import { createContext, useContext } from "react";
import { Navigate, Outlet } from "react-router-dom";
import { SimplifiedPlaylist, SimplifiedTrack } from "spotify-types";
import { useAuth } from "../components";
import { SPOTIFY_URL } from "./consts";

const SpotifyAPIContext = createContext<any>(null);

const DEFAULT_HEADER = (access_token: string) => {
  return {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token,
    }
  }
}

export async function checkToken(access_token: string) {
  const response = await fetch(SPOTIFY_URL + 'me', DEFAULT_HEADER(access_token));
  if (response.status === 200) {
    return true;
  }
  return false;
}

export function SpotifyAPIProvider() {
  const auth = useAuth();

  async function requestAPI(uri: string) {
    const response = await fetch(uri, DEFAULT_HEADER(auth.token));
    if (response.status === 401) {
      auth.refreshToken();
    }
    else if (!response.ok) {
      throw new Error(`Fetching API data at ${uri} failed with status ${response.status}`);
    }
    return response;
  }

  async function getUserPlaylists(): Promise<SimplifiedPlaylist[] | undefined> {
    const response = await requestAPI(`${SPOTIFY_URL}me/playlists`);
    const data = await response.json() as { items: SimplifiedPlaylist[] };
    return data.items;
  }

  async function getPlaylistItems(playlist_id: string): Promise<SimplifiedTrack[]> {
    const response = await requestAPI(`${SPOTIFY_URL}playlists/${playlist_id}/tracks`);
    const data = await response.json() as { items: SimplifiedTrack[] };
    return data.items.map((elem: any) => elem.track);
  }

  if (!auth.token) return <Navigate to="/" />;
  return (
    <SpotifyAPIContext.Provider value={{ getPlaylistItems, getUserPlaylists }}>
      <Outlet />
    </SpotifyAPIContext.Provider>);
}

export function useSpotifyAPI() {
  if (!useAuth().token) throw new Error("Impossible to use spotifyAPI if not logged in")
  return useContext(SpotifyAPIContext);
}
