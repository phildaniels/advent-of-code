import fs, { Dir } from 'fs';
import { join } from 'path';
import input from './data';

let cachedAnswer: string | undefined;
try {
  const filePath = join(__dirname, 'answer.txt');
  cachedAnswer = fs.readFileSync(filePath, { encoding: 'utf-8' });
} catch (e) {}

type Direction = 'U' | 'R' | 'D' | 'L';

type Position = [number, number];

type Instruction = {
  direction: Direction;
  count: number;
};

const solve = () => {
  const shouldPrint = true;

  const convertHexCodeToBase10 = (hexCode: string) => Number(hexCode).valueOf();
  const convertNumberToDirection = (num: number): Direction => {
    switch (num) {
      case 0: {
        return 'R';
      }

      case 1: {
        return 'D';
      }

      case 2: {
        return 'L';
      }

      case 3: {
        return 'U';
      }

      default: {
        throw new Error(`Invalid Code ${num}`);
      }
    }
  };

  const extractInput = (input: string): Instruction[] => {
    const lines = input.split('\n');
    return lines.map<Instruction>((line) => {
      const [, , hexCodeStringWithParentheses] = line.split(' ');
      const colorCode = hexCodeStringWithParentheses.substring(
        1,
        hexCodeStringWithParentheses.length - 1
      );
      const hexadecimal = colorCode.substring(0, 6).replace('#', '0x');
      const directionNumberString = colorCode[colorCode.length - 1];
      const count = convertHexCodeToBase10(hexadecimal);
      const direction = convertNumberToDirection(+directionNumberString);
      return { direction, count };
    });
  };

  const postionInsidePolygon = (position: Position, polygon: Position[]) => {
    const [xPosition, yPosition] = position;
    let inside = false;
    for (let i = 0; i < polygon.length; i++) {
      const [currentX, currentY] = polygon[i];
      const [previousX, previousY] =
        polygon[i === 0 ? polygon.length - 1 : i - 1];

      const intersect =
        currentY > yPosition !== previousY > yPosition &&
        xPosition <
          ((previousX - currentX) * (yPosition - currentY)) /
            (previousY - currentY) +
            currentX;

      if (intersect) {
        inside = !inside;
      }
    }

    return inside;
  };

  const createDotGridOfSize = (arrayWidth: number, arrayHeight: number) => {
    const grid: string[][] = [];
    for (let i = 0; i < arrayHeight; i++) {
      const dots = [];
      for (let j = 0; j < arrayWidth; j++) {
        dots.push('.');
      }

      grid.push(dots);
    }

    return grid;
  };

  const fillArrayWithPolygonBorder = (
    vertices: Position[],
    polygonArray: string[][]
  ) => {
    for (let i = 1; i < vertices.length; i++) {
      const [previousX, previousY] = vertices[i - 1];
      const [currentX, currentY] = vertices[i];

      const deltaX = Math.abs(currentX - previousX);

      if (deltaX > 0) {
        const start = Math.min(previousX, currentX);
        const end = Math.max(previousX, currentX);
        for (let j = start; j <= end; j++) {
          setCharacterAtPosition([j, previousY], polygonArray, '#');
        }
      } else {
        const start = Math.min(previousY, currentY);
        const end = Math.max(previousY, currentY);
        for (let j = start; j <= end; j++) {
          setCharacterAtPosition([previousX, j], polygonArray, '#');
        }
      }
    }
  };

  const getCharacterAtPosition = (
    [xPosition, yPosition]: Position,
    polygonArray: string[][]
  ) => polygonArray[yPosition][xPosition];

  const setCharacterAtPosition = (
    [xPosition, yPosition]: Position,
    polygonArray: string[][],
    character: string
  ) => {
    polygonArray[yPosition][xPosition] = character;
  };

  const fillInteriorOfPolygon = (
    vertices: Position[],
    polygonArray: string[][]
  ) => {
    const allDotCoordinatesInPolygon = polygonArray
      .flatMap((line, index) =>
        line.map<Position>((_, innerIndex) => [innerIndex, index])
      )
      .filter(
        (position) =>
          getCharacterAtPosition(position, polygonArray) === '.' &&
          postionInsidePolygon(position, vertices)
      );
    allDotCoordinatesInPolygon.forEach((position) => {
      return setCharacterAtPosition(position, polygonArray, '#');
    });
  };

  const printPolygonArrayAsString = (polygonArray: string[][]) => {
    if (shouldPrint) {
      console.log(polygonArray.map((line) => line.join('')).join('\n'));
    }
  };

  const normalizeVertices = (
    vertices: Position[],
    xOffset: number,
    yOffset: number
  ) => {
    return vertices.map<Position>(([xPosition, yPosition]) => [
      xPosition + xOffset,
      yPosition + yOffset,
    ]);
  };

  const calculateNextPositionBasedOnInstruction = (
    currentPosition: Position,
    instruction: Instruction
  ) => {
    const { direction, count } = instruction;
    const [xPosition, yPosition] = currentPosition;
    switch (direction) {
      case 'U': {
        const nextPosition: Position = [xPosition, yPosition - count];
        return nextPosition;
      }
      case 'R': {
        const nextPosition: Position = [xPosition + count, yPosition];
        return nextPosition;
      }
      case 'D': {
        const nextPosition: Position = [xPosition, yPosition + count];
        return nextPosition;
      }
      case 'L': {
        const nextPosition: Position = [xPosition - count, yPosition];
        return nextPosition;
      }
      default: {
        return currentPosition;
      }
    }
  };

  const calcPolygonArea = (vertices: Position[]) => {
    let area = 0;
    for (const [
      i,
      [currentXPosition, currentYPosition],
    ] of vertices.entries()) {
      let j = (i + 1) % vertices.length;
      const [nextXPosition, nextYPosition] = vertices[j];
      const borderLength = Math.max(
        Math.abs(nextXPosition - currentXPosition),
        Math.abs(nextYPosition - currentYPosition)
      );
      area +=
        currentXPosition * nextYPosition -
        currentYPosition * nextXPosition +
        borderLength;
    }
    return Math.abs(area / 2) + 1;
  };

  const executeInstructions = (instructions: Instruction[]) => {
    let position: Position = [0, 0];
    const vertices: Position[] = [position];
    for (const instruction of instructions) {
      const nextPosition = calculateNextPositionBasedOnInstruction(
        position,
        instruction
      );
      vertices.push(nextPosition);
      position = nextPosition;
    }

    return calcPolygonArea(vertices);
  };

  const instructions = extractInput(input);
  const area = executeInstructions(instructions);
  return area;
};

const answer = cachedAnswer ?? `${solve()}`;
if (!cachedAnswer) {
  const filePath = join(__dirname, 'answer.txt');
  fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
}

export default answer;
