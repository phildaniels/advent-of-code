export const getProblemText = async (cwd: string) => {
  const data = Bun.file(`${cwd}/data.txt`);
  const text = await data.text();
  return text;
};

export const getProblemLines = (text: string) => text.split("\n");

export const getProblemLinesFromText = async (cwd: string) => {
  const text = await getProblemText(cwd);
  const lines = getProblemLines(text);
  return lines;
};