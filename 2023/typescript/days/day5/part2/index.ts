import fs from 'fs';
import { join } from 'path';
import input from './data';

let cachedAnswer: string | undefined;
try {
  const filePath = join(__dirname, 'answer.txt');
  cachedAnswer = fs.readFileSync(filePath, { encoding: 'utf-8' });
} catch (e) {}

const solve = () => {
  type SourceToDestinationObject = {
    sourceStartIndex: number;
    destinationStartIndex: number;
    range: number;
  };

  type SeedAndRangeObject = {
    seedStartIndex: number;
    range: number;
  };
  const calculateLowestLocation = (input: string) => {
    let index = 0;
    const rows = input.split('\n');

    const seedsString = rows[index].split(':')[1].trim();

    let seedPairs = seedsString.split(' ').map((number) => number.trim());

    const seedAndRanges: SeedAndRangeObject[] = [];
    for (let i = 0; i < seedPairs.length; i++) {
      const seedStartIndex = +seedPairs[i];
      i++;
      const range = +seedPairs[i];
      seedAndRanges.push({ seedStartIndex, range });
    }

    index++;
    index++;
    index++;

    let row = rows[index].trim();
    const parsedSeedToSoilInformation: SourceToDestinationObject[] = [];
    while (row != '') {
      const [destinationStartIndex, sourceStartIndex, range] = row
        .split(' ')
        .map((number) => +number.trim());
      parsedSeedToSoilInformation.push({
        destinationStartIndex,
        sourceStartIndex,
        range,
      });

      index++;
      row = rows[index]?.trim();
    }
    index++;
    index++;

    row = rows[index]?.trim();
    const parsedSoilToFertilizerInformation: SourceToDestinationObject[] = [];
    while (row != '') {
      const [destinationStartIndex, sourceStartIndex, range] = row
        .split(' ')
        .map((number) => +number.trim());
      parsedSoilToFertilizerInformation.push({
        destinationStartIndex,
        sourceStartIndex,
        range,
      });
      index++;
      row = rows[index]?.trim();
    }

    index++;
    index++;

    row = rows[index]?.trim();
    const parsedFertilizerToWaterInformation: SourceToDestinationObject[] = [];
    while (row != '') {
      const [destinationStartIndex, sourceStartIndex, range] = row
        .split(' ')
        .map((number) => +number.trim());
      parsedFertilizerToWaterInformation.push({
        destinationStartIndex,
        sourceStartIndex,
        range,
      });
      index++;
      row = rows[index]?.trim();
    }

    index++;
    index++;
    row = rows[index]?.trim();

    const parsedWaterToLightInformation: SourceToDestinationObject[] = [];
    while (row != '') {
      const [destinationStartIndex, sourceStartIndex, range] = row
        .split(' ')
        .map((number) => +number.trim());
      parsedWaterToLightInformation.push({
        destinationStartIndex,
        sourceStartIndex,
        range,
      });
      index++;
      row = rows[index]?.trim();
    }

    index++;
    index++;
    row = rows[index]?.trim();

    const parsedLightToTemperatureInformation: SourceToDestinationObject[] = [];
    while (row != '') {
      const [destinationStartIndex, sourceStartIndex, range] = row
        .split(' ')
        .map((number) => +number.trim());
      parsedLightToTemperatureInformation.push({
        destinationStartIndex,
        sourceStartIndex,
        range,
      });
      index++;
      row = rows[index]?.trim();
    }

    index++;
    index++;
    row = rows[index]?.trim();

    const parsedTemperatureToHumidityInformation: SourceToDestinationObject[] =
      [];
    while (row != '') {
      const [destinationStartIndex, sourceStartIndex, range] = row
        .split(' ')
        .map((number) => +number.trim());
      parsedTemperatureToHumidityInformation.push({
        destinationStartIndex,
        sourceStartIndex,
        range,
      });
      index++;
      row = rows[index]?.trim();
    }

    index++;
    index++;
    row = rows[index]?.trim();

    const parsedHumidityToLocationInformation: SourceToDestinationObject[] = [];
    while (input === undefined || index < rows.length) {
      const [destinationStartIndex, sourceStartIndex, range] = row
        .split(' ')
        .map((number) => +number.trim());
      parsedHumidityToLocationInformation.push({
        destinationStartIndex,
        sourceStartIndex,
        range,
      });
      index++;
      row = rows[index]?.trim();
    }

    index++;
    index++;
    row = rows[index]?.trim();

    const locations: number[] = [];
    for (let i = 0; i < seedAndRanges.length; i++) {
      const { seedStartIndex, range: seedRange } = seedAndRanges[i];
      const minSeedId = seedStartIndex;
      const maxSeedId = seedStartIndex + seedRange - 1;
      let possibleSoilObjects = parsedSeedToSoilInformation
        .filter(({ sourceStartIndex, range }) => {
          return !(
            sourceStartIndex + range - 1 < minSeedId ||
            sourceStartIndex > maxSeedId
          );
        })
        .map(
          ({
            sourceStartIndex: innerStartIndex,
            range: innerRange,
            destinationStartIndex,
          }) => {
            const newSourceStartIndex = Math.max(minSeedId, innerStartIndex);
            const newMax = Math.min(
              maxSeedId,
              innerStartIndex + innerRange - 1
            );
            const newRange = newMax - newSourceStartIndex;
            const newDestinationStartIndex =
              newSourceStartIndex - innerStartIndex + destinationStartIndex;
            return {
              sourceStartIndex: newSourceStartIndex,
              range: newRange,
              destinationStartIndex: newDestinationStartIndex,
            };
          }
        );
      if (possibleSoilObjects.length === 0) {
        possibleSoilObjects = [
          {
            sourceStartIndex: minSeedId,
            destinationStartIndex: maxSeedId,
            range: seedRange,
          },
        ];
      }

      let possibleFertilizerObjects: SourceToDestinationObject[] = [];
      for (let i = 0; i < possibleSoilObjects.length; i++) {
        const { destinationStartIndex, range } = possibleSoilObjects[i];
        const min = destinationStartIndex;
        const max = destinationStartIndex + range - 1;
        possibleFertilizerObjects = possibleFertilizerObjects.concat(
          parsedSoilToFertilizerInformation
            .filter(
              ({ sourceStartIndex: innerStartIndex, range: innerRange }) => {
                return !(
                  max < innerStartIndex || min > innerStartIndex + innerRange
                );
              }
            )
            .map(
              ({
                sourceStartIndex: innerStartIndex,
                range: innerRange,
                destinationStartIndex,
              }) => {
                const newSourceStartIndex = Math.max(min, innerStartIndex);
                const newMax = Math.min(max, innerStartIndex + innerRange - 1);
                const newRange = newMax - newSourceStartIndex;
                const newDestinationStartIndex =
                  newSourceStartIndex - innerStartIndex + destinationStartIndex;
                return {
                  sourceStartIndex: newSourceStartIndex,
                  range: newRange,
                  destinationStartIndex: newDestinationStartIndex,
                };
              }
            )
        );
      }
      if (possibleFertilizerObjects.length === 0) {
        possibleFertilizerObjects = possibleSoilObjects;
      }

      let possibleWaterObjects: SourceToDestinationObject[] = [];
      for (let i = 0; i < possibleFertilizerObjects.length; i++) {
        const { destinationStartIndex, range } = possibleFertilizerObjects[i];
        const min = destinationStartIndex;
        const max = destinationStartIndex + range - 1;
        possibleWaterObjects = possibleWaterObjects.concat(
          parsedFertilizerToWaterInformation
            .filter(
              ({ sourceStartIndex: innerStartIndex, range: innerRange }) => {
                return !(
                  max < innerStartIndex || min > innerStartIndex + innerRange
                );
              }
            )
            .map(
              ({
                sourceStartIndex: innerStartIndex,
                range: innerRange,
                destinationStartIndex,
              }) => {
                const newSourceStartIndex = Math.max(min, innerStartIndex);
                const newMax = Math.min(max, innerStartIndex + innerRange - 1);
                const newRange = newMax - newSourceStartIndex;
                const newDestinationStartIndex =
                  newSourceStartIndex - innerStartIndex + destinationStartIndex;
                return {
                  sourceStartIndex: newSourceStartIndex,
                  range: newRange,
                  destinationStartIndex: newDestinationStartIndex,
                };
              }
            )
        );
      }
      if (possibleWaterObjects.length === 0) {
        possibleWaterObjects = possibleFertilizerObjects;
      }

      let possibleLightObjects: SourceToDestinationObject[] = [];
      for (let i = 0; i < possibleWaterObjects.length; i++) {
        const { destinationStartIndex, range } = possibleWaterObjects[i];
        const min = destinationStartIndex;
        const max = destinationStartIndex + range - 1;

        possibleLightObjects = possibleLightObjects.concat(
          parsedWaterToLightInformation
            .filter(
              ({ sourceStartIndex: innerStartIndex, range: innerRange }) => {
                return !(
                  max < innerStartIndex || min > innerStartIndex + innerRange
                );
              }
            )
            .map(
              ({
                sourceStartIndex: innerStartIndex,
                range: innerRange,
                destinationStartIndex,
              }) => {
                const newSourceStartIndex = Math.max(min, innerStartIndex);
                const newMax = Math.min(max, innerStartIndex + innerRange - 1);
                const newRange = newMax - newSourceStartIndex;
                const newDestinationStartIndex =
                  newSourceStartIndex - innerStartIndex + destinationStartIndex;
                return {
                  sourceStartIndex: newSourceStartIndex,
                  range: newRange,
                  destinationStartIndex: newDestinationStartIndex,
                };
              }
            )
        );
      }
      if (possibleLightObjects.length === 0) {
        possibleLightObjects = possibleWaterObjects;
      }

      let possibleTemperatureObjects: SourceToDestinationObject[] = [];
      for (let i = 0; i < possibleLightObjects.length; i++) {
        const { destinationStartIndex, range } = possibleLightObjects[i];
        const min = destinationStartIndex;
        const max = destinationStartIndex + range - 1;
        possibleTemperatureObjects = possibleTemperatureObjects.concat(
          parsedLightToTemperatureInformation
            .filter(
              ({ sourceStartIndex: innerStartIndex, range: innerRange }) => {
                return !(
                  max < innerStartIndex || min > innerStartIndex + innerRange
                );
              }
            )
            .map(
              ({
                sourceStartIndex: innerStartIndex,
                range: innerRange,
                destinationStartIndex,
              }) => {
                const newSourceStartIndex = Math.max(min, innerStartIndex);
                const newMax = Math.min(max, innerStartIndex + innerRange - 1);
                const newRange = newMax - newSourceStartIndex;
                const newDestinationStartIndex =
                  newSourceStartIndex - innerStartIndex + destinationStartIndex;
                return {
                  sourceStartIndex: newSourceStartIndex,
                  range: newRange,
                  destinationStartIndex: newDestinationStartIndex,
                };
              }
            )
        );
      }
      if (possibleTemperatureObjects.length === 0) {
        possibleTemperatureObjects = possibleLightObjects;
      }

      let possibleHumidityObjects: SourceToDestinationObject[] = [];
      for (let i = 0; i < possibleTemperatureObjects.length; i++) {
        const { destinationStartIndex, range } = possibleTemperatureObjects[i];
        const min = destinationStartIndex;
        const max = destinationStartIndex + range - 1;
        possibleHumidityObjects = possibleHumidityObjects.concat(
          parsedTemperatureToHumidityInformation
            .filter(
              ({ sourceStartIndex: innerStartIndex, range: innerRange }) => {
                return !(
                  max < innerStartIndex || min > innerStartIndex + innerRange
                );
              }
            )
            .map(
              ({
                sourceStartIndex: innerStartIndex,
                range: innerRange,
                destinationStartIndex,
              }) => {
                const newSourceStartIndex = Math.max(min, innerStartIndex);
                const newMax = Math.min(max, innerStartIndex + innerRange - 1);
                const newRange = newMax - newSourceStartIndex;
                const newDestinationStartIndex =
                  newSourceStartIndex - innerStartIndex + destinationStartIndex;
                return {
                  sourceStartIndex: newSourceStartIndex,
                  range: newRange,
                  destinationStartIndex: newDestinationStartIndex,
                };
              }
            )
        );
      }
      if (possibleHumidityObjects.length === 0) {
        possibleHumidityObjects = possibleTemperatureObjects;
      }

      let possibleLocationObjects: SourceToDestinationObject[] = [];
      for (let i = 0; i < possibleHumidityObjects.length; i++) {
        const { destinationStartIndex, range } = possibleHumidityObjects[i];
        const min = destinationStartIndex;
        const max = destinationStartIndex + range - 1;
        possibleLocationObjects = possibleLocationObjects.concat(
          parsedHumidityToLocationInformation
            .filter(
              ({ sourceStartIndex: innerStartIndex, range: innerRange }) => {
                return !(
                  max < innerStartIndex || min > innerStartIndex + innerRange
                );
              }
            )
            .map(
              ({
                sourceStartIndex: innerStartIndex,
                range: innerRange,
                destinationStartIndex,
              }) => {
                const newSourceStartIndex = Math.max(min, innerStartIndex);
                const newMax = Math.min(max, innerStartIndex + innerRange - 1);
                const newRange = newMax - newSourceStartIndex;
                const newDestinationStartIndex =
                  newSourceStartIndex - innerStartIndex + destinationStartIndex;
                return {
                  sourceStartIndex: newSourceStartIndex,
                  range: newRange,
                  destinationStartIndex: newDestinationStartIndex,
                };
              }
            )
        );
      }
      if (possibleLocationObjects.length === 0) {
        possibleLocationObjects = possibleHumidityObjects;
      }

      const minLocationIds = possibleLocationObjects.map(
        ({ destinationStartIndex }) => destinationStartIndex
      );
      locations.push(...minLocationIds);
    }

    return Math.min(...locations);
  };

  const lowestLocationNumber = calculateLowestLocation(input);
  return lowestLocationNumber;
};

const answer = cachedAnswer ?? `${solve()}`;
if (!cachedAnswer) {
  const filePath = join(__dirname, 'answer.txt');
  fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
}

export default answer;
