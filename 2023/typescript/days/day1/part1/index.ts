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
  let sum = 0;
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    let firstNumber: number | undefined;
    let lastNumber: number | undefined;
    for (let j = 0; j < line.length; j++) {
      const char = line[j];
      const charAsNum = +char;
      if (isNaN(charAsNum)) {
        continue;
      }

      if (!firstNumber) {
        firstNumber = charAsNum;
      }

      lastNumber = charAsNum;
    }

    const value = +`${firstNumber}${lastNumber}`;

    sum += value;
  }

  return sum;
};

const answer = cachedAnswer ?? `${solve()}`;
if (!cachedAnswer) {
  const filePath = join(__dirname, 'answer.txt');
  fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
}

export default answer;
