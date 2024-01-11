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
  type LabelAndFocalLength = { label: string; focalLength: number | undefined };
  type Box = Array<LabelAndFocalLength>;

  const extractLabelsAndFocalLengthsFromBox = (box: Box) => {
    const labels: string[] = [];
    const focalLengths: number[] = [];

    for (let i = 0; i < box.length; i++) {
      const { label, focalLength } = box[i];
      labels.push(label);
      if (focalLength) {
        focalLengths.push(focalLength);
      }
    }

    return [labels, focalLengths] as [string[], number[]];
  };

  const extractLabelAndFocalLengthFromString = (
    s: string
  ): LabelAndFocalLength => {
    if (s.includes('=')) {
      const [label, focalLengthString] = s.split('=');
      const focalLength = +focalLengthString;
      return { label, focalLength };
    }

    const [label] = s.split('-');
    return { label, focalLength: undefined };
  };

  const calculateFocusingPowerOfInitializationSequence = (ss: string[]) => {
    const boxes: Array<Box> = [];
    for (let i = 0; i < 256; i++) {
      boxes.push([] as Box);
    }
    for (let s of ss) {
      const { label, focalLength } = extractLabelAndFocalLengthFromString(s);
      const boxIndex = hashAlgorithm(label);
      const [labels] = extractLabelsAndFocalLengthsFromBox(boxes[boxIndex]);
      const indexOfLabel = labels.indexOf(label);
      if (!focalLength) {
        const indexOfLabel = labels.indexOf(label);
        if (indexOfLabel === -1) {
          continue;
        }
        boxes[boxIndex].splice(indexOfLabel, 1);
        continue;
      }

      if (indexOfLabel !== -1) {
        boxes[boxIndex][indexOfLabel] = { label, focalLength };
        continue;
      }

      boxes[boxIndex].push({ label, focalLength });
    }

    let sum = 0;

    for (let i = 0; i < boxes.length; i++) {
      const box = boxes[i];
      if (box.length === 0) {
        continue;
      }

      for (let j = 0; j < box.length; j++) {
        const { focalLength } = box[j];
        sum += (1 + i) * (j + 1) * focalLength!;
      }
    }

    return sum;
  };

  const initializationSequence = input.split('\n').join('').split(',');
  return calculateFocusingPowerOfInitializationSequence(initializationSequence);
};

const answer = cachedAnswer ?? `${solve()}`;
if (!cachedAnswer) {
  const filePath = join(__dirname, 'answer.txt');
  fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
}

export default answer;
