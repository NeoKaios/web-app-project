import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbGetStudySongs, dbGetUserData, dbRegisterUser, dbTest, dbUpdateStudySong } from "./db";
import { oauthCallback, oauthLogin, oauthRefreshToken } from "./oauth";

const app = express();

app.use(cors())
   .use(cookieParser());

// Oauth setup
app.get('/login', oauthLogin)
app.get('/callback', oauthCallback)
app.get('/refresh_token', oauthRefreshToken)

app.get('/testdb', dbTest);
app.get('/register_user/:user_id/:username', dbRegisterUser);
app.get('/user/:user_id', dbGetUserData);
app.get('/get_study_songs/:user_id/:playlist_id', dbGetStudySongs);
app.get('/update_study_song/:user_id/:playlist_id/:song_id/:quality', dbUpdateStudySong);

app.listen(4000, () => {
  console.log('listening for requests on port 4000')
})