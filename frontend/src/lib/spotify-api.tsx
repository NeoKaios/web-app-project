import { SimplifiedPlaylist, SimplifiedTrack } from "spotify-types";
import { refreshTokenFn } from "../providers/auth-provider";
import { ERROR_NOT_LOGGED_IN, SPOTIFY_URL } from "./consts";

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
  return response.status === 200;
}

export class SpotifyAPI {
  private token: string = '';
  private static _instance: SpotifyAPI = new SpotifyAPI();

  static setToken(token: string) {
    console.log('Set token to: ', token);
    SpotifyAPI.Instance.token = token;
  }

  static get Instance() {
    return SpotifyAPI._instance;
  }

  private async requestAPI(uri: string): Promise<Response> {
    console.log("calling api with auth:", this.token);
    if (!this.token) throw new Error(ERROR_NOT_LOGGED_IN);
    const response = await fetch(uri, DEFAULT_HEADER(this.token));
    if (response.status === 401) {
      await refreshTokenFn();
      return this.requestAPI(uri);
    }
    else if (!response.ok) {
      throw new Error(`Fetching API data at ${uri} failed with status ${response.status}`);
    }
    return response;
  }

  async getUserPlaylists(): Promise<SimplifiedPlaylist[]> {
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
