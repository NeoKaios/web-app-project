import { SimplifiedPlaylist } from "spotify-types";

export const fetchPlaylists = async (apiToken: string): Promise<SimplifiedPlaylist[]> => {
  const response = await fetch('https://api.spotify.com/v1/me/playlists', {
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
