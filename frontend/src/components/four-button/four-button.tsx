import { randomShuffle } from '../../lib/random';
import './four-button.scss';

export function FourButton({ choices, noShuffle, callback, square }: { choices: { text: string, id: string }[], noShuffle: boolean, square: boolean, callback: any }) {

  // Check the array as the correct size
  while (choices.length < 4) {
    choices.push({ text: '', id: '' })
  }
  choices = choices.slice(0, 4);

  choices = noShuffle ? choices : randomShuffle(choices);

  return (
    <div className={"four-button" + (square ? " square" : "")}>
      {choices.map(({ text, id }, idx) => {
        return <button className={'color-' + idx} onClick={() => callback(id)} key={id}>{text}</button>
      })}
    </div>
  );
}

FourButton.defaultProps = {
  noShuffle: false,
  square: false,
}
