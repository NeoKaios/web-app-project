import React, { useState } from "react";
import logo from "./assets/logo.svg";
import "./App.scss";
import { SimplifiedPlaylist } from "spotify-types";
import { fetchTracks } from "./lib/fetchPlaylist";
import { PlaylistList } from "./components";
import { getHashParams } from "./lib/utils";

function App() {
  const [playlists, setPlaylists] = useState<SimplifiedPlaylist[]>();

  const params = getHashParams();
  const logged = params.access_token !== undefined;
  const getPlaylistsAsync = async () => {
    setPlaylists(await fetchTracks(params.access_token));
  };

  if (logged && playlists === undefined) {
    getPlaylistsAsync();
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {logged ? (
          <div className="tokens">
            <p>Access token: {params.access_token}</p>
            <p>Refresh token: {params.refresh_token}</p>
            <p>Error: {params.error}</p>
          </div>
        ) : null}
        {logged ? (
          <a href="http://localhost:3000/">Log out</a>
        ) : (
          <a href="http://localhost:4000/login">Login</a>
        )}
        {playlists ? (
          <div>
            <p>List of playlists:</p>
            <PlaylistList playlists={playlists}></PlaylistList>
          </div>
        ) : null}
      </header>
    </div>
  );
}

export default App;
