import "./FlashCard.scss";
import questionMark from "../../assets/question-mark.jpg"

export function FlashCard({ description, flipped, onClick }: { description: string, flipped: boolean, onClick: () => void }) {
  return (
    <div onClick={onClick} className={"flashcard" + (flipped ? " flipped" : "")}>
      <div className="flashcard-inner">
        <img className="flashcard-front" src={questionMark} />
        <div className="flashcard-back">
          <span>{description}</span>
        </div>
      </div>
    </div>
  );
}
