import fs from 'fs';
import { join } from 'path';
import input from './data';

let cachedAnswer: string | undefined;
try {
  const filePath = join(__dirname, 'answer.txt');
  cachedAnswer = fs.readFileSync(filePath, { encoding: 'utf-8' });
} catch (e) {}

const solve = () => {
  type Position = [number, number];

  const getCharacterAtPosition = (
    lines: string[],
    [xPosition, yPosition]: Position
  ) => {
    return lines[yPosition][xPosition];
  };

  const findStartPosition = (lines: string[]) => {
    for (let [i, line] of lines.entries()) {
      const indexOfS = line.indexOf('S');
      if (indexOfS !== -1) {
        const positionOfStart: Position = [indexOfS, i];
        return positionOfStart;
      }
    }
  };

  const getAdjacentStepsToPosition = (
    lines: string[],
    [xPosition, yPosition]: Position
  ) => {
    const gridWidth = lines[0].length;
    const gridHeight = lines.length;
    const up: Position = [xPosition, yPosition - 1];
    const right: Position = [xPosition + 1, yPosition];
    const down: Position = [xPosition, yPosition + 1];
    const left: Position = [xPosition - 1, yPosition];
    return [up, right, down, left].filter(
      ([adjacentXPosition, adjacentYPosition]) => {
        return (
          adjacentXPosition >= 0 &&
          adjacentXPosition < gridWidth &&
          adjacentYPosition >= 0 &&
          adjacentYPosition < gridHeight &&
          getCharacterAtPosition(lines, [
            adjacentXPosition,
            adjacentYPosition,
          ]) !== '#'
        );
      }
    );
  };

  const getKeyFromPosition = (
    [xPosition, yPosition]: Position,
    depth?: number
  ) =>
    depth !== undefined
      ? `${xPosition}_${yPosition}_${depth}`
      : `${xPosition}_${yPosition}`;

  const numberOfPositionsNStepsAway = (
    lines: string[],
    startPosition: Position,
    nSteps: number
  ) => {
    const toExplore = [{ position: startPosition, depth: 0 }];
    let totalPositionsCount = 0;
    const seen = new Set<string>();
    while (toExplore.length > 0) {
      const { position, depth } = toExplore.shift()!;
      const key = getKeyFromPosition(position, depth);
      if (seen.has(key)) {
        continue;
      }
      seen.add(key);

      if (depth === nSteps) {
        totalPositionsCount++;
        continue;
      }

      const adjacentPositions = getAdjacentStepsToPosition(lines, position);
      const nextPositionsAndDepth = adjacentPositions.map(
        (adjacentPosition) => ({
          position: adjacentPosition,
          depth: depth + 1,
        })
      );
      toExplore.push(...nextPositionsAndDepth);
    }
    return totalPositionsCount;
  };

  const lines = input.split('\n');
  const startPosition = findStartPosition(lines)!;
  return numberOfPositionsNStepsAway(lines, startPosition, 64);
};

const answer = cachedAnswer ?? `${solve()}`;
if (!cachedAnswer) {
  const filePath = join(__dirname, 'answer.txt');
  fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
}

export default answer;
