import logo from "./assets/logo.svg";
import "./App.scss";
import { PlaylistList } from "./components";
import { getAccessToken, getRefreshToken, removeCookie } from "./lib/cookie";
import { ACCESS_TOKEN_COOKIE, BACK_URL, FRONT_URL, REFRESH_TOKEN_COOKIE } from "./lib/consts";
import { useEffect, useState } from "react";
import { SimplifiedPlaylist } from "spotify-types";
import { fetchPlaylists } from "./lib/fetchPlaylists";
import { checkToken } from "./lib/spotify-api";
import { Player } from "./components/player/Player";
import { TestAPI } from "./components/test-api/TestAPI";

function logout() {
  removeCookie(ACCESS_TOKEN_COOKIE);
  removeCookie(REFRESH_TOKEN_COOKIE);
}

function App() {
  const [playlists, setPlaylists] = useState<SimplifiedPlaylist[]>();
  const [logged, setLogged] = useState(false);
  const [testing, setTest] = useState(false);

  const access_token = getAccessToken();
  const refresh_token = getRefreshToken();

  const getPlaylistsAsync = async (access_token: string) => {
    setPlaylists(await fetchPlaylists(access_token));
  };

  useEffect(() => {
    const fun = async () => {
      if (!access_token) return;
      const isValid = await checkToken(access_token);
      console.log("Token validity : ", isValid);
      if (isValid) {
        getPlaylistsAsync(access_token);
        setLogged(true);
      } else { // Invalid token : generate a new one
        window.location.href = BACK_URL + 'refresh_token?refresh_token=' + refresh_token;
      }
    };
    fun();
  }, [access_token, refresh_token]);

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
      { logged && testing && access_token && <TestAPI access_token={ access_token } /> }
      <button onClick={ () => setTest(!testing) }>Test : { testing ? "On" : "Off" }</button>
    </div>
  );
}

export default App;
