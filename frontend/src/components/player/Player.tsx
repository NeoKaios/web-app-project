import { useCallback, useEffect, useState } from 'react';
import './player.scss';
import logo from "../../assets/logo.svg";

const DEFAULT_TIME = 15;

export function Player({ preview_url }: { preview_url: string }) {
  const [counter, setCounter] = useState(DEFAULT_TIME);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio(preview_url));

  const resetCounter = useCallback(() => {
    setCounter(0);
    setIsPlaying(false);
    audio.currentTime = 0;
    audio.pause();
  }, [audio]);

  useEffect(() => {
    let intervalId: NodeJS.Timer;
    if (isPlaying) {
      intervalId = setInterval(() => {
        if (counter <= 1) {
          resetCounter();
        } else {
          setCounter(counter - 1)
        }
      }, 1000)
    };
    return () => clearInterval(intervalId);
  }, [isPlaying, counter, resetCounter]);

  const play = () => {
    if (isPlaying) {
      resetCounter();
    } else {
      setCounter(DEFAULT_TIME);
      setIsPlaying(true);
      audio.play();
    }
  };

  return (
    <div className={"player" + (isPlaying ? " playing" : "") + ((isPlaying && (counter <= 3)) ? " end" : "")} onClick={play}>
      <img src={logo} className="spotify-logo" alt="logo" />
    </div>
  );
}

