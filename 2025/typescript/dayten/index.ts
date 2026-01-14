import { getProblemLinesFromText, search } from "../utils";
import solver, { type SolveResult } from "javascript-lp-solver";

const lines = await getProblemLinesFromText(__dirname);

type ParsedRow = {
  lightDiagram: string;
  buttonSchematics: number[][];
  joltageRequirements: number[];
};

const mutateLightDiagramBasedOnButtonSchematics = (
  lightDiagram: string,
  buttonSchematic: number[]
) => {
  const newCharArray = [...lightDiagram];

  for (const index of buttonSchematic) {
    newCharArray[index] = newCharArray[index] === "." ? "#" : ".";
  }

  return newCharArray.join("");
};

const getMinimumNumberOfButtonPressesLightDiagram = async (
  target: string,
  buttonSchematics: number[][]
) => {
  const initialString = [...target].map(() => ".").join("");

  let minButtonPresses = Infinity;
  const minButtonPressesForStateMap = new Map<string, number>();

  await search<{ currentString: string; buttonPresses: number }>({
    algorithm: "DFS",
    initialItems: [{ currentString: initialString, buttonPresses: 0 }],
    getNextItems: ({ currentString, buttonPresses }) =>
      buttonSchematics.map((buttonSchematic) => ({
        currentString: mutateLightDiagramBasedOnButtonSchematics(
          currentString,
          buttonSchematic
        ),
        buttonPresses: buttonPresses + 1,
      })),
    targetFound: ({ currentString }) => currentString === target,
    onTargetFound: ({ buttonPresses }, iteration, remainingFrontier) => {
      if (buttonPresses < minButtonPresses) {
        minButtonPresses = buttonPresses;
      }
    },
    continueOnTargetFound: true,
    prune: true,
    checkTargetBeforePrune: true,
    shouldPrune: (
      { currentString, buttonPresses },
      _iteration,
      _remainingFrontier
    ) => {
      if (buttonPresses > minButtonPresses) {
        return true;
      }

      const value = minButtonPressesForStateMap.get(currentString);

      if (value === undefined || value > buttonPresses) {
        minButtonPressesForStateMap.set(currentString, buttonPresses);
        return false;
      }

      return true;
    },
  });

  return minButtonPresses;
};

const partOne = async (lines: string[]) => {
  const parsedRows = getParsedRows(lines);
  let buttonPresses = 0;
  let i = -1;
  for (const { lightDiagram, buttonSchematics } of parsedRows) {
    i++;
    const result = await getMinimumNumberOfButtonPressesLightDiagram(
      lightDiagram,
      buttonSchematics
    );
    buttonPresses += result;
  }

  return buttonPresses;
};

const solvePartTwo = (
  target: number[],
  buttonSchematics: number[][]
): number => {
  const n = target.length;
  const m = buttonSchematics.length;

  if (target.every((v) => v === 0)) {
    return 0;
  }

  const model: any = {
    optimize: "cost",
    opType: "min",
    constraints: {},
    variables: {},
    ints: {},
  };

  for (let j = 0; j < m; j++) {
    const varName = `button${j}`;
    model.variables[varName] = { cost: 1 };
    model.ints[varName] = 1;
  }

  for (let i = 0; i < n; i++) {
    const constraintName = `counter${i}`;
    model.constraints[constraintName] = { equal: target[i] };

    for (let j = 0; j < m; j++) {
      const varName = `button${j}`;
      const contribution = buttonSchematics[j]!.filter(
        (idx) => idx === i
      ).length;
      if (contribution > 0) {
        if (!model.variables[varName][constraintName]) {
          model.variables[varName][constraintName] = 0;
        }
        model.variables[varName][constraintName] = contribution;
      }
    }
  }

  const result = solver.Solve(model) as SolveResult;

  if (!result || !result.feasible) {
    return -1;
  }

  let total = 0;
  for (let j = 0; j < m; j++) {
    const varName = `button${j}`;
    const presses = (result[varName] as number) || 0;
    total += presses;
  }

  return total;
};

const getParsedRows = (lines: string[]) => {
  const parsedRows: ParsedRow[] = [];
  for (const line of lines) {
    if (!line || line.trim() === "") continue;

    const indexOfFirstSeparator = line.indexOf("(");

    if (indexOfFirstSeparator === -1) {
      throw `Invalid line could not find first separator: ${line}`;
    }

    const lightDiagramString = line.substring(0, indexOfFirstSeparator).trim();
    const lightDiagram = lightDiagramString.substring(
      1,
      lightDiagramString.length - 1
    );

    const indexOfSecondSeparator = line.indexOf("{");
    if (indexOfSecondSeparator === -1) {
      throw `Invalid line, could not find second separator: ${line}`;
    }

    const buttonsSchematicString = line
      .substring(indexOfFirstSeparator, indexOfSecondSeparator - 1)
      .trim();

    const buttonSchematics = buttonsSchematicString.split(" ").map((chunk) => {
      const numsWithCommas = chunk.substring(1, chunk.length - 1);
      const nums = numsWithCommas.split(",").map((num) => +num);
      return nums;
    });

    const joltageRequirementString = line
      .substring(indexOfSecondSeparator)
      .trim();

    const joltageRequirements = joltageRequirementString
      .substring(1, joltageRequirementString.length - 1)
      .split(",")
      .map((chunk) => +chunk);

    const parsedRow: ParsedRow = {
      lightDiagram,
      buttonSchematics,
      joltageRequirements,
    };

    parsedRows.push(parsedRow);
  }

  return parsedRows;
};

const partTwo = (lines: string[]) => {
  const parsedRows = getParsedRows(lines);
  let totalButtonPresses = 0;

  for (let i = 0; i < parsedRows.length; i++) {
    const row = parsedRows[i]!;
    const { joltageRequirements, buttonSchematics } = row;
    // console.log(`Solving row ${i}...`);
    const result = solvePartTwo(joltageRequirements, buttonSchematics);
    // console.log(`Row ${i}: ${result} presses`);
    totalButtonPresses += result;
  }

  return totalButtonPresses;
};

export default {
  partOne: () => partOne(lines),
  partTwo: () => partTwo(lines),
};
