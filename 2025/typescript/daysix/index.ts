import { main } from "bun";
import { getProblemLinesFromText } from "../utils";

const lines = await getProblemLinesFromText(__dirname);

type ArithmeticOperation = {
  operationType: "+" | "*";
  numbers: number[];
};

const evaluateArithmeticOperation = ({
  operationType,
  numbers,
}: ArithmeticOperation) => {
  switch (operationType) {
    case "*":
      return numbers.reduce((previous, current) => previous * current, 1);
    case "+":
      return numbers.reduce((previous, current) => previous + current, 0);
  }
};

const evaluateArithmeticOperationUsingCephalopodMath = ({
  operationType,
  numbers,
}: ArithmeticOperation) => {
  let maxLength = 0;
  const numbersAsStrings = numbers.map((num) => {
    const numAsString = [...num.toString()].reverse().join("");

    if (numAsString.length > maxLength) {
      maxLength = numAsString.length;
    }

    return numAsString;
  });

  console.log({ maxLength, operationType, numbers });

  switch (operationType) {
    case "+":
      let sum = 0;
      for (let i = maxLength - 1; i >= 0; i--) {
        const num = +numbersAsStrings
          .map((numberAsString) => numberAsString[i])
          .filter((numberAsString) => numberAsString !== undefined)
          .join("");
        console.log({ num });
        sum += num;
      }

      return sum;
    case "*":
      let product = 1;
      for (let i = maxLength - 1; i >= 0; i--) {
        const num = +numbersAsStrings
          .map((numberAsString) => numberAsString[i])
          .filter((numberAsString) => numberAsString !== undefined)
          .join("");
        console.log({ num });
        product *= num;
      }

      return product;
  }
};

const partOne = (lines: string[]) => {
  const firstLine = lines[0];

  if (!firstLine) {
    throw "Lines are empty in this input";
  }

  const operationsNumbers = firstLine
    .match(/\d+/g)
    ?.map((numberAsString) => [+numberAsString]);

  if (!Array.isArray(operationsNumbers)) {
    throw "Line 0 contains no numbers";
  }

  for (let i = 1; i < lines.length - 1; i++) {
    const currentLine = lines[i]!;
    const currentLineNumbers = currentLine
      .match(/\d+/g)
      ?.map((numberAsString) => +numberAsString);

    if (!Array.isArray(currentLineNumbers)) {
      throw `Line ${i} contains no numbers`;
    }

    for (let j = 0; j < currentLineNumbers.length; j++) {
      const currentLineNumber = currentLineNumbers[j]!;
      if (operationsNumbers[j] === undefined) {
        throw `Operation numbers does not have a list at ${j}`;
      }

      operationsNumbers[j]!.push(currentLineNumber);
    }
  }
  const arithmeticOperators = lines[lines.length - 1]!.match(/\*|\+/g);

  if (!Array.isArray(arithmeticOperators)) {
    throw `Last line of input was not arithmetic operators`;
  }

  const arithmeticOperations: ArithmeticOperation[] = operationsNumbers.map(
    (numbers, index) => ({
      operationType: arithmeticOperators[index]! as "+" | "*",
      numbers,
    })
  );

  let sum = 0;
  for (const arithmeticOperation of arithmeticOperations) {
    const result = evaluateArithmeticOperation(arithmeticOperation);
    sum += result;
  }

  return sum;
};

const partTwo = (lines: string[]) => {
  const linesWithNumbersReversed = lines
    .slice(0, lines.length - 1)
    .map((line) => [...line].toReversed().join(""));

  const rows = linesWithNumbersReversed.length;
  const columns = linesWithNumbersReversed[0]!.length;

  const operators = lines[lines.length - 1]?.match(/\*|\+/g);

  if (!Array.isArray(operators)) {
    throw `Last line of input was not arithmetic operators`;
  }

  let numsToOperateOn = [];
  let sum = 0;
  for (let col = 0; col < columns; col++) {
    const numInColumnChars: string[] = [];
    for (let row = 0; row < rows; row++) {
      const char = linesWithNumbersReversed![row]![col]!;
      if (char === " ") {
        continue;
      }

      numInColumnChars.push(char);
    }

    if (numInColumnChars.length === 0) {
      const operator = operators.pop();
      //   console.log(numsToOperateOn, operator);
      if (operator === "+") {
        sum += numsToOperateOn.reduce(
          (previous, current) => previous + current,
          0
        );
      } else {
        sum += numsToOperateOn.reduce(
          (previous, current) => previous * current,
          1
        );
      }
      numsToOperateOn = [];
      continue;
    }

    numsToOperateOn.push(+numInColumnChars.join(""));
  }

  const operator = operators.pop();
  //   console.log(numsToOperateOn, operator);
  if (operator === "+") {
    sum += numsToOperateOn.reduce((previous, current) => previous + current, 0);
  } else {
    sum += numsToOperateOn.reduce((previous, current) => previous * current, 1);
  }

  return sum;
};

export default { partOne: () => partOne(lines), partTwo: () => partTwo(lines) };
