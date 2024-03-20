import { useCallback, useState } from 'react';
import { Player } from '..';
import { useSpotifyAPI } from '../../providers/spotify-api-provider';

export function TestAPI() {
const api = useSpotifyAPI();
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
