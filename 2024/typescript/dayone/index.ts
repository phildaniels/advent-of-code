const getProblemText = async () => {
  const data = Bun.file("data.txt");
  const text = await data.text();
  return text;
};

const getProblemLines = (text: string) => text.split("\n");

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

const text = await getProblemText();
const lines = getProblemLines(text);

console.log("part one:", partOne(lines));
console.log("part two:", partTwo(lines));
