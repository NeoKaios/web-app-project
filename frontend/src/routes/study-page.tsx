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
import { FlashCard } from '../components/flashcard/FlashCard';

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

const LEVELS = [
  'Never heard',
  'Hardly know the song',
  'Hard, would not have remembered',
  'I swear I knew it',
  'Remembered after a while',
  'EZ',
];

export function StudyPage() {
  const loaderData = useLoaderData() as Awaited<ReturnType<typeof studyLoader>>;
  const [newTracks, setNewTracks] = useState(loaderData.newTracks);
  const [toStudy, setToStudy] = useState(loaderData.toStudy);
  const [selectedTrack, setSelectedTrack] = useState<Track>();
  const [flipped, setFlipped] = useState(false);

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
    setFlipped(false);
  }

  return (
    <div className="training-panel">
      <Player preview_url={selectedTrack.preview_url} />
      <>
        <div onClick={() => setFlipped(true)}>
          <p>Can you guess this song ?</p>
          <FlashCard description={selectedTrack.name} flipped={flipped} />
        </div>
      </>
      {flipped &&
        <>
          <p>How difficult was it ?</p>
          {[0, 1, 2, 3, 4, 5].map((quality) => {
            return <Button
              key={quality}
              id={"difficulty-level-" + quality}
              variant="contained"
              onClick={() => submitLevel(quality)}>{quality + ' - ' + LEVELS[quality]}</Button>
          })}
        </>
      }
    </div>
  );
}
