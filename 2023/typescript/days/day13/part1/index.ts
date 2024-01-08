import fs from 'fs';
import { join } from 'path';
import input from './data';

type Pattern = string[];

let cachedAnswer: string | undefined;
try {
  const filePath = join(__dirname, 'answer.txt');
  cachedAnswer = fs.readFileSync(filePath, { encoding: 'utf-8' });
} catch (e) {}

const solve = () => {
  const getPatterns = (input: string) => {
    const rawPatterns = input.split('\n\n');
    const patterns: Pattern[] = [];

    for (let i = 0; i < rawPatterns.length; i++) {
      const rawPattern = rawPatterns[i];
      const pattern = rawPattern.split('\n');
      patterns.push(pattern);
    }

    return patterns;
  };

  const getColumnAtIndexFromPattern = (pattern: Pattern, index: number) => {
    return pattern.map((line) => line[index]).join('');
  };

  const getRowAtIndexFromPattern = (pattern: Pattern, index: number) => {
    return pattern[index] ?? '';
  };

  const calculateNumberOfColumnsLeftOfReflectionLine = (pattern: Pattern) => {
    let n = pattern[0].length;
    for (let i = 0; i < n; i++) {
      let perfectMirror = true;
      let k = 0;
      for (let j = i; j >= 0; j--) {
        const left = getColumnAtIndexFromPattern(pattern, j);
        const right = getColumnAtIndexFromPattern(pattern, i + k + 1);
        if (left === '' || right === '') {
          perfectMirror = k > 0;
          break;
        }

        if (left !== right) {
          perfectMirror = false;
          break;
        }
        k++;
      }

      if (perfectMirror) {
        return i + 1;
      }
    }

    return -1;
  };

  const calculateNumberOfRowsAboveReflectionLine = (pattern: Pattern) => {
    let m = pattern.length;
    for (let i = 0; i < m; i++) {
      let perfectMirror = true;
      let k = 0;
      for (let j = i; j >= 0; j--) {
        const above = getRowAtIndexFromPattern(pattern, j);
        const below = getRowAtIndexFromPattern(pattern, i + k + 1);
        if (above === '' || below === '') {
          perfectMirror = k > 0;
          break;
        }

        if (above !== below) {
          perfectMirror = false;
          break;
        }
        k++;
      }

      if (perfectMirror) {
        return i + 1;
      }
    }

    return -1;
  };

  const patterns = getPatterns(input);
  let horizontalSum = 0;
  let verticalSum = 0;
  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i];

    const rowsAboveHorizontalMirror =
      calculateNumberOfRowsAboveReflectionLine(pattern);
    if (rowsAboveHorizontalMirror !== -1) {
      horizontalSum += rowsAboveHorizontalMirror;
    }

    const columnsLeftOfVerticalMirror =
      calculateNumberOfColumnsLeftOfReflectionLine(pattern);
    if (columnsLeftOfVerticalMirror !== -1) {
      verticalSum += columnsLeftOfVerticalMirror;
    }
  }

  return 100 * horizontalSum + verticalSum;
};

const answer = `${solve()}`;
// const answer = cachedAnswer ?? `${solve()}`;
// if (!cachedAnswer) {
//   const filePath = join(__dirname, 'answer.txt');
//   fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
// }

export default answer;
