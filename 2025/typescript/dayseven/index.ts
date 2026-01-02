import {
  displayPartsToString,
  isBreakStatement,
  setEmitFlags,
} from "typescript";
import {
  generateKeyFromPosition,
  generatePositionFromKey,
  getPositionVisuallyBelowCurrentPosition,
  getPositionsVisuallyLeftAndRightOfCurrentPosition,
  getProblemLinesFromText,
  positionsIncludePosition,
  type Position,
} from "../utils";
import { indexOfLine } from "bun";

const lines = await getProblemLinesFromText(__dirname);

// const partOne = (lines: string[]) => {
//   let startPosition: Position | undefined;

//   for (let i = 0; i < lines.length; i++) {
//     const line = lines[i]!;
//     const indexOfS = line.indexOf("S");

//     if (indexOfS === -1) {
//       continue;
//     }

//     startPosition = [i, indexOfS];
//     break;
//   }

//   if (!startPosition) {
//     throw "No start position detected on the board";
//   }

//   const firstBeam = getPositionVisuallyBelowCurrentPosition(
//     startPosition,
//     lines
//   );

//   if (!firstBeam) {
//     throw "No position below start position";
//   }

//   const beams: Position[] = [firstBeam];
//   const previousBeams: Position[] = [];

//   let iterationCount = -1;

//   let splitCount = 0;

//   let logSampleSize = 10;

//   while (beams.length > 0) {
//     iterationCount++;
//     if (iterationCount % logSampleSize === 0) {
//       console.log({ iterationCount });
//       printBoard(lines, beams, previousBeams);
//     }
//     const currentBeam = beams.shift()!;

//     previousBeams.push(currentBeam);

//     const positionBelowCurrentBeam = getPositionVisuallyBelowCurrentPosition(
//       currentBeam,
//       lines
//     );

//     if (!positionBelowCurrentBeam) {
//       continue;
//     }

//     if (
//       lines[positionBelowCurrentBeam[0]]?.[positionBelowCurrentBeam[1]] === "^"
//     ) {
//       splitCount++;
//       const nextPositions = getPositionsVisuallyLeftAndRightOfCurrentPosition(
//         positionBelowCurrentBeam,
//         lines
//       );
//       beams.push(...nextPositions);
//       continue;
//     }

//     beams.push(positionBelowCurrentBeam);
//   }

//   return splitCount;
// };

const getModifiedLinesAndCountOfSplits = (input: string[]) => {
  let indexOfStartLine: number | undefined;
  // input = input.filter((line) => ![...line].every((char) => char === "."));
  for (let i = 0; i < input.length; i++) {
    const currentLine = input[i]!;
    if (currentLine.indexOf("S") === -1) {
      continue;
    }

    indexOfStartLine = i;
    break;
  }

  if (indexOfStartLine === undefined) {
    throw "Start position not found!";
  }

  let currentLines = [...input].slice(indexOfStartLine);
  let previousLines = [];

  let countOfSplits = 0;
  // let iterationCount = -1;
  while (currentLines.length > 0) {
    // iterationCount++;
    const currentLine = currentLines.shift()!;
    previousLines.push(currentLine);
    const indexesOfBeams = [...currentLine]
      .map((char, index) => [char, index] as [string, number])
      .filter(([char]) => char === "|" || char === "S")
      .map(([, originalIndex]) => originalIndex);

    const nextLine = currentLines[0];

    if (!nextLine) {
      break;
    }

    const indexesOfSplitBeams: number[] = [];

    const modifiedNextLineWithoutSplitBeams = [...nextLine].map(
      (char, index) => {
        if (!indexesOfBeams.includes(index)) {
          return char;
        }

        if (char === "^") {
          countOfSplits++;
          indexesOfSplitBeams.push(index - 1, index + 1);
          return char;
        }

        return "|";
      }
    );

    const modifiedNextLine = modifiedNextLineWithoutSplitBeams
      .map((char, index) => {
        if (indexesOfSplitBeams.includes(index)) {
          return "|";
        }

        return char;
      })
      .join("");
    currentLines[0] = modifiedNextLine;

    // if (iterationCount === 0 || (iterationCount + 1) % sampleInterval === 0) {
    //   console.log(`Iteration ${iterationCount + 1}`, { countOfSplits });
    //   console.log([...previousLines, ...currentLines].join("\n"));
    //   console.log();
    // }
  }

  return [countOfSplits, [...previousLines, ...currentLines]] as [
    number,
    string[]
  ];
};

const partOne = (input: string[]) => {
  const [countOfSplits] = getModifiedLinesAndCountOfSplits(input);
  return countOfSplits;
};

const partTwo = (lines: string[]) => {
  const [, modifiedLines] = getModifiedLinesAndCountOfSplits(lines);
  let positionOfStart: Position | undefined;
  for (let i = 0; i < modifiedLines.length; i++) {
    const currentLine = modifiedLines[i]!;
    const indexOfS = currentLine.indexOf("S");
    if (indexOfS === -1) {
      continue;
    }

    positionOfStart = [i, indexOfS];
    break;
  }

  if (!positionOfStart) {
    throw "No starting position!";
  }

  // console.log(modifiedLines.join("\n"));

  const dp = new Map<string, number>();
  for (let i = modifiedLines.length - 1; i >= 0; i--) {
    const line = modifiedLines[i]!;
    for (let j = 0; j < line.length; j++) {
      const currentPosition: Position = [i, j];
      const positionKey = generateKeyFromPosition([i, j]);
      const char = line[j];

      if (char === "|" || char === "S") {
        const positionBelow = getPositionVisuallyBelowCurrentPosition(
          currentPosition,
          modifiedLines
        );

        if (!positionBelow) {
          dp.set(positionKey, 1);
        } else {
          const positionBelowKey = generateKeyFromPosition(positionBelow);
          const currentValue = dp.get(positionBelowKey)!;
          dp.set(positionKey, currentValue);
        }
      }

      if (char === "^") {
        continue;
      }
    }

    for (let j = 0; j < line.length; j++) {
      const currentPosition: Position = [i, j];
      const positionKey = generateKeyFromPosition([i, j]);
      const char = line[j];

      if (char === "^") {
        const leftAndRightPositions =
          getPositionsVisuallyLeftAndRightOfCurrentPosition(
            currentPosition,
            modifiedLines
          );

        const value = leftAndRightPositions.reduce((prev, current) => {
          const key = generateKeyFromPosition(current);
          const dpAtKey = dp.get(key)!;
          return prev + dpAtKey;
        }, 0);

        dp.set(positionKey, value);
      }
    }
  }

  // let maxValueInDp = 0;
  // for (const val of dp.values()) {
  //   if (val > maxValueInDp) {
  //     maxValueInDp = val;
  //   }
  // }

  // const linesWithReplacements = [...modifiedLines]
  //   .map((line, xPosition) =>
  //     [
  //       ...[...line].map((char, yPosition) => {
  //         let value =
  //           dp
  //             .get(generateKeyFromPosition([xPosition, yPosition]))
  //             ?.toString() ?? char;
  //         for (
  //           let i = 0;
  //           i < maxValueInDp.toString().length - value.length;
  //           i++
  //         ) {
  //           value = `${value} `;
  //         }

  //         return `${value} `;
  //       }),
  //       ...["|", ...modifiedLines[xPosition]!].map((char) => {
  //         let value = char;
  //         for (
  //           let i = 0;
  //           i < maxValueInDp.toString().length - value.length;
  //           i++
  //         ) {
  //           value = `${value}  `;
  //         }

  //         return `${value} `;
  //       }),
  //     ].join("")
  //   )
  //   .join("\n");

  // console.log(linesWithReplacements);
  const startKey = generateKeyFromPosition(positionOfStart);
  const dpAtStart = dp.get(startKey);

  if (dpAtStart === undefined) {
    throw "DP at start was not calculated!";
  }

  return dpAtStart;
};

export default {
  partOne: () => partOne(lines),
  partTwo: () => partTwo(lines),
};
