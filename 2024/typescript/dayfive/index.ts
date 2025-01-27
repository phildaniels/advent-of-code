import { getProblemText } from "../utils";

const getRulesAndUpdates = (text: string) => {
  const [rulesSection, updatesSection] = text.split("\n\n");
  const rulesLines = rulesSection.split("\n");
  const updatesLines = updatesSection.split("\n");

  const rules = rulesLines.map(
    (line) =>
      line.split("|").map((numberString) => +numberString) as [number, number]
  );
  const updates = updatesLines.map((line) =>
    line.split(",").map((numberString) => +numberString)
  );

  return { rules, updates };
};

type RulesLookup = Map<number, Set<number>>;
const generateRulesLookupFromRules = (rules: Array<[number, number]>) => {
  const graph: RulesLookup = new Map<number, Set<number>>();

  for (const [before, after] of rules) {
    if (!graph.has(before)) {
      graph.set(before, new Set([after]));
    } else {
      const current = graph.get(before)!;
      current.add(after);
      graph.set(before, current);
    }
  }

  return graph;
};

const validateRulesForNode = (
  pageToCheck: number,
  previousPage: number,
  rulesLookup: RulesLookup
) => {
  return !(rulesLookup.get(pageToCheck)?.has(previousPage) ?? false);
};

const reorderUpdateInCorrectOrder = (
  update: number[],
  rulesLookup: RulesLookup
) => {
  return update.sort((left, right) => {
    if (rulesLookup.get(left)?.has(right)) {
      return -1;
    }

    if (rulesLookup.get(right)?.has(left)) {
      return 1;
    }

    return 0;
  });
};

const validateUpdate = (update: number[], rulesLookup: RulesLookup) => {
  let updateValid = true;
  for (let i = 1; i < update.length; i++) {
    const previousPage = update[i - 1];
    const currentPage = update[i];
    updateValid = validateRulesForNode(currentPage, previousPage, rulesLookup);
    if (!updateValid) {
      break;
    }
  }

  return updateValid;
};

const partOne = (
  updates: number[][],
  rulesLookup: RulesLookup,
  invalidUpdates: number[][]
) => {
  let sum = 0;
  for (const update of updates) {
    if (validateUpdate(update, rulesLookup)) {
      sum += update[Math.floor(update.length / 2)];
    } else {
      invalidUpdates.push(update);
    }
  }

  return sum;
};

const partTwo = (invalidUpdates: number[][], rulesLookup: RulesLookup) => {
  let sum = 0;
  for (const invalidUpdate of invalidUpdates) {
    const validUpdate = reorderUpdateInCorrectOrder(invalidUpdate, rulesLookup);
    sum += validUpdate[Math.floor(validUpdate.length / 2)];
  }

  return sum;
};

const text = await getProblemText(__dirname);
const { rules, updates } = getRulesAndUpdates(text);
const rulesLookup = generateRulesLookupFromRules(rules);
const invalidUpdates: number[][] = [];

export default {
  partOne: () => partOne(updates, rulesLookup, invalidUpdates),
  partTwo: () => partTwo(invalidUpdates, rulesLookup),
};
