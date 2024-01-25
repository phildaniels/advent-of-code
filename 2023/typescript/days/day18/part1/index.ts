import fs, { Dir } from 'fs';
import { join } from 'path';
import input from './data';
import chalk from 'chalk';

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
  hexCode: string;
};

const solve = () => {
  const shouldPrint = false;

  const extractInput = (input: string): Instruction[] => {
    const lines = input.split('\n');
    return lines.map<Instruction>((line) => {
      const [directionString, countString, hexCodeStringWithParentheses] =
        line.split(' ');
      const direction = directionString as Direction;
      const count = +countString;
      const hexCode = hexCodeStringWithParentheses.substring(
        1,
        hexCodeStringWithParentheses.length - 1
      );
      return { direction, count, hexCode };
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

  const printPolygonArrayAsString = (
    polygonArray: string[][],
    positionKeyToColorMap?: Map<string, string>
  ) => {
    const coloredArray = polygonArray.map((line, index) =>
      line.map((char, innerIndex) => {
        const key = `${innerIndex}_${index}`;
        const color = positionKeyToColorMap?.get(key);
        if (!color) {
          return chalk.rgb(0, 0, 0)(char);
        }

        const rgb = hexToRgb(color);
        if (!rgb) {
          return chalk.rgb(0, 0, 0)(char);
        }

        const { r, g, b } = rgb;

        return chalk.rgb(r, g, b)(char);
      })
    );

    if (shouldPrint) {
      console.log('\n');
      console.log(coloredArray.map((line) => line.join('')).join('\n'));
    }
  };

  const normalizeVerticesAndColors = (
    vertices: Array<[Position, string]>,
    xOffset: number,
    yOffset: number
  ) => {
    return vertices.map<[Position, string]>(
      ([[xPosition, yPosition], color]) => [
        [xPosition + xOffset, yPosition + yOffset],
        color,
      ]
    );
  };

  const calcPolygonArea = (
    vertices: Position[],
    arrayWidth: number,
    arrayHeight: number,
    positionKeyToColorMap: Map<string, string>
  ) => {
    const polygonArray = createDotGridOfSize(arrayWidth, arrayHeight);
    printPolygonArrayAsString(polygonArray);
    fillArrayWithPolygonBorder(vertices, polygonArray);
    printPolygonArrayAsString(polygonArray, positionKeyToColorMap);
    fillInteriorOfPolygon(vertices, polygonArray);
    printPolygonArrayAsString(polygonArray, positionKeyToColorMap);

    const countOfHashTags = polygonArray.reduce(
      (accumulator, current) =>
        accumulator +
        current.reduce(
          (innerAccumulator, innerCurrent) =>
            innerAccumulator + (innerCurrent === '#' ? 1 : 0),
          0
        ),
      0
    );

    return countOfHashTags;
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

  const hexToRgb = (hex: string) => {
    const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    return result
      ? {
          r: parseInt(result[1], 16),
          g: parseInt(result[2], 16),
          b: parseInt(result[3], 16),
        }
      : null;
  };

  const executeInstructions = (instructions: Instruction[]) => {
    let position: Position = [0, 0];
    const verticesAndColors: Array<[Position, string]> = [
      [position, instructions[instructions.length - 1].hexCode],
    ];
    const positionKeyToColorMap = new Map<string, string>();
    for (const instruction of instructions) {
      const nextPosition = calculateNextPositionBasedOnInstruction(
        position,
        instruction
      );
      verticesAndColors.push([nextPosition, instruction.hexCode]);
      position = nextPosition;
    }

    const xPositions = verticesAndColors.map(([[xPosition]]) => xPosition);
    const yPositions = verticesAndColors.map(([[, yPosition]]) => yPosition);
    const xOffset = Math.abs(0 - Math.min(...xPositions));
    const yOffset = Math.abs(0 - Math.min(...yPositions));

    const normalizedVerticesAndColors = normalizeVerticesAndColors(
      verticesAndColors,
      xOffset,
      yOffset
    );

    for (let [i, vertexAndColor] of normalizedVerticesAndColors.entries()) {
      const [currentPosition] = vertexAndColor;
      const [nextPosition, nextColor] =
        i === 0
          ? normalizedVerticesAndColors[normalizedVerticesAndColors.length - 1]
          : normalizedVerticesAndColors[
              (i % normalizedVerticesAndColors.length) - 1
            ];
      const [nextXPosition, nextYPosition] = nextPosition;
      const [currentXPosition, currentYPosition] = currentPosition;

      const minX = Math.min(nextXPosition, currentXPosition);
      const maxX = Math.max(nextXPosition, currentXPosition);
      const minY = Math.min(nextYPosition, currentYPosition);
      const maxY = Math.max(nextYPosition, currentYPosition);
      for (let i = minX; i <= maxX; i++) {
        for (let j = minY; j <= maxY; j++) {
          const positionKey = `${i}_${j}`;
          positionKeyToColorMap.set(positionKey, nextColor);
        }
      }
    }

    const arrayWidth = Math.max(...xPositions) + xOffset + 1;
    const arrayHeight = Math.max(...yPositions) + yOffset + 1;
    const vertices = normalizedVerticesAndColors.map(([vertex]) => vertex);
    return calcPolygonArea(
      vertices,
      arrayWidth,
      arrayHeight,
      positionKeyToColorMap
    );
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
