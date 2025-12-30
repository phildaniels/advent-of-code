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

  const fiveMinutes = Temporal.Duration.from({ minutes: 5 });
  const cacheEntry: CachedEntry<Answers> = {
    timeToLive: Temporal.Now.instant().add(fiveMinutes).epochMilliseconds,
    entry: modifiedAnswers,
  };

  await writeText(cwd, "answers.txt", JSON.stringify(cacheEntry));
};
