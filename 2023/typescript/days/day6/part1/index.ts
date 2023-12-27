import fs from 'fs';
import { join } from 'path';
import input from './data';

let cachedAnswer: string | undefined;
try {
  const filePath = join(__dirname, 'answer.txt');
  cachedAnswer = fs.readFileSync(filePath, { encoding: 'utf-8' });
} catch (e) {}

const solve = () => {
  const [timeLineString, distanceLineString] = input.split('\n');

  const timesString = timeLineString.split(':')[1].trim();
  const distancesString = distanceLineString.split(':')[1].trim();

  const times = timesString
    .split(' ')
    .filter((part) => part !== '')
    .map((filtered) => +filtered);
  const distances = distancesString
    .split(' ')
    .filter((part) => part !== '')
    .map((filtered) => +filtered);
  let ways = 1;
  for (let i = 0; i < times.length; i++) {
    const time = times[i];
    const distance = distances[i];

    const potentialDistances: number[] = [];

    for (let j = 0; j < time; j++) {
      const timeHeld = j;
      const speed = timeHeld;
      const timeToTravel = time - timeHeld;
      const distance = speed * timeToTravel;
      potentialDistances.push(distance);
    }

    const countOfRecordBeatingTimes = potentialDistances.filter(
      (potentialDistance) => potentialDistance > distance
    ).length;

    ways = ways * countOfRecordBeatingTimes;
  }

  return ways;
};

const answer = cachedAnswer ?? `${solve()}`;
if (!cachedAnswer) {
  const filePath = join(__dirname, 'answer.txt');
  fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
}

export default answer;
