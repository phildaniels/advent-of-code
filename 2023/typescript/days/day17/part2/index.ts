import fs from 'fs';
import { join } from 'path';
import puzzleInput from './data';

let cachedAnswer: string | undefined;
try {
  const filePath = join(__dirname, 'answer.txt');
  cachedAnswer = fs.readFileSync(filePath, { encoding: 'utf-8' });
} catch (e) {}

const solve = () => {
  type PriorityQueueItem<TValue> = { priority: number; value: TValue };

  type PriorityQueueComparator<TValue> = (
    a: PriorityQueueItem<TValue>,
    b: PriorityQueueItem<TValue>
  ) => number;

  class PriorityArray<TValue> {
    constructor(
      private items: Array<PriorityQueueItem<TValue>> = [],
      private priorityComparator: PriorityQueueComparator<TValue> = (a, b) =>
        a.priority - b.priority
    ) {
      items.sort(priorityComparator);
    }

    push(...items: Array<PriorityQueueItem<TValue>>): void {
      this.items.push(...items);
      this.items.sort(this.priorityComparator);
    }

    pop(): TValue | undefined {
      return this.items.shift()?.value;
    }

    get length() {
      return this.items.length;
    }
  }

  type QueueNode = {
    position: Position;
    direction: Direction;
    stepsInThatDirection: number;
    pathCost: number;
  };

  type Position = [number, number];

  type Direction = 'up' | 'down' | 'left' | 'right';

  type Neighbor = {
    position: Position;
    cost: number;
    direction: Direction;
  };

  type Heuristic = (
    position: Position,
    goalPosition: Position,
    input: string[]
  ) => number;

  const getKeyFromPosition = ([xPosition, yPosition]: Position) =>
    `${xPosition}_${yPosition}`;

  const getValueFromInputByPosition = (
    [xPosition, yPosition]: Position,
    input: string[]
  ) => {
    const result = input[yPosition]?.[xPosition];
    if (!result) {
      return undefined;
    }

    return +result;
  };

  const positionsAreEqual = (
    [leftX, leftY]: Position,
    [rightX, rightY]: Position
  ) => leftX === rightX && leftY === rightY;

  const getOppositeDirection = (direction: Direction): Direction => {
    switch (direction) {
      case 'up': {
        return 'down';
      }

      case 'right': {
        return 'left';
      }

      case 'down': {
        return 'up';
      }

      case 'left': {
        return 'right';
      }

      default: {
        return direction;
      }
    }
  };

  const getNeighbors = (
    [xPosition, yPosition]: Position,
    direction: Direction,
    stepsInThatDirection: number,
    minConsecutiveStepsAllowed: number,
    maxConsecutiveStepsAllowed: number,
    input: string[]
  ) => {
    const up: [Position, Direction] = [[xPosition, yPosition - 1], 'up'];
    const right: [Position, Direction] = [[xPosition + 1, yPosition], 'right'];
    const down: [Position, Direction] = [[xPosition, yPosition + 1], 'down'];
    const left: [Position, Direction] = [[xPosition - 1, yPosition], 'left'];

    return [up, right, down, left]
      .filter(([neighborPosition, neighborDirection]) => {
        const cost = getValueFromInputByPosition(neighborPosition, input);
        // can't go backwards
        const oppositeDirection = getOppositeDirection(direction);
        if (neighborDirection === oppositeDirection) {
          return false;
        }

        // out of bounds
        if (cost === undefined) {
          return false;
        }

        // more than maxConsecutiveStepsAllowed moves in the same direction
        if (neighborDirection === direction) {
          return stepsInThatDirection < maxConsecutiveStepsAllowed
            ? true
            : false;
        }

        // otherwise to turn, have to travel minConsecutiveStepsAllowed
        return stepsInThatDirection >= minConsecutiveStepsAllowed
          ? true
          : false;
      })
      .map<Neighbor>(([validNeighborPosition, validNeighborDirection]) => ({
        position: validNeighborPosition,
        direction: validNeighborDirection,
        cost: getValueFromInputByPosition(validNeighborPosition, input)!,
      }));
  };

  const modifiedAStarShortestPath = (
    startPosition: Position,
    endPosition: Position,
    minConsecutiveStepsAllowed: number,
    maxConsecutiveStepsAllowed: number,
    input: string[],
    heuristic: Heuristic = () => 0
  ) => {
    const frontier = new PriorityArray<QueueNode>();
    const visited = new Set<string>();
    frontier.push(
      {
        priority: 0,
        value: {
          position: startPosition,
          pathCost: 0,
          direction: 'right',
          stepsInThatDirection: 0,
        },
      },
      {
        priority: 0,
        value: {
          position: startPosition,
          pathCost: 0,
          direction: 'down',
          stepsInThatDirection: 0,
        },
      }
    );
    while (frontier.length > 0) {
      const value = frontier.pop()!;
      const { position, direction, stepsInThatDirection, pathCost } = value;

      if (
        positionsAreEqual(position, endPosition) &&
        stepsInThatDirection >= minConsecutiveStepsAllowed
      ) {
        return pathCost;
      }

      const positionKey = getKeyFromPosition(position);
      const visitedKey = `$${positionKey}-${direction}-${stepsInThatDirection}`;
      if (visited.has(visitedKey)) {
        continue;
      }
      visited.add(visitedKey);

      const neighbors = getNeighbors(
        position,
        direction,
        stepsInThatDirection,
        minConsecutiveStepsAllowed,
        maxConsecutiveStepsAllowed,
        input
      );

      const itemsToQueue = neighbors.map<PriorityQueueItem<QueueNode>>(
        ({
          position: neighborPosition,
          cost: neighborCost,
          direction: neighborDirection,
        }) => ({
          priority:
            pathCost +
            neighborCost +
            heuristic(neighborPosition, endPosition, input),
          value: {
            position: neighborPosition,
            direction: neighborDirection,
            pathCost: pathCost + neighborCost,
            stepsInThatDirection:
              direction === neighborDirection ? stepsInThatDirection + 1 : 1,
          },
        })
      );

      frontier.push(...itemsToQueue);
    }

    return -1;
  };

  const input = puzzleInput.split('\n');
  const startPosition: Position = [0, 0];
  const endPosition: Position = [input.length - 1, input[0].length - 1];

  const answer = modifiedAStarShortestPath(
    startPosition,
    endPosition,
    4,
    10,
    input
  );
  return answer;
};

const answer = cachedAnswer ?? `${solve()}`;
if (!cachedAnswer) {
  const filePath = join(__dirname, 'answer.txt');
  fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
}

export default answer;
