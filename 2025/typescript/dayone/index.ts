import { getProblemLinesFromText } from "../utils";

const lines = await getProblemLinesFromText(__dirname);

const DIAL_SIZE = 99;
const STARTING_POSITION = 50;

const simulateTurns = (
  direction: "L" | "R",
  count: number,
  startingPosition: number
) => {
  let touchedZeroCount = 0;
  for (let i = 0; i < count; i++) {
    if (startingPosition === DIAL_SIZE && direction === "R") {
      startingPosition = 0;
      touchedZeroCount++;
    } else if (startingPosition === 0 && direction === "L") {
      startingPosition = DIAL_SIZE;
    } else {
      const delta = direction === "R" ? 1 : -1;
      startingPosition = startingPosition + delta;

      if (direction === "L" && startingPosition === 0) {
        touchedZeroCount++;
      }
    }
  }

  const result: [number, number] = [startingPosition, touchedZeroCount];
  return result;
};

const partOne = (lines: string[]) => {
  let position = STARTING_POSITION;
  console.log(`- The dial starts by pointing at ${STARTING_POSITION}`);
  let countOfZeroes = 0;
  for (const line of lines) {
    const [direction, ...rest] = line.split("") as ["L" | "R", string[]];
    const count = +rest.join("");

    const [newPosition] = simulateTurns(direction, count, position);
    // console.log(
    //   `- The dial is rotated ${direction}${count} to point at ${newPosition}`
    // );

    position = newPosition;

    if (position === 0) {
      countOfZeroes++;
    }
  }
  return countOfZeroes;
};

const partTwo = (lines: string[]) => {
  let position = STARTING_POSITION;
  console.log(`- The dial starts by pointing at ${STARTING_POSITION}`);
  let countOfZeroes = 0;
  for (const line of lines) {
    const [direction, ...rest] = line.split("") as ["L" | "R", string[]];
    const count = +rest.join("");

    const [newPosition, touchedZeroCount] = simulateTurns(
      direction,
      count,
      position
    );
    // console.log(
    //   `- The dial is rotated ${direction}${count} to point at ${newPosition}; it touched zero ${touchedZeroCount} time(s)`
    // );

    position = newPosition;
    countOfZeroes += touchedZeroCount;
  }
  return countOfZeroes;
};

export default { partOne: () => partOne(lines), partTwo: () => partTwo(lines) };
