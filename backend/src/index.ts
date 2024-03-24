import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbGetStudySong, dbGetUserData } from "./db";
import { oauthCallback, oauthLogin, oauthRefreshToken } from "./oauth";

const app = express();

app.use(cors())
   .use(cookieParser());

// Oauth setup
app.get('/login', oauthLogin)
app.get('/callback', oauthCallback)
app.get('/refresh_token', oauthRefreshToken)

app.get('/user/:user_id', dbGetUserData);
app.get('/study/:user_id/:playlist_id', dbGetStudySong);

app.listen(4000, () => {
  console.log('listening for requests on port 4000')
})
