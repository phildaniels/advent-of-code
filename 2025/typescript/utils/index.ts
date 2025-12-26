export const getProblemText = async (cwd: string) => {
  const data = Bun.file(`${cwd}/data.txt`);
  const text = await data.text();
  return text;
};

const getDelimitedEntries = (text: string, delimiter: string) =>
  text.split(delimiter);

export const chunkString = (str: string, size: number): string[] => {
  const chunks: string[] = [];
  for (let i = 0; i < str.length; i += size) {
    chunks.push(str.slice(i, i + size));
  }
  return chunks;
};

export const getProblemLinesFromText = async (cwd: string) => {
  const text = await getProblemText(cwd);
  const lines = getDelimitedEntries(text, "\n");
  return lines;
};

export const getCommaSeparatedItemsFromText = async (cwd: string) => {
  const text = await getProblemText(cwd);
  const lines = getDelimitedEntries(text, ",");
  return lines;
};
