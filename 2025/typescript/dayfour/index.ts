import { getProblemLinesFromText, getAdjacentCells } from "../utils";

const lines = await getProblemLinesFromText(__dirname);

const partOne = (lines: string[]) => {
  let count = 0;
  for (let xPosition = 0; xPosition < lines.length; xPosition++) {
    const line = lines[xPosition]!;
    for (let yPosition = 0; yPosition < line.length; yPosition++) {
      const currentValue = lines![xPosition]![yPosition]!;
      if (currentValue !== "@") {
        continue;
      }

      const adjacentPositions = getAdjacentCells([xPosition, yPosition], lines);
      //   console.log({
      //     xPosition,
      //     yPosition,
      //     adjacentPositions: adjacentPositions
      //       .filter(([, v]) => v === "@")
      //       .map(([[x, y], val]) => `(${x}, ${y}): ${val}`),
      //     length: adjacentPositions
      //       .filter(([, v]) => v === "@")
      //       .map(([[x, y], val]) => `(${x}, ${y}): ${val}`).length,
      //   });
      if (adjacentPositions.filter(([, value]) => value === "@").length < 4) {
        count++;
      }
    }
  }

  return count;
};

const partTwo = (lines: string[]) => {
  let removedCount = 0;
  let z = 0;
  let count: number | undefined;

  while (count !== 0) {
    // console.log("\n");
    // console.log(lines.join("\n"));
    let positionsThatCanBeRemoved = new Set<string>();
    count = 0;
    for (let xPosition = 0; xPosition < lines.length; xPosition++) {
      for (let xPosition = 0; xPosition < lines.length; xPosition++) {
        const line = lines[xPosition]!;
        for (let yPosition = 0; yPosition < line.length; yPosition++) {
          const currentValue = lines![xPosition]![yPosition]!;
          if (currentValue !== "@") {
            continue;
          }

          const adjacentPositions = getAdjacentCells(
            [xPosition, yPosition],
            lines
          );
          if (
            adjacentPositions.filter(([, value]) => value === "@").length < 4
          ) {
            count++;
            positionsThatCanBeRemoved.add(`${xPosition}_${yPosition}`);
          }
        }
      }
    }

    [...positionsThatCanBeRemoved].forEach((key) => {
      const [xPos, yPos] = key.split("_").map((s) => +s) as [number, number];
      const line = lines[xPos]!;
      const newLine = line
        .split("")
        .map((val, index) => (index === yPos ? "." : val))
        .join("");
      lines[xPos] = newLine;
    });

    removedCount += positionsThatCanBeRemoved.size;

    // console.log(`iteration`, z, "removed", removedCount);

    z++;
  }
  return removedCount;
};

export default { partOne: () => partOne(lines), partTwo: () => partTwo(lines) };
