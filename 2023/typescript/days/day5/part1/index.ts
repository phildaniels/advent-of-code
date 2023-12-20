import input from './data';

type SourceToDestinationObject = {
  sourceStartIndex: number;
  destinationStartIndex: number;
  range: number;
};
const calculateLowestLocation = (input: string) => {
  let index = 0;
  const rows = input.split('\n');

  const seedsString = rows[index].split(':')[1].trim();

  let seeds = seedsString.split(' ').map((number) => +number.trim());

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
  for (let i = 0; i < seeds.length; i++) {
    const seedId = seeds[i];
    let seedToSoilObj = parsedSeedToSoilInformation.find(
      ({ sourceStartIndex, range }) =>
        sourceStartIndex <= seedId && seedId <= sourceStartIndex + range
    );
    if (!seedToSoilObj) {
      seedToSoilObj = {
        sourceStartIndex: seedId,
        destinationStartIndex: seedId,
        range: 0,
      };
    }

    const soilId =
      seedId -
      seedToSoilObj.sourceStartIndex +
      seedToSoilObj.destinationStartIndex;
    let soilToFertilizerObj = parsedSoilToFertilizerInformation.find(
      ({ sourceStartIndex, range }) =>
        sourceStartIndex <= soilId && soilId <= sourceStartIndex + range
    );
    if (!soilToFertilizerObj) {
      soilToFertilizerObj = {
        sourceStartIndex: soilId,
        destinationStartIndex: soilId,
        range: 0,
      };
    }

    const fertilizerId =
      soilId -
      soilToFertilizerObj.sourceStartIndex +
      soilToFertilizerObj.destinationStartIndex;
    let fertilizerToWaterObj = parsedFertilizerToWaterInformation.find(
      ({ sourceStartIndex, range }) =>
        sourceStartIndex <= fertilizerId &&
        fertilizerId <= sourceStartIndex + range
    );

    if (!fertilizerToWaterObj) {
      fertilizerToWaterObj = {
        sourceStartIndex: fertilizerId,
        destinationStartIndex: fertilizerId,
        range: 0,
      };
    }

    const waterId =
      fertilizerId -
      fertilizerToWaterObj.sourceStartIndex +
      fertilizerToWaterObj.destinationStartIndex;
    let waterToLightObj = parsedWaterToLightInformation.find(
      ({ sourceStartIndex, range }) =>
        sourceStartIndex <= waterId && waterId <= sourceStartIndex + range
    );

    if (!waterToLightObj) {
      waterToLightObj = {
        sourceStartIndex: waterId,
        destinationStartIndex: waterId,
        range: 0,
      };
    }

    const lightId =
      waterId -
      waterToLightObj.sourceStartIndex +
      waterToLightObj.destinationStartIndex;
    let lightToTemperatureObj = parsedLightToTemperatureInformation.find(
      ({ sourceStartIndex, range }) =>
        sourceStartIndex <= lightId && lightId <= sourceStartIndex + range
    );

    if (!lightToTemperatureObj) {
      lightToTemperatureObj = {
        sourceStartIndex: lightId,
        destinationStartIndex: lightId,
        range: 0,
      };
    }

    const temperatureId =
      lightId -
      lightToTemperatureObj.sourceStartIndex +
      lightToTemperatureObj.destinationStartIndex;
    let temperatureToHumidityObj = parsedTemperatureToHumidityInformation.find(
      ({ sourceStartIndex, range }) =>
        sourceStartIndex <= temperatureId &&
        temperatureId <= sourceStartIndex + range
    );

    if (!temperatureToHumidityObj) {
      temperatureToHumidityObj = {
        sourceStartIndex: temperatureId,
        destinationStartIndex: temperatureId,
        range: 0,
      };
    }

    const humidityId =
      temperatureId -
      temperatureToHumidityObj.sourceStartIndex +
      temperatureToHumidityObj.destinationStartIndex;
    let humidityToLocationObj = parsedHumidityToLocationInformation.find(
      ({ sourceStartIndex, range }) =>
        sourceStartIndex <= humidityId && humidityId <= sourceStartIndex + range
    );

    if (!humidityToLocationObj) {
      humidityToLocationObj = {
        sourceStartIndex: humidityId,
        destinationStartIndex: humidityId,
        range: 0,
      };
    }

    const locationId =
      humidityId -
      humidityToLocationObj.sourceStartIndex +
      humidityToLocationObj.destinationStartIndex;
    locations.push(locationId);
  }

  return Math.min(...locations);
};

const lowestLocationNumber = calculateLowestLocation(input);
const answer = lowestLocationNumber.toString();

export default answer;
