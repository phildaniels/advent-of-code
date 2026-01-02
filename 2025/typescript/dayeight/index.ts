import {
  generateCoordinateFromKey,
  getExhaustiveCoordinateDistances,
  getProblemLinesFromText,
  sortCoordinatesInPlace,
  type Coordinate,
} from "../utils";

const lines = await getProblemLinesFromText(__dirname);

const getCoordinatesFromLines = (lines: string[]) =>
  lines.map(
    (line) => line.split(",").map((numAsString) => +numAsString) as Coordinate
  );

const partOne = (lines: string[]) => {
  const coordinates = getCoordinatesFromLines(lines);
  sortCoordinatesInPlace(coordinates);
  const distances = getExhaustiveCoordinateDistances(coordinates);
  const reverseEntries: Array<[number, string[]]> = [];
  for (const [key, value] of distances.entries()) {
    const reverseEntry: [number, string[]] = [value, key.split("_")];
    reverseEntries.push(reverseEntry);
  }

  reverseEntries.sort(([left], [right]) => left - right);
  //   console.log({
  //     s: [...new Set(reverseEntries.map((x) => x[0]))].length,
  //     l: reverseEntries.length,
  //   });

  const circuits: Array<Set<string>> = [];

  for (let i = 0; i < 1000; i++) {
    const [, [left, right]] = reverseEntries.shift()!;

    const circuitMatchingBoth = circuits.find(
      (circuit) => circuit.has(left!) && circuit.has(right!)
    );
    if (circuitMatchingBoth) {
      //   console.log({ i, left, right, op: "noop" });
      continue;
    }

    let rightIndex = -1;
    const circuitMatchingRight = circuits.find((circuit, index) => {
      rightIndex = index;
      return circuit.has(right!);
    });
    const circuitMatchingLeft = circuits.find((circuit) => circuit.has(left!));

    if (!circuitMatchingLeft && !circuitMatchingRight) {
      circuits.push(new Set<string>([left!, right!]));
      //   console.log({
      //     i,
      //     left,
      //     right,
      //     actualOperationCount,
      //     circuits,
      //     op: "no match, brand new circuit",
      //   });
      continue;
    }

    if (circuitMatchingRight && !circuitMatchingLeft) {
      circuitMatchingRight.add(left!);
      //   console.log({
      //     i,
      //     left,
      //     right,
      //     actualOperationCount,
      //     circuits,
      //     op: "left -> right match",
      //   });
      continue;
    }

    if (!circuitMatchingRight && circuitMatchingLeft) {
      circuitMatchingLeft.add(right!);
      //   console.log({
      //     i,
      //     left,
      //     right,
      //     actualOperationCount,
      //     circuits,
      //     op: "right -> left match",
      //   });
      continue;
    }

    if (circuitMatchingLeft && circuitMatchingRight) {
      for (const rightValue of circuitMatchingRight) {
        circuitMatchingLeft.add(rightValue);
      }

      circuits.splice(rightIndex, 1);
      //   console.log({
      //     i,
      //     left,
      //     right,
      //     actualOperationCount,
      //     circuits,
      //     op: "merge right -> left",
      //   });
      continue;
    }

    throw "Reached an unreachable state";
  }

  //   console.log({ circuits });
  const result = circuits
    .sort((a, b) => b.size - a.size)
    .slice(0, 3)
    .reduce((prev, current) => prev * current.size, 1);

  return result;
};

const partTwo = (lines: string[]) => {
  const coordinates = getCoordinatesFromLines(lines);
  sortCoordinatesInPlace(coordinates);
  const distances = getExhaustiveCoordinateDistances(coordinates);
  const reverseEntries: Array<[number, string[]]> = [];
  for (const [key, value] of distances.entries()) {
    const reverseEntry: [number, string[]] = [value, key.split("_")];
    reverseEntries.push(reverseEntry);
  }

  reverseEntries.sort(([left], [right]) => left - right);

  const distinctJunctionBoxes = new Set([...lines]).size;

  const circuits: Array<Set<string>> = [];

  let largestCircuitSize = 0;
  let lastAddedCircuit: [string, string] | undefined;

  let iteration = -1;
  while (largestCircuitSize < distinctJunctionBoxes) {
    iteration++;
    // console.log({ iteration, lastAddedCircuit, largestCircuitSize });
    const [, [left, right]] = reverseEntries.shift()!;
    lastAddedCircuit = [left!, right!];

    const circuitMatchingBoth = circuits.find(
      (circuit) => circuit.has(left!) && circuit.has(right!)
    );
    if (circuitMatchingBoth) {
      //   console.log({ i, left, right, op: "noop" });
      continue;
    }

    let rightIndex = -1;
    const circuitMatchingRight = circuits.find((circuit, index) => {
      rightIndex = index;
      return circuit.has(right!);
    });
    const circuitMatchingLeft = circuits.find((circuit) => circuit.has(left!));

    if (!circuitMatchingLeft && !circuitMatchingRight) {
      circuits.push(new Set<string>([left!, right!]));
      if (largestCircuitSize < 2) {
        largestCircuitSize = 2;
      }
      //   console.log({
      //     i,
      //     left,
      //     right,
      //     actualOperationCount,
      //     circuits,
      //     op: "no match, brand new circuit",
      //   });
      continue;
    }

    if (circuitMatchingRight && !circuitMatchingLeft) {
      circuitMatchingRight.add(left!);
      if (largestCircuitSize < circuitMatchingRight.size) {
        largestCircuitSize = circuitMatchingRight.size;
      }
      //   console.log({
      //     i,
      //     left,
      //     right,
      //     actualOperationCount,
      //     circuits,
      //     op: "left -> right match",
      //   });
      continue;
    }

    if (!circuitMatchingRight && circuitMatchingLeft) {
      circuitMatchingLeft.add(right!);
      if (largestCircuitSize < circuitMatchingLeft.size) {
        largestCircuitSize = circuitMatchingLeft.size;
      }
      //   console.log({
      //     i,
      //     left,
      //     right,
      //     actualOperationCount,
      //     circuits,
      //     op: "right -> left match",
      //   });
      continue;
    }

    if (circuitMatchingLeft && circuitMatchingRight) {
      for (const rightValue of circuitMatchingRight) {
        circuitMatchingLeft.add(rightValue);
      }

      if (largestCircuitSize < circuitMatchingLeft.size) {
        largestCircuitSize = circuitMatchingLeft.size;
      }

      circuits.splice(rightIndex, 1);
      //   console.log({
      //     i,
      //     left,
      //     right,
      //     actualOperationCount,
      //     circuits,
      //     op: "merge right -> left",
      //   });
      continue;
    }

    throw "Reached an unreachable state";
  }

  const [leftLastX] = generateCoordinateFromKey(lastAddedCircuit![0])!;
  const [rightLastX] = generateCoordinateFromKey(lastAddedCircuit![1])!;

  return leftLastX! * rightLastX!;
};

export default { partOne: () => partOne(lines), partTwo: () => partTwo(lines) };
