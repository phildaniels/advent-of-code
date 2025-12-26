import { getProblemLinesFromText } from "../utils";

const lines = await getProblemLinesFromText(__dirname);

const partOne = (lines: string[]) => {
  return 1;
};

const partTwo = (lines: string[]) => {
  return 0;
};

export default { partOne: () => partOne(lines), partTwo: () => partTwo(lines) };
