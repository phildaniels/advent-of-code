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
    const results: number[] = [];
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
        results.push(i + 1);
      }
    }

    if (results.length > 0) {
      return results;
    }

    return [-1];
  };

  const calculateNumberOfRowsAboveReflectionLine = (pattern: Pattern) => {
    const results: number[] = [];
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
        results.push(i + 1);
      }
    }

    if (results.length > 0) {
      return results;
    }

    return [-1];
  };

  const patterns = getPatterns(input);
  let horizontalSum = 0;
  let verticalSum = 0;
  for (let i = 0; i < patterns.length; i++) {
    const pattern = patterns[i];
    const m = pattern.length;
    const n = pattern[0].length;

    const [originalRowsAboveHorizontalMirror] =
      calculateNumberOfRowsAboveReflectionLine(pattern);

    const [originalColumnsLeftOfVerticalMirror] =
      calculateNumberOfColumnsLeftOfReflectionLine(pattern);
    for (let j = 0; j < m; j++) {
      let smudgeFound = false;
      for (let k = 0; k < n; k++) {
        let mutatedPattern = pattern.slice();
        const characterAtPosition = mutatedPattern[j][k];
        const newCharacter = characterAtPosition === '#' ? '.' : '#';
        const mutatedPatternRow = mutatedPattern[j].split('');
        mutatedPatternRow[k] = newCharacter;
        mutatedPattern[j] = mutatedPatternRow.join('');

        const possibleHorizontalMirrors =
          calculateNumberOfRowsAboveReflectionLine(mutatedPattern).filter(
            (result) => result !== originalRowsAboveHorizontalMirror
          );
        const rowsAboveHorizontalMirror =
          possibleHorizontalMirrors[possibleHorizontalMirrors.length - 1] ?? -1;
        if (
          rowsAboveHorizontalMirror !== -1 &&
          originalRowsAboveHorizontalMirror
        ) {
          smudgeFound = true;
        }

        const possibleVerticalMirrors =
          calculateNumberOfColumnsLeftOfReflectionLine(mutatedPattern).filter(
            (result) => result !== originalColumnsLeftOfVerticalMirror
          );
        const columnsLeftOfVerticalMirror =
          possibleVerticalMirrors[possibleVerticalMirrors.length - 1] ?? -1;
        if (
          columnsLeftOfVerticalMirror !== -1 &&
          originalColumnsLeftOfVerticalMirror !== columnsLeftOfVerticalMirror
        ) {
          smudgeFound = true;
        }

        if (!smudgeFound) {
          continue;
        }

        if (rowsAboveHorizontalMirror !== -1) {
          horizontalSum += rowsAboveHorizontalMirror;
        }

        if (
          rowsAboveHorizontalMirror === -1 &&
          columnsLeftOfVerticalMirror !== -1
        ) {
          verticalSum += columnsLeftOfVerticalMirror;
        }

        break;
      }

      if (smudgeFound) {
        break;
      }
    }
  }

  return 100 * horizontalSum + verticalSum;
};

const answer = cachedAnswer ?? `${solve()}`;
if (!cachedAnswer) {
  const filePath = join(__dirname, 'answer.txt');
  fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
}

export default answer;
