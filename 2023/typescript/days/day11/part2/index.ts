import fs from 'fs';
import { join } from 'path';
import input from './data';

let cachedAnswer: string | undefined;
try {
  const filePath = join(__dirname, 'answer.txt');
  cachedAnswer = fs.readFileSync(filePath, { encoding: 'utf-8' });
} catch (e) {}

const solve = () => {
  const findEmtpyRowsAndColumns = (grid: string[]) => {
    let m = grid.length;
    let n = grid[0].length;
    const emptyRowIndexes: number[] = [];
    const emptyColumnIndexes: number[] = [];
    for (let i = 0; i < m; i++) {
      let includesGalaxy = false;
      for (let j = 0; j < n; j++) {
        const currentChar = grid[i][j];
        if (currentChar === '#') {
          includesGalaxy = true;
          break;
        }
      }

      if (!includesGalaxy) {
        emptyColumnIndexes.push(i);
      }
    }
    for (let i = 0; i < n; i++) {
      let includesGalaxy = false;
      for (let j = 0; j < m; j++) {
        const currentChar = grid[j][i];
        if (currentChar === '#') {
          includesGalaxy = true;
          break;
        }
      }

      if (!includesGalaxy) {
        emptyRowIndexes.push(i);
      }
    }

    return [emptyColumnIndexes, emptyRowIndexes];
  };

  const findCoordinatesOfGalaxies = (
    grid: string[],
    emptyRowIndexes: number[],
    emptyColumnIndexes: number[]
  ) => {
    let m = grid.length;
    let n = grid[0].length;
    const galaxyCoordinates: Array<[number, number]> = [];
    for (let i = 0; i < m; i++) {
      for (let j = 0; j < n; j++) {
        if (grid[i][j] === '#') {
          const rowsSmallerThanI = emptyRowIndexes.filter(
            (index) => index < i
          ).length;
          const columnsSmallerThanJ = emptyColumnIndexes.filter(
            (index) => index < j
          ).length;
          const adjustedI = i + rowsSmallerThanI * 999999;
          const adjustedJ = j + columnsSmallerThanJ * 999999;
          galaxyCoordinates.push([adjustedI, adjustedJ]);
        }
      }
    }

    return galaxyCoordinates;
  };

  const findShortestPathsBetweenAllGalaxies = (
    coordinates: Array<[number, number]>
  ) => {
    const shortestPathsBetweenAllGalaxies: number[][] = [];
    for (let i = 0; i < coordinates.length; i++) {
      let shortestPaths: number[] = [];
      const [startX, startY] = coordinates[i];
      for (let j = i + 1; j < coordinates.length; j++) {
        const [endX, endY] = coordinates[j];
        shortestPaths.push(Math.abs(startX - endX) + Math.abs(startY - endY));
      }

      shortestPathsBetweenAllGalaxies.push(shortestPaths);
    }

    return shortestPathsBetweenAllGalaxies;
  };

  const lines = input.split('\n');
  const [emtpyRowIndexes, emptyColumnIndexes] = findEmtpyRowsAndColumns(lines);

  const galaxyCoordinates = findCoordinatesOfGalaxies(
    lines,
    emtpyRowIndexes,
    emptyColumnIndexes
  );
  const shortestPathsBetweenAllGalaxies =
    findShortestPathsBetweenAllGalaxies(galaxyCoordinates);

  let sum = 0;
  for (let i = 0; i < shortestPathsBetweenAllGalaxies.length; i++) {
    const paths = shortestPathsBetweenAllGalaxies[i];
    for (let j = 0; j < paths.length; j++) {
      let path = paths[j];
      sum += path;
    }
  }

  return sum;
};

const answer = `${solve()}`;
// const answer = cachedAnswer ?? `${solve()}`;
// if (!cachedAnswer) {
//   const filePath = join(__dirname, 'answer.txt');
//   fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
// }

export default answer;
