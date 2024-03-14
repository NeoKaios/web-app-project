import logo from "./assets/logo.svg";
import "./App.scss";
import { PlaylistList } from "./components";
import { getAccessToken, getRefreshToken, removeCookie } from "./lib/cookie";
import { ACCESS_TOKEN_COOKIE, BACK_URL, FRONT_URL, REFRESH_TOKEN_COOKIE } from "./lib/consts";
import { useEffect, useState } from "react";
import { SimplifiedPlaylist } from "spotify-types";
import { fetchPlaylists } from "./lib/fetchPlaylists";
import { checkToken } from "./lib/spotify-api";

function logout() {
  removeCookie(ACCESS_TOKEN_COOKIE);
  removeCookie(REFRESH_TOKEN_COOKIE);
}

function App() {
  const [playlists, setPlaylists] = useState<SimplifiedPlaylist[]>();
  const [logged, setLogged] = useState(false);

  const access_token = getAccessToken();
  const refresh_token = getRefreshToken();

  const getPlaylistsAsync = async (access_token: string) => {
    setPlaylists(await fetchPlaylists(access_token));
  };

  useEffect(() => {
    if (access_token) {
      checkToken(access_token).then((isValid) => {
        console.log("Token validity : ", isValid);
        if (isValid) {
          getPlaylistsAsync(access_token);
          setLogged(true);
        } else { // Invalid token : generate a new one
          window.location.href = BACK_URL + 'refresh_token?refresh_token=' + refresh_token;
        }
      });
    }
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {logged ? (
          <a href={ FRONT_URL } onClick={logout}>Log out</a>
        ) : (
          <a href={ BACK_URL + "login" }>Login</a>
        )}
        {logged && playlists ? <PlaylistList playlists={playlists}></PlaylistList> : null}
      </header>
    </div>
  );
}

export default App;
