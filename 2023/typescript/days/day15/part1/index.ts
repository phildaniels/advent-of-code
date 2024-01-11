import fs from 'fs';
import { join } from 'path';
import input from './data';

let cachedAnswer: string | undefined;
try {
  const filePath = join(__dirname, 'answer.txt');
  cachedAnswer = fs.readFileSync(filePath, { encoding: 'utf-8' });
} catch (e) {}

const solve = () => {
  const hashAlgorithm = (s: string) => {
    let currentValue = 0;
    for (let i = 0; i < s.length; i++) {
      const asciiCode = s.charCodeAt(i);
      currentValue = currentValue + asciiCode;
      currentValue = currentValue * 17;
      currentValue = currentValue % 256;
    }

    return currentValue;
  };

  const calculateSumOfInitalizationSequence = (ss: string[]) => {
    let sum = 0;
    for (let i = 0; i < ss.length; i++) {
      const s = ss[i];
      sum += hashAlgorithm(s);
    }

    return sum;
  };

  const initializationSequence = input.split('\n').join('').split(',');
  return calculateSumOfInitalizationSequence(initializationSequence);
};

const answer = cachedAnswer ?? `${solve()}`;
if (!cachedAnswer) {
  const filePath = join(__dirname, 'answer.txt');
  fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
}

export default answer;
