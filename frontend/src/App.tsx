import logo from "./assets/logo.svg";
import "./App.scss";
import { PlaylistList } from "./components";
import { getRefreshToken, removeCookie } from "./lib/cookie";
import { ACCESS_TOKEN_COOKIE, BACK_URL, FRONT_URL, REFRESH_TOKEN_COOKIE } from "./lib/consts";
import { useCallback, useState } from "react";
import { SimplifiedPlaylist } from "spotify-types";
import { TestAPI } from "./components/test-api/TestAPI";
import { Oauth } from "./components/oauth/Oauth";
import { SpotifyAPI } from "./lib/spotify-api";

function logout() {
  removeCookie(ACCESS_TOKEN_COOKIE);
  removeCookie(REFRESH_TOKEN_COOKIE);
}

function App() {
  const [playlists, setPlaylists] = useState<SimplifiedPlaylist[]>();
  const [access_token, setAccessToken] = useState('');
  const loggedIn = getRefreshToken() !== undefined;

  const onValidToken = useCallback((access_token: string) => {
    const getPlaylistsAsync = async () => {
      const api = new SpotifyAPI();
      setPlaylists(await api.getUserPlaylists(access_token));
    };
    getPlaylistsAsync();
    setAccessToken(access_token);
  }, []);

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        {loggedIn ? (
          <>
            <Oauth onValidToken={onValidToken} />
            {access_token !== '' && (
              <>
                <a href={FRONT_URL} onClick={logout}>Log out</a>
                {playlists && <PlaylistList playlists={playlists}></PlaylistList>}
                <TestAPI access_token={access_token} />
              </>
            )}
          </>
        ) : (
          <a href={BACK_URL + "login"}>Login</a>
        )}
      </header>
    </div>
  );
}

export default App;
