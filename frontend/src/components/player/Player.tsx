import { useEffect, useState } from 'react';
import './player.scss';
import logo from "../../assets/logo.svg";

const DEFAULT_TIME = 15;

enum PlayingState {
  Init = 'init',
  Started = 'started',
  Paused = 'paused',
}

export function Player({ preview_url }: { preview_url: string }) {
  const [playingState, setPlayingState] = useState(PlayingState.Init);
  const [audio] = useState(new Audio());

  useEffect(() => {
    setPlayingState(PlayingState.Init);
    if (!audio.paused) {
      //Auto play if user clicked while music still playing
      setTimeout(() => {
        audio.play();
        setPlayingState(PlayingState.Started);
      }, 200);
    }
    audio.src = preview_url;
    audio.load();
  }, [preview_url, audio]);

  useEffect(() => {
    audio.ontimeupdate = () => {
      if (audio.currentTime > DEFAULT_TIME) {
        audio.pause();
        audio.currentTime = 0;
        setPlayingState(PlayingState.Init);
      }
    }
  }, [audio])

  const handleAudio = () => {
    if (playingState === PlayingState.Started) {
      setPlayingState(PlayingState.Paused);
      audio.pause();
    } else {
      setPlayingState(PlayingState.Started);
      audio.play();
    }
  };

  return (
    <div className={"player " + playingState} onClick={handleAudio} onAnimationEnd={() => { }}>
      <img src={logo} className='animated' alt="Player"/>
    </div>
  );
}

