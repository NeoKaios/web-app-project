export const SPOTIFY_URL = 'https://api.spotify.com/v1/';
export const WEB_SPOTIFY_URL = 'https://api.spotify.com/v1/';
export const FRONT_URL = 'http://localhost:3000/'
export const BACK_URL = 'http://localhost:4000/'

export const HOME_URL = '/'
export const STUDY_URL = (playlist_id: string) => '/study/' + playlist_id;
export const PROGRESSION_URL = (playlist_id: string) => '/progression/' + playlist_id;
export const QUIZ_URL = (playlist_id: string) => '/quiz/' + playlist_id;
export const HARDCORE_URL = (playlist_id: string) => '/hardcore/' + playlist_id

export const ACCESS_TOKEN_COOKIE = 'access_token';
export const REFRESH_TOKEN_COOKIE = 'refresh_token';
export const ADMIN_TOKEN_COOKIE = "admin_token"
export const USER_TOKEN_COOKIE = "user_token"

export const ERROR_TOKEN_NEED_REFRESH = 'Spotify API returned 401';
export const ERROR_NOT_LOGGED_IN = 'User not logged in, unable to perform Spotify API call';
export const ERROR_NOT_ADMIN = 'Admin not logged in, unable to perform Backend API call';
export const ERROR_PLAYLIST_IS_TOO_SMALL = 'Playlist is too small';
export const ERROR_EMPTY_PLAYLIST = 'Your playlist is empty';
export const ERROR_EMPTY_ARRAY = 'The array is empty';
export const ERROR_UNEXPECTED_BACKEND_ERROR = 'Unexpected backend error';

export const DESKTOP_MIN_SIZE = 800;
