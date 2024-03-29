/*
 * SuperMemo v2 algorithm.
 * Refs :
 *  + https://www.supermemo.com/en/blog/application-of-a-computer-to-improve-the-results-obtained-in-working-with-the-supermemo-method
 *  + https://github.com/thyagoluciano/sm2?tab=readme-ov-file
 */

export const INITIAL_REPETITIONS = 0;
export const INITIAL_EF = 2.5;
export const INITIAL_INTERVAL = 1;

export const INTERVAL_DURATION = 30; // In seconds

export type SM2State = {
  repetitions: number,
  ef: number,
  interval: number
}

/**
 * Patch for only 4 options
 * 3 - perfect response
 * 2 - correct response recalled with serious difficulty | incorrect response; where the correct one seemed easy to recall
 * 1 - incorrect response; the correct one remembered
 * 0 - complete blackout.
 */
export function updateSM2(quality: number, repetitions: number, ef: number, interval: number): SM2State {
  const quality_bis = (() => {
    switch (quality) {
      case 0:
        return 0;
      case 1:
        return 2;
      case 2:
        return 3;
      default: // 3
        return 5;
    }
  })();
  console.log("Quality bis", quality_bis);
  return updateSM2Core(quality_bis, repetitions, ef, interval);
}

/**
 * Quality:
 * 5 - perfect response
 * 4 - correct response after a hesitation
 * 3 - correct response recalled with serious difficulty
 * 2 - incorrect response; where the correct one seemed easy to recall
 * 1 - incorrect response; the correct one remembered
 * 0 - complete blackout.
 */
function updateSM2Core(quality: number, repetitions: number, ef: number, interval: number): SM2State {
  let ret: SM2State = { repetitions, ef, interval };
  console.log("From ", ret);

  // Correct response
  if (quality >= 3) {
    if (repetitions === 0) {
      ret.interval = 1;
    } else if (repetitions === 1) {
      ret.interval = 6;
    } else {
      console.log("qefleqjflqkjflqkejflqkefjqlekfjqelkfjqelkfjqelkfjeqlfkjqlfkjelfkjqlfkjqelfkjqelkfjqf");
      ret.interval = Math.ceil(interval * ef);
    }
    ret.repetitions += 1;
    ret.ef = Math.max(1.3, ef + (0.1 - (5 - quality) * (0.08 + (5 - quality) * 0.02)));

    // Incorrect response
  } else {
    ret.repetitions = 0;
    ret.interval = 1;
  }

  console.log("To ", ret);
  return ret;
}
