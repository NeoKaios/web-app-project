const SPOTIFY_URL = 'https://api.spotify.com/v1/';
export const WEB_SPOTIFY_URL = 'https://api.spotify.com/v1/';
const FRONT_URL = 'http://localhost:3000/'
const BACK_URL = 'http://localhost:4000/'

const HOME_URL = '/'
const STUDY_URL = '/study'

const ACCESS_TOKEN_COOKIE = 'access_token';
const REFRESH_TOKEN_COOKIE = 'refresh_token';

export const ERROR_TOKEN_NEED_REFRESH = 'Spotify API returned 401';
export const ERROR_NOT_LOGGED_IN = 'User not logged in, unable to perform Spotify API call';

export {
  ACCESS_TOKEN_COOKIE,
  REFRESH_TOKEN_COOKIE,
  SPOTIFY_URL,
  HOME_URL,
  STUDY_URL,
  BACK_URL,
  FRONT_URL,
}
