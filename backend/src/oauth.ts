import crypto from 'crypto';
import querystring from 'querystring';
import { Request, Response } from 'express';
import { CLIENT_ID, CLIENT_SECRET, FRONT_URL, HOME_URL, REDIRECT_URI, STATEKEY } from './consts';

const encodeFormData = (data: any) => {
  return Object.keys(data)
    .map(key => `${encodeURIComponent(key)}=${encodeURIComponent(data[key])}`)
    .join('&');
}

const generateRandomString = (length: number) => {
  return crypto
    .randomBytes(60)
    .toString('hex')
    .slice(0, length);
}

/**
 * The first function that gets called when you press the 'login' button
 */
export function oauthLogin(_req: Request, res: Response) {
  console.log('Got login request')

  var state = generateRandomString(16);
  res.cookie(STATEKEY, state);

  // Request authorization
  var scope = '';
  res.redirect('https://accounts.spotify.com/authorize?' +
    querystring.stringify({
      response_type: 'code',
      client_id: CLIENT_ID,
      scope: scope,
      redirect_uri: REDIRECT_URI,
      state: state
    }));
}

/**
 * Requests refresh and access tokens after checking the state parameter
 */
export function oauthCallback(req: Request, res: Response) {
  var code = req.query.code || null;
  var state = req.query.state || null;
  var storedState = req.cookies ? req.cookies[STATEKEY] : null;

  if (state === null || state !== storedState) {
    res.redirect(FRONT_URL + '#' +
      querystring.stringify({
        error: 'state_mismatch'
      }));
    return;
  }

  res.clearCookie(STATEKEY);
  const body = {
    'grant_type': 'authorization_code',
    'code': (code || '').toString(), // A bit ugly, might be fixed later
    'redirect_uri': REDIRECT_URI
  };

  var authOptions = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')),
      'Accept': 'application/json'
    },
    body: encodeFormData(body)
  };

  (async () => {
    const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
    if (response.ok && response.status === 200) {
      const { access_token, refresh_token } = await response.json() as { access_token: string, refresh_token: string }
      // we can also pass the token to the browser to make requests from there
      res.cookie('access_token', access_token);
      res.cookie('refresh_token', refresh_token);
      res.redirect(HOME_URL);

    } else {
      res.redirect(FRONT_URL + '#' +
        querystring.stringify({
          error: 'invalid_token'
        }));
    }
  })();
}

export function oauthRefreshToken(req: Request, res: Response) {
  console.log('Got token refresh request');

  const refresh_token = req.query.refresh_token;
  const body = {
    'grant_type': 'refresh_token',
    'refresh_token': refresh_token
  };

  var authOptions = {
    method: 'POST',
    headers: {
      'content-type': 'application/x-www-form-urlencoded',
      'Authorization': 'Basic ' + (Buffer.from(`${CLIENT_ID}:${CLIENT_SECRET}`).toString('base64')),
      'Accept': 'application/json'
    },
    body: encodeFormData(body)
  };

  (async () => {
    const response = await fetch('https://accounts.spotify.com/api/token', authOptions);
    if (response.ok && response.status === 200) {
      const { access_token } = await response.json() as { access_token: string }
      // we can also pass the token to the browser to make requests from there
      // res.cookie('access_token', access_token);
      return res.send(access_token);
    }
  })();
}
