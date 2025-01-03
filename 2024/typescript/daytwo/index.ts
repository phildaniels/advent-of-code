import { getProblemLinesFromText } from "../utils";

const arrayIsValid = (numbers: number[]) => {
  for (let i = 1; i < numbers.length - 1; i++) {
    const previousNumber = numbers[i - 1];
    const currentNumber = numbers[i];
    const nextNumber = numbers[i + 1];
    if (
      !(
        (previousNumber < currentNumber && currentNumber < nextNumber) ||
        (previousNumber > currentNumber && currentNumber > nextNumber)
      )
    ) {
      return false;
    }

    if (
      Math.abs(currentNumber - previousNumber) > 3 ||
      Math.abs(currentNumber - nextNumber) > 3
    ) {
      return false;
    }
  }

  return true;
};

const partOne = (lines: string[]) => {
  let validLines = 0;
  for (const line of lines) {
    const numbers = line.split(" ").map((numberString) => +numberString);
    const lineIsValid = arrayIsValid(numbers);
    if (lineIsValid) {
      validLines++;
    }
  }

  return validLines;
};

const generateAllPermutationsOfArrayWithZeroOrOneElementRemoved = (
  numbers: number[]
) => {
  const permutations = [numbers];
  for (let i = 0; i < numbers.length; i++) {
    const copy = [...numbers];
    copy.splice(i, 1);
    permutations.push(copy);
  }

  return permutations;
};

const partTwo = (lines: string[]) => {
  let validLines = 0;
  for (const line of lines) {
    const numbers = line.split(" ").map((numberString) => +numberString);
    const permutations =
      generateAllPermutationsOfArrayWithZeroOrOneElementRemoved(numbers);
    for (const permutation of permutations) {
      const lineIsValid = arrayIsValid(permutation);
      if (lineIsValid) {
        validLines++;
        break;
      }
    }
  }

  return validLines;
};

const partTwoMorePerformant = (lines: string[]) => {
  let validLines = 0;
  for (const line of lines) {
    const numbers = line.split(" ").map((numberString) => +numberString);
    const lineIsValid = arrayIsValid(numbers);
    if (lineIsValid) {
      validLines++;
      continue;
    }

    for (let i = 0; i < numbers.length; i++) {
      const copy = [...numbers];
      copy.splice(i, 1);
      const permutationIsValid = arrayIsValid(copy);
      if (permutationIsValid) {
        validLines++;
        break;
      }
    }
  }

  return validLines;
};

const isSequenceValid = (one: number, two: number, three: number) => {
  if (!((one < two && two < three) || (one > two && two > three))) {
    return false;
  }

  if (Math.abs(two - one) > 3 || Math.abs(two - three) > 3) {
    return false;
  }

  return true;
};

const lines = await getProblemLinesFromText(__dirname);

export default {
  partOne: () => partOne(lines),
  partTwo: () => partTwoMorePerformant(lines),
};
