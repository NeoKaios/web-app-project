import { Button } from '@mui/material';
import { useLoaderData } from 'react-router-dom';
import { ERROR_EMPTY_PLAYLIST } from '../lib/consts';
import { useEffect, useState } from 'react';
import { getPlaylistItems, getUserData } from '../lib/spotify-api';
import { randomChoice } from '../lib/random';
import { Player } from '../components';
import { getStudySongs, updateStudySong } from '../lib/backend-api';
import { Track } from 'spotify-types';
import './study-page.scss';

export async function studyLoader({ params: { playlist_id } }: any) {
  console.log('Loading study mode with playlist_id = ', playlist_id);

  const playlistId = (playlist_id || "") as string;
  const userId = (await getUserData()).id;

  const tracks = await getPlaylistItems(playlist_id);
  if (!tracks)
    throw new Error(ERROR_EMPTY_PLAYLIST);

  const { toStudy: toStudy_, studied } = (await getStudySongs(userId, playlist_id));
  const newTracks = tracks.filter(t => t.preview_url && !studied.includes(t.id));
  const toStudy = tracks.filter(t => t.preview_url && toStudy_.includes(t.id));

  return { newTracks, userId, playlistId, toStudy };
}

export function StudyPage() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof studyLoader>>;
  const [newTracks, setNewTracks] = useState(loaderData.newTracks);
  const [toStudy, setToStudy] = useState(loaderData.toStudy);
  const [selectedTrack, setSelectedTrack] = useState<Track>();

  const getRandomTrack = () => {
    let updatedToStudy = toStudy;
    let updatedNewTracks = newTracks;

    if (selectedTrack) {
      updatedToStudy = toStudy.filter(t => t.id !== selectedTrack.id);
      updatedNewTracks = newTracks.filter(t => t.id !== selectedTrack.id);
      updatedToStudy.length ?
        setToStudy(updatedToStudy) :
        setNewTracks(updatedNewTracks);
    }

    if (!updatedToStudy.length && !updatedNewTracks.length) {
      return;
    }
    return updatedToStudy.length ? randomChoice(updatedToStudy) : randomChoice(updatedNewTracks);
  }

  useEffect(() => {
    if (newTracks.length || toStudy.length) {
      setSelectedTrack(getRandomTrack());
    }
  }, []);

  if ((!newTracks.length && !toStudy.length) || !selectedTrack) {
    return <p>You already studied everything in this playlist !</p>;
  }

  const submitLevel = (quality: number) => {
    updateStudySong(loaderData.userId, loaderData.playlistId, selectedTrack.id, quality);
    setSelectedTrack(getRandomTrack());
  }

  return (
    <div className="training-panel">
      <p>{selectedTrack.name}</p>
      <p>{selectedTrack.preview_url}</p>
      <Player preview_url={selectedTrack.preview_url} />
      <p>Play your song !</p>
      {[0, 1, 2, 3, 4, 5].map((quality) => {
        return <Button
          key={quality}
          id={"difficulty-level-" + quality}
          variant="contained"
          onClick={() => submitLevel(quality)}>Level {quality}</Button>
      })}
    </div>
  );
}
