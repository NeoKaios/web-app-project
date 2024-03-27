/*
 * SuperMemo v2 algorithm.
 * Refs :
 *  + https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-supermemo-method
 *  + https://github.com/thyagoluciano/sm2?tab=readme-ov-file
 */

export const INITIAL_REPETITIONS = 0;
export const INITIAL_EF = 2.5;
export const INITIAL_INTERVAL = 1;

export type SM2State = {
  repetitions: number,
  ef: number,
  interval: number
}

/*
 * Quality:
 * 5 - perfect response
 * 4 - correct response after a hesitation
 * 3 - correct response recalled with serious difficulty
 * 2 - incorrect response; where the correct one seemed easy to recall
 * 1 - incorrect response; the correct one remembered
 * 0 - complete blackout.
 */
export function updateSM2(quality: number, repetitions: number, ef: number, interval: number): SM2State {
  var ret: SM2State = { repetitions, ef, interval };

  // Correct response
  if (quality >= 3) {
    switch (repetitions) {
      case 0:
        ret.interval = 1;
        break;
      case 1:
        ret.interval = 6;
      default:
        ret.interval = Math.ceil(interval * ef);
        break;
    }
    ret.repetitions += 1;
    ret.ef = Math.max(1.3, ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

  // Incorrect response
  } else {
    ret.repetitions = 0;
    ret.interval = 1;
  }

  return ret;
}
