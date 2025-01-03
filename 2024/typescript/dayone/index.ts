import { getProblemLinesFromText } from "../utils";

const partOne = (lines: string[]) => {
  const left: number[] = [];
  const right: number[] = [];
  for (const line of lines) {
    const [leftNumber, rightNumber] = line
      .split("   ")
      .map((numberString) => +numberString) as [number, number];
    left.push(leftNumber);
    right.push(rightNumber);
  }
  left.sort();
  right.sort();
  let sum = 0;
  for (let i = 0; i < left.length; i++) {
    const leftNumber = left[i];
    const rightNumber = right[i];
    const difference = Math.abs(leftNumber - rightNumber);
    sum += difference;
  }

  return sum;
};

const partTwo = (lines: string[]) => {
  const rightNumberToFrequencyLookup = new Map<number, number>();
  const left: number[] = [];
  for (const line of lines) {
    const [leftNumber, rightNumber] = line
      .split("   ")
      .map((numberString) => +numberString) as [number, number];
    left.push(leftNumber);

    if (!rightNumberToFrequencyLookup.has(rightNumber)) {
      rightNumberToFrequencyLookup.set(rightNumber, 1);
    } else {
      const current = rightNumberToFrequencyLookup.get(rightNumber)!;
      rightNumberToFrequencyLookup.set(rightNumber, current + 1);
    }
  }

  let sum = 0;
  for (const item of left) {
    const frequencyInRight = rightNumberToFrequencyLookup.get(item) ?? 0;
    sum += frequencyInRight * item;
  }

  return sum;
};

const lines = await getProblemLinesFromText(__dirname);

export default { partOne: () => partOne(lines), partTwo: () => partTwo(lines) };
