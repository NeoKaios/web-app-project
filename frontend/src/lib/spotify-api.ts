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
function ensureToken(target: any, key: string, descriptor: PropertyDescriptor) {
  const oldFun = descriptor.value;

  descriptor.value = async function(this: any, ...args: any[]) {
    const answer = await checkToken(args[0]);
    if (answer == false) {
      console.log("Wrong token : ", answer);
      return;
    }
    return await oldFun.apply(this, args);
  }

  return descriptor;
}

export async function checkToken(access_token: string) {
  const response = await fetch(SPOTIFY_URL + 'me', DEFAULT_HEADER(access_token));
  if (response.status == 200) {
    return true;
  }
  return false;
}

export class SpotifyAPI {
  @ensureToken
  async requestAPI(access_token: string, uri: string) {
    return (await fetch(uri, DEFAULT_HEADER(access_token))).json();
  }

  @ensureToken
  async getUserPlaylists(access_token: string): Promise<SimplifiedPlaylist[] | undefined> {
    return (await this.requestAPI(access_token, `${SPOTIFY_URL}me/playlists`))?.items;
  }

  @ensureToken
  async getPlaylistItems(access_token: string, playlist: SimplifiedPlaylist): Promise<SimplifiedTrack[] | undefined> {
    return (await this.requestAPI(access_token, `${SPOTIFY_URL}playlists/${playlist.id.toString()}/tracks`))?.items.map((elem: any)=>elem.track);
  }
}
