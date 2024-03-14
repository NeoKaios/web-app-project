import { SimplifiedPlaylist } from "spotify-types";
import { SPOTIFY_URL } from "./consts";

export const fetchPlaylists = async (apiToken: string): Promise<SimplifiedPlaylist[]> => {
  const response = await fetch(SPOTIFY_URL + 'me/playlists', {
    method: 'GET',
    headers: {
      Authorization: 'Bearer ' + apiToken,
    },
  });
  if (!response.ok) {
    throw new Error(`Fetching tracks failed with status ${response.status}`)
  }
  const data = await response.json() as { items: SimplifiedPlaylist[] };

  return data.items;
};
