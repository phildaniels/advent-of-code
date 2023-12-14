import input from './data';

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

const answer = `${sum}`;

export default answer;
