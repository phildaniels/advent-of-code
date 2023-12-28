import fs from 'fs';
import { join } from 'path';
import input from './data';

let cachedAnswer: string | undefined;
try {
  const filePath = join(__dirname, 'answer.txt');
  cachedAnswer = fs.readFileSync(filePath, { encoding: 'utf-8' });
} catch (e) {}

const solve = () => {
  const lines = input.split('\n');

  type Coordinate = [number, number];

  let start: Coordinate = [0, 0];

  for (let i = 0; i < lines.length; i++) {
    const currentLine = lines[i];
    const indexOfS = currentLine.indexOf('S');
    if (indexOfS !== -1) {
      start = [i, indexOfS];
    }
  }

  const traverse = (lines: string[], start: Coordinate) => {
    // I have my x's and y's mixed up here. As you look at the picture, increasing
    // x moves you down, not rigth, but too lazy to fix now
    const lineLength = lines[0].length;
    const [startI, startJ] = start;

    const toExplore = [
      [startI - 1, startJ],
      [startI + 1, startJ],
      [startI, startJ - 1],
      [startI, startJ + 1],
    ]
      .filter(
        ([i, j]) => i >= 0 && i < lines.length && j < lineLength && j >= 0
      )
      .filter(([i, j]) => lines[i][j] !== '.')
      .filter(([i, j]) => {
        const charAtPosition = lines[i][j];
        if (j > startJ) {
          // is to left of start, only characters with right accepting entrances
          return ['-', '7', 'J'].includes(charAtPosition);
        }

        if (j < startJ) {
          // is to right of start, only characters with left accepting entrances
          return ['-', 'F', 'L'].includes(charAtPosition);
        }

        if (i > startI) {
          // is below start, only characters with top accepting entrances
          return ['|', 'L', 'J'].includes(charAtPosition);
        }

        // must be above start, only characters with bottom accepting entrances
        return ['|', 'F', '7'].includes(charAtPosition);
      })
      .map(
        (coordinate) =>
          [1, coordinate, [startI, startJ]] as [number, Coordinate, Coordinate]
      );
    let longestPath = 0;
    const seen: Record<string, boolean> = {};
    while (toExplore.length > 0) {
      const [explorationLevel, coordinate, previousCoordinate] =
        toExplore.shift()!;
      const [coordinateX, coordinateY] = coordinate;
      const [previousX, previousY] = previousCoordinate;
      const coordinateKey = `${coordinateX}_${coordinateY}`;
      if (seen[coordinateKey]) {
        continue;
      }
      seen[coordinateKey] = true;

      if (explorationLevel > longestPath) {
        longestPath = explorationLevel;
      }

      const character = lines[coordinateX][coordinateY];

      if (!character) {
        continue;
      }

      const up = -1;
      const down = 1;
      const right = 1;
      const left = -1;

      switch (character) {
        case '|': {
          const newCoordinates: Coordinate =
            // if previous spot was below char then we're going just up, else just down
            previousX > coordinateX
              ? [coordinateX + up, coordinateY]
              : [coordinateX + down, coordinateY];
          toExplore.push([explorationLevel + 1, newCoordinates, coordinate]);
          break;
        }

        case '-': {
          // if previous spot was left of char, we're going just right, else just left
          const newCoordinates: Coordinate =
            previousY < coordinateY
              ? [coordinateX, coordinateY + right]
              : [coordinateX, coordinateY + left];
          toExplore.push([explorationLevel + 1, newCoordinates, coordinate]);
          break;
        }

        case 'L': {
          // previous spot was above char, we're going just right, else just up
          const newCoordinates: Coordinate =
            previousX < coordinateX
              ? [coordinateX, coordinateY + right]
              : [coordinateX + up, coordinateY];
          toExplore.push([explorationLevel + 1, newCoordinates, coordinate]);
          break;
        }

        case 'J': {
          // previous spot was above char, we're going just left, else just up
          const newCoordinates: Coordinate =
            previousX < coordinateX
              ? [coordinateX, coordinateY + left]
              : [coordinateX + up, coordinateY];
          toExplore.push([explorationLevel + 1, newCoordinates, coordinate]);
          break;
        }

        case '7': {
          // previous spot was below char, we're going just left, else just down
          const newCoordinates: Coordinate =
            previousX > coordinateX
              ? [coordinateX, coordinateY + left]
              : [coordinateX + down, coordinateY];
          toExplore.push([explorationLevel + 1, newCoordinates, coordinate]);
          break;
        }

        case 'F': {
          // previous spot was below char, we're going just right, else just down
          const newCoordinates: Coordinate =
            previousX > coordinateX
              ? [coordinateX, coordinateY + right]
              : [coordinateX + down, coordinateY];
          toExplore.push([explorationLevel + 1, newCoordinates, coordinate]);
          break;
        }
      }
    }

    return longestPath;
  };

  const longestPath = traverse(lines, start);
  return longestPath;
};

const answer = cachedAnswer ?? `${solve()}`;
if (!cachedAnswer) {
  const filePath = join(__dirname, 'answer.txt');
  fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
}

export default answer;
