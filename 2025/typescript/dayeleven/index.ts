import { getProblemLinesFromText, search } from "../utils";

const lines = await getProblemLinesFromText(__dirname);

const parseLines = (lines: string[]) => {
  const map = new Map<string, string[]>();
  const keyValueSet = new Set<string>();
  for (const line of lines) {
    const [keyString, valueString] = line.split(":");

    if (!keyString) {
      throw `Line has no key: ${line}`;
    }

    if (!valueString) {
      throw `Line has no value: ${valueString}`;
    }

    const values = valueString.trim().split(" ");
    const current = map.get(keyString);
    if (current) {
      map.set(keyString, [...current, ...values]);
    } else {
      map.set(keyString, values);
    }

    for (const keyAndValues of [keyString, ...values]) {
      keyValueSet.add(keyAndValues);
    }
  }
  // console.log(keyValueSet.size);
  return map;
};

const getTotalPathsToOut = async (map: Map<string, string[]>) => {
  let totalPaths = 0;
  await search<[string, string[]]>({
    algorithm: "DFS",
    initialItems: [["you", []]],
    getNextItems: ([currentItem, pathSoFar], iteration, remainingFrontier) => {
      return map
        .get(currentItem)
        ?.map(
          (next) => [next, [...pathSoFar, currentItem]] as [string, string[]]
        );
    },
    targetFound: ([currentItem]) => currentItem === "out",
    onTargetFound: ([currentItem, pathSoFar], iteration, remainingFrontier) => {
      //   console.log({
      //     iteration,
      //     path: [...pathSoFar, currentItem].join(" -> "),
      //     totalPaths: totalPaths + 1,
      //     remainingFrontier: remainingFrontier.map(([first]) => first),
      //   });
      totalPaths++;
    },
    continueOnTargetFound: true,
    prune: false,
  });

  return totalPaths;
};

const getTotalPathsToOutWithFFTAndDAC = async (map: Map<string, string[]>) => {
  const reverseMap = new Map<string, string[]>();
  const inDegree = new Map<string, number>();

  for (const [from, toList] of map.entries()) {
    if (!inDegree.has(from)) inDegree.set(from, 0);
    for (const to of toList) {
      if (!reverseMap.has(to)) {
        reverseMap.set(to, []);
      }
      reverseMap.get(to)!.push(from);
      inDegree.set(to, (inDegree.get(to) ?? 0) + 1);
    }
  }

  const queue: string[] = [];
  const topoOrder: string[] = [];

  for (const [node, degree] of inDegree.entries()) {
    if (degree === 0) {
      queue.push(node);
    }
  }

  while (queue.length > 0) {
    const node = queue.shift()!;
    topoOrder.push(node);

    for (const neighbor of map.get(node) ?? []) {
      const newDegree = inDegree.get(neighbor)! - 1;
      inDegree.set(neighbor, newDegree);
      if (newDegree === 0) {
        queue.push(neighbor);
      }
    }
  }

  const dp = new Map<string, number>();
  const key = (node: string, hasFFT: boolean, hasDAC: boolean) =>
    `${node},${hasFFT ? 1 : 0},${hasDAC ? 1 : 0}`;

  dp.set(key("svr", false, false), 1);

  for (const node of topoOrder) {
    for (const hasFFT of [false, true]) {
      for (const hasDAC of [false, true]) {
        const currentKey = key(node, !!hasFFT, !!hasDAC);
        const pathCount = dp.get(currentKey) ?? 0;

        if (pathCount === 0) {
          continue;
        }

        const newFFT = hasFFT || node === "fft";
        const newDAC = hasDAC || node === "dac";

        for (const next of map.get(node) ?? []) {
          const nextKey = key(next, newFFT, newDAC);
          dp.set(nextKey, (dp.get(nextKey) ?? 0) + pathCount);
        }
      }
    }
  }

  return dp.get(key("out", true, true)) ?? 0;
};

const partOne = async (lines: string[]) => {
  const map = parseLines(lines);
  const pathsToOut = await getTotalPathsToOut(map);
  return pathsToOut;
};

const partTwo = async (lines: string[]) => {
  const map = parseLines(lines);
  const pathsToOut = await getTotalPathsToOutWithFFTAndDAC(map);
  return pathsToOut;
};

export default { partOne: () => partOne(lines), partTwo: () => partTwo(lines) };
