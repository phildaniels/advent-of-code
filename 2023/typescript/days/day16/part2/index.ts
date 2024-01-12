import fs from 'fs';
import { join } from 'path';
import input from './data';

let cachedAnswer: string | undefined;
try {
  const filePath = join(__dirname, 'answer.txt');
  cachedAnswer = fs.readFileSync(filePath, { encoding: 'utf-8' });
} catch (e) {}

type Position = {
  x: number;
  y: number;
  previousPosition: Position | undefined;
};

const solve = () => {
  const grid = input.split('\n');

  const leftTiles: Position[] = [];
  for (let i = 0; i < grid.length; i++) {
    leftTiles.push({
      x: 0,
      y: i,
      previousPosition: { x: -1, y: i, previousPosition: undefined },
    });
  }

  const topTiles: Position[] = [];
  for (let i = 0; i < grid[0].length; i++) {
    topTiles.push({
      x: i,
      y: 0,
      previousPosition: { x: i, y: -1, previousPosition: undefined },
    });
  }

  const rightTiles: Position[] = [];
  for (let i = 0; i < grid.length; i++) {
    rightTiles.push({
      x: grid[0].length - 1,
      y: i,
      previousPosition: {
        x: grid[0].length,
        y: i,
        previousPosition: undefined,
      },
    });
  }

  const bottomTiles: Position[] = [];
  for (let i = 0; i < grid.length; i++) {
    rightTiles.push({
      x: i,
      y: grid[0].length - 1,
      previousPosition: {
        x: i,
        y: grid[0].length,
        previousPosition: undefined,
      },
    });
  }

  const startingPositions = [
    ...rightTiles,
    ...topTiles,
    ...rightTiles,
    ...bottomTiles,
  ];

  let max = 0;
  for (let i = 0; i < startingPositions.length; i++) {
    const startingPosition = startingPositions[i];

    const positions: Position[] = [startingPosition];

    const getCharAtXAndY = (x: number, y: number, grid: string[]) => {
      return grid[y]?.[x];
    };

    const visited = new Set<string>();
    while (positions.length > 0) {
      const currentPosition = positions.pop()!;
      const { x, y, previousPosition } = currentPosition;
      const previousX = previousPosition!.x;
      const previousY = previousPosition!.y;
      const charAtCurrentPosition = getCharAtXAndY(x, y, grid);
      if (!charAtCurrentPosition) {
        continue;
      }

      const visitedKey = `${x}_${y}-${previousX}_${previousY}`;
      if (visited.has(visitedKey)) {
        continue;
      }

      visited.add(visitedKey);

      const xDelta = x - previousX;
      const yDelta = y - previousY;

      switch (charAtCurrentPosition) {
        case '.': {
          positions.push({
            x: x + xDelta,
            y: y + yDelta,
            previousPosition: {
              ...currentPosition,
              previousPosition: undefined,
            },
          });
          break;
        }

        case '|': {
          if (previousX !== x) {
            positions.push(
              {
                x,
                y: y + 1,
                previousPosition: {
                  ...currentPosition,
                  previousPosition: undefined,
                },
              },
              {
                x,
                y: y - 1,
                previousPosition: {
                  ...currentPosition,
                  previousPosition: undefined,
                },
              }
            );
          } else {
            positions.push({
              x: x + xDelta,
              y: y + yDelta,
              previousPosition: {
                ...currentPosition,
                previousPosition: undefined,
              },
            });
          }
          break;
        }

        case '-': {
          if (previousY !== y) {
            positions.push(
              {
                x: x + 1,
                y: y,
                previousPosition: {
                  ...currentPosition,
                  previousPosition: undefined,
                },
              },
              {
                x: x - 1,
                y: y,
                previousPosition: {
                  ...currentPosition,
                  previousPosition: undefined,
                },
              }
            );
          } else {
            positions.push({
              x: x + xDelta,
              y: y + yDelta,
              previousPosition: {
                ...currentPosition,
                previousPosition: undefined,
              },
            });
          }
          break;
        }

        case '\\': {
          positions.push({
            x: x + yDelta,
            y: y + xDelta,
            previousPosition: {
              ...currentPosition,
              previousPosition: undefined,
            },
          });
          break;
        }

        case '/': {
          if (xDelta === 0) {
            positions.push({
              x: x - yDelta, // 0
              y: y + xDelta, // -1
              previousPosition: {
                ...currentPosition,
                previousPosition: undefined,
              },
            });
          } else {
            positions.push({
              x: x + yDelta, // 0
              y: y - xDelta, // -1
              previousPosition: {
                ...currentPosition,
                previousPosition: undefined,
              },
            });
          }
          break;
        }

        default: {
          break;
        }
      }
    }

    const distinctVisited = new Set<string>();
    for (let visitedEntry of visited) {
      const [modifiedKey] = visitedEntry.split('-');
      distinctVisited.add(modifiedKey);
    }
    if (distinctVisited.size > max) {
      max = distinctVisited.size;
    }
  }

  return max;
};

const answer = cachedAnswer ?? `${solve()}`;
if (!cachedAnswer) {
  const filePath = join(__dirname, 'answer.txt');
  fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
}

export default answer;
