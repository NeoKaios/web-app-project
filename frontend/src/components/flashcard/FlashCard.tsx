import { useEffect, useState } from "react";
import "./FlashCard.scss";
import questionMark from "../../assets/question-mark.jpg"

export function FlashCard({ description, flipped }: { description: string, flipped: boolean }) {
  const [isFlipped, setIsFlipped] = useState(false);

  useEffect(() => {
    setIsFlipped(flipped);
  }, [flipped])

  return (
    <div className={"flashcard" + (isFlipped ? " flipped" : "")}>
      <div className="flashcard-inner">
        <img className="flashcard-front" src={questionMark} />
        <div className="flashcard-back">
          <span>{description}</span>
        </div>
      </div>
    </div>
  );
}
