import 'dotenv/config';

export const FRONT_URL = 'http://localhost:3000';
export const BACK_URL = 'http://localhost:4000';
export const HOME_URL = FRONT_URL + '/home';
export const REDIRECT_URI = BACK_URL + '/callback'; // Your redirect uri

export const STATEKEY = 'spotify_auth_state';
export const ADMIN_COOKIE = 'admin_token';
export const USER_COOKIE = 'user_token';

export const DB_HOST = process.env.DB_HOST ?? '';
export const DB_PORT = Number(process.env.DB_PORT) || 0;
export const DB_USER = 'root';
export const DB_PASSWORD = process.env.MYSQL_ROOT_PASSWORD ?? '';

export const CLIENT_ID = process.env.CLIENT_ID || '';
export const CLIENT_SECRET = process.env.CLIENT_SECRET || '';

export const UPDATE_OK = { update: "ok" };

const sessions: string[] = [];
export default sessions;