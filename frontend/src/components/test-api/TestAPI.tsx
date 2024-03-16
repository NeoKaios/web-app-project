import { useEffect, useState } from 'react';
import { SpotifyAPI } from '../../lib/spotify-api';
import { Player } from '../player/Player';

export function TestAPI({ access_token }: { access_token: string }) {
  const [track, setTrack] = useState("");

  useEffect(() => {
    const api = new SpotifyAPI();
    const fn = async () => {
      const playlists = (await api.getUserPlaylists(access_token));
      if (!playlists?.length || playlists.length < 1) return;
      const playlistItems = await api.getPlaylistItems(access_token, playlists[0]);
      if (!playlistItems?.[0]) return;
      setTrack(playlistItems[0].preview_url);
    };
    fn();
  }, [access_token]);

  return (
    <div className="test">
      {track !== "" && (<>
        <Player preview_url={track} />
        <p>Play your song !</p>
      </>)
      }
    </div>
  );
}
