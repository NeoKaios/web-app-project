import { Button } from "@mui/material";
import "./DifficultySelector.scss";

const LEVELS = [
  'I Hardly know the song',
  'Hard, would not have remembered alone',
  'Took some time / almost',
  'EZ',
];

export function DifficultySelector({ row, callback }: { row: boolean, callback: (quality: number) => void }) {
  const buttonTextGen = (quality: number) => {
    return row ? quality.toString()
      : quality + ' - ' + LEVELS[quality];
  };

  return (
    <div className={"difficulty-selector " + (row ? "row" : "col")}>
      {[0, 1, 2, 3].map((quality) => {
        return <Button
          key={quality}
          className={"difficulty-button"}
          variant="contained"
          onClick={() => callback(quality)}>
          {buttonTextGen(quality)}
        </Button>
      })}
    </div>);
}
