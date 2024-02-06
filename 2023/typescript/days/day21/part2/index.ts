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
    const [modifedXIndex, modifiedYIndex] = getModifiedPosition(lines, [
      xPosition,
      yPosition,
    ]);
    return lines[modifiedYIndex][modifedXIndex];
  };

  const getModifiedPosition = (
    lines: string[],
    [xPosition, yPosition]: Position
  ) => {
    const gridWidth = lines[0].length;
    const gridHeight = lines.length;
    const modifedXIndex =
      xPosition >= 0
        ? xPosition % gridWidth
        : (gridWidth + (xPosition % gridWidth)) % gridWidth;
    const modifiedYIndex =
      yPosition >= 0
        ? yPosition % gridHeight
        : (gridHeight + (yPosition % gridHeight)) % gridHeight;
    const modifiedPosition: Position = [modifedXIndex, modifiedYIndex];
    return modifiedPosition;
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

  const getDistanceFromStartToAllOtherPositions = (
    lines: string[],
    startPosition: Position
  ) => {
    const toExplore = [{ position: startPosition, distance: 0 }];
    const seen = new Map<string, number>();
    while (toExplore.length > 0) {
      const { position, distance: distance } = toExplore.shift()!;
      const key = getKeyFromPosition(position);
      if (seen.has(key)) {
        continue;
      }
      seen.set(key, distance);

      const adjacentPositions = getAdjacentStepsToPosition(lines, position);
      const nextPositionsAndDepth = adjacentPositions.map(
        (adjacentPosition) => ({
          position: adjacentPosition,
          distance: distance + 1,
        })
      );
      toExplore.push(...nextPositionsAndDepth);
    }

    return [...seen.values()];
  };

  const lines = input.split('\n');
  const startPosition = findStartPosition(lines)!;
  const distancesFromStartToAllOtherPositions =
    getDistanceFromStartToAllOtherPositions(lines, startPosition);

  const steps = 26_501_365;
  const [startX] = startPosition;

  // inspired by the rust based geometric solution here:
  // https://github.com/villuna/aoc23/wiki/A-Geometric-solution-to-advent-of-code-2023,-day-21
  const depthsReachableAtOddSteps =
    distancesFromStartToAllOtherPositions.filter((depth) => depth % 2 == 1);
  const depthsReachableAtEvenSteps =
    distancesFromStartToAllOtherPositions.filter((depth) => depth % 2 == 0);

  const oddCorners = depthsReachableAtOddSteps.filter(
    (depthReachableAtOddStep) => depthReachableAtOddStep > startX
  ).length;
  const evenCorners = depthsReachableAtEvenSteps.filter(
    (depthReachableAtEvenSteps) => depthReachableAtEvenSteps > startX
  ).length;

  const n = (steps - startX) / lines[0].length;
  const nPlus1 = n + 1;

  const even = n * n;
  const odd = nPlus1 * nPlus1;

  const answer =
    BigInt(odd) * BigInt(depthsReachableAtOddSteps.length) +
    BigInt(even) * BigInt(depthsReachableAtEvenSteps.length) -
    BigInt(nPlus1) * BigInt(oddCorners) +
    BigInt(n) * BigInt(evenCorners);

  return answer;
};

const answer = cachedAnswer ?? `${solve()}`;
if (!cachedAnswer) {
  const filePath = join(__dirname, 'answer.txt');
  fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
}

export default answer;
