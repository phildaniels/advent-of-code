import { getProblemText } from "../utils";

const multiplyAndSumMatches = (matches: RegExpExecArray[]) =>
  matches.reduce(
    (previous, [, firstString, secondString]) =>
      previous + +firstString * +secondString,
    0
  );

const partOne = (text: string) => {
  const regex = /mul\((\d+),(\d+)\)/g;
  const matches = [...text.matchAll(regex)];
  return multiplyAndSumMatches(matches);
};

const partTwo = (text: string) => {
  const regex = /do\(\)|don\'t\(\)|mul\((\d+),(\d+)\)/g;
  const matches = [...text.matchAll(regex)];
  let enabled = true;
  const validMatches: RegExpExecArray[] = [];
  for (const match of matches) {
    const [matchedString] = match;
    if (matchedString === "do()") {
      enabled = true;
      continue;
    }

    if (matchedString === `don't()`) {
      enabled = false;
      continue;
    }

    if (enabled) {
      validMatches.push(match);
    }
  }

  return multiplyAndSumMatches(validMatches);
};

const text = await getProblemText(__dirname);

export default {
  partOne: () => partOne(text),
  partTwo: () => partTwo(text),
};
