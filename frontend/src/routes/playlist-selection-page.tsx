import { Button } from "@mui/material";
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { SimplifiedPlaylist } from "spotify-types";
import { ModeSelector, PlaylistTable } from "../components";
import { WEB_SPOTIFY_URL } from "../lib/consts";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import './playlist-selection-page.scss';
import { getUserPlaylists } from "../lib/spotify-api";

export async function playlistLoader() {
  console.log('Loading playlist selection page...');
  return await getUserPlaylists();
}

export function PlaylistSelectionPage() {
  const playlists = useLoaderData() as Awaited<ReturnType<typeof playlistLoader>>;
  const [chosenPlaylist, setChosenPlaylist] = useState<SimplifiedPlaylist>();

  const unsetPlaylist = () => setChosenPlaylist(undefined);

  if (!playlists.length) {
    return <>
      <h2>No playlists</h2>
      <p>You have no public playlist on Spotify.</p>
      <p>Go to <a href={WEB_SPOTIFY_URL}>Spotify</a>, add some playlist to your profile and come back here !</p>
    </>
  }
  else if (!chosenPlaylist) {
    return <PlaylistTable playlists={playlists} callback={setChosenPlaylist} />
  }
  return <div className='mode-selector'>
    <Button color="inherit" aria-label="unselect playlist" className="back-btn" onClick={unsetPlaylist}><ArrowBackIcon className="back-icon" /></Button>
    <ModeSelector selectedPlaylist={chosenPlaylist} />
  </div>;
}
