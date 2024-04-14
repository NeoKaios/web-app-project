import { useLoaderData } from 'react-router-dom';
import { randomChoice, randomNChoices } from "../../lib/random";
import { getPlaylist, getPlaylistItems } from '../../lib/spotify-api';
import './hardcore-page.scss';
import { Track } from 'spotify-types';
import { useState } from 'react';
import { FourButton, Player } from '../../components';


export async function hardcoreLoader({ params: { playlist_id } }: any) {
    console.log('Loading playlist training page...');
    const allTracks = await getPlaylistItems(playlist_id);
    const playlistInfo = await getPlaylist(playlist_id);
    const tracks = allTracks.filter(track => track.preview_url);
    return { tracks, playlistInfo };
  }
  
  export function HardcorePage() {
    const { tracks, playlistInfo } = useLoaderData() as Awaited<ReturnType<typeof hardcoreLoader>>;
    const [choices, setChoices] = useState<[ Track, Track, Track]>();

    const getRandomSelection = () => {
        setChoices([...(randomNChoices(tracks, 3))] as typeof choices);
      }
    
      if (!choices) {
        getRandomSelection();
        return null;
      }

    return (
        <div className="hardcore-page">
          <h2 className='title'>Training on {playlistInfo.name}</h2>
          <Player preview_url={choices[0].preview_url} />
          <Player preview_url={choices[1].preview_url} />
          <Player preview_url={choices[2].preview_url} />
        </div>
      );

}