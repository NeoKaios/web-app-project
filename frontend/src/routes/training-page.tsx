import './training-page.scss';
import { useState } from "react";
import { useLoaderData } from "react-router-dom";
import { Track } from "spotify-types";
import { FourButton, Player } from "../components";
import { ERROR_PLAYLIST_IS_TOO_SMALL } from "../lib/consts";
import { randomChoice, randomNChoices } from "../lib/random";
import { getPlaylist, getPlaylistItems } from "../lib/spotify-api";
import { useMediaQuery } from 'react-responsive';

export async function trainingLoader({ params: { playlist_id } }: any) {
  console.log('Loading playlist training page...');
  const allTracks = await getPlaylistItems(playlist_id);
  const playlistInfo = await getPlaylist(playlist_id);
  const tracks = allTracks.filter(track => track.preview_url);
  return { tracks, playlistInfo };
}

export function TrainingPage() {
  const { tracks, playlistInfo } = useLoaderData() as Awaited<ReturnType<typeof trainingLoader>>;
  const [remainingTracks, setRemainingTracks] = useState<Track[]>(tracks);
  const [choices, setChoices] = useState<[Track, Track, Track, Track]>();
  const useSquare = useMediaQuery({ query: '(max-width: 800px)' });

  if (tracks.length < 4) {
    throw new Error(ERROR_PLAYLIST_IS_TOO_SMALL);
  }

  const getRandomSelection = () => {
    if (!remainingTracks.length) {
      setRemainingTracks(tracks);
      setChoices(undefined);
      return;
    }
    const newSelected = randomChoice(remainingTracks);
    const filteredTracks = tracks.filter(t => t.id !== newSelected.id)
    setChoices([newSelected, ...(randomNChoices(filteredTracks, 3))] as typeof choices);
    setRemainingTracks(remainingTracks.filter(t => t.id !== newSelected.id));
  }

  if (!choices) {
    getRandomSelection();
    return null;
  }

  const submitChoice = (id: string) => {
    const res = choices[0].id;
    console.log(res === id)
    getRandomSelection();
  }

  const buttonChoices = choices.map(({ id, name }) => ({ text: name, id }));
  const selectedTrack = choices[0];

  return (
    <div className="training-page">
      <h2 className='title'>Training on {playlistInfo.name}</h2>
      <Player preview_url={selectedTrack.preview_url} />
        <FourButton choices={buttonChoices} callback={submitChoice} square={useSquare}/>
    </div>
  );
}
