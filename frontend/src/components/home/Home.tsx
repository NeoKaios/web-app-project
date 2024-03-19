import './home.scss';
import { useCallback, useState } from 'react';
import { SimplifiedPlaylist } from 'spotify-types';
import { ACCESS_TOKEN_COOKIE, BACK_URL, FRONT_URL, REFRESH_TOKEN_COOKIE } from '../../lib/consts';
import { getRefreshToken, removeCookie } from '../../lib/cookie';
import { SpotifyAPI } from '../../lib/spotify-api';
import { Oauth } from '../oauth/Oauth';
import { PlaylistTable } from '../playlist-table/PlaylistTable';
import { ModeSelector } from '../mode-selector/ModeSelector';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import logo from "../../assets/logo.svg";

function logout() {
  removeCookie(ACCESS_TOKEN_COOKIE);
  removeCookie(REFRESH_TOKEN_COOKIE);
}

export function Home() {
  const [access_token, setAccessToken] = useState('');
  const [playlists, setPlaylists] = useState<SimplifiedPlaylist[]>();
  const [chosenPlaylist, setChosenPlaylist] = useState<SimplifiedPlaylist>();
  const loggedIn = getRefreshToken() !== undefined;

  const onValidToken = useCallback((access_token: string) => {
    const getPlaylistsAsync = async () => {
      const api = SpotifyAPI.getInstance();
      setPlaylists(await api.getUserPlaylists(access_token));
    };
    getPlaylistsAsync();
    setAccessToken(access_token);
  }, []);

  return (
    <div className="home-panel">
      <nav className='header'>
        <img src={logo} className="logo" alt="App logo" />
        <h1>Spotify BlindTest Learner</h1>
        {loggedIn ?
          <Button className="log-btn" href={FRONT_URL} variant="contained" onClick={logout}>Log out</Button>
          : <Button className="log-btn" href={BACK_URL + "login"} variant="contained">Login</Button>
        }
      </nav>
      {loggedIn ? (
        <>
          <Oauth onValidToken={onValidToken} />
          {access_token !== '' && playlists && (
            chosenPlaylist ? (
              <div className='mode-selector'>
                <Button color="inherit" aria-label="unselect playlist" className="back-btn" onClick={() => setChosenPlaylist(undefined)}><ArrowBackIcon className="back-icon"/></Button>
                <ModeSelector playlist={chosenPlaylist} />
              </div>
            ) : <PlaylistTable playlists={playlists} callback={setChosenPlaylist} />
          )}
        </>
      ) : null}
    </div>
  );
}
