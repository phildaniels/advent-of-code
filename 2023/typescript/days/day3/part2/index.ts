import input from './data';

const lines = input.split('\n');

const extractNumbersAndStartIndexesFromLine = (line: string) => {
  const numbersAndStartIndexes: Array<[string, number]> = [];
  const chars = line?.split('') ?? [];
  let currentNumberString = '';
  let currentNumberStartIndex: number | undefined;
  for (let i = 0; i <= chars.length; i++) {
    const currentChar = chars[i];
    const currentCharAsNumber = +currentChar;
    if (isNaN(currentCharAsNumber)) {
      if (currentNumberString !== '' && currentNumberStartIndex !== undefined) {
        numbersAndStartIndexes.push([
          currentNumberString,
          currentNumberStartIndex,
        ]);
        currentNumberString = '';
        currentNumberStartIndex = undefined;
      }
      continue;
    }

    if (currentNumberString === '') {
      currentNumberStartIndex = i;
    }

    currentNumberString = `${currentNumberString}${currentCharAsNumber}`;
  }

  return numbersAndStartIndexes;
};

const getAdjacentNumbersToAsterisk = (
  lines: Array<string>,
  currentAsteriskLineNumber: number,
  currentAsteriskLineIndex: number
) => {
  const lineAbove = lines[currentAsteriskLineNumber - 1];
  const numbersAndStartIndexesAboveAsterisk =
    extractNumbersAndStartIndexesFromLine(lineAbove);
  const numbersTouchingAsteriskAbove = numbersAndStartIndexesAboveAsterisk
    .filter(([number, startIndex]) => {
      const numberEndIndex = startIndex + number.length - 1;
      return (
        (currentAsteriskLineIndex - 1 <= startIndex &&
          startIndex <= currentAsteriskLineIndex + 1) ||
        (currentAsteriskLineIndex - 1 <= numberEndIndex &&
          numberEndIndex <= currentAsteriskLineIndex + 1)
      );
    })
    .map(([number]) => number);

  const lineBelow = lines[currentAsteriskLineNumber + 1];
  const numbersAndStartIndexesBelowAsterisk =
    extractNumbersAndStartIndexesFromLine(lineBelow);
  const numbersTouchingAsteriskBelow = numbersAndStartIndexesBelowAsterisk
    .filter(([number, startIndex]) => {
      const numberEndIndex = startIndex + number.length - 1;
      return (
        (currentAsteriskLineIndex - 1 <= startIndex &&
          startIndex <= currentAsteriskLineIndex + 1) ||
        (currentAsteriskLineIndex - 1 <= numberEndIndex &&
          numberEndIndex <= currentAsteriskLineIndex + 1)
      );
    })
    .map(([number]) => number);

  const currentLine = lines[currentAsteriskLineNumber];
  const numbersAndStartIndexesOnCurrentLine =
    extractNumbersAndStartIndexesFromLine(currentLine);
  const numbersLeftAndRightAdjacentToAsterisk =
    numbersAndStartIndexesOnCurrentLine
      .filter(([number, startIndex]) => {
        const numberEndIndex = startIndex + number.length - 1;
        return (
          numberEndIndex === currentAsteriskLineIndex - 1 ||
          startIndex === currentAsteriskLineIndex + 1
        );
      })
      .map(([number]) => number);

  const allNumbersTouchingAsterisk = [
    ...numbersTouchingAsteriskAbove,
    ...numbersTouchingAsteriskBelow,
    ...numbersLeftAndRightAdjacentToAsterisk,
  ];

  return allNumbersTouchingAsterisk.map((number) => +number);
};

let sum = 0;

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  const chars = line.split('');
  for (let j = 0; j < chars.length; j++) {
    const currentChar = chars[j];

    if (currentChar !== '*') {
      continue;
    }

    const adjacentNumbers = getAdjacentNumbersToAsterisk(lines, i, j);

    if (adjacentNumbers.length === 2) {
      const [number1, number2] = adjacentNumbers;
      const gearRatio = number1 * number2;
      sum += gearRatio;
    }
  }
}

const answer = `${sum}`;

//81463996

export default answer;
