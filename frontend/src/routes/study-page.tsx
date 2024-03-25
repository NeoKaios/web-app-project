import { Button } from '@mui/material';
import { useLoaderData } from 'react-router-dom';
import { BACK_URL, ERROR_EMPTY_PLAYLIST, ERROR_UNEXPECTED_BACKEND_ERROR } from '../lib/consts';
import { useCallback, useEffect, useState } from 'react';
import { getPlaylistItems, getUserData } from '../lib/spotify-api';
import { randomChoice } from '../lib/random';
import { Player } from '../components';

export async function studyLoader({ params: { playlist_id } }: any) {
  console.log('Loading study mode with playlist_id = ', playlist_id);

  const userId = (await getUserData()).id;
  const playlistId = (playlist_id || "") as string;

  const tracks = await getPlaylistItems(playlist_id);
  if (!tracks)
    throw new Error(ERROR_EMPTY_PLAYLIST);

  const { toStudy, studied } = (await getStudySongs(userId, playlist_id));
  const newTracks = tracks.filter(t => t.preview_url
    && studied.reduce((acc, elem) => acc && (elem !== t.id), true));
  const toStudy_ = tracks.filter(t => t.preview_url
    && toStudy.reduce((acc, elem) => acc || (elem === t.id), false));

  return { newTracks, userId, playlistId, toStudy: toStudy_ };
}

async function getStudySongs(user_id: string, playlist_id: string): Promise<{ toStudy: string[], studied: string[] }> {
  /*
   * Fetches songs to study and all previously encountered songs in database
   */
  const response = await fetch(BACK_URL + `get_study_songs/${user_id}/${playlist_id}`);
  if (!response.ok || response.status !== 200)
    throw new Error(ERROR_UNEXPECTED_BACKEND_ERROR);
  return await response.json();
}

async function updateStudySong(user_id: string, playlist_id: string, song_id: string, quality: number) {
  /*
   * Request backend to update song score
   */
  await fetch(BACK_URL + `update_study_song/${user_id}/${playlist_id}/${song_id}/${quality}`);
}

export function StudyPage() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof studyLoader>>;
  const [newTracks, setNewTracks] = useState(loaderData.newTracks);
  const [toStudy, setToStudy] = useState(loaderData.toStudy);
  const selectRandomTrack = useCallback(() => {
    return toStudy.length ? randomChoice(toStudy) : randomChoice(newTracks);
  }, [toStudy, newTracks]);
  const [selectedTrack, setSelectedTrack] = useState(selectRandomTrack());

  const submitLevel = (quality: number) => {
    updateStudySong(loaderData.userId, loaderData.playlistId, selectedTrack.id, quality);

    if (toStudy.length) { // Current track is a previously studied track
      setToStudy(toStudy.filter(t => t.id !== selectedTrack.id));

    } else { // Current track is a new track
      setNewTracks(newTracks.filter(t => t.id !== selectedTrack.id));
    }
  }

  useEffect(() => {
    setSelectedTrack(selectRandomTrack());
  }, [toStudy, newTracks, selectRandomTrack]);

  return (
    <div className="training-panel">
      {selectedTrack ?
        <>
          <p>{selectedTrack.name}</p>
          <p>{selectedTrack.preview_url}</p>
          <Player preview_url={selectedTrack.preview_url} />
          <p>Play your song !</p>
          <>
            {[0, 1, 2, 3, 4, 5].map((quality) => {
              return <Button
                id={"difficulty-level-" + quality}
                variant="contained"
                onClick={() => submitLevel(quality)}>Level {quality}</Button>
            })}
          </>
        </>
        : <p>You studied everything already in this playlist !</p>
      }
    </div>
  );
}
