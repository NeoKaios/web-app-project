import express from "express";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbGetStudySongs, dbGetUserData, dbGetUserProgression, dbRegisterUser, dbResetPlaylistProgression, dbTest, dbUpdateStudySong } from "./db";
import { oauthCallback, oauthLogin, oauthRefreshToken } from "./oauth";
import { fetchRequests, locallogin, storeRequest } from "./reqs";


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
app.get('/progression/:user_id/:playlist_id', dbGetUserProgression);
app.get('/reset_progression/:user_id/:playlist_id', dbResetPlaylistProgression);

app.get('/locallogin', locallogin)

//Vulnerable Features Management
app.get('/reqstore', storeRequest)
app.get('/reqfetch', fetchRequests)

app.listen(4000, () => {
  console.log('listening for requests on port 4000')
})

