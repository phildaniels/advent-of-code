import { getProblemText } from "../utils";

const text = await getProblemText(__dirname);

const getPresentsAndGrid = (text: string) => {
  const sections = text
    .split("\n\n")
    .flatMap((section) =>
      !section.includes("x") ? [section] : section.split("\n"),
    );
  const gridDtos: Array<{
    width: number;
    height: number;
    presentConfiguration: number[];
  }> = [];
  const presentIndexToAreaLookup: Record<string, number> = {};
  while (sections.length > 0) {
    const section = sections.shift()!;
    if (!section.includes("x")) {
      const [indexWithColon, ...shape] = section.split("\n");
      const [numberPartOfIndex] = indexWithColon!.split(":")!;
      presentIndexToAreaLookup[numberPartOfIndex!] = shape
        .join("")
        .split("")!
        .filter((char) => char === "#").length;
    } else {
      const [gridSize, gridPresents] = section.split(": ");
      const [width, height] = gridSize!.split("x").map((char) => +char);

      const presentConfiguration = gridPresents!
        .trim()
        .split(" ")
        .filter((char) => char !== " ")
        .map((char) => +char);
      gridDtos.push({ width: width!, height: height!, presentConfiguration });
    }
  }

  return { presentIndexToAreaLookup, gridDtos };
};

const partOne = (text: string) => {
  const { presentIndexToAreaLookup, gridDtos } = getPresentsAndGrid(text);

  return gridDtos.reduce((prev, { width, height, presentConfiguration }) => {
    const gridArea = width * height;
    const totalShapeArea = presentConfiguration.reduce(
      (innerPrev, innerCurrent, index) =>
        innerPrev + innerCurrent * presentIndexToAreaLookup[index]!,
      0,
    );

    if (totalShapeArea > gridArea) {
      return prev;
    }

    const totalFullShapesThatCanFit =
      Math.floor(width / 3) * Math.floor(height / 3);

    const totalPresents = presentConfiguration.reduce(
      (innerPrev, innerCurrent) => innerPrev + innerCurrent,
      0,
    );

    if (totalFullShapesThatCanFit >= totalPresents) {
      return prev + 1;
    }

    throw new Error("Case requires complex search");
  }, 0);
};

const partTwo = (text: string) => {
  return "Part two was to solve all other parts";
};

export default { partOne: () => partOne(text), partTwo: () => partTwo(text) };
