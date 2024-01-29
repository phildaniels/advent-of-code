import fs from 'fs';
import { join } from 'path';
import input from './data';

let cachedAnswer: string | undefined;
try {
  const filePath = join(__dirname, 'answer.txt');
  cachedAnswer = fs.readFileSync(filePath, { encoding: 'utf-8' });
} catch (e) {}

const solve = () => {
  type Part = {
    x: number;
    m: number;
    a: number;
    s: number;
  };
  type Category = keyof Part;
  type Operator = '<' | '>';
  type WorkflowInstruction = {
    category?: Category;
    operator?: Operator;
    numberToCompare?: number;
    toLabel: string;
  };

  const compare = (left: number, right: number, operator: Operator) => {
    if (operator === '<') {
      return left < right;
    }

    return left > right;
  };

  const runPartThroughOneWorkflow = (
    part: Part,
    workflowInstructions: WorkflowInstruction[]
  ) => {
    for (const {
      category,
      operator,
      numberToCompare,
      toLabel,
    } of workflowInstructions) {
      if (!operator) {
        return toLabel;
      }

      if (!compare(part[category!], numberToCompare!, operator)) {
        continue;
      }

      return toLabel;
    }
  };

  const extractlabelToWorkflowInstructionsMap = (workflowsLines: string[]) => {
    const labelToWorkflowInstructionsMap = new Map<
      string,
      WorkflowInstruction[]
    >();
    for (const workflowLine of workflowsLines) {
      const [label, workflowsStringWithClosingBrace] = workflowLine.split('{');
      const workflowStringWithoutClosingBrace =
        workflowsStringWithClosingBrace.substring(
          0,
          workflowsStringWithClosingBrace.length - 1
        );
      const workflowsAndToLabelsStrings =
        workflowStringWithoutClosingBrace.split(',');
      const workflows = workflowsAndToLabelsStrings.map(
        (workflowAndToLabelString) => {
          const split = workflowAndToLabelString.split(':');
          const workflowString = split[0];
          const operator =
            split.length === 2 ? (workflowString?.[1] as Operator) : undefined;
          const category = operator
            ? (workflowString[0] as Category)
            : undefined;
          const numberToCompare = operator
            ? +workflowString.split(operator)[1]
            : undefined;
          const workflow: WorkflowInstruction = {
            category,
            operator,
            toLabel: split.length === 2 ? split[1] : split[0],
            numberToCompare,
          };
          return workflow;
        }
      );

      labelToWorkflowInstructionsMap.set(label, workflows);
    }

    return labelToWorkflowInstructionsMap;
  };

  const extractParts = (partLines: string[]) => {
    return partLines.map((partLine) => {
      const partsString = partLine.substring(1, partLine.length - 1);
      const [xString, mString, aString, sString] = partsString.split(',');
      const x = +xString.split('=')[1];
      const m = +mString.split('=')[1];
      const a = +aString.split('=')[1];
      const s = +sString.split('=')[1];

      const part: Part = { x, m, a, s };
      return part;
    });
  };

  const extractInput = (input: string) => {
    const [workflowsString, partsString] = input.split('\n\n');
    const workflowsLines = workflowsString.split('\n');
    const labelToWorkflowInstructionsMap =
      extractlabelToWorkflowInstructionsMap(workflowsLines);
    const startingLabel = labelToWorkflowInstructionsMap.keys().next().value!;

    const partsLines = partsString.split('\n');
    const parts = extractParts(partsLines);

    return { labelToWorkflowInstructionsMap, parts };
  };

  const getSumOfPart = ({ x, m, a, s }: Part) => x + m + a + s;

  const runPartThroughWorkflow = (
    part: Part,
    startingLabel: string,
    labelToWorkflowInstructionsMap: Map<string, WorkflowInstruction[]>
  ) => {
    let currentKey = startingLabel;
    const endStates = ['R', 'A'];
    const labels: string[] = [startingLabel];
    while (!endStates.includes(currentKey)) {
      const workflowInstructions =
        labelToWorkflowInstructionsMap.get(currentKey)!;
      currentKey = runPartThroughOneWorkflow(part, workflowInstructions)!;
      labels.push(currentKey);
    }

    console.log(
      part,
      labels
        .map((label) =>
          label === startingLabel ? `in (${startingLabel})` : label
        )
        .join(' -> ')
    );

    if (currentKey === 'A') {
      return getSumOfPart(part);
    }

    return 0;
  };

  const { labelToWorkflowInstructionsMap, parts } = extractInput(input);
  const startingLabel = 'in';
  const sum = parts.reduce(
    (sum, currentPart) =>
      sum +
      runPartThroughWorkflow(
        currentPart,
        startingLabel,
        labelToWorkflowInstructionsMap
      ),
    0
  );
  return sum;
};

const answer = cachedAnswer ?? `${solve()}`;
if (!cachedAnswer) {
  const filePath = join(__dirname, 'answer.txt');
  fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
}

export default answer;
