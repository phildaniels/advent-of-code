import { getCachedAnswers, writeCachedAnswers, type Answers } from "./utils";
import dayone from "./dayone";
import daytwo from "./daytwo";
import daythree from "./daythree";
import dayfour from "./dayfour";
import dayfive from "./dayfive";
import daysix from "./daysix";
import dayseven from "./dayseven";
import dayeight from "./dayeight";
import daynine from "./daynine";
import dayten from "./dayten";
import dayeleven from "./dayeleven";

const problems: Array<{
  partOne: (() => number) | (() => Promise<number>);
  partTwo: (() => number) | (() => Promise<number>);
  cache: boolean;
}> = [
  {
    partOne: dayone.partOne,
    partTwo: dayone.partTwo,
    cache: true,
  },
  {
    partOne: daytwo.partOne,
    partTwo: daytwo.partTwo,
    cache: true,
  },
  {
    partOne: daythree.partOne,
    partTwo: daythree.partTwo,
    cache: true,
  },
  {
    partOne: dayfour.partOne,
    partTwo: dayfour.partTwo,
    cache: true,
  },
  {
    partOne: dayfive.partOne,
    partTwo: dayfive.partTwo,
    cache: true,
  },
  {
    partOne: daysix.partOne,
    partTwo: daysix.partTwo,
    cache: true,
  },
  {
    partOne: dayseven.partOne,
    partTwo: dayseven.partTwo,
    cache: true,
  },
  {
    partOne: dayeight.partOne,
    partTwo: dayeight.partTwo,
    cache: true,
  },
  {
    partOne: daynine.partOne,
    partTwo: daynine.partTwo,
    cache: true,
  },
  {
    partOne: dayten.partOne,
    partTwo: dayten.partTwo,
    cache: true,
  },
  {
    partOne: dayeleven.partOne,
    partTwo: dayeleven.partTwo,
    cache: true,
  },
];

let answerCache: Answers = {};

const answers = await getCachedAnswers(__dirname);

if (answers) {
  answerCache = answers;
}

for (const [index, problem] of problems.entries()) {
  const day = index + 1;
  console.log(`Day ${day}`);
  const cachedResult = answerCache[day];
  if (!cachedResult && problem.cache) {
    console.log("cache miss for day", day);
  } else if (
    problem.cache &&
    !!!cachedResult?.partOne &&
    !!cachedResult?.partTwo
  ) {
    console.log("cache miss for day", day, "part one");
  } else if (
    problem.cache &&
    !!cachedResult?.partOne &&
    !!!cachedResult?.partTwo
  ) {
    console.log("cache miss for day", day, "part two");
  }

  const partOneCache = cachedResult?.partOne;
  let partOneFromCache = !!partOneCache;
  const partOne = partOneCache ?? problem.partOne();
  const partOneResult = partOne instanceof Promise ? await partOne : partOne;
  if (problem.cache && partOneResult !== 0) {
    answerCache[day] = { partOne: partOneResult, partTwo: undefined };
  }

  console.log(
    `Part One: ${partOneResult}${partOneFromCache ? " (cached)" : ""}`
  );
  const partTwoCache = cachedResult?.partTwo;
  let partTwoFromCache = !!partTwoCache;
  const partTwo = partTwoCache ?? problem.partTwo();
  const partTwoResult = partTwo instanceof Promise ? await partTwo : partTwo;
  if (problem.cache && partTwoResult !== 0) {
    answerCache[day] = { ...answerCache[day], partTwo: partTwoResult };
  }

  console.log(
    `Part Two: ${partTwoResult}${partTwoFromCache ? " (cached)" : ""}`
  );
  console.log();

  await writeCachedAnswers(__dirname, answerCache);
}
