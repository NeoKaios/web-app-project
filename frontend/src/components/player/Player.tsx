import { useEffect, useState } from 'react';
import './player.scss';
import logo from "./assets/logo.svg";

const DEFAULT_TIME = 15;

export function Player({ preview_url }: { preview_url: string }) {
  const [counter, setCounter] = useState(15);
  const [isPlaying, setIsPlaying] = useState(false);
  const [audio] = useState(new Audio(preview_url));

  useEffect(() => {
    let intervalId: NodeJS.Timer;
    if (isPlaying) {
      intervalId = setInterval(() => {
        if (counter <= 1) {
          setIsPlaying(false);
        } else {
          setCounter(counter - 1)
        }
      }, 1000)
    };
    return () => clearInterval(intervalId);
  }, [isPlaying, counter]);

  const play = () => {
    if (isPlaying) {
      setCounter(0);
      setIsPlaying(false);
      audio.currentTime = 0;
      audio.pause();
    } else {
      setCounter(DEFAULT_TIME);
      setIsPlaying(true);
      audio.play();
    }
  };

  return (
    <div className={"player" + (isPlaying ? " playing" : "")} onClick={play}>
      <img src={logo} className="spotify-logo" alt="logo" />
    </div>
  );
}

