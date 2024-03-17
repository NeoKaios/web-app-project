import { useCallback, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SimplifiedTrack } from 'spotify-types';
import { SpotifyAPI } from '../../lib/spotify-api';
import { Oauth } from '../oauth/Oauth';
import { Player } from '../player/Player';

export function Study() {
  const { playlist_id } = useParams() as { playlist_id: string };
  const [access_token, setAccessToken] = useState('');
  const [tracks, setTracks] = useState<SimplifiedTrack[]>();

  const onValidToken = useCallback((access_token: string) => {
    setAccessToken(access_token);
    const api = SpotifyAPI.getInstance();
    const fn = async () => {
      const playlist_items = await api.getPlaylistItems(access_token, playlist_id);
      playlist_items !== undefined && setTracks(playlist_items);
    };
    fn();
  }, [playlist_id]);

  return (
    <>
      <Oauth onValidToken={onValidToken} />
      <div className="training-panel">
        {tracks && (<>
          <Player preview_url={tracks[Math.floor(Math.random() * tracks.length)].preview_url} />
          <p>Play your song !</p>
        </>)}
      </div>
    </>
  );
}
