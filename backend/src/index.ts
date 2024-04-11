import express from "express";
import fileupload from "express-fileupload";
import cors from "cors";
import cookieParser from "cookie-parser";
import { dbGetStudySongs, dbGetUserData, dbGetUserProgression, dbRegisterUser, dbResetPlaylistProgression, dbTest, dbUpdateStudySong } from "./db";
import { oauthCallback, oauthLogin, oauthRefreshToken } from "./oauth";
import { fetchRequests, storeRequest } from "./reqs";
import { deleteFile, extraUrls, uploadFile } from "./upload";
import { locallogin, protectRoute } from "./admin";
import { UPLOADS_DIR } from "./consts";

const app = express();

app.use(fileupload({ createParentPath: true }));

app.use(cors())
  .use(cookieParser());

app.use(express.urlencoded({ extended: true }));
app.use(express.json());


app.use('/audio', express.static(UPLOADS_DIR));

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

// Local Auth
app.get('/locallogin', locallogin)

// Upload
app.post('/upload', protectRoute(uploadFile))
app.delete('/upload/delete/:track_id', protectRoute(deleteFile))
app.post('/get_extra_urls', extraUrls)

//Vulnerable Features Management
app.get('/reqstore', storeRequest)
app.get('/reqfetch', fetchRequests)

app.listen(4000, () => {
  console.log('listening for requests on port 4000')
})

