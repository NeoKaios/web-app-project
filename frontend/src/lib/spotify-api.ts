import { SimplifiedPlaylist, Track, PublicUser, Paging, PlaylistTrack } from "spotify-types";
import { getToken, refreshToken } from "./auth";
import { getExtraPreviewUrls } from "./backend-api";
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

async function requestAPI(uri: string): Promise<any> {
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
  return await response.json();
}

export async function getUserData(): Promise<PublicUser> {
  return requestAPI(`${SPOTIFY_URL}me`);
}

export async function getUserPlaylists(): Promise<SimplifiedPlaylist[]> {
  const data = await requestAPI(`${SPOTIFY_URL}me/playlists`) as { items: SimplifiedPlaylist[] };
  return data.items;
}

export async function getTrack(track_id: string): Promise<Track> {
  const o = await requestAPI(`${SPOTIFY_URL}tracks/${track_id}`) as Track;
  return o;
}

export async function getPlaylistItems(playlist_id: string): Promise<Track[]> {
  const getAllTracks = async () => {
    var url = `${SPOTIFY_URL}playlists/${playlist_id}/tracks?limit=100`;
    const data = await requestAPI(url) as Paging<PlaylistTrack>;
    var tracks = data.items.map(elem => elem.track as Track)
    if (!data.next) {
      return tracks;
    }

    var requests: Promise<Paging<PlaylistTrack>>[] = []
    for (let i = 100; i < data.total; i += 100) {
      requests.push(requestAPI(url + `&offset=${i}`));
    }
    const datas = await Promise.all(requests); //parallelize request for speeeed
    return tracks.concat(...datas.map(data => data.items.map(elem => elem.track as Track)))
  };

  const tracks = await getAllTracks();
  const res = await getExtraPreviewUrls(tracks.map(track => track.id))
  tracks.map(track => {
    const idx = res.findIndex(({ id }) => track.id === id);
    if (idx !== -1) {
      track.preview_url = res[idx].preview_url;
    }
    return track;
  });
  return tracks;
}

export async function getPlaylist(playlist_id: string): Promise<SimplifiedPlaylist> {
  return await requestAPI(`${SPOTIFY_URL}playlists/${playlist_id}?fields=!tracks,name,id,images,owner,public,description`) as SimplifiedPlaylist;
}

export function spotifyAPILoader() {
  console.log('API Loading...');
  const token = getToken();
  if (!token) {
    throw new Error(ERROR_NOT_LOGGED_IN);
  }
  return null; // Cannot be void function
}
