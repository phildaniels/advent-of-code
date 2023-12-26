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

const starting = 'AAA';

let current = starting;
let totalSteps = 0;
let instructionsIterator = 0;
while (current !== 'ZZZ') {
  const currentInstruction = sequence[instructionsIterator];
  instructionsIterator++;

  if (!currentInstruction) {
    instructionsIterator = 0;
    continue;
  }
  totalSteps++;
  const graphAtCurrentNode = graph[current];
  current =
    currentInstruction === 'L' ? graphAtCurrentNode[0] : graphAtCurrentNode[1];
}

const answer = `${totalSteps}`;
export default answer;
