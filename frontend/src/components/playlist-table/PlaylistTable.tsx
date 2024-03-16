import Grid from '@mui/material/Grid';
import { SimplifiedPlaylist } from 'spotify-types';
import { PlaylistElement } from '../playlist-element/PlaylistElement';

export function PlaylistTable({ playlists, callback }: { playlists: SimplifiedPlaylist[], callback: (playlist: SimplifiedPlaylist) => void }) {
  return (
    <div className="playlist-table">
      <Grid container justifyContent="center" spacing={2} maxWidth="1000px">
        {playlists.map((playlist) => (
          <Grid item>
            <PlaylistElement playlist={playlist} callback={callback}/>
          </Grid>
        ))}
      </Grid>
    </div>
  );
}
