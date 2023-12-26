import input from './data';

const lines = input.split('\n');

const sequence = lines[0].split('');

const graph: Record<string, [string, string]> = {};

for (let i = 2; i < lines.length; i++) {
  const line = lines[i];
  const [vertex, nodeString] = line.split(' = ');
  const nodeOne = nodeString.substring(1, 4);
  const nodeTwo = nodeString.substring(6, 9);
  graph[vertex] = [nodeOne, nodeTwo];
}

let totalSteps = 0;
let currentNodesAndOriginalIndexes = Object.keys(graph)
  .filter((key) => key[2] === 'A')
  .map((value, index) => [index, value] as [number, string]);

let instructionsIterator = 0;
let goalsFound = 0;
const totalStartingNodes = currentNodesAndOriginalIndexes.length;
const goalSteps = currentNodesAndOriginalIndexes.map(() => -1);

while (goalsFound != totalStartingNodes) {
  const currentInstruction = sequence[instructionsIterator];
  instructionsIterator++;

  if (!currentInstruction) {
    instructionsIterator = 0;
    continue;
  }
  totalSteps++;
  const currentInstructionIndex = currentInstruction === 'L' ? 0 : 1;
  currentNodesAndOriginalIndexes = currentNodesAndOriginalIndexes.map(
    ([index, current]) => [index, graph[current][currentInstructionIndex]]
  );

  const nodesAtGoal = currentNodesAndOriginalIndexes.filter(
    ([, current]) => current[2] === 'Z'
  );

  if (nodesAtGoal.length === 0) {
    continue;
  }

  for (let i = 0; i < nodesAtGoal.length; i++) {
    const [originalIndex] = nodesAtGoal[i];
    goalSteps[originalIndex] = totalSteps;
    goalsFound++;
  }

  currentNodesAndOriginalIndexes = currentNodesAndOriginalIndexes.filter(
    ([, current]) => current[2] !== 'Z'
  );
}

const gcd = (a: number, b: number) => {
  while (b !== 0) {
    let t = b;
    b = a % b;
    a = t;
  }
  return a;
};

const lcm = (a: number, b: number) => {
  return (a * b) / gcd(a, b);
};

const lcmOfArray = (numbers: number[]) => {
  let multiple = numbers[0];
  for (let i = 1; i < numbers.length; i++) {
    multiple = lcm(multiple, numbers[i]);
  }
  return multiple;
};

const lcmOfGoalSteps = lcmOfArray(goalSteps);

const answer = `${lcmOfGoalSteps}`;
export default answer;
