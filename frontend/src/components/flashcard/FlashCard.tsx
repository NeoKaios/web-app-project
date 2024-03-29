import "./FlashCard.scss";
import { FourButton } from "../four-button/four-button";
import { useEffect, useState } from "react";

const LEVELS = [
  'I Hardly know the song',
  'Hard, would not have remembered alone',
  'Took some time / almost',
  'EZ',
];

export function FlashCard({ description, flipped, callback, onClick }: { description: string, flipped: boolean, callback: (quality: number) => void, onClick: () => void }) {
  return (
    <div className={"flashcard" + (flipped ? " flipped" : "")}>
      <div className="flashcard-inner">
        <div onClick={onClick} className="flashcard-front">
          <span>?</span>
        </div>
        <div className="flashcard-back">
          <span>{description}</span>
          <FourButton
            choices={[0, 1, 2, 3].map((quality) => {
              return {
                text: LEVELS[quality],
                id: quality.toString()
              }
            })}
            noShuffle={true}
            square={true}
            callback={(quality: string) => callback(Number(quality))} />
        </div>
      </div>
    </div>
  );
}
