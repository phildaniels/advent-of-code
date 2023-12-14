import input from './data';

const wordToNumberLookup: Record<string, number> = {
  zero: 0,
  one: 1,
  two: 2,
  three: 3,
  four: 4,
  five: 5,
  six: 6,
  seven: 7,
  eight: 8,
  nine: 9,
};

const lines = input.split('\n');
let sum = 0;
for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  let firstNumber: number | undefined;
  let lastNumber: number | undefined;
  for (let j = 0; j < line.length; j++) {
    const char = line[j];
    const charAsNum = +char;
    if (isNaN(charAsNum)) {
      let wordSoFar = char;
      for (let k = j + 1; k < line.length; k++) {
        const currentChar = line[k];
        if (!isNaN(+currentChar)) {
          break;
        }
        wordSoFar = `${wordSoFar}${currentChar}`;
        const lookupValue = wordToNumberLookup[wordSoFar];
        if (!lookupValue) {
          continue;
        }
        if (!firstNumber) {
          firstNumber = lookupValue;
        }

        lastNumber = lookupValue;
      }

      continue;
    }

    if (!firstNumber) {
      firstNumber = charAsNum;
    }

    lastNumber = charAsNum;
  }

  const value = +`${firstNumber}${lastNumber}`;

  sum += value;
}

const answer = `${sum}`;

export default answer;
