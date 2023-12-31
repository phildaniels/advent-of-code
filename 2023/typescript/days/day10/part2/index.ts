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

  const getSquaresInLoop = (lines: string[], start: Coordinate) => {
    // I have my x's and y's mixed up here. As you look at the picture, increasing
    // x moves you down, not rigth, but too lazy to fix now
    const lineLength = lines[0].length;
    const [startI, startJ] = start;

    let [firstPositionAwayFromStart, startCoordinate] = [
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
          [coordinate, [startI, startJ]] as [Coordinate, Coordinate]
      )[0];
    const pathSoFar: Coordinate[] = [[startI, startJ]];
    let [coordinateX, coordinateY] = firstPositionAwayFromStart;
    let [previousX, previousY] = startCoordinate;
    while (coordinateX !== startI || coordinateY !== startJ) {
      pathSoFar.push([coordinateX, coordinateY]);
      const character = lines[coordinateX][coordinateY];
      const up = -1;
      const down = 1;
      const right = 1;
      const left = -1;

      switch (character) {
        case '|': {
          const [newCoordinateX, newCoordinateY]: Coordinate =
            // if previous spot was below char then we're going just up, else just down
            previousX > coordinateX
              ? [coordinateX + up, coordinateY]
              : [coordinateX + down, coordinateY];
          previousX = coordinateX;
          previousY = coordinateY;
          coordinateX = newCoordinateX;
          coordinateY = newCoordinateY;
          break;
        }

        case '-': {
          // if previous spot was left of char, we're going just right, else just left
          const [newCoordinateX, newCoordinateY]: Coordinate =
            previousY < coordinateY
              ? [coordinateX, coordinateY + right]
              : [coordinateX, coordinateY + left];
          previousX = coordinateX;
          previousY = coordinateY;
          coordinateX = newCoordinateX;
          coordinateY = newCoordinateY;
          break;
        }

        case 'L': {
          // previous spot was above char, we're going just right, else just up
          const [newCoordinateX, newCoordinateY]: Coordinate =
            previousX < coordinateX
              ? [coordinateX, coordinateY + right]
              : [coordinateX + up, coordinateY];
          previousX = coordinateX;
          previousY = coordinateY;
          coordinateX = newCoordinateX;
          coordinateY = newCoordinateY;
          break;
        }

        case 'J': {
          // previous spot was above char, we're going just left, else just up
          const [newCoordinateX, newCoordinateY]: Coordinate =
            previousX < coordinateX
              ? [coordinateX, coordinateY + left]
              : [coordinateX + up, coordinateY];
          previousX = coordinateX;
          previousY = coordinateY;
          coordinateX = newCoordinateX;
          coordinateY = newCoordinateY;
          break;
        }

        case '7': {
          // previous spot was below char, we're going just left, else just down
          const [newCoordinateX, newCoordinateY]: Coordinate =
            previousX > coordinateX
              ? [coordinateX, coordinateY + left]
              : [coordinateX + down, coordinateY];
          previousX = coordinateX;
          previousY = coordinateY;
          coordinateX = newCoordinateX;
          coordinateY = newCoordinateY;
          break;
        }

        case 'F': {
          // previous spot was below char, we're going just right, else just down
          const [newCoordinateX, newCoordinateY]: Coordinate =
            previousX > coordinateX
              ? [coordinateX, coordinateY + right]
              : [coordinateX + down, coordinateY];
          previousX = coordinateX;
          previousY = coordinateY;
          coordinateX = newCoordinateX;
          coordinateY = newCoordinateY;
          break;
        }
      }
    }

    // ray casting algorithm, written by copilot
    const pointInPolygon = (point: Coordinate, polygon: Coordinate[]) => {
      let intersects = false;
      for (let i = 0, j = polygon.length - 1; i < polygon.length; j = i++) {
        let xi = polygon[i][0],
          yi = polygon[i][1];
        let xj = polygon[j][0],
          yj = polygon[j][1];

        let intersect =
          yi > point[1] !== yj > point[1] &&
          point[0] < ((xj - xi) * (point[1] - yi)) / (yj - yi) + xi;
        if (intersect) intersects = !intersects;
      }
      return intersects;
    };

    const pointPartOfPath = (point: Coordinate, path: Coordinate[]) => {
      const [x, y] = point;
      for (let i = 0; i < path.length; i++) {
        const [x1, y1] = path[i];
        if (x === x1 && y === y1) {
          return true;
        }
      }
      return false;
    };

    const allCoordinatesInsideLoop: Coordinate[] = [];
    for (let i = 0; i < lines.length; i++) {
      const line = lines[i];
      for (let j = 0; j < line.length; j++) {
        if (
          pointInPolygon([i, j], pathSoFar) &&
          !pointPartOfPath([i, j], pathSoFar)
        ) {
          allCoordinatesInsideLoop.push([i, j]);
        }
      }
    }

    return allCoordinatesInsideLoop.length;
  };

  const countOfPeriodsInLoop = getSquaresInLoop(lines, start);
  return countOfPeriodsInLoop;
};

const answer = cachedAnswer ?? `${solve()}`;
if (!cachedAnswer) {
  const filePath = join(__dirname, 'answer.txt');
  fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
}

export default answer;
