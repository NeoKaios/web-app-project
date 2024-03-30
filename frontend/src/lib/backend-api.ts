import { BACK_URL, ERROR_UNEXPECTED_BACKEND_ERROR } from "./consts";

async function requestAPI(url: string) {
  const response = await fetch(BACK_URL + url);
  if (response.status !== 200) throw new Error(ERROR_UNEXPECTED_BACKEND_ERROR);
  return await response.json();
}

/**
 * Fetches songs to study and all previously encountered songs in database
 */
export async function getStudySongs(user_id: string, playlist_id: string): Promise<{ toStudy: string[], studied: string[] }> {
  return requestAPI(`get_study_songs/${user_id}/${playlist_id}`);
}

/**
 * Fetches songs to study that were updated after timestamp
 */
export async function getNewStudySongs(user_id: string, playlist_id: string, timestamp: number): Promise<{ newToStudy: string[] }> {
  return requestAPI(`get_new_study_songs/${user_id}/${playlist_id}/${timestamp}`);
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

