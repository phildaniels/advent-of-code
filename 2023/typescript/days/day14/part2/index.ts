import fs from 'fs';
import { join } from 'path';
import input from './data';

let cachedAnswer: string | undefined;
try {
  const filePath = join(__dirname, 'answer.txt');
  cachedAnswer = fs.readFileSync(filePath, { encoding: 'utf-8' });
} catch (e) {}

type Pattern = string[];

type Direction = 'North' | 'South' | 'East' | 'West';

const solve = () => {
  const getColumn = (pattern: Pattern, index: number) => {
    const n = pattern.length;
    const column: string[] = [];
    for (let i = 0; i < n; i++) {
      const currentRow = pattern[i];
      const currentColumn = currentRow[index];
      column.push(currentColumn);
    }

    return column;
  };

  const replaceColumn = (
    pattern: Pattern,
    replacement: string[],
    index: number
  ) => {
    const n = pattern.length;
    const newPattern = pattern.slice();
    const replacementCopy = replacement.slice();
    for (let i = 0; i < n; i++) {
      const newRow = newPattern[i].split('');
      newRow[index] = replacementCopy.shift()!;
      newPattern[i] = newRow.join('');
    }

    return newPattern;
  };

  const getRow = (pattern: Pattern, index: number) => {
    const row: string[] = pattern[index].split('');
    return row;
  };

  const replaceRow = (
    pattern: Pattern,
    replacement: string[],
    index: number
  ) => {
    const newPattern = pattern.slice();
    newPattern[index] = replacement.join('');
    return newPattern;
  };

  const getIndexesOfRoundRocksAndCubeRocksForColumnOrRow = (
    columnOrRow: string[]
  ) => {
    const indexesOfRoundRocks: number[] = [];
    const indexesOfCubeRocks: number[] = [];
    for (let i = 0; i < columnOrRow.length; i++) {
      const char = columnOrRow[i];
      if (char === '#') {
        indexesOfCubeRocks.push(i);
        continue;
      }

      if (char === 'O') {
        indexesOfRoundRocks.push(i);
        continue;
      }
    }

    return [indexesOfRoundRocks, indexesOfCubeRocks] as [number[], number[]];
  };

  const getCountOfSymbolInString = (symbol: string, searchString: string) => {
    let count = 0;
    for (let i = 0; i < searchString.length; i++) {
      const char = searchString[i];
      if (char === symbol) {
        count++;
      }
    }

    return count;
  };

  const getRockIndexesInRange = (
    rockIndexes: number[],
    lowerBound: number,
    upperBound: number
  ) => {
    let results: number[] = [];
    for (let i = 0; i < rockIndexes.length; i++) {
      const currentIndex = rockIndexes[i];
      if (lowerBound < currentIndex && currentIndex < upperBound) {
        results.push(currentIndex);
      }
    }

    return results;
  };

  const tiltInput = (
    pattern: Pattern,
    direction: Direction,
    cache = new Map<string, string[]>()
  ) => {
    const patternKey = `${pattern.join('')}_${direction}`;
    const cachedValue = cache.get(patternKey);
    if (cachedValue) {
      return cachedValue;
    }

    switch (direction) {
      case 'North': {
        const result = tiltNorth(pattern);
        cache.set(patternKey, result);
        return result;
      }

      case 'East': {
        const result = tiltEast(pattern);
        cache.set(patternKey, result);
        return result;
      }

      case 'South': {
        const result = tiltSouth(pattern);
        cache.set(patternKey, result);
        return result;
      }

      case 'West': {
        const result = tiltWest(pattern);
        cache.set(patternKey, result);
        return result;
      }

      default: {
        const result = pattern;
        cache.set(patternKey, result);
        return result;
      }
    }
  };

  const tiltNorth = (pattern: Pattern) => {
    let modifiedPattern = pattern.slice();
    const n = pattern[0].length;
    for (let i = 0; i < n; i++) {
      const column = getColumn(pattern, i);

      let [roundIndexes, cubeIndexes] =
        getIndexesOfRoundRocksAndCubeRocksForColumnOrRow(column);
      cubeIndexes = [-1, ...cubeIndexes];

      let segments: Array<string> = [];

      for (let j = 0; j < cubeIndexes.length; j++) {
        const segment: string[] = j === 0 ? [] : ['#'];
        const cubeIndex = cubeIndexes[j];
        const followingCubeIndex = cubeIndexes[j + 1] ?? n;
        const roundIndexesInRange = getRockIndexesInRange(
          roundIndexes,
          cubeIndex,
          followingCubeIndex
        );
        const rounds = new Array(roundIndexesInRange.length).fill('O');
        const dotsToGenerate =
          followingCubeIndex - cubeIndex - rounds.length - 1;
        const rest =
          dotsToGenerate > 0 ? new Array(dotsToGenerate).fill('.') : [];
        segment.push(...rounds, ...rest);
        segments.push(segment.join(''));
      }
      const newColumn = segments.join('').split('');
      modifiedPattern = replaceColumn(modifiedPattern, newColumn, i);
    }

    return modifiedPattern;
  };

  const tiltEast = (pattern: Pattern) => {
    let modifiedPattern = pattern.slice();
    const m = pattern.length;
    for (let i = 0; i < m; i++) {
      const row = getRow(pattern, i);

      let [roundIndexes, cubeIndexes] =
        getIndexesOfRoundRocksAndCubeRocksForColumnOrRow(row);
      cubeIndexes = [-1, ...cubeIndexes];

      let segments: Array<string> = [];

      for (let j = 0; j < cubeIndexes.length; j++) {
        const segment: string[] = j === 0 ? [] : ['#'];
        const cubeIndex = cubeIndexes[j];
        const followingCubeIndex = cubeIndexes[j + 1] ?? m;
        const roundIndexesInRange = getRockIndexesInRange(
          roundIndexes,
          cubeIndex,
          followingCubeIndex
        );
        const rounds = new Array(roundIndexesInRange.length).fill('O');
        const dotsToGenerate =
          followingCubeIndex - cubeIndex - rounds.length - 1;
        const rest =
          dotsToGenerate > 0 ? new Array(dotsToGenerate).fill('.') : [];
        segment.push(...rest, ...rounds);
        segments.push(segment.join(''));
      }
      const newRow = segments.join('').split('');
      modifiedPattern = replaceRow(modifiedPattern, newRow, i);
    }

    return modifiedPattern;
  };

  const tiltSouth = (pattern: Pattern) => {
    let modifiedPattern = pattern.slice();
    const n = pattern[0].length;
    for (let i = 0; i < n; i++) {
      const column = getColumn(pattern, i);

      let [roundIndexes, cubeIndexes] =
        getIndexesOfRoundRocksAndCubeRocksForColumnOrRow(column);
      cubeIndexes = [-1, ...cubeIndexes];

      let segments: Array<string> = [];

      for (let j = 0; j < cubeIndexes.length; j++) {
        const segment: string[] = j === 0 ? [] : ['#'];
        const cubeIndex = cubeIndexes[j];
        const followingCubeIndex = cubeIndexes[j + 1] ?? n;
        const roundIndexesInRange = getRockIndexesInRange(
          roundIndexes,
          cubeIndex,
          followingCubeIndex
        );
        const rounds = new Array(roundIndexesInRange.length).fill('O');
        const dotsToGenerate =
          followingCubeIndex - cubeIndex - rounds.length - 1;
        const rest =
          dotsToGenerate > 0 ? new Array(dotsToGenerate).fill('.') : [];
        segment.push(...rest, ...rounds);
        segments.push(segment.join(''));
      }
      const newColumn = segments.join('').split('');
      modifiedPattern = replaceColumn(modifiedPattern, newColumn, i);
    }

    return modifiedPattern;
  };

  const tiltWest = (pattern: Pattern) => {
    let modifiedPattern = pattern.slice();
    const m = pattern.length;
    for (let i = 0; i < m; i++) {
      const row = getRow(pattern, i);

      let [roundIndexes, cubeIndexes] =
        getIndexesOfRoundRocksAndCubeRocksForColumnOrRow(row);
      cubeIndexes = [-1, ...cubeIndexes];

      let segments: Array<string> = [];

      for (let j = 0; j < cubeIndexes.length; j++) {
        const segment: string[] = j === 0 ? [] : ['#'];
        const cubeIndex = cubeIndexes[j];
        const followingCubeIndex = cubeIndexes[j + 1] ?? m;
        const roundIndexesInRange = getRockIndexesInRange(
          roundIndexes,
          cubeIndex,
          followingCubeIndex
        );
        const rounds = new Array(roundIndexesInRange.length).fill('O');
        const dotsToGenerate =
          followingCubeIndex - cubeIndex - rounds.length - 1;
        const rest =
          dotsToGenerate > 0 ? new Array(dotsToGenerate).fill('.') : [];
        segment.push(...rounds, ...rest);
        segments.push(segment.join(''));
      }
      const newRow = segments.join('').split('');
      modifiedPattern = replaceRow(modifiedPattern, newRow, i);
    }

    return modifiedPattern;
  };

  const peformCycle = (
    pattern: Pattern,
    cache = new Map<string, string[]>()
  ) => {
    let cycledPattern = pattern.slice();
    cycledPattern = tiltInput(cycledPattern, 'North', cache);
    cycledPattern = tiltInput(cycledPattern, 'West', cache);
    cycledPattern = tiltInput(cycledPattern, 'South', cache);
    cycledPattern = tiltInput(cycledPattern, 'East', cache);
    return cycledPattern;
  };

  const calculateLoadOfPattern = (pattern: Pattern) => {
    let load = 0;
    for (let i = 0; i < pattern.length; i++) {
      const line = pattern[i];
      const modifiedIndex = pattern.length - i;
      const totalRoundsOnLine = getCountOfSymbolInString('O', line);
      load += modifiedIndex * totalRoundsOnLine;
    }

    return load;
  };

  const calculateFirstAndSubsequentRepetitionsOfCycle = (
    pattern: Pattern,
    cache = new Map<string, string[]>()
  ) => {
    let i = 0;
    let firstDetectedRepetition: number | undefined;
    let subsequentRepetitions: number | undefined;
    let cycleRepetitions = 0;
    const cycledPatterns = new Set<string>();
    let cycledPattern = pattern.slice();
    while (
      firstDetectedRepetition === undefined ||
      subsequentRepetitions === undefined
    ) {
      cycledPattern = peformCycle(cycledPattern, cache);
      const newPatternKey = cycledPattern.join('');
      if (cycledPatterns.has(newPatternKey)) {
        cycledPatterns.clear();
        cycleRepetitions++;
        if (cycleRepetitions === 1) {
          firstDetectedRepetition = i;
        }

        if (cycleRepetitions === 2) {
          subsequentRepetitions = i;
        }
        i = 0;
      } else {
        i++;
        cycledPatterns.add(newPatternKey);
      }
    }

    const firstRepetition = firstDetectedRepetition - subsequentRepetitions;
    return [firstRepetition, subsequentRepetitions] as [number, number];
  };

  const pattern: Pattern = input.split('\n');
  let patternToCyle = pattern.slice();
  const cache = new Map<string, string[]>();
  let [firstRepetition, subsequentRepetitions] =
    calculateFirstAndSubsequentRepetitionsOfCycle(patternToCyle, cache);

  const remainderCycle = (1000000000 - firstRepetition) % subsequentRepetitions;
  patternToCyle = pattern.slice();
  for (let i = 0; i < firstRepetition + remainderCycle; i++) {
    patternToCyle = peformCycle(patternToCyle);
  }

  return calculateLoadOfPattern(patternToCyle);
};

const answer = cachedAnswer ?? `${solve()}`;
if (!cachedAnswer) {
  const filePath = join(__dirname, 'answer.txt');
  fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
}

export default answer;
