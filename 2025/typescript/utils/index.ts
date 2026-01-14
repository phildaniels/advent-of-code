import { Temporal } from "@js-temporal/polyfill";
import { isTemplateExpression } from "typescript";

export const getFileText = async (cwd: string, fileName: string) => {
  const data = Bun.file(`${cwd}/${fileName}`);
  const text = await data.text();
  return text;
};

export const getProblemText = (cwd: string) => getFileText(cwd, "data.txt");

export const writeText = async (
  cwd: string,
  fileName: string,
  text: string
) => {
  try {
    const file = Bun.file(`${cwd}/${fileName}`);
    await file.write(text);
  } catch (e) {
    console.error(e);
  }
};

const getDelimitedEntries = (text: string, delimiter: string) =>
  text.split(delimiter);

export const chunkString = (str: string, size: number): string[] => {
  const chunks: string[] = [];
  for (let i = 0; i < str.length; i += size) {
    chunks.push(str.slice(i, i + size));
  }
  return chunks;
};

export const getProblemLinesFromText = async (cwd: string) => {
  const text = await getProblemText(cwd);
  const lines = getDelimitedEntries(text, "\n");
  return lines;
};

export const getCommaSeparatedItemsFromText = async (cwd: string) => {
  const text = await getProblemText(cwd);
  const lines = getDelimitedEntries(text, ",");
  return lines;
};

export type CachedEntry<T extends Record<string, unknown>> = {
  timeToLive: number;
  entry: T;
};

export type Answer = { partOne?: number; partTwo?: number };

export type Answers = Record<number, Answer | undefined>;

export const getCachedAnswers = async (cwd: string) => {
  try {
    const text = await getFileText(cwd, "answers.txt");

    const { timeToLive, entry: answers }: CachedEntry<Answers> =
      JSON.parse(text);

    if (Temporal.Now.instant().epochMilliseconds > timeToLive) {
      console.log("cache went stale!");
      return undefined;
    }

    return answers;
  } catch {
    return undefined;
  }
};

export const writeCachedAnswers = async (cwd: string, answers: Answers) => {
  const modifiedAnswers = Object.fromEntries(
    Object.entries(answers).filter(([, value]) => value !== undefined)
  );

  const duration = Temporal.Duration.from({ hours: 24 });
  const cacheEntry: CachedEntry<Answers> = {
    timeToLive: Temporal.Now.instant().add(duration).epochMilliseconds,
    entry: modifiedAnswers,
  };

  await writeText(cwd, "answers.txt", JSON.stringify(cacheEntry));
};

export type Position = [number, number];

export const getAdjacentCells = (
  [xPosition, yPosition]: Position,
  lines: string[]
) => {
  const positions: Array<[number, number]> = [
    [xPosition, yPosition + 1],
    [xPosition, yPosition - 1],
    [xPosition + 1, yPosition],
    [xPosition + 1, yPosition + 1],
    [xPosition + 1, yPosition - 1],
    [xPosition - 1, yPosition],
    [xPosition - 1, yPosition + 1],
    [xPosition - 1, yPosition - 1],
  ];
  return positions
    .map(([xPos, yPos]) => {
      const newTuple: [Position, string | undefined] = [
        [xPos, yPos],
        lines[xPos]?.[yPos],
      ];
      return newTuple;
    })
    .filter((tuple): tuple is [Position, string] => {
      const [, value] = tuple;
      return !!value;
    });
};

export const positionsIncludePosition = (
  positions: Position[],
  [xPosition, yPosition]: Position
) =>
  positions.some(
    ([currentX, currentY]) => currentX === xPosition && currentY === yPosition
  );

export const getPositionVisuallyBelowCurrentPosition = (
  [currentX, currentY]: Position,
  lines: string[]
) => {
  const belowPosition: Position = [currentX + 1, currentY];

  if (lines[belowPosition[0]]?.[belowPosition[1]]) {
    return belowPosition;
  }

  return undefined;
};

export const getPositionsVisuallyLeftAndRightOfCurrentPosition = (
  [currentX, currentY]: Position,
  lines: string[]
) => {
  const left: Position = [currentX, currentY - 1];
  const right: Position = [currentX, currentY + 1];

  const leftValid = !!lines[left[0]]?.[left[1]];
  const rightValid = !!lines[right[0]]?.[right[1]];

  const positionsToReturn: Position[] = [];

  if (leftValid) {
    positionsToReturn.push(left);
  }

  if (rightValid) {
    positionsToReturn.push(right);
  }

  return positionsToReturn;
};

export const generateKeyFromPosition = ([positionX, positionY]: Position) =>
  `${positionX}_${positionY}`;

export const generatePositionFromKey = (key: string) => {
  const numbers = key.split("_").map((char) => +char);
  if (numbers.length !== 2) {
    throw `Invalid key ${key}`;
  }

  return numbers;
};

export type Coordinate = [number, number, number];

export const sortCoordinatesInPlace = (coordinates: Coordinate[]) =>
  coordinates.sort(([aX, aY, aZ], [bX, bY, bZ]) => {
    if (aX === bX) {
      if (aY === bY) {
        return aZ - bZ;
      }

      return aY - bY;
    }

    return aX - bX;
  });

export const getDistanceBetweenCoordinates = (
  [leftX, leftY, leftZ]: Coordinate,
  [rightX, rightY, rightZ]: Coordinate
) => {
  const deltaX = Math.abs(leftX - rightX);
  const deltaY = Math.abs(leftY - rightY);
  const deltaZ = Math.abs(leftZ - rightZ);

  const deltaXSquared = deltaX * deltaX;
  const deltaYSquared = deltaY * deltaY;
  const deltaZSquared = deltaZ * deltaZ;

  const straightLineDistance = Math.sqrt(
    deltaXSquared + deltaYSquared + deltaZSquared
  );

  return straightLineDistance;
};

export const generateKeyFromCoordinate = ([x, y, z]: Coordinate) =>
  `${x},${y},${z}`;

export const generateCompoundKeyFromCoordinates = (
  left: Coordinate,
  right: Coordinate
) => {
  const [leftX, leftY, leftZ] = left;
  const [rightX, rightY, rightZ] = right;

  const [finalLeft, finalRight] =
    leftX === rightX
      ? leftY === rightY
        ? leftZ === rightZ
          ? [left, right]
          : leftZ > rightZ
          ? [left, right]
          : [right, left]
        : leftY > rightY
        ? [left, right]
        : [right, left]
      : leftX > rightX
      ? [left, right]
      : [right, left];

  return `${generateKeyFromCoordinate(finalLeft)}_${generateKeyFromCoordinate(
    finalRight
  )}`;
};
export const generateCoordinateFromKey = (key: string) => {
  const numbers = key.split(",").map((char) => +char);
  if (numbers.length !== 3) {
    throw `Invalid key ${key}`;
  }

  return numbers;
};

export const getExhaustiveCoordinateDistances = (coordinates: Coordinate[]) => {
  const distances = new Map<string, number>();

  for (let i = 0; i < coordinates.length; i++) {
    const left = coordinates[i]!;
    for (let j = i + 1; j < coordinates.length; j++) {
      const right = coordinates[j]!;

      const distance = getDistanceBetweenCoordinates(left, right);
      const key = generateCompoundKeyFromCoordinates(left, right);
      distances.set(key, distance);
    }
  }

  return distances;
};

export type Polygon = Position[];
const isPositionOnLineSegment = (
  [xPosition, yPosition]: Position,
  [lineStartX, lineStartY]: Position,
  [lineEndX, lineEndY]: Position
) => {
  const crossProduct =
    (yPosition - lineStartY) * (lineEndX - lineStartX) -
    (xPosition - lineStartX) * (lineEndY - lineStartY);
  if (crossProduct !== 0) {
    return false;
  }

  if (
    xPosition < Math.min(lineStartX, lineEndX) ||
    xPosition > Math.max(lineStartX, lineEndX)
  ) {
    return false;
  }
  if (
    yPosition < Math.min(lineStartY, lineEndY) ||
    yPosition > Math.max(lineStartY, lineEndY)
  ) {
    return false;
  }

  return true;
};

export const isPointInPolygon = (position: Position, polygon: Polygon) => {
  const [xPosition, yPosition] = position;

  for (let i = 0; i < polygon.length; i++) {
    const current = polygon[i]!;
    const next = polygon[(i + 1) % polygon.length]!;

    if (isPositionOnLineSegment(position, current, next)) {
      return true;
    }
  }

  let intersections = 0;

  for (let i = 0; i < polygon.length; i++) {
    const [x1, y1] = polygon[i]!;
    const [x2, y2] = polygon[(i + 1) % polygon.length]!;

    if (y1 > yPosition !== y2 > yPosition) {
      const xIntersect = x1 + ((yPosition - y1) * (x2 - x1)) / (y2 - y1);

      if (xPosition < xIntersect) {
        intersections++;
      }
    }
  }

  return intersections % 2 === 1;
};

const getCrossProduct = (
  [leftX, leftY]: Position,
  [rightX, rightY]: Position
) => {
  return leftX * rightY - leftY * rightX;
};

const doEdgesIntersect = (
  [leftStart, leftEnd]: [Position, Position],
  [rightStart, rightEnd]: [Position, Position]
) => {
  const d1 = getCrossProduct(
    [rightEnd[0] - rightStart[0], rightEnd[1] - rightStart[1]],
    [leftStart[0] - rightStart[0], leftStart[1] - rightStart[1]]
  );
  const d2 = getCrossProduct(
    [rightEnd[0] - rightStart[0], rightEnd[1] - rightStart[1]],
    [leftEnd[0] - rightStart[0], leftEnd[1] - rightStart[1]]
  );
  const d3 = getCrossProduct(
    [leftEnd[0] - leftStart[0], leftEnd[1] - leftStart[1]],
    [rightStart[0] - leftStart[0], rightStart[1] - leftStart[1]]
  );
  const d4 = getCrossProduct(
    [leftEnd[0] - leftStart[0], leftEnd[1] - leftStart[1]],
    [rightEnd[0] - leftStart[0], rightEnd[1] - leftStart[1]]
  );

  if (
    ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
    ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0))
  ) {
    return true;
  }

  if (d1 === 0 && isPositionOnLineSegment(leftStart, rightStart, rightEnd)) {
    return true;
  }
  if (d2 === 0 && isPositionOnLineSegment(leftEnd, rightStart, rightEnd)) {
    return true;
  }
  if (d3 === 0 && isPositionOnLineSegment(rightStart, leftStart, leftEnd)) {
    return true;
  }
  if (d4 === 0 && isPositionOnLineSegment(rightEnd, leftStart, leftEnd)) {
    return true;
  }

  return false;
};

export const doesPolygonFitInsidePolygon = (
  innerPolygon: Polygon,
  outerPolygon: Polygon
) => {
  // Check all vertices of inner polygon are inside outer polygon
  for (const vertex of innerPolygon) {
    if (!isPointInPolygon(vertex, outerPolygon)) {
      return false;
    }
  }

  // Check no edges intersect (cross each other)
  for (let i = 0; i < innerPolygon.length; i++) {
    const innerEdge: [Position, Position] = [
      innerPolygon[i]!,
      innerPolygon[(i + 1) % innerPolygon.length]!,
    ];

    for (let j = 0; j < outerPolygon.length; j++) {
      const outerEdge: [Position, Position] = [
        outerPolygon[j]!,
        outerPolygon[(j + 1) % outerPolygon.length]!,
      ];

      if (doEdgesIntersect(innerEdge, outerEdge)) {
        // Edges on the boundary are OK, true intersections are not
        const innerOnOuter =
          isPositionOnLineSegment(innerEdge[0], outerEdge[0], outerEdge[1]) ||
          isPositionOnLineSegment(innerEdge[1], outerEdge[0], outerEdge[1]);
        const outerOnInner =
          isPositionOnLineSegment(outerEdge[0], innerEdge[0], innerEdge[1]) ||
          isPositionOnLineSegment(outerEdge[1], innerEdge[0], innerEdge[1]);

        if (!innerOnOuter && !outerOnInner) {
          return false;
        }
      }
    }
  }

  return true;
};

export type SearchOptions<T> = {
  initialItems: T[];
  maxIterations?: number;
  getNextItems: (
    currentItem: T,
    iteration: number,
    remainingFrontier: T[]
  ) => T[] | Promise<T[]>;
  targetFound: (
    item: T,
    iteration: number,
    remainingFrontier: T[]
  ) => boolean | Promise<boolean>;
  onTargetFound: (
    item: T,
    iteration: number,
    remainingFrontier: T[]
  ) => void | Promise<void>;
  continueOnTargetFound?: boolean;
} & (
  | {
      prune: true;
      getItemKey?: (item: T) => string;
      shouldPrune: (
        item: T,
        iteration: number,
        remainingFrontier: T[]
      ) => boolean | Promise<boolean>;
      checkTargetBeforePrune?: boolean;
    }
  | { prune: false }
) &
  (
    | {
        algorithm: "BFS" | "DFS";
      }
    | {
        algorithm: "ASTAR";
        heuristicFunction: (item: T) => number;
        heuristicPriority: "lowest" | "highest";
      }
  );

const getNextItemFromFrontier = <T>(
  frontier: T[],
  options: SearchOptions<T>
) => {
  switch (options.algorithm) {
    case "BFS": {
      return frontier.shift();
    }

    case "DFS": {
      return frontier.pop();
    }

    case "ASTAR": {
      const heuristicFunction = options.heuristicFunction;
      const heuristicPriority = options.heuristicPriority;
      frontier.sort((a, b) =>
        heuristicPriority === "highest"
          ? heuristicFunction(b) - heuristicFunction(a)
          : heuristicFunction(a) - heuristicFunction(b)
      );
      return frontier.pop();
    }
  }
};

export const search = async <T>(options: SearchOptions<T>) => {
  const {
    initialItems: frontier,
    maxIterations,
    targetFound,
    onTargetFound,
    continueOnTargetFound,
    getNextItems,
    prune,
  } = options;
  const processed = new Set<string>();
  let iteration = 0;
  while (frontier.length > 0) {
    iteration++;
    if (maxIterations !== undefined && maxIterations < iteration) {
      break;
    }
    const current = getNextItemFromFrontier(frontier, options)!;

    if (prune) {
      if (options.checkTargetBeforePrune) {
        if (await targetFound(current, iteration, frontier)) {
          await onTargetFound(current, iteration, frontier);
          if (continueOnTargetFound) {
            continue;
          } else {
            break;
          }
        }
      }

      if (options.getItemKey) {
        const key = options.getItemKey(current);
        if (processed.has(key)) {
          continue;
        }

        processed.add(key);
      }

      if (
        options.shouldPrune &&
        (await options.shouldPrune(current, iteration, frontier))
      ) {
        continue;
      }
    }

    if (await targetFound(current, iteration, frontier)) {
      await onTargetFound(current, iteration, frontier);
      if (options.continueOnTargetFound) {
        continue;
      } else {
        break;
      }
    }

    const nextItems = await getNextItems(current, iteration, frontier);
    frontier.push(...nextItems);
  }
};

export const areArraysEqual = <T>(left: T[], right: T[]) => {
  if ((!left && right) || (!right && left)) {
    return false;
  }

  if (left.length !== right.length) {
    return false;
  }

  for (let i = 0; i < left.length; i++) {
    if (left[i] !== right[i]) {
      return false;
    }
  }

  return true;
};
