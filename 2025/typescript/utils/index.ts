import { Temporal } from "@js-temporal/polyfill";

export const getFileText = async (cwd: string, fileName: string) => {
  const data = Bun.file(`${cwd}/${fileName}`);
  const text = await data.text();
  return text;
};

export const getProblemText = (cwd: string) => getFileText(cwd, "data.txt");

export const writeText = async (
  cwd: string,
  fileName: string,
  text: string
) => {
  try {
    const file = Bun.file(`${cwd}/${fileName}`);
    await file.write(text);
  } catch (e) {
    console.error(e);
  }
};

const getDelimitedEntries = (text: string, delimiter: string) =>
  text.split(delimiter);

export const chunkString = (str: string, size: number): string[] => {
  const chunks: string[] = [];
  for (let i = 0; i < str.length; i += size) {
    chunks.push(str.slice(i, i + size));
  }
  return chunks;
};

export const getProblemLinesFromText = async (cwd: string) => {
  const text = await getProblemText(cwd);
  const lines = getDelimitedEntries(text, "\n");
  return lines;
};

export const getCommaSeparatedItemsFromText = async (cwd: string) => {
  const text = await getProblemText(cwd);
  const lines = getDelimitedEntries(text, ",");
  return lines;
};

export type CachedEntry<T extends Record<string, unknown>> = {
  timeToLive: number;
  entry: T;
};

export type Answer = { partOne: string | number; partTwo: string | number };

export type Answers = Record<number, Answer | undefined>;

export const getCachedAnswers = async (cwd: string) => {
  try {
    const text = await getFileText(cwd, "answers.txt");

    const { timeToLive, entry: answers }: CachedEntry<Answers> =
      JSON.parse(text);

    if (Temporal.Now.instant().epochMilliseconds > timeToLive) {
      console.log("cache went stale!");
      return undefined;
    }

    return answers;
  } catch {
    return undefined;
  }
};

export const writeCachedAnswers = async (cwd: string, answers: Answers) => {
  const modifiedAnswers = Object.fromEntries(
    Object.entries(answers).filter(([, value]) => value !== undefined)
  );

  const duration = Temporal.Duration.from({ hours: 24 });
  const cacheEntry: CachedEntry<Answers> = {
    timeToLive: Temporal.Now.instant().add(duration).epochMilliseconds,
    entry: modifiedAnswers,
  };

  await writeText(cwd, "answers.txt", JSON.stringify(cacheEntry));
};

export type Position = [number, number];

export const getAdjacentCells = (
  [xPosition, yPosition]: Position,
  lines: string[]
) => {
  const positions: Array<[number, number]> = [
    [xPosition, yPosition + 1],
    [xPosition, yPosition - 1],
    [xPosition + 1, yPosition],
    [xPosition + 1, yPosition + 1],
    [xPosition + 1, yPosition - 1],
    [xPosition - 1, yPosition],
    [xPosition - 1, yPosition + 1],
    [xPosition - 1, yPosition - 1],
  ];
  return positions
    .map(([xPos, yPos]) => {
      const newTuple: [Position, string | undefined] = [
        [xPos, yPos],
        lines[xPos]?.[yPos],
      ];
      return newTuple;
    })
    .filter((tuple): tuple is [Position, string] => {
      const [, value] = tuple;
      return !!value;
    });
};

export const positionsIncludePosition = (
  positions: Position[],
  [xPosition, yPosition]: Position
) =>
  positions.some(
    ([currentX, currentY]) => currentX === xPosition && currentY === yPosition
  );

export const getPositionVisuallyBelowCurrentPosition = (
  [currentX, currentY]: Position,
  lines: string[]
) => {
  const belowPosition: Position = [currentX + 1, currentY];

  if (lines[belowPosition[0]]?.[belowPosition[1]]) {
    return belowPosition;
  }

  return undefined;
};

export const getPositionsVisuallyLeftAndRightOfCurrentPosition = (
  [currentX, currentY]: Position,
  lines: string[]
) => {
  const left: Position = [currentX, currentY - 1];
  const right: Position = [currentX, currentY + 1];

  const leftValid = !!lines[left[0]]?.[left[1]];
  const rightValid = !!lines[right[0]]?.[right[1]];

  const positionsToReturn: Position[] = [];

  if (leftValid) {
    positionsToReturn.push(left);
  }

  if (rightValid) {
    positionsToReturn.push(right);
  }

  return positionsToReturn;
};

export const generateKeyFromPosition = ([positionX, positionY]: Position) =>
  `${positionX}_${positionY}`;

export const generatePositionFromKey = (key: string) => {
  const numbers = key.split("_").map((char) => +char);
  if (numbers.length !== 2) {
    throw `Invalid key ${key}`;
  }

  return numbers;
};
