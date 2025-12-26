import dayone from "./dayone";
import daytwo from "./daytwo";
import daythree from "./daythree";

const problems = [
  {
    partOne: dayone.partOne,
    partTwo: dayone.partTwo,
  },
  // {
  //   partOne: daytwo.partOne,
  //   partTwo: daytwo.partTwo,
  // },
  {
    partOne: daythree.partOne,
    partTwo: daythree.partTwo,
  },
];

for (const [index, problem] of problems.entries()) {
  console.log(`Day ${index + 1}`);
  console.log(`Part One: ${problem.partOne()}`);
  console.log(`Part Two: ${problem.partTwo()}`);
  console.log();
}
