import { useCallback, useState } from 'react';
import { SpotifyAPI } from '../../lib/spotify-api';
import { Oauth } from '../oauth/Oauth';
import { Player } from '../player/Player';

export function TestAPI() {
  const [access_token, setAccessToken] = useState('');
  const [track, setTrack] = useState('');

  const onValidToken = useCallback((access_token: string) => {
    setAccessToken(access_token);
    const api = new SpotifyAPI();
    const fn = async () => {
      const playlists = await api.getUserPlaylists(access_token);
      if (!playlists?.length || playlists.length < 1) return;
      const playlistItems = await api.getPlaylistItems(access_token, playlists[0]);
      if (!playlistItems?.[0]) return;
      setTrack(playlistItems[0].preview_url);
    };
    fn();
  }, []);

  return (
    <>
      <Oauth onValidToken={onValidToken} />
      <div className="test">
        {track !== "" && (<>
          <Player preview_url={track} />
          <p>Play your song !</p>
        </>)}
      </div>
    </>
  );
}
