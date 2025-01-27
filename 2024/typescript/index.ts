import dayone from "./dayone";
import daytwo from "./daytwo";
import daythree from "./daythree";
import dayfour from "./dayfour";
import dayfive from "./dayfive";

const problems = [
  {
    partOne: dayone.partOne,
    partTwo: dayone.partTwo,
  },
  {
    partOne: daytwo.partOne,
    partTwo: daytwo.partTwo,
  },
  {
    partOne: daythree.partOne,
    partTwo: daythree.partTwo,
  },
  {
    partOne: dayfour.partOne,
    partTwo: dayfour.partTwo,
  },
  {
    partOne: dayfive.partOne,
    partTwo: dayfive.partTwo,
  },
];

for (const [index, problem] of problems.entries()) {
  console.log(`Day ${index + 1}`);
  console.log(`Part One: ${problem.partOne()}`);
  console.log(`Part Two: ${problem.partTwo()}`);
  console.log();
}
