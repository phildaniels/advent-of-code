import fs from 'fs';
import { join } from 'path';
import input from './data';

let cachedAnswer: string | undefined;
try {
  const filePath = join(__dirname, 'answer.txt');
  cachedAnswer = fs.readFileSync(filePath, { encoding: 'utf-8' });
} catch (e) {}

const solve = () => {
  const cards = input.split('\n');

  const extractNumbersFromCard = (cards: string[]) => {
    const extractedCards: Array<[number[], number[]]> = [];
    for (let i = 0; i < cards.length; i++) {
      const currentCard = cards[i];
      const rawNumbers = currentCard.split(':')[1].trim();
      const [winningRawNumbers, cardRawNumbers] = rawNumbers
        .split('|')
        .map((raw) => raw.trim());
      const winningNumbers = winningRawNumbers
        .split(' ')
        .map((winningRawNumber) => winningRawNumber.trim())
        .filter((cardTrimedNumber) => cardTrimedNumber !== '')
        .map((nonEmptyTrimmedNumbers) => +nonEmptyTrimmedNumbers);
      const cardNumbers = cardRawNumbers
        .split(' ')
        .map((cardRawNumber) => cardRawNumber.trim())
        .filter((cardTrimedNumber) => cardTrimedNumber !== '')
        .map((nonEmptyTrimmedNumbers) => +nonEmptyTrimmedNumbers);
      extractedCards.push([winningNumbers, cardNumbers]);
    }

    return extractedCards;
  };

  const extractedCards = extractNumbersFromCard(cards);
  let sum = 0;
  for (let i = 0; i < extractedCards.length; i++) {
    const [winningNumbers, cardNumbers] = extractedCards[i];
    const matchingNumbersCount = cardNumbers.filter((cardNumber) =>
      winningNumbers.includes(cardNumber)
    ).length;
    if (matchingNumbersCount > 0) {
      const cardScore = Math.pow(2, matchingNumbersCount - 1);
      sum += cardScore;
    }
  }
  return sum;
};

const answer = cachedAnswer ?? `${solve()}`;
if (!cachedAnswer) {
  const filePath = join(__dirname, 'answer.txt');
  fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
}

export default answer;
