import fs from 'fs';
import { join } from 'path';
import input from './data';

let cachedAnswer: string | undefined;
try {
  const filePath = join(__dirname, 'answer.txt');
  cachedAnswer = fs.readFileSync(filePath, { encoding: 'utf-8' });
} catch (e) {}

const solve = () => {
  const numbers: string[] = [];

  const lines = input.split('\n');

  const adjacentSquaresContainASymbol = (
    lines: Array<string>,
    currentLineIndex: number,
    currentBlockStartIndex: number,
    currentBlockEndIndex: number
  ) => {
    const charsAbove =
      lines[currentLineIndex - 1]
        ?.substring(currentBlockStartIndex, currentBlockEndIndex + 1)
        ?.split('') ?? [];
    const charsBelow =
      lines[currentLineIndex + 1]
        ?.substring(currentBlockStartIndex, currentBlockEndIndex + 1)
        ?.split('') ?? [];
    const charLeft =
      lines[currentLineIndex]?.charAt(currentBlockStartIndex - 1) ?? '';
    const charRight =
      lines[currentLineIndex]?.charAt(currentBlockEndIndex + 1) ?? '';

    const charDiagonalTopLeft =
      lines[currentLineIndex - 1]?.charAt(currentBlockStartIndex - 1) ?? '';
    const charDiagonalTopRight =
      lines[currentLineIndex - 1]?.charAt(currentBlockEndIndex + 1) ?? '';
    const charDiagonalBottomLeft =
      lines[currentLineIndex + 1]?.charAt(currentBlockStartIndex - 1) ?? '';
    const charDiagonalBottomRight =
      lines[currentLineIndex + 1]?.charAt(currentBlockEndIndex + 1) ?? '';

    const allAdjacentChars = [
      charDiagonalTopLeft,
      ...charsAbove,
      charDiagonalTopRight,
      charRight,
      charDiagonalBottomRight,
      ...charsBelow,
      charLeft,
      charDiagonalBottomLeft,
    ]
      .join('')
      .split('');

    const atLeastOneAdjacentCharIsSymbol = allAdjacentChars.some((char) =>
      charIsSymbol(char)
    );

    return atLeastOneAdjacentCharIsSymbol;
  };

  const charIsSymbol = (char: string) => {
    return isNaN(+char) && char !== '.';
  };

  let sum = 0;

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const chars = line.split('');
    let currentNumberString = '';
    let currentNumberStartIndex: number | undefined;
    let currentNumberEndIndex: number | undefined;
    for (let j = 0; j <= chars.length; j++) {
      const currentChar = chars[j];
      const currentCharAsNumber = +currentChar;
      if (isNaN(currentCharAsNumber)) {
        if (
          currentNumberString !== '' &&
          currentNumberStartIndex !== undefined
        ) {
          currentNumberEndIndex = j - 1;
          if (
            adjacentSquaresContainASymbol(
              lines,
              i,
              currentNumberStartIndex,
              currentNumberEndIndex
            )
          ) {
            numbers.push(`${currentNumberString}_${i}`);
            sum += +currentNumberString;
          }

          currentNumberString = '';
          currentNumberStartIndex = undefined;
          currentNumberEndIndex = undefined;
        }
        continue;
      }

      if (currentNumberString === '' && currentNumberStartIndex === undefined) {
        currentNumberStartIndex = j;
      }
      currentNumberString = `${currentNumberString}${currentChar}`;
    }
  }

  return sum;
};

const answer = cachedAnswer ?? `${solve()}`;
if (!cachedAnswer) {
  const filePath = join(__dirname, 'answer.txt');
  fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
}

export default answer;
