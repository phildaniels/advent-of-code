import input from './data';

const cards = input.split('\n');
type ExtractedCard = {
  index: number;
  winningNumbers: number[];
  cardNumbers: number[];
};

const extractNumbersFromCard = (cards: string[]) => {
  const extractedCards: Array<ExtractedCard> = [];
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
    extractedCards.push({ index: i, winningNumbers, cardNumbers });
  }

  return extractedCards;
};

const extractedCards = extractNumbersFromCard(cards);
const workingList = JSON.parse(
  JSON.stringify(extractedCards)
) as ExtractedCard[];

let totalCount = 0;

while (workingList.length > 0) {
  const currentCard = workingList.pop()!;
  totalCount++;
  const totalWinningNumbers = currentCard.cardNumbers.filter((cardNumber) =>
    currentCard.winningNumbers.includes(cardNumber)
  ).length;

  for (
    let i = currentCard.index + 1;
    i < currentCard.index + 1 + totalWinningNumbers;
    i++
  ) {
    workingList.push(extractedCards[i]);
  }
}

const answer = totalCount.toString();
export default answer;
