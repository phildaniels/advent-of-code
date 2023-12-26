import input from './data';

type CardValue = 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 11 | 12 | 13 | 14;
enum HandType {
  'FiveOfAKind' = 7,
  'FourOfAKind' = 6,
  'FullHouse' = 5,
  'ThreeOfAKind' = 4,
  'TwoPair' = 3,
  'OnePair' = 2,
  'HighCard' = 1,
}
type Hand = [CardValue, CardValue, CardValue, CardValue, CardValue];

const handStrings = input.split('\n');

const convertCardToNumericValue = (card: string): CardValue => {
  switch (card) {
    case 'A':
      return 14;
    case 'K':
      return 13;
    case 'Q':
      return 12;
    case 'J':
      return 11;
    case 'T':
      return 10;
    default:
      return +card as CardValue;
  }
};

const calculateHandType = (hand: Hand) => {
  const cardToCount: Record<number, number> = {};

  for (let i = 0; i < hand.length; i++) {
    const card = hand[i];

    if (!cardToCount[card]) {
      cardToCount[card] = 0;
    }

    cardToCount[card] = cardToCount[card] + 1;
  }

  const sortedEntries = Object.entries(cardToCount)
    .map(([key, value]) => [+key, value] as [number, number])
    .sort((leftEntry, rightEntry) => {
      const [, leftEntryValue] = leftEntry;
      const [, rightEntryValue] = rightEntry;
      return rightEntryValue - leftEntryValue;
    });

  const [, largestCount] = sortedEntries[0];

  if (largestCount === 1) {
    return HandType.HighCard;
  }

  if (largestCount === 2) {
    const [, secondLargestCount] = sortedEntries[1];
    return secondLargestCount === 2 ? HandType.TwoPair : HandType.OnePair;
  }

  if (largestCount === 3) {
    const [, secondLargestCount] = sortedEntries[1];
    return secondLargestCount === 2
      ? HandType.FullHouse
      : HandType.ThreeOfAKind;
  }

  if (largestCount === 4) {
    return HandType.FourOfAKind;
  }
  return HandType.FiveOfAKind;
};

const leftHandIsStrongerThanRightHand = (
  left: [Hand, HandType],
  right: [Hand, HandType]
) => {
  const [leftHand, leftHandType] = left;
  const [rightHand, rightHandType] = right;

  if (leftHandType > rightHandType) {
    return true;
  }

  if (rightHandType > leftHandType) {
    return false;
  }

  for (let i = 0; i < leftHand.length; i++) {
    const leftCard = leftHand[i];
    const rightCard = rightHand[i];

    if (leftCard > rightCard) {
      return true;
    }

    if (rightCard > leftCard) {
      return false;
    }
  }

  return true;
};

const handAndBids: Array<[Hand, HandType, number]> = [];
for (let i = 0; i < handStrings.length; i++) {
  const handAndBidString = handStrings[i];
  const [handString, bidString] = handAndBidString.split(' ');

  const hand = handString
    .split('')
    .map((cardString) => convertCardToNumericValue(cardString)) as Hand;
  const handType = calculateHandType(hand);
  const bid = +bidString;

  handAndBids.push([hand, handType, bid]);
}

const handsSorted = handAndBids.sort((a, b) => {
  const [aHand, aHandType] = a;
  const [bHand, bHandType] = b;
  return leftHandIsStrongerThanRightHand([aHand, aHandType], [bHand, bHandType])
    ? 1
    : -1;
});

let sum = 0;
for (let i = 0; i < handsSorted.length; i++) {
  const rank = i + 1;
  const [, , bid] = handsSorted[i];
  const scoreByRank = bid * rank;
  sum += scoreByRank;
}

const answer = `${sum}`;

export default answer;
