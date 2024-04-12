import { ADMIN_TOKEN_COOKIE, BACK_URL, ERROR_NOT_ADMIN, ERROR_UNEXPECTED_BACKEND_ERROR } from "./consts";
import { getCookie } from "./cookie";

async function requestAPI(url: string, options: RequestInit | undefined = undefined) {
  const response = await fetch(BACK_URL + url, options);
  if (response.status !== 200 && response.status !== 401) throw new Error(ERROR_UNEXPECTED_BACKEND_ERROR);
  switch (response.headers.get('Content-Type')) {
    case 'application/json; charset=utf-8':
      return await response.json();
    case 'text/html; charset=utf-8':
      return await response.text();
    default:
      return;
  }
}

/**
 * Fetches extra url for songs where preview_url is missing
 */
export async function getExtraPreviewUrls(track_ids: string[]): Promise<string[]> {
  return requestAPI("get_extra_urls", {
    method: "POST",
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded',
    },
    body: "tracks=" + track_ids.join(','),
  });
}

/**
 * Fetches songs to study and all previously encountered songs in database
 */
export async function getStudySongs(user_id: string, playlist_id: string): Promise<{ toStudy: string[], studied: string[] }> {
  return requestAPI(`get_study_songs/${user_id}/${playlist_id}`);
}

/**
 * Request backend to update song score
 */
export async function updateStudySong(user_id: string, playlist_id: string, song_id: string, quality: number) {
  return requestAPI(`update_study_song/${user_id}/${playlist_id}/${song_id}/${quality}`);
}

/**
 * Request backend to delete progression
 */
export async function getUserProgression(user_id: string, playlist_id: string) {
  return requestAPI(`progression/${user_id}/${playlist_id}`);
}

/**
 * Request backend to delete progression
 */
export async function resetProgression(user_id: string, playlist_id: string) {
  return requestAPI(`reset_progression/${user_id}/${playlist_id}`);
}

/**
 * Request admin local login
 */
export function adminLogin(password: string) {
  return requestAPI("locallogin?password=" + password);
}

/**
 * Request user local login
 */
export function userLogin() {
  return requestAPI("locallogin?userLogin=true");
}

/**
 * Submit a request of playlist review
 */
export async function submitRequest(id: string) {
  return requestAPI('reqstore?playlist_id=' + id)
}

/**
 * Fetch all requests from backend
 */
export async function fetchRequests() {
  return requestAPI('reqfetch', {
    headers: {
      'Authorization': 'Bearer ' + getCookie(ADMIN_TOKEN_COOKIE)
    }
  })
}

/**
 * Delete request from backend
 */
export async function deleteRequest(playlist_id: string) {
  return requestAPI('reqdelete?playlist_id=' + playlist_id, {
    headers: {
      'Authorization': 'Bearer ' + getCookie(ADMIN_TOKEN_COOKIE)
    }
  })
}
/**
 * Delete and extra audio file
 */
export async function deleteExtra(track: string) {
  return requestAPI('upload/delete/' + track,
    {
      method: "DELETE",
      headers: {
        'Authorization': 'Bearer ' + getCookie(ADMIN_TOKEN_COOKIE)
      }
    });
}

/**
 * Upload audio file
 */
export function uploadAudioFiles(formData: FormData) {
  return requestAPI("upload", {
    method: "POST",
    headers: {
      'Authorization': 'Bearer ' + getCookie(ADMIN_TOKEN_COOKIE)
    },
    body: formData
  });
}

/**
 * Loader to ensure the user has a admin token
 */
export function adminSecureLoader() {
  console.log('API Loading...');
  const token = getCookie(ADMIN_TOKEN_COOKIE);
  if (!token) {
    throw new Error(ERROR_NOT_ADMIN);
  }
  return null;
}

/**
 * Refresh spotify token
 */
export function refreshSpotifyToken(refresh_token: string) {
  return requestAPI('refresh_token?refresh_token=' + refresh_token);
}

