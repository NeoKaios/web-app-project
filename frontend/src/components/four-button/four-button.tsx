import { randomShuffle } from '../../lib/random';
import './four-button.scss';

export function FourButton({ choices, noShuffle }: { choices: { text: string, id: string }[], noShuffle: boolean }) {

  const click = (id: string) => {
    dispatchEvent(new CustomEvent('four-button-click', { detail: id }));
  }

  // Check the array as the correct size
  while (choices.length < 4) {
    choices.push({ text: '', id: '' })
  }
  choices = choices.slice(0, 4);

  choices = noShuffle ? choices : randomShuffle(choices);

  return (
    <div className="four-button">
      {choices.map(({ text, id }) => {
        return <button onClick={() => click(id)} key={id}>{text}</button>
      })}
    </div>
  );
}

FourButton.defaultProps = {
  noShuffle: false
}
