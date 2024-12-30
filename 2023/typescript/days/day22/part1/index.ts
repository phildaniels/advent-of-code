import fs from 'fs';
import { join } from 'path';
import input from './data';

// let cachedAnswer: string | undefined;
// try {
//   const filePath = join(__dirname, 'answer.txt');
//   cachedAnswer = fs.readFileSync(filePath, { encoding: 'utf-8' });
// } catch (e) {}

const solve = () => {
  type Coordinate = [number, number, number];
  type Brick = [Coordinate, Coordinate, string];
  type MinAndMaxMetadata = {
    xMin: number;
    xMax: number;
    yMin: number;
    yMax: number;
    zMin: number;
    zMax: number;
  };

  const letterGenerator = function* () {
    let current = '';
    while (true) {
      let carry = true;
      let result = '';
      for (let i = current.length - 1; i >= 0; i--) {
        if (carry) {
          if (current[i] === 'Z') {
            result = `A${result}`;
          } else {
            result = `${String.fromCharCode(
              current.charCodeAt(i) + 1
            )}${result}`;
            carry = false;
          }
        } else {
          result = `${current[i]}${result}`;
        }
      }
      if (carry) {
        result = `A${result}`;
      }
      current = result;
      yield current;
    }
  };

  const getCoordinatesFromInput = (input: string) => {
    const letterGen = letterGenerator();
    const bricks: Brick[] = [];
    const lines = input.split('\n');
    for (const line of lines) {
      const [firstString, secondString] = line.split('~');

      const leftBrick = firstString
        .split(',')
        .map((intAsString) => +intAsString) as Coordinate;
      const rightBrick = secondString
        .split(',')
        .map((intAsString) => +intAsString) as Coordinate;

      const [leftX, leftY, leftZ] = leftBrick;
      const [rightX, rightY, rightZ] = rightBrick;

      let brick: Brick;
      if (leftZ > rightZ) {
        brick = [rightBrick, leftBrick, letterGen.next().value];
      } else if (leftZ < rightZ) {
        brick = [leftBrick, rightBrick, letterGen.next().value];
      } else {
        if (leftX > rightX) {
          brick = [rightBrick, leftBrick, letterGen.next().value];
        } else if (leftX < rightX) {
          brick = [leftBrick, rightBrick, letterGen.next().value];
        } else {
          if (leftY > rightY) {
            brick = [rightBrick, leftBrick, letterGen.next().value];
          } else {
            brick = [leftBrick, rightBrick, letterGen.next().value];
          }
        }
      }

      bricks.push(brick);
    }

    return bricks;
  };

  const getMinAndMaxXYZ = (bricks: Brick[]) => {
    const xs: number[] = [];
    const ys: number[] = [];
    const zs: number[] = [];

    for (const [[startX, startY, startZ], [endX, endY, endZ]] of bricks) {
      xs.push(startX, endX);
      ys.push(startY, endY);
      zs.push(startZ, endZ);
    }

    return {
      xMin: Math.min(...xs),
      xMax: Math.max(...xs),
      yMin: Math.min(...ys),
      yMax: Math.max(...ys),
      zMin: Math.min(...zs),
      zMax: Math.max(...zs),
    };
  };

  const printXAndZ = (
    bricks: Brick[],
    { xMin, xMax, zMin, zMax }: MinAndMaxMetadata
  ) => {
    const characterSeparator = ' ';
    const lines: string[][] = [];
    for (let z = 0; z <= zMax; z++) {
      const line: string[] = [];
      for (let x = 0; x <= xMax; x++) {
        line.push('.');
      }
      lines.push(line);
    }

    for (let x = xMin; x <= xMax; x++) {
      for (let z = zMin; z <= zMax; z++) {
        lines[z][x] =
          bricks.find(([[firstX, , firstZ], [secondX, , secondZ]]) => {
            const startX = Math.min(firstX, secondX);
            const endX = Math.max(firstX, secondX);

            const startZ = Math.min(firstZ, secondZ);
            const endZ = Math.max(firstZ, secondZ);
            return startX <= x && x <= endX && startZ <= z && z <= endZ;
          })?.[2] ?? '.';
      }
    }

    const headerFirstLine: string[] = [];
    const headerSecondLine: string[] = [];
    for (let i = 0; i <= xMax; i++) {
      if (i === Math.ceil(xMax / 2)) {
        headerFirstLine.push('x');
      } else {
        headerFirstLine.push(' ');
      }
      headerSecondLine.push(`${i}`);
    }
    console.log(headerFirstLine.join(characterSeparator));
    console.log(headerSecondLine.join(characterSeparator));
    const body = lines
      .map((line, index) =>
        index === 0
          ? `${new Array<string>(xMax + 1)
              .fill('-')
              .join(characterSeparator)} 0`
          : `${line.join(characterSeparator)} ${index}${
              index === Math.ceil(lines.length / 2) ? ' z' : ''
            }`
      )
      .toReversed()
      .join('\n');
    console.log(body);
  };

  const printYAndZ = (
    bricks: Brick[],
    { yMin, yMax, zMin, zMax }: MinAndMaxMetadata
  ) => {
    const characterSeparator = ' ';
    const lines: string[][] = [];
    for (let z = 0; z <= zMax; z++) {
      const line: string[] = [];
      for (let x = 0; x <= yMax; x++) {
        line.push('.');
      }
      lines.push(line);
    }

    for (let y = yMin; y <= yMax; y++) {
      for (let z = zMin; z <= zMax; z++) {
        lines[z][y] =
          bricks.find(([[, firstY, firstZ], [, secondY, secondZ]]) => {
            const startX = Math.min(firstY, secondY);
            const endX = Math.max(firstY, secondY);

            const startZ = Math.min(firstZ, secondZ);
            const endZ = Math.max(firstZ, secondZ);
            return startX <= y && y <= endX && startZ <= z && z <= endZ;
          })?.[2] ?? '.';
      }
    }

    const headerFirstLine: string[] = [];
    const headerSecondLine: string[] = [];
    for (let i = 0; i <= yMax; i++) {
      if (i === Math.ceil(yMax / 2)) {
        headerFirstLine.push('y');
      } else {
        headerFirstLine.push(' ');
      }
      headerSecondLine.push(`${i}`);
    }
    console.log(headerFirstLine.join(characterSeparator));
    console.log(headerSecondLine.join(characterSeparator));
    const body = lines
      .map((line, index) =>
        index === 0
          ? `${new Array<string>(yMax + 1)
              .fill('-')
              .join(characterSeparator)} 0`
          : `${line.join(characterSeparator)} ${index}${
              index === Math.ceil(lines.length / 2) ? ' z' : ''
            }`
      )
      .toReversed()
      .join('\n');
    console.log(body);
  };

  const orderBricks = (bricks: Brick[]) => {
    return bricks.sort((leftBrick, rightBrick) => {
      const [leftStart, leftEnd] = leftBrick;
      const [leftStartX, leftStartY, leftStartZ] = leftStart;
      const [leftEndX, leftEndY, leftEndZ] = leftEnd;

      const [rightStart, rightEnd] = rightBrick;
      const [rightStartX, rightStartY, rightStartZ] = rightStart;
      const [rightEndX, rightEndY, rightEndZ] = rightEnd;

      if (leftStartZ !== rightStartZ) {
        return leftStartZ - rightStartZ;
      }
      if (leftEndZ !== rightEndZ) {
        return leftEndZ - rightEndZ;
      }
      if (leftStartX !== rightStartX) {
        return leftStartX - rightStartX;
      }
      if (leftEndX !== rightEndX) {
        return leftEndX - rightEndX;
      }
      if (leftStartY !== rightStartY) {
        return leftStartY - rightStartY;
      }

      return leftEndY - rightEndY;
    });
  };

  const isBrickOnTop = (top: Brick, bottom: Brick): boolean => {
    const [topStart, topEnd] = top;
    const [topStartX, topStartY, topStartZ] = topStart;
    const [topEndX, topEndY, topEndZ] = topEnd;

    const [bottomStart, bottomEnd] = bottom;
    const [bottomStartX, bottomStartY, bottomStartZ] = bottomStart;
    const [bottomEndX, bottomEndY, bottomEndZ] = bottomEnd;

    const topBrickBottomZ = Math.min(topStartZ, topEndZ);
    const bottomBrickTopZ = Math.max(bottomStartZ, bottomEndZ);

    const isDirectlyAbove = topBrickBottomZ === bottomBrickTopZ + 1;
    const overlapX = topStartX <= bottomEndX && topEndX >= bottomStartX;
    const overlapY = topStartY <= bottomEndY && topEndY >= bottomStartY;

    return isDirectlyAbove && overlapX && overlapY;
  };

  const makeBricksFall = (bricks: Brick[]) => {
    const orderedBricks = orderBricks(bricks);
    const bricksAfterFall: Brick[] = [];
    while (orderedBricks.length > 0) {
      const lowestBrick = orderedBricks.shift()!;
      let lowestBrickAfterFall = lowestBrick;
      // console.log('Brick started at', lowestBrickAfterFall);
      while (true) {
        const [lowestStart, lowestEnd, lowestBrickLetter] =
          lowestBrickAfterFall;
        const [lowestStartX, lowestStartY, lowestStartZ] = lowestStart;
        const [lowestEndX, lowestEndY, lowestEndZ] = lowestEnd;

        const minZ = Math.min(lowestStartZ - 1, lowestEndZ - 1);

        if (minZ === 0) {
          // console.log(
          //   'Brick',
          //   lowestBrickLetter,
          //   'is adjacent to the ground and cannot fall'
          // );
          break;
        }

        const brickThatWillPreventFall = bricksAfterFall.find((brick) => {
          return isBrickOnTop(lowestBrickAfterFall, brick);
        });

        if (brickThatWillPreventFall) {
          // console.log(
          //   'Brick',
          //   lowestBrickLetter,
          //   'cannot fall because it will intersect with brick',
          //   brickThatWillPreventFall[2]
          // );
          break;
        }

        lowestBrickAfterFall = [
          [lowestStartX, lowestStartY, minZ],
          [lowestEndX, lowestEndY, minZ],
          lowestBrickLetter,
        ];

        // console.log('Brick', lowestBrickLetter, 'fell one spot to z=', minZ);
      }

      // console.log('Brick ended at', lowestBrickAfterFall);
      bricksAfterFall.push(lowestBrickAfterFall);
    }

    return orderBricks(bricksAfterFall);
  };

  const brickIsSafeToDisintegrate = (brick: Brick, allBricks: Brick[]) => {
    const [, , currentBrickName] = brick;
    const bricksWithoutBrick = allBricks.filter(([, , name]) => {
      return currentBrickName !== name;
    });

    const bricksAfterFall = makeBricksFall([...bricksWithoutBrick]);
    const bricksThatMoved = bricksAfterFall.filter((brickAfterFall) => {
      const [brickAfterFallStart, brickAfterFallEnd, brickAfterFallLetter] =
        brickAfterFall;
      const [brickAfterFallStartX, brickAfterFallStartY, brickAfterFallStartZ] =
        brickAfterFallStart;
      const [brickAfterFallEndX, brickAfterFallEndY, brickAfterFallEndZ] =
        brickAfterFallEnd;

      const brickBeforeFall = bricksWithoutBrick.find(
        ([, , name]) => name === brickAfterFallLetter
      )!;

      const [brickBeforeFallStart, brickBeforeFallEnd] = brickBeforeFall;
      const [
        brickBeforeFallStartX,
        brickBeforeFallStartY,
        brickBeforeFallStartZ,
      ] = brickBeforeFallStart;
      const [brickBeforeFallEndX, brickBeforeFallEndY, brickBeforeFallEndZ] =
        brickBeforeFallEnd;

      return (
        brickAfterFallStartX !== brickBeforeFallStartX ||
        brickAfterFallStartY !== brickBeforeFallStartY ||
        brickAfterFallStartZ !== brickBeforeFallStartZ ||
        brickAfterFallEndX !== brickBeforeFallEndX ||
        brickAfterFallEndY !== brickBeforeFallEndY ||
        brickAfterFallEndZ !== brickBeforeFallEndZ
      );
    });

    if (bricksThatMoved.length > 0) {
      console.log(
        'Bricks ',
        bricksThatMoved.map(([, , name]) => name),
        'moved after disintegrating brick',
        currentBrickName
      );

      return false;
    } else {
      console.log('Brick', currentBrickName, 'is safe to disintegrate');
      return true;
    }
  };

  const bricks = getCoordinatesFromInput(input);
  printXAndZ(bricks, getMinAndMaxXYZ(bricks));
  console.log();
  printYAndZ(bricks, getMinAndMaxXYZ(bricks));
  console.log();
  const bricksAfterFall = makeBricksFall(bricks);
  printXAndZ(bricksAfterFall, getMinAndMaxXYZ(bricksAfterFall));
  console.log();
  printYAndZ(bricksAfterFall, getMinAndMaxXYZ(bricksAfterFall));

  let countOfBricksThatAreSafeToDisintegrate = 0;
  for (const brick of bricksAfterFall) {
    if (brickIsSafeToDisintegrate(brick, bricksAfterFall)) {
      countOfBricksThatAreSafeToDisintegrate++;
    }
  }

  return countOfBricksThatAreSafeToDisintegrate;
};

const answer = `${solve()}`;
// if (!cachedAnswer) {
//   const filePath = join(__dirname, 'answer.txt');
//   fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
// }

// 423 too
export default answer;
