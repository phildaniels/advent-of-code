import input from './data';

const data = input.trim();

const lines = data.split('\n\n');

const inventories = lines.map((line) =>
  line.split('\n').map((chars) => +chars)
);

const elfs: number[] = [];
for (let inventory of inventories) {
  const sumOfInventory = inventory.reduce((sum, calory) => sum + calory, 0);
  elfs.push(sumOfInventory);
}

const max = Math.max(...elfs);
const answer = `${max}`;

export default answer;
