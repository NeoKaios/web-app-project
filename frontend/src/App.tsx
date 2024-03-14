import React, { useState } from "react";
import logo from "./assets/logo.svg";
import "./App.scss";
import { SimplifiedPlaylist } from "spotify-types";
import { fetchTracks } from "./lib/fetchPlaylist";
import { PlaylistList } from "./components";
import { getCookie, removeCookie } from "./lib/cookie";

function logout() {
  removeCookie('access_token');
  removeCookie('refresh_token');
}

function App() {
  const [playlists, setPlaylists] = useState<SimplifiedPlaylist[]>();

  const access_token = getCookie('access_token');
  const logged = access_token !== undefined;

  const getPlaylistsAsync = async (access_token: string) => {
    setPlaylists(await fetchTracks(access_token));
  };

  if (logged && playlists === undefined) {
    getPlaylistsAsync(access_token);
  }

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {logged ? (
          <a href="http://localhost:3000/" onClick={logout}>Log out</a>
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
