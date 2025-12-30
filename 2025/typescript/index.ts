import dayone from "./dayone";
import daytwo from "./daytwo";
import daythree from "./daythree";
import dayfour from "./dayfour";
import dayfive from "./dayfive";
import daysix from "./daysix";
import { getCachedAnswers, writeCachedAnswers, type Answers } from "./utils";

const problems = [
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
    cache: false,
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
  }

  const partOneResult = cachedResult?.partOne ?? problem.partOne();
  console.log(`Part One: ${partOneResult}`);
  const partTwoResult = cachedResult?.partTwo ?? problem.partTwo();
  console.log(`Part Two: ${partTwoResult}`);
  console.log();

  if (problem.cache) {
    answerCache[day] = { partOne: partOneResult, partTwo: partTwoResult };
  } else {
    answerCache[day] = undefined;
  }
}

await writeCachedAnswers(__dirname, answerCache);
