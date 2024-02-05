import input from './data';

const data = input.trim();

const lines = data.split('\n\n');

const inventories = lines.map((line) =>
  line.split('\n').map((chars) => +chars)
);

const getTopNValues = (n: number) => {
  const elfs: number[] = [];
  for (let inventory of inventories) {
    const sumOfInventory = inventory.reduce((sum, calory) => sum + calory, 0);
    elfs.push(sumOfInventory);
  }

  elfs.sort((a, b) => b - a);
  const answer = elfs.slice(0, n).reduce((sum, calory) => sum + calory, 0);
  return answer;
};

const answer = `${getTopNValues(3)}`;
export default answer;
