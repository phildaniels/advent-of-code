import input from './data';

const fixedLookup: Record<string, number> = {
  'A X': 3,
  'A Y': 4,
  'A Z': 8,
  'B X': 1,
  'B Y': 5,
  'B Z': 9,
  'C X': 2,
  'C Y': 6,
  'C Z': 7,
};

const grandTotal = input
  .split('\n')
  .reduce((total, current) => total + fixedLookup[current]!, 0);

const answer = `${grandTotal}`;

export default answer;
