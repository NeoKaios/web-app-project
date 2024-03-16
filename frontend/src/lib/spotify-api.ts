import { SimplifiedPlaylist, SimplifiedTrack } from "spotify-types";
import { SPOTIFY_URL } from "./consts";

const DEFAULT_HEADER = (access_token: string) => {
  return {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + access_token,
    }
  }
}

// Decorator to check that all subsequent API calls are made with a correct token
function failSafe(target: any, key: string, descriptor: PropertyDescriptor) {
  const oldFun = descriptor.value;

  descriptor.value = async function(this: any, ...args: any[]) {
    try {
      return await oldFun.apply(this, args);
    } catch (error) {
      console.log(error);
      return undefined;
    }
  }

  return descriptor;
}

export async function checkToken(access_token: string) {
  const response = await fetch(SPOTIFY_URL + 'me', DEFAULT_HEADER(access_token));
  if (response.status === 200) {
    return true;
  }
  return false;
}

export class SpotifyAPI {
  async requestAPI(access_token: string, uri: string) {
    const response = await fetch(uri, {
      method: 'GET',
      headers: {
        Authorization: 'Bearer ' + access_token,
      },
    });
    if (!response.ok) {
      throw new Error(`Fetching API data at ${uri} failed with status ${response.status}`);
    }

    return response;
  }

  @failSafe
  async getUserPlaylists(access_token: string): Promise<SimplifiedPlaylist[] | undefined> {
    const response = await this.requestAPI(access_token, `${SPOTIFY_URL}me/playlists`);
    const data = await response.json() as { items: SimplifiedPlaylist[] };
    return data.items;
  }

  @failSafe
  async getPlaylistItems(access_token: string, playlist_id: string): Promise<SimplifiedTrack[]> {
    const response = await this.requestAPI(access_token, `${SPOTIFY_URL}playlists/${playlist_id}/tracks`);
    const data = await response.json() as { items: SimplifiedTrack[] };
    return data.items.map((elem: any) => elem.track);
  }
}
