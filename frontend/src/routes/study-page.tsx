import { useLoaderData } from 'react-router-dom';
import { DESKTOP_MIN_SIZE, ERROR_EMPTY_PLAYLIST } from '../lib/consts';
import { useEffect, useState } from 'react';
import { getPlaylistItems, getTrack, getUserData } from '../lib/spotify-api';
import { randomChoice } from '../lib/random';
import { Player } from '../components';
import { getNewStudySongs, getStudySongs, updateStudySong } from '../lib/backend-api';
import { Track } from 'spotify-types';
import { FlashCard } from '../components/flashcard/FlashCard';
import { DifficultySelector } from '../components/difficulty-selector/DifficultySelector';
import MediaQuery, { useMediaQuery } from 'react-responsive';
import './study-page.scss';

const REFRESH_DELAY = 10000; // Refresh period for toStudy songs in ms
let timestamp = Math.round(Date.now() / 1000); // A bit ugly, but an initial timestamp is needed

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
  const [flipped, setFlipped] = useState(false);
  const isMobile = useMediaQuery({ query: `(min-width: ${DESKTOP_MIN_SIZE}px)` })

  const getRandomTrack = () => {
    let updatedToStudy = toStudy;
    let updatedNewTracks = newTracks;

    if (selectedTrack) {
      updatedToStudy = toStudy.filter(t => t.id !== selectedTrack.id);
      updatedNewTracks = newTracks.filter(t => t.id !== selectedTrack.id);
      setToStudy(updatedToStudy);
      setNewTracks(updatedNewTracks);
    }

    if (!updatedToStudy.length && !updatedNewTracks.length) {
      return;
    }

    return updatedToStudy.length ? randomChoice(updatedToStudy) : randomChoice(updatedNewTracks);
  }

  // Regularly refresh songs to study
  useEffect(() => {
    const interval = setInterval(async () => {
      const { newToStudy } = await getNewStudySongs(loaderData.userId, loaderData.playlistId, timestamp);

      // New songs to study
      if (newToStudy.length) {
        timestamp = Math.round((Date.now() - REFRESH_DELAY) / 1000);
        const newTracksToStudy = await Promise.all(newToStudy.map(getTrack));
        setToStudy(toStudy.concat(newTracksToStudy));
      }
    }, REFRESH_DELAY);

    return () => clearInterval(interval);
  }, [toStudy])

  // Select a track when loading page
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
    <div className="study-page">
      <Player preview_url={selectedTrack.preview_url} />
      <p>Can you guess this song ?</p>
      <div className={"study-layout " + (isMobile ? "row" : "col")}>
        <FlashCard onClick={() => setFlipped(true)} description={selectedTrack.name} flipped={flipped} />
        <MediaQuery minWidth={DESKTOP_MIN_SIZE}>
          <DifficultySelector row={false} callback={submitLevel} />
        </MediaQuery>
        <MediaQuery maxWidth={DESKTOP_MIN_SIZE - 1}>
          <DifficultySelector row={true} callback={submitLevel} />
        </MediaQuery>
      </div>
    </div>
  );
}
