import input from './data';

const lookup: Record<string, number> = {
  AX: 1 + 3,
  AY: 2 + 6,
  AZ: 3 + 0,
  BX: 1 + 0,
  BY: 2 + 3,
  BZ: 3 + 6,
  CX: 1 + 6,
  CY: 2 + 0,
  CZ: 3 + 3,
};

const lines = input.split('\n');

const trimmed = lines.map((pair) => {
  return pair.replace(/\s/g, '');
});

const scores = trimmed.map((secretScore) => {
  return lookup[secretScore]!;
});

const grandTotal = scores.reduce((total, current) => {
  return total + current;
}, 0);

const answer = `${grandTotal}`;

export default answer;
