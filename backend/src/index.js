require('dotenv').config()
const express = require('express')
const cors = require('cors')
const cookieParser = require('cookie-parser');
require('./db.js');
const oauth = require('./oauth.js');

const app = express()

app.use(cors())
   .use(cookieParser());

// Oauth setup
app.get('/login', oauth.oauthLogin)
app.get('/callback', oauth.oauthCallback)
app.get('/refresh_token', oauth.oauthRefreshToken)

app.get('/user/:user_id', function(req, res) {
  return res.send('lqlqqlqlqlq' + req.params.user_id);
});

app.listen(4000, () => {
  console.log('listening for requests on port 4000')
})
