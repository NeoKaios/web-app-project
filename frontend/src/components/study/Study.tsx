import { useLoaderData } from 'react-router-dom';
import { Player } from '..';
import { SpotifyAPI } from '../../lib/spotify-api';

export async function loader({ params: { playlist_id } }: any) {
  console.log('study loader, loading: ', playlist_id);
  return await SpotifyAPI.Instance.getPlaylistItems(playlist_id);
}

export function Study() {
  const tracks = useLoaderData() as Awaited<ReturnType<typeof loader>>;

  do { //TODO: should be a map
    var idx = Math.floor(Math.random() * tracks.length);
    var selected_url = tracks[idx].preview_url;
  } while(!selected_url)

  console.log(tracks[idx].name);
  console.log(tracks[idx].artists.map(ar => {return ar.name}));

  return (
    <div className="training-panel">
      <Player preview_url={selected_url} />
      <p>Play your song !</p>
    </div>
  );
}
