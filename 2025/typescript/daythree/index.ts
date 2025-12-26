import { getProblemLinesFromText } from "../utils";

const lines = await getProblemLinesFromText(__dirname);

const partOne = (lines: string[]) => {
  let sum = 0;
  for (const line of lines) {
    let max = 0;
    for (let i = 0; i < line.length; i++) {
      for (let j = i + 1; j < line.length; j++) {
        const num = +`${line[i]}${line[j]}`;
        if (num > max) {
          max = num;
        }
      }
    }
    // console.log({ max });
    sum += max;
  }

  return sum;
};

const partTwo = (lines: string[]) => {
  let sum = 0;
  for (const line of lines) {
    let lineAsNumbers = [...line].map((char) => +char);
    const numberSoFar: number[] = [];

    while (numberSoFar.length < 12) {
      const numbersRemaining = 12 - numberSoFar.length;
      const possibleChoices = lineAsNumbers
        .slice(0, lineAsNumbers.length - numbersRemaining + 1)
        .map((num, index) => [num, index] as [number, number]);
      const nextBiggestIndex = possibleChoices.sort(
        ([aSize], [bSize]) => bSize - aSize
      )?.[0]?.[1];

      const nextBiggestNumber = lineAsNumbers[nextBiggestIndex!];
      //   console.log({
      //     numberSoFar: numberSoFar.join(""),
      //     remainingString: lineAsNumbers.join(""),
      //     choices: possibleChoices.map(([num]) => num),
      //     chose: nextBiggestNumber,
      //   });
      numberSoFar.push(nextBiggestNumber!);
      lineAsNumbers = lineAsNumbers.slice(nextBiggestIndex! + 1);
    }

    const maxNumber = +numberSoFar.join("");
    sum += maxNumber;
  }

  return sum;
};

export default { partOne: () => partOne(lines), partTwo: () => partTwo(lines) };
