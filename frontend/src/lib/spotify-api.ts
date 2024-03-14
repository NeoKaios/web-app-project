import { SPOTIFY_URL } from "./consts";

export async function checkToken(access_token: string) {
  const response = await fetch(SPOTIFY_URL + 'me', {
    method: 'GET',
    headers: {
      'Authorization': 'Bearer ' + access_token,
    }
  });

  if (response.status == 401) {
    return false;
  }

  return true;
}
