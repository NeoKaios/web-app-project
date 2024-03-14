require('dotenv').config()
const express = require('express')
const cors = require('cors')
const crypto = require('crypto');
const querystring = require('querystring');
const cookieParser = require('cookie-parser');
const request = require('request');

const generateRandomString = (length) => {
  return crypto
  .randomBytes(60)
  .toString('hex')
  .slice(0, length);
}

var stateKey = 'spotify_auth_state';

const app = express()

app.use(cors())
   .use(cookieParser());

var client_id = process.env.CLIENT_ID;
var client_secret = process.env.CLIENT_SECRET;
var redirect_uri = 'http://localhost:4000/callback'; // Your redirect uri

app.get('/login', (req, res) => {
    console.log('Got login request')

    var state = generateRandomString(16);
    res.cookie(stateKey, state);

    // your application requests authorization
    var scope = '';
    res.setHeader('Access-Control-Allow-Origin', '*');
    res.redirect('https://accounts.spotify.com/authorize?' +
        querystring.stringify({
            response_type: 'code',
            client_id: client_id,
            scope: scope,
            redirect_uri: redirect_uri,
            state: state
        }));
});

app.get('/callback', function(req, res) {

    // your application requests refresh and access tokens
    // after checking the state parameter

    var code = req.query.code || null;
    var state = req.query.state || null;
    var storedState = req.cookies ? req.cookies[stateKey] : null;

    if (state === null || state !== storedState) {
        res.redirect('http://localhost:3000/#' +
            querystring.stringify({
                error: 'state_mismatch'
            }));
        return;
    }
    res.clearCookie(stateKey);
    var authOptions = {
        url: 'https://accounts.spotify.com/api/token',
        form: {
            code: code,
            redirect_uri: redirect_uri,
            grant_type: 'authorization_code'
        },
        headers: {
            'content-type': 'application/x-www-form-urlencoded',
            Authorization: 'Basic ' + (new Buffer.from(client_id + ':' + client_secret).toString('base64'))
        },
        json: true
    };

    request.post(authOptions, function(error, response, body) {
        if (!error && response.statusCode === 200) {

            var access_token = body.access_token,
                refresh_token = body.refresh_token;

            var options = {
                url: 'https://api.spotify.com/v1/me',
                headers: { 'Authorization': 'Bearer ' + access_token },
                json: true
            };

            // use the access token to access the Spotify Web API
            request.get(options, function(error, response, body) {
                console.log(body);
            });

            // we can also pass the token to the browser to make requests from there
            res.redirect('http://localhost:3000/#' +
                querystring.stringify({
                    access_token: access_token,
                    refresh_token: refresh_token
                }));
        } else {
            res.redirect('http://localhost:3000/#' +
                querystring.stringify({
                    error: 'invalid_token'
                }));
        }
    });
});

app.listen(4000, () => {
  console.log('listening for requests on port 4000')
})
