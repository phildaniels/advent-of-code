import input from './data';

const [timeLineString, distanceLineString] = input.split('\n');

const timesString = timeLineString.split(':')[1].trim();
const distancesString = distanceLineString.split(':')[1].trim();

const time = BigInt(
  timesString
    .split(' ')
    .filter((part) => part !== '')
    .join('')
);
const distance = BigInt(
  `-${distancesString
    .split(' ')
    .filter((part) => part !== '')
    .join('')}`
);

const newtonIteration = (n: bigint, x0: bigint): bigint => {
  const x1 = (n / x0 + x0) >> 1n;
  if (x0 === x1 || x0 === x1 - 1n) {
    return x0;
  }
  return newtonIteration(n, x1);
};

const sqrtBigInt = (value: bigint) => {
  if (value < 0n) {
    throw 'square root of negative numbers is not supported';
  }

  if (value < 2n) {
    return value;
  }

  return newtonIteration(value, 1n);
};

const quadraticFormula = (a: bigint, b: bigint, c: bigint) => {
  const rootOne = (-b + sqrtBigInt(b * b - 4n * a * c)) / (2n * a);
  const rootTwo = (-b - sqrtBigInt(b * b - 4n * a * c)) / (2n * a);
  return [rootOne, rootTwo] as [bigint, bigint];
};

const a = -1n;
const b = time;
const c = distance;

const [rootOne, rootTwo] = quadraticFormula(a, b, c);

const largerRoot = rootOne > rootTwo ? rootOne : rootTwo;
const smallerRoot = rootOne > rootTwo ? rootTwo : rootOne;

const difference = largerRoot - smallerRoot + 1n;

const answer = `${difference}`;

export default answer;
