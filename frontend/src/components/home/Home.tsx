import './home.scss';
import { useEffect, useState } from 'react';
import { SimplifiedPlaylist } from 'spotify-types';
import { ModeSelector, PlaylistTable } from '..';
import { Button } from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useSpotifyAPI } from '../../lib/spotify-api-provider';

export function Home() {
  const spotifyAPI = useSpotifyAPI();
  const [playlists, setPlaylists] = useState<SimplifiedPlaylist[]>();
  const [chosenPlaylist, setChosenPlaylist] = useState<SimplifiedPlaylist>();

  const getPlaylistsAsync = async () => {
    setPlaylists(await spotifyAPI.getUserPlaylists());
  };
  if (playlists === undefined) getPlaylistsAsync();

  console.log('home reloaded');
  return (
    <div className='container'>
      {playlists && (
        chosenPlaylist ? (
          <div className='mode-selector'>
            <Button color="inherit" aria-label="unselect playlist" className="back-btn" onClick={() => setChosenPlaylist(undefined)}><ArrowBackIcon className="back-icon" /></Button>
            <ModeSelector playlist={chosenPlaylist} />
          </div>
        ) : <PlaylistTable playlists={playlists} callback={setChosenPlaylist} />
      )}
    </div>
  );
}
