import { SimplifiedPlaylist, SimplifiedTrack } from "spotify-types";
import { getToken, refreshToken, setToken } from "./auth";
import { ERROR_NOT_LOGGED_IN, SPOTIFY_URL } from "./consts";

const DEFAULT_HEADER = (access_token: string) => {
  return {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + access_token,
    }
  }
}

// export async function checkToken(access_token: string) {
//   const response = await fetch(SPOTIFY_URL + 'me', DEFAULT_HEADER(access_token));
//   return response.status === 200;
// }

async function requestAPI(uri: string): Promise<Response> {
  const token = getToken();
  console.log("Calling API with token:", token);
  if (!token) throw new Error(ERROR_NOT_LOGGED_IN);
  const response = await fetch(uri, DEFAULT_HEADER(token));
  if (response.status === 401) {
    await refreshToken();
    return requestAPI(uri);
  }
  else if (!response.ok) {
    throw new Error(`Fetching API data at ${uri} failed with status ${response.status}`);
  }
  return response;
}

export async function getUserPlaylists(): Promise < SimplifiedPlaylist[] > {
  const response = await requestAPI(`${SPOTIFY_URL}me/playlists`);
  const data = await response.json() as { items: SimplifiedPlaylist[] };
  return data.items;
}

export async function getPlaylistItems(playlist_id: string): Promise < SimplifiedTrack[] > {
  const response = await requestAPI(`${SPOTIFY_URL}playlists/${playlist_id}/tracks`);
  const data = await response.json() as { items: SimplifiedTrack[] };
  return data.items.map((elem: any) => elem.track);
}

export function spotifyAPILoader() {
  console.log('API Loading...');
  const token = getToken();
  if(!token) {
    throw new Error(ERROR_NOT_LOGGED_IN);
  }
  setToken(token)
  return null;
}
