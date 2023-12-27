import fs from 'fs';
import { join } from 'path';
import input from './data';

let cachedAnswer: string | undefined;
try {
  const filePath = join(__dirname, 'answer.txt');
  cachedAnswer = fs.readFileSync(filePath, { encoding: 'utf-8' });
} catch (e) {}

const solve = () => {
  const lines = input.split('\n');

  const calculateNextNumberForSequence = (sequence: number[]) => {
    let differences = sequence;
    const differenceArray: Array<number[]> = [differences];
    do {
      differences = calculateDifferenceBetweenNumbersInSequence(differences);
      differenceArray.push(differences);
    } while (differences.some((element) => element !== 0));

    for (let i = differenceArray.length - 1; i >= 0; i--) {
      const firstIndexOfPreviousDifferences = 0;
      const firstElementOfPreviousDifferences =
        differenceArray?.[i + 1]?.[firstIndexOfPreviousDifferences] ?? 0;
      differenceArray[i].unshift(
        differenceArray[i][0] - firstElementOfPreviousDifferences
      );
    }

    return differenceArray[0][0];
  };

  const calculateDifferenceBetweenNumbersInSequence = (sequence: number[]) => {
    const differences: number[] = [];
    for (let i = 1; i < sequence.length; i++) {
      const currentNumber = sequence[i];
      const previousNumber = sequence[i - 1];
      const difference = currentNumber - previousNumber;
      differences.push(difference);
    }
    return differences;
  };

  let sum = 0;
  for (let i = 0; i < lines.length; i++) {
    const sequenceString = lines[i];
    const sequence = sequenceString
      .split(' ')
      .map((numberAsChar) => +numberAsChar);
    const nextNumberInSequence = calculateNextNumberForSequence(sequence);
    sum += nextNumberInSequence;
  }
  return sum;
};

const answer = cachedAnswer ?? `${solve()}`;
if (!cachedAnswer) {
  const filePath = join(__dirname, 'answer.txt');
  fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
}

export default answer;
