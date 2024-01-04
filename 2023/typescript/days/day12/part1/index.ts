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
  const springsAndGroups: Array<[Array<'?' | '.' | '#'>, number[]]> = [];

  const calculateValidArrangements = (
    springs: Array<'?' | '.' | '#'>,
    group: number[]
  ): number => {
    if (springs.length === 0 && group.length === 0) {
      return 1;
    }

    if (springs.length === 0 && group.length !== 0) {
      return 0;
    }

    const springHead = springs[0];
    const springTail = springs.slice(1);

    if (springHead === '.') {
      return calculateValidArrangements(springTail, group);
    }

    if (springHead === '?') {
      return (
        calculateValidArrangements(['.', ...springTail], group) +
        calculateValidArrangements(['#', ...springTail], group)
      );
    }

    const groupHead = group[0];
    const groupTail = group.slice(1);
    const springsToGroup = springs.slice(0, groupHead) as Array<
      '?' | '.' | '#'
    >;

    if (
      !(
        springsToGroup.length === groupHead &&
        springsToGroup.every((spring) => spring !== '.')
      )
    ) {
      return 0;
    }

    if (groupTail.length > 0 && springs[groupHead] === '#') {
      return 0;
    }

    const springsAfterGroup = springs.slice(groupHead);
    if (groupTail.length > 0) {
      springsAfterGroup.splice(0, 1, '.');
    }

    return calculateValidArrangements(springsAfterGroup, groupTail);
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    const [springString, groupString] = line.split(' ');
    const _springs = springString.split('') as Array<'?' | '.' | '#'>;
    const _group = groupString.split(',').map((char) => +char);
    let springs: Array<'?' | '.' | '#'> = [];
    let group: number[] = [];
    for (let j = 0; j < 1; j++) {
      springs = springs.concat(_springs);
      group = group.concat(_group);
    }
    springsAndGroups.push([springs, group]);
  }
  let sum = 0;
  for (let i = 0; i < springsAndGroups.length; i++) {
    const [springs, group] = springsAndGroups[i];
    const calculation = calculateValidArrangements(springs, group);
    sum += calculation;
  }
  return sum;
};

const answer = cachedAnswer ?? `${solve()}`;
if (!cachedAnswer) {
  const filePath = join(__dirname, 'answer.txt');
  fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
}

export default answer;
