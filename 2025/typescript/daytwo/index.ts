import { getCommaSeparatedItemsFromText } from "../utils";

const items = await getCommaSeparatedItemsFromText(__dirname);

const parseText = (items: string[]) =>
  items
    .map((item) => item.split("-"))
    .map(([left, right]) => [+left!, +right!] as [number, number]);

const chunk = (str: string, numChunks: number) => {
  const chunks: string[] = [];
  const chunkSize = Math.floor(str.length / numChunks);
  const remainder = str.length % numChunks;

  let index = 0;
  for (let i = 0; i < numChunks; i++) {
    const size = chunkSize + (i < remainder ? 1 : 0);
    chunks.push(str.slice(index, index + size));
    index += size;
  }

  return chunks;
};

const numberHasRepeatingCharactersOfLength = (num: number, n: number) => {
  const asString = num.toString();

  if (asString.length % n !== 0) {
    return false;
  }

  const chunks = chunk(asString, n);

  if (chunks.length <= 1) {
    return false;
  }

  const [firstChunk] = chunks;

  return chunks.every((chunk) => chunk === firstChunk);
};

const partOne = (items: string[]) => {
  const ranges = parseText(items);

  let runningTotal = 0;
  for (const range of ranges) {
    const [lower, upper] = range;
    let nums: number[] = [];
    for (let i = lower; i <= upper; i++) {
      if (numberHasRepeatingCharactersOfLength(i, 2)) {
        nums.push(i);
        runningTotal += i;
      }
    }
    // console.log({ range: `${lower}-${upper}`, nums });
  }

  return runningTotal;
};

const partTwo = (items: string[]) => {
  const ranges = parseText(items);

  let runningTotal = 0;
  for (const range of ranges) {
    const [lower, upper] = range;
    let nums: number[] = [];
    for (let i = lower; i <= upper; i++) {
      const numberLength = i.toString().length;
      for (let j = 1; j <= numberLength; j++) {
        if (numberHasRepeatingCharactersOfLength(i, j)) {
          nums.push(i);
          runningTotal += i;
          break;
        }
      }
    }
    // console.log({ range: `${lower}-${upper}`, nums });
  }

  return runningTotal;
};

export default {
  partOne: () => partOne(items),
  partTwo: () => partTwo(items),
};
