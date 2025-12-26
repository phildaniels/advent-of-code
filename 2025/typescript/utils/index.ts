export const getProblemText = async (cwd: string) => {
  const data = Bun.file(`${cwd}/data.txt`);
  const text = await data.text();
  return text;
};

const getDelimitedEntries = (text: string, delimiter: string) =>
  text.split(delimiter);

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
