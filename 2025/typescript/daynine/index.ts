import { isYieldExpression } from "typescript";
import {
  doesPolygonFitInsidePolygon,
  getProblemLinesFromText,
  isPointInPolygon,
  positionsIncludePosition,
  type Polygon,
  type Position,
} from "../utils";
import { redis } from "bun";

const lines = await getProblemLinesFromText(__dirname);

const mapInputToPositions = (lines: string[]) =>
  lines.map(
    (line) =>
      line
        .split(",")
        .map((char) => +char)
        .toReversed() as Position
  );

const print = (
  positions: Position[],
  startPosition: Position,
  endPosition: Position
) => {
  let maxX = 0;
  let maxY = 0;
  for (const [xPosition, yPosition] of positions) {
    if (xPosition > maxX) {
      maxX = xPosition;
    }

    if (yPosition > maxY) {
      maxY = yPosition;
    }
  }
  const lines: string[] = [];
  for (let i = 0; i < maxX + 2; i++) {
    const line: string[] = [];
    for (let j = 0; j < maxY + 2; j++) {
      line.push(".");
    }
    lines.push(line.join(""));
  }

  const padding = " ";
  const linesWithTiles = lines.map((line, xPos) =>
    [...line]
      .map((char, yPos) => {
        if (positionsIncludePosition(positions, [xPos, yPos])) {
          return "#";
        }

        return char;
      })
      .join("")
  );

  console.log(
    linesWithTiles
      .map((line) => [...line].map((char) => `${char}${padding}`).join(""))
      .join("\n")
  );
  console.log();

  const modifiedStartX = Math.min(startPosition![0], endPosition![0]);
  const modifiedEndX = Math.max(startPosition![0], endPosition![0]);
  const modifiedStartY = Math.min(startPosition![1], endPosition![1]);
  const modifiedEndY = Math.max(startPosition![1], endPosition![1]);

  for (let i = modifiedStartX; i <= modifiedEndX; i++) {
    const line = [...linesWithTiles[i]!];
    for (let j = modifiedStartY; j <= modifiedEndY; j++) {
      line[j] = "O";
    }

    linesWithTiles[i] = line.join("");
  }

  console.log(
    linesWithTiles
      .map((line) => [...line].map((char) => `${char}${padding}`).join(""))
      .join("\n")
  );
  console.log();
};

type PositionAndColor = [number, number, "red" | "green"];

const positionsIncludePositionAndReturnColor = (
  positionsAndColors: PositionAndColor[],
  [xPosition, yPosition]: Position
) => {
  const match = positionsAndColors.find(
    ([xPos, yPos]) => xPos === xPosition && yPos === yPosition
  );
  if (match) {
    return match[2];
  }

  return undefined;
};

const printEdges = (reds: Position[], greens: Position[]) => {
  const positionsAndColors = [
    ...reds.map<PositionAndColor>((red) => [...red, "red"]),
    ...greens.map<PositionAndColor>((green) => [...green, "green"]),
  ];

  let maxX = 0;
  let maxY = 0;
  for (const [xPosition, yPosition] of positionsAndColors) {
    if (xPosition > maxX) {
      maxX = xPosition;
    }

    if (yPosition > maxY) {
      maxY = yPosition;
    }
  }
  const lines: string[] = [];
  for (let i = 0; i < maxX + 2; i++) {
    const line: string[] = [];
    for (let j = 0; j < maxY + 2; j++) {
      line.push(".");
    }
    lines.push(line.join(""));
  }

  const padding = " ";
  const linesWithTiles = lines.map((line, xPos) =>
    [...line]
      .map((char, yPos) => {
        const color = positionsIncludePositionAndReturnColor(
          positionsAndColors,
          [xPos, yPos]
        );
        if (color) {
          return color === "red" ? "#" : "X";
        }

        return char;
      })
      .join("")
  );
  console.log(
    linesWithTiles
      .map((line) => [...line].map((char) => `${char}${padding}`).join(""))
      .join("\n")
  );
  console.log();
};

const printFilledPolygon = (reds: Position[]) => {
  const polygon: Polygon = reds;

  let maxX = 0;
  let maxY = 0;
  for (const [xPosition, yPosition] of polygon) {
    if (xPosition > maxX) {
      maxX = xPosition;
    }

    if (yPosition > maxY) {
      maxY = yPosition;
    }
  }

  const lines: string[] = [];
  for (let i = 0; i < maxX + 2; i++) {
    const line: string[] = [];
    for (let j = 0; j < maxY + 2; j++) {
      line.push(".");
    }
    lines.push(line.join(""));
  }

  const filledPolygonLines = lines.map((line, xPosition) =>
    [...line]
      .map((char, yPosition) => {
        if (positionsIncludePosition(polygon, [xPosition, yPosition])) {
          return "#";
        }

        if (isPointInPolygon([xPosition, yPosition], polygon)) {
          return "X";
        }

        return char;
      })
      .join("")
  );

  const padding = " ";
  console.log(
    filledPolygonLines
      .map((line) => [...line].map((char) => `${char}${padding}`).join(""))
      .join("\n")
  );
  console.log();
};

const printAndFilledPolygonAndRectangle = (
  reds: Position[],
  startPosition: Position,
  endPosition: Position
) => {
  const polygon: Polygon = reds;

  let maxX = 0;
  let maxY = 0;
  for (const [xPosition, yPosition] of polygon) {
    if (xPosition > maxX) {
      maxX = xPosition;
    }

    if (yPosition > maxY) {
      maxY = yPosition;
    }
  }

  const lines: string[] = [];
  for (let i = 0; i < maxX + 2; i++) {
    const line: string[] = [];
    for (let j = 0; j < maxY + 2; j++) {
      line.push(".");
    }
    lines.push(line.join(""));
  }

  const filledPolygonLines = lines.map((line, xPosition) =>
    [...line]
      .map((char, yPosition) => {
        if (positionsIncludePosition(polygon, [xPosition, yPosition])) {
          return "#";
        }

        if (isPointInPolygon([xPosition, yPosition], polygon)) {
          return "X";
        }

        return char;
      })
      .join("")
  );

  const modifiedStartX = Math.min(startPosition![0], endPosition![0]);
  const modifiedEndX = Math.max(startPosition![0], endPosition![0]);
  const modifiedStartY = Math.min(startPosition![1], endPosition![1]);
  const modifiedEndY = Math.max(startPosition![1], endPosition![1]);

  const padding = " ";
  for (let i = modifiedStartX; i <= modifiedEndX; i++) {
    const line = [...filledPolygonLines[i]!];
    for (let j = modifiedStartY; j <= modifiedEndY; j++) {
      line[j] = "O";
    }

    filledPolygonLines[i] = line.join("");
  }

  console.log(
    filledPolygonLines
      .map((line) => [...line].map((char) => `${char}${padding}`).join(""))
      .join("\n")
  );
  console.log();
};

const partOne = (input: string[]) => {
  const positions = mapInputToPositions(input);

  //   console.log({ positions, maxX, maxY });

  let maxArea = 0;
  //   let startPosition: Position | undefined;
  //   let endPosition: Position | undefined;
  for (let i = 0; i < positions.length; i++) {
    for (let j = 1; j < positions.length; j++) {
      const [leftX, leftY] = positions[i]!;
      const [rightX, rightY] = positions[j]!;

      const width = Math.abs(leftX - rightX) + 1;
      const length = Math.abs(leftY - rightY) + 1;

      const area = width * length;

      if (area > maxArea) {
        maxArea = area;
        // startPosition = positions[i];
        // endPosition = positions[j];
      }
    }
  }

  //   print(positions, startPosition!, endPosition!);

  return maxArea;
};

const getAllPositionsForRectangle = (
  [leftX, leftY]: Position,
  [rightX, rightY]: Position
) => {
  const allPositions: Position[] = [
    [leftX, leftY],
    [leftX, rightY],
    [rightX, rightY],
    [rightX, leftY],
  ];

  return allPositions;
};

type PrecalculatedAreaAndPosition = {
  rectangle: Polygon;
  area: number;
};

const partTwo = (input: string[]) => {
  const positions = mapInputToPositions(input);
  // printFilledPolygon(positions);

  //   console.log({ positions, maxX, maxY });

  // let startPosition: Position | undefined;
  // let endPosition: Position | undefined;

  const precalculatedAreasAndPositions: PrecalculatedAreaAndPosition[] = [];

  for (let i = 0; i < positions.length; i++) {
    for (let j = i + 1; j < positions.length; j++) {
      const left = positions[i]!;
      const [leftX, leftY] = left;
      const right = positions[j]!;
      const [rightX, rightY] = right;

      const width = Math.abs(leftX - rightX) + 1;
      const length = Math.abs(leftY - rightY) + 1;
      const area = width * length;

      const rectangle = getAllPositionsForRectangle(left, right);

      precalculatedAreasAndPositions.push({ rectangle, area });
    }
  }

  precalculatedAreasAndPositions.sort((a, b) => a.area - b.area);
  let maxArea = 0;
  let i = -1;
  while (precalculatedAreasAndPositions.length > 0) {
    i++;
    const { rectangle, area } = precalculatedAreasAndPositions.pop()!;

    const rectangleFitsInsideLargerPolygon = doesPolygonFitInsidePolygon(
      rectangle,
      positions
    );
    if (rectangleFitsInsideLargerPolygon) {
      // startPosition = rectangle[0];
      // endPosition = rectangle[2];
      maxArea = area;
      break;
    }
  }

  if (maxArea === 0) {
    throw "No valid rectangle found!";
  }

  // printFilledPolygon(positions);
  // printAndFilledPolygonAndRectangle(positions, startPosition!, endPosition!);

  return maxArea;
};

export default { partOne: () => partOne(lines), partTwo: () => partTwo(lines) };
