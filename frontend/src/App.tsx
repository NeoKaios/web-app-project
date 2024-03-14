import logo from "./assets/logo.svg";
import "./App.scss";
import { PlaylistList } from "./components";
import { getAccessToken, removeCookie } from "./lib/cookie";
import { ACCESS_TOKEN_COOKIE, REFRESH_TOKEN_COOKIE } from "./lib/consts";
import { useState } from "react";
import { SimplifiedPlaylist } from "spotify-types";
import { fetchPlaylists } from "./lib/fetchPlaylists";

function logout() {
  removeCookie(ACCESS_TOKEN_COOKIE);
  removeCookie(REFRESH_TOKEN_COOKIE);
}

function App() {
  const [playlists, setPlaylists] = useState<SimplifiedPlaylist[]>();

  const access_token = getAccessToken();
  const logged = access_token !== undefined;

  const getPlaylistsAsync = async (access_token: string) => {
    setPlaylists(await fetchPlaylists(access_token));
  };

  if (logged && !playlists) {
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
        {logged && playlists ? <PlaylistList playlists={playlists}></PlaylistList> : null}
      </header>
    </div>
  );
}

export default App;
