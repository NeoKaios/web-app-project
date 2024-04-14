import { useLoaderData } from 'react-router-dom';
import { randomNChoices } from "../../lib/random";
import { getPlaylist, getPlaylistItems } from '../../lib/spotify-api';
import './hardcore-page.scss';
import { Track } from 'spotify-types';
import { useState } from 'react';
import { Player } from '../../components';
import logo0 from '../../assets/0-spotify-logo.svg'
import logo1 from '../../assets/1-spotify-logo.svg'
import logo2 from '../../assets/2-spotify-logo.svg'
import logo3 from '../../assets/3-spotify-logo.svg'
import Select from 'react-select';
import { ERROR_PLAYLIST_IS_TOO_SMALL } from '../../lib/consts';

export async function hardcoreLoader({ params: { playlist_id } }: any) {
  console.log('Loading hardcore page...');
  const allTracks = await getPlaylistItems(playlist_id);
  const playlistInfo = await getPlaylist(playlist_id);
  const tracks = allTracks.filter(track => track.preview_url);
  return { tracks, playlistInfo };
}

const VOLUMES = [1, 0.85, 0.70] as const;

export function HardcorePage() {
  const { tracks, playlistInfo } = useLoaderData() as Awaited<ReturnType<typeof hardcoreLoader>>;
  const [choices, setChoices] = useState<Track[]>();
  const [currentScore, setCurrentScore] = useState<number>(0)
  const logos = [logo0, logo1, logo2, logo3]

  if (tracks.length < 3) {
    throw new Error(ERROR_PLAYLIST_IS_TOO_SMALL);
  }

  const getRandomSelection = () => {
    setChoices([...(randomNChoices(tracks, 3))] as typeof choices);
  }

  if (!choices) {
    getRandomSelection();
    return null
  }

  if (choices.length === 0) {
    setCurrentScore(oldScore => {
      return oldScore + 100;
    })
    getRandomSelection();
  }

  const handleClick = () => {
    const players = document.querySelectorAll('[id^="partialPlayer"]');
    players.forEach((player: any) => player.click());
  }

  const options = tracks.map(item => ({ value: item.id, label: item.name, }));

  const submitChoice = (selectedOption: any) => {
    const chosen = selectedOption.value;
    if (choices?.filter(tr => tr.id === chosen).length !== 0) {
      setChoices(oldValues => {
        return oldValues?.filter(tr => tr.id !== chosen);
      })
      setCurrentScore(oldScore => {
        return oldScore + 50;
      })
    }
  }

  return (
    <div className="hardcore-page">
      <h2 className='title'>Multiple songs from {playlistInfo.name}</h2>
      <div id="allPlayers" hidden>
        <div></div>
        {choices.map(({ preview_url }, idx) => {
          return <Player preview_url={preview_url} id={"partialPlayer" + idx.toString()} volume={VOLUMES[idx]} />
        })}
      </div>
      <img src={logos[choices.length]} className='animated' alt="Player" onClick={handleClick} />
      <div id="center">
        <div className='animated-score' id="score">
          {currentScore}
        </div>
      </div>
      <Select placeholder="Select a song" options={options} styles={{
        menu: (base) => ({ width: "max-content", minWidth: "100%" }),
        input: (base) => ({ color: 'white' }),
        control: (baseStyles, state) => ({
          ...baseStyles,
          borderColor: 'green',
          backgroundColor: 'black',
          color: 'green',
        }),
        singleValue: (provided: any) => ({
          ...provided,
          height: '100%',
          color: 'white',
          paddingTop: '3px',
          backgroundColor: 'black'
        }),
        option: (styles, { isFocused, isSelected }) => ({
          ...styles,
          backgroundColor: isFocused ? 'green' : 'black',
        })
      }}
        onChange={submitChoice}
      />
    </div>
  );
}
