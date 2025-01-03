import dayOne from "./dayone";
import dayTwo from "./daytwo";
import dayThree from "./daythree";

const problems = [
  {
    partOne: dayOne.partOne,
    partTwo: dayOne.partTwo,
  },
  {
    partOne: dayTwo.partOne,
    partTwo: dayTwo.partTwo,
  },
  {
    partOne: dayThree.partOne,
    partTwo: dayThree.partTwo,
  },
];

for (const [index, problem] of problems.entries()) {
  console.log(`Day ${index + 1}`);
  console.log(`Part One: ${problem.partOne()}`);
  console.log(`Part Two: ${problem.partTwo()}`);
  console.log();
}
