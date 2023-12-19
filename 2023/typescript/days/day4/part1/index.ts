import input from './data';

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

const answer = sum.toString();
export default answer;
