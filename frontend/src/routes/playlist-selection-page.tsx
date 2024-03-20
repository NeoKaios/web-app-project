import { Button } from "@mui/base";
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { SimplifiedPlaylist } from "spotify-types";
import { ModeSelector, PlaylistTable } from "../components";
import { ACCESS_TOKEN_COOKIE } from "../lib/consts";
import { getCookie } from "../lib/cookie";
import { SpotifyAPI } from "../lib/spotify-api";
import { useSpotifyAPI } from "../providers/spotify-api-provider";

export async function loader() {
  console.log('calling play loader');
  await new Promise(r => setTimeout(r, 2000));
  const playlists = await SpotifyAPI.Instance.getUserPlaylists();
  return playlists;
}

export function PlaylistSelectionPage() {
  const playlists = useLoaderData() as Awaited<ReturnType<typeof loader>>;
  const [chosenPlaylist, setChosenPlaylist] = useState<SimplifiedPlaylist>();

  console.log('rendering playselepage', playlists);
  if (!playlists) {
    console.log('manual load')
    return null;
  }
  return <>{
    chosenPlaylist ? (
      <div className='mode-selector'>
        <Button color="inherit" aria-label="unselect playlist" className="back-btn" onClick={() => setChosenPlaylist(undefined)}><ArrowBackIcon className="back-icon" /></Button>
        <ModeSelector playlist={chosenPlaylist} />
      </div>
    ) : <PlaylistTable playlists={playlists} callback={setChosenPlaylist} />
  }</>;
}
