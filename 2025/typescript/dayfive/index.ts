import { getProblemText } from "../utils";

const text = await getProblemText(__dirname);

type Range = [number, number];

const getIngredientIdsAndRanges = (problemText: string) => {
  const [rangesSection, ingredientsSection] = problemText.split("\n\n") as [
    string,
    string
  ];
  const rangesStrings = rangesSection.split("\n");
  const ingredientsStrings = ingredientsSection.split("\n");

  const ingredientIds = ingredientsStrings.map(
    (ingredientString) => +ingredientString
  );
  const ranges = rangesStrings.map(
    (rangeString) => rangeString.split("-").map((range) => +range) as Range
  );

  return { ingredientIds, ranges };
};

const partOne = (text: string) => {
  const { ingredientIds, ranges } = getIngredientIdsAndRanges(text);
  const freshIngredients = new Set<number>();

  for (const [lowerBounder, upperBound] of ranges) {
    for (const ingredientId of ingredientIds) {
      if (freshIngredients.has(ingredientId)) {
        continue;
      }

      if (lowerBounder <= ingredientId && ingredientId <= upperBound) {
        freshIngredients.add(ingredientId);
      }
    }
  }

  return freshIngredients.size;
};

const partTwo = (text: string) => {
  const { ranges } = getIngredientIdsAndRanges(text);

  ranges.sort(([aLower, aUpper], [bLower, bUpper]) =>
    aLower === bLower ? aUpper - bUpper : aLower - bLower
  );

  if (!ranges[0]) {
    throw "Need at least one range!";
  }

  const newRanges: Range[] = [];
  let currentRange: Range = [...ranges[0]];
  for (const [lower, upper] of ranges.slice(1)) {
    const [, currentUpper] = currentRange;

    // console.log({ lower, upper, currentLower, currentUpper });

    // we get some impossible cases because the list is sorted,
    // there are only three possibilities, the next range fits in current,
    // the range extends the last, the ranges are disjunct

    // range starts in the middle of current range, extend / do nothing
    if (lower <= currentUpper + 1) {
      currentRange[1] = Math.max(upper, currentUpper);
      // range is disjunct
    } else {
      newRanges.push([...currentRange]);
      currentRange = [lower, upper];
    }
  }

  // push final range
  newRanges.push(currentRange);

  return newRanges.reduce(
    (prev, [lower, upper]) => prev + (upper - lower + 1),
    0
  );
};

export default { partOne: () => partOne(text), partTwo: () => partTwo(text) };
