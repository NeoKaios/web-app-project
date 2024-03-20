import { SimplifiedPlaylist, SimplifiedTrack } from "spotify-types";
import { SPOTIFY_URL } from "./consts";

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

export class SpotifyAPI {
  private auth: any;
  private static _instance: SpotifyAPI = new SpotifyAPI();

  static setAuth(auth: any) {
    SpotifyAPI.Instance.auth = auth;
  }

  static get Instance() {
    return SpotifyAPI._instance;
  }

  private async requestAPI(uri: string) {
    if(!this.auth) throw new Error("User is not connected");
    const response = await fetch(uri, DEFAULT_HEADER(this.auth.token));
    if (response.status === 401) {
      this.auth.refreshToken();
    }
    else if (!response.ok) {
      throw new Error(`Fetching API data at ${uri} failed with status ${response.status}`);
    }
    return response;
  }

  async getUserPlaylists(): Promise<SimplifiedPlaylist[] | undefined> {
    const response = await this.requestAPI(`${SPOTIFY_URL}me/playlists`);
    const data = await response.json() as { items: SimplifiedPlaylist[] };
    return data.items;
  }

  async getPlaylistItems(playlist_id: string): Promise<SimplifiedTrack[]> {
    const response = await this.requestAPI(`${SPOTIFY_URL}playlists/${playlist_id}/tracks`);
    const data = await response.json() as { items: SimplifiedTrack[] };
    return data.items.map((elem: any) => elem.track);
  }
}
