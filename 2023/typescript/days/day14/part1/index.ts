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

  const tiltInput = (pattern: Pattern, direction: Direction) => {
    switch (direction) {
      default: {
        return tiltNorth(pattern);
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

  const pattern: Pattern = input.split('\n');
  const tiltedInput = tiltInput(pattern, 'North');
  return calculateLoadOfPattern(tiltedInput);
};

const answer = `${solve()}`;

export default answer;
