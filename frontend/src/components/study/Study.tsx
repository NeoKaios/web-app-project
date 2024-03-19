import { useCallback, useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { SimplifiedTrack } from 'spotify-types';
import { Player } from '..';
import { useSpotifyAPI } from '../../lib/spotify-api-provider';

export function Study() {
  const api = useSpotifyAPI();
  const { playlist_id } = useParams() as { playlist_id: string };
  const [tracks, setTracks] = useState<SimplifiedTrack[]>();

  const fn = async () => {
    const playlist_items = await api.getPlaylistItems(playlist_id);
    playlist_items !== undefined && setTracks(playlist_items);
  };
  if (tracks === undefined) fn();
  return (
    <div className="training-panel">
      {tracks && (<>
        <Player preview_url={tracks[Math.floor(Math.random() * tracks.length)].preview_url} />
        <p>Play your song !</p>
      </>)}
    </div>
  );
}
