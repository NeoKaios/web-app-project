import './Home.scss';
import { useCallback, useState } from 'react';
import { SimplifiedPlaylist } from 'spotify-types';
import { ACCESS_TOKEN_COOKIE, BACK_URL, FRONT_URL, REFRESH_TOKEN_COOKIE } from '../../lib/consts';
import { getRefreshToken, removeCookie } from '../../lib/cookie';
import { SpotifyAPI } from '../../lib/spotify-api';
import { Oauth } from '../oauth/Oauth';
import { PlaylistTable } from '../playlist-table/PlaylistTable';
import { ModeSelector } from '../mode-selector/ModeSelector';
import { Button, IconButton } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

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
      {loggedIn ? (
        <>
          <Oauth onValidToken={onValidToken} />
          {access_token !== '' && (
            <>
              {playlists && (
                chosenPlaylist ? (
                  <>
                    <IconButton aria-label="unselect playlist" size="large" onClick={() => setChosenPlaylist(undefined)}><ArrowBackIcon /></IconButton>
                    <ModeSelector playlist={chosenPlaylist} />
                  </>
                )
                  : <PlaylistTable playlists={playlists} callback={setChosenPlaylist} />
              )}
              <div className="logout">
                <Button className="logout" href={FRONT_URL} variant="contained" onClick={logout}>Log out</Button>
              </div>
            </>
          )}
        </>
      ) : (
        <a href={BACK_URL + "login"}>Login</a>
      )}
    </div>
  );
}
