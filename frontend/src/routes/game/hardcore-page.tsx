import { useLoaderData } from 'react-router-dom';
import { randomChoice, randomNChoices } from "../../lib/random";
import { getPlaylist, getPlaylistItems } from '../../lib/spotify-api';
import './hardcore-page.scss';
import { Track } from 'spotify-types';
import { MouseEventHandler, useState } from 'react';
import { FourButton, Player } from '../../components';
import logo from '../../assets/spotify-logo.svg'


export async function hardcoreLoader({ params: { playlist_id } }: any) {
    console.log('Loading hardcore page...');
    const allTracks = await getPlaylistItems(playlist_id);
    const playlistInfo = await getPlaylist(playlist_id);
    const tracks = allTracks.filter(track => track.preview_url);
    


    return { tracks, playlistInfo };
  }
  
  export function HardcorePage() {
    const { tracks, playlistInfo } = useLoaderData() as Awaited<ReturnType<typeof hardcoreLoader>>;
    const [choices, setChoices] = useState<[ Track, Track, Track]>();
    const [volume, setVolume] = useState<[number, number, number]>([1,0.85,0.70]);

    const getRandomSelection = () => {
        setChoices([...(randomNChoices(tracks, 3))] as typeof choices);
      }
    
      if (!choices) {
        getRandomSelection();
        return null;
      }

    const handleClick = () => {
        const players = document.querySelectorAll('[id^="partialPlayer"]');
        console.log(players)
        players.forEach((player: any) => player.click());
        console.log(volume);
    }   

    return (
        <div className="hardcore-page">
          <h2 className='title'>Training on {playlistInfo.name}</h2>
          <div id="allPlayers" hidden>
            <Player preview_url={choices[0].preview_url} id="partialPlayer1" volume={volume[0]}/>
            <Player preview_url={choices[1].preview_url} id="partialPlayer2" volume={volume[1]}/>
            <Player preview_url={choices[2].preview_url} id="partialPlayer3" volume ={volume[2]}/>
            </div>
          <img src={logo} className='animated' alt="Player" onClick={handleClick} />
        </div>
      );

}