import { useCallback, useState } from 'react';
import { Player } from '..';
import { SpotifyAPI } from '../../lib/spotify-api';

export function TestAPI() {
  const api = SpotifyAPI.Instance;
  const [track, setTrack] = useState('');

  const onValidToken = useCallback((access_token: string) => {
    const fn = async () => {
      const playlists = await api.getUserPlaylists();
      if (!playlists?.length || playlists.length < 1) return;
      const playlistItems = await api.getPlaylistItems(playlists[0].id.toString());
      if (!playlistItems?.[0]) return;
      setTrack(playlistItems[0].preview_url);
    };
    fn();
  }, []);

  return (
    <>
      <div className="test">
        {track !== "" && (<>
          <Player preview_url={track} />
          <p>Play your song !</p>
        </>)}
      </div>
    </>
  );
}
