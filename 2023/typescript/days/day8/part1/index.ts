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
      currentInstruction === 'L'
        ? graphAtCurrentNode[0]
        : graphAtCurrentNode[1];
  }

  return totalSteps;
};

const answer = cachedAnswer ?? `${solve()}`;
if (!cachedAnswer) {
  const filePath = join(__dirname, 'answer.txt');
  fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
}

export default answer;
