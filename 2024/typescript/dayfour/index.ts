import { getProblemLinesFromText } from "../utils";

const checkAllEightDirectionsForXmas = (
  xPosition: number,
  yPosition: number,
  lines: string[]
) => {
  const xDeltas = [0, -1, 1];
  const yDeltas = [0, -1, 1];
  let countOfXmasAtPosition = 0;
  for (const xDelta of xDeltas) {
    for (const yDelta of yDeltas) {
      if (
        lines[xPosition + xDelta]?.[yPosition + yDelta] === "M" &&
        lines[xPosition + xDelta * 2]?.[yPosition + yDelta * 2] === "A" &&
        lines[xPosition + xDelta * 3]?.[yPosition + yDelta * 3] === "S"
      ) {
        countOfXmasAtPosition++;
      }
    }
  }

  return countOfXmasAtPosition;
};

const getIndexesOfAllAsInAllMASConfigurations = (
  xPosition: number,
  yPosition: number,
  lines: string[]
) => {
  const xDeltas = [-1, 1];
  const yDeltas = [-1, 1];
  let indexesOfA: string[] = [];
  for (const xDelta of xDeltas) {
    for (const yDelta of yDeltas) {
      if (
        lines[xPosition + xDelta]?.[yPosition + yDelta] === "A" &&
        lines[xPosition + xDelta * 2]?.[yPosition + yDelta * 2] === "S"
      ) {
        indexesOfA.push(`${xPosition + xDelta}_${yPosition + yDelta}`);
      }
    }
  }

  return indexesOfA;
};

const partOne = (lines: string[]) => {
  let xmasCount = 0;
  for (let xPosition = 0; xPosition < lines.length; xPosition++) {
    const line = lines[xPosition];
    for (let yPosition = 0; yPosition < line.length; yPosition++) {
      const char = line[yPosition];
      if (char !== "X") {
        continue;
      }

      xmasCount += checkAllEightDirectionsForXmas(xPosition, yPosition, lines);
    }
  }

  return xmasCount;
};

const partTwo = (lines: string[]) => {
  const keyToCountLookup = new Map<string, number>();
  for (let xPosition = 0; xPosition < lines.length; xPosition++) {
    const line = lines[xPosition];
    for (let yPosition = 0; yPosition < line.length; yPosition++) {
      const char = line[yPosition];
      if (char !== "M") {
        continue;
      }

      const keys = getIndexesOfAllAsInAllMASConfigurations(
        xPosition,
        yPosition,
        lines
      );

      for (const key of keys) {
        if (!keyToCountLookup.has(key)) {
          keyToCountLookup.set(key, 1);
        } else {
          const current = keyToCountLookup.get(key)!;
          keyToCountLookup.set(key, current + 1);
        }
      }
    }
  }

  let xmasCount = 0;
  for (const value of keyToCountLookup.values()) {
    if (value > 1) {
      xmasCount += value - 1;
    }
  }

  return xmasCount;
};

const lines = await getProblemLinesFromText(__dirname);
export default {
  partOne: () => partOne(lines),
  partTwo: () => partTwo(lines),
};
