import input from './data';

const lines = input.split('\n');

const calculateNextNumberForSequence = (sequence: number[]) => {
  let differences = sequence;
  const differenceArray: Array<number[]> = [differences];
  do {
    differences = calculateDifferenceBetweenNumbersInSequence(differences);
    differenceArray.push(differences);
  } while (differences.some((element) => element !== 0));

  for (let i = differenceArray.length - 1; i >= 0; i--) {
    const lastIndexOfPreviousDifferences =
      (differenceArray?.[i + 1]?.length ?? 0) - 1;
    const lastElementOfPreviousDifferences =
      differenceArray?.[i + 1]?.[lastIndexOfPreviousDifferences] ?? 0;
    const lastElementOfCurrentDifferences =
      differenceArray[i][differenceArray[i].length - 1];
    differenceArray[i].push(
      lastElementOfCurrentDifferences + lastElementOfPreviousDifferences
    );
  }

  return differenceArray[0][differenceArray[0].length - 1];
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

const answer = `${sum}`;

export default answer;
