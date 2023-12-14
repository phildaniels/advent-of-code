import data from './data';

type GameInformation = {
  redMaxCount: number;
  blueMaxCount: number;
  greenMaxCount: number;
};
const parseInputData = (s: string) => {
  const games = s.split('\n');
  const gameToGameInformationDictionary: Record<number, GameInformation> = {};
  for (let i = 0; i < games.length; i++) {
    const game = games[i];
    let redMaxCount = 0;
    let blueMaxCount = 0;
    let greenMaxCount = 0;
    const gameDataString = game.split(':')[1].trim();
    const bagPulls = gameDataString.split(';');
    for (let j = 0; j < bagPulls.length; j++) {
      const bagPull = bagPulls[j].trim();
      const colorStrings = bagPull.split(',');
      for (let k = 0; k < colorStrings.length; k++) {
        let colorString = colorStrings[k].trim();
        let [numberString, color] = colorString.split(' ');
        const number = +numberString;
        switch (color) {
          case 'blue':
            blueMaxCount = number > blueMaxCount ? number : blueMaxCount;
            break;

          case 'red':
            redMaxCount = number > redMaxCount ? number : redMaxCount;
            break;

          default:
            greenMaxCount = number > greenMaxCount ? number : greenMaxCount;
            break;
        }
      }

      gameToGameInformationDictionary[i + 1] = {
        redMaxCount,
        blueMaxCount,
        greenMaxCount,
      };
    }
  }

  return gameToGameInformationDictionary;
};

const parsedInputData = parseInputData(data);

const redCubes = 12;
const greenCubes = 13;
const blueCubes = 14;

const answer = Object.entries(parsedInputData)
  .filter(([, value]) => {
    const { redMaxCount, blueMaxCount, greenMaxCount } = value;
    return !(
      redMaxCount > redCubes ||
      greenMaxCount > greenCubes ||
      blueMaxCount > blueCubes
    );
  })
  .reduce((acc, prev) => +prev[0] + acc, 0)
  .toString();

export default answer;
