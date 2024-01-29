import fs from 'fs';
import { join } from 'path';
import input from './data';
import util from 'util';

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

  type Range = [number, number];

  type Operator = '<' | '>';

  type WorkflowInstruction = {
    category: Category;
    operator: Operator;
    numberToCompare: number;
    toLabel: string;
  };

  type ExplorationDto = {
    key: string;
    xRange: Range;
    mRange: Range;
    aRange: Range;
    sRange: Range;
  };

  const getInverseOfOperatorAndNumber = (
    operator: Operator,
    numberToCompare: number
  ) => {
    switch (operator) {
      case '<': {
        return {
          operator: '>' as Operator,
          numberToCompare: numberToCompare - 1,
        };
      }

      case '>': {
        return {
          operator: '<' as Operator,
          numberToCompare: numberToCompare + 1,
        };
      }

      default: {
        return { operator, numberToCompare };
      }
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
      const workFlows: WorkflowInstruction[] = [];
      workflowsAndToLabelsStrings.forEach((workflowAndToLabelString) => {
        const split = workflowAndToLabelString.split(':');
        const workflowString = split[0];
        const operator =
          split.length === 2 ? (workflowString?.[1] as Operator) : undefined;

        if (operator) {
          const category = workflowString[0] as Category;
          const numberToCompare = +workflowString.split(operator)[1];
          const workFlow: WorkflowInstruction = {
            category,
            operator,
            toLabel: split[1],
            numberToCompare,
          };

          workFlows.push(workFlow);
          return;
        }

        const {
          operator: previousOperator,
          numberToCompare: previousNumberToCompare,
          category: previousCategory,
        } = workFlows[workFlows.length - 1];

        const {
          operator: previousInverseOperator,
          numberToCompare: previousInverseNumberToCompare,
        } = getInverseOfOperatorAndNumber(
          previousOperator,
          previousNumberToCompare
        );

        const workFlow: WorkflowInstruction = {
          category: previousCategory,
          operator: previousInverseOperator!,
          toLabel: split[0],
          numberToCompare: previousInverseNumberToCompare!,
        };

        workFlows.push(workFlow);
        return;
      });

      labelToWorkflowInstructionsMap.set(label, workFlows);
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
    const partsLines = partsString.split('\n');
    const parts = extractParts(partsLines);
    return { labelToWorkflowInstructionsMap, parts };
  };

  const calculateNewRangeBasedOnCurrentRangeOperatorAndNumberToCompare = (
    [currentMin, currentMax]: Range,
    operator: Operator,
    numberToCompare: number
  ) => {
    switch (operator) {
      case '>': {
        const newRange: Range = [numberToCompare + 1, currentMax];
        return newRange;
      }

      case '<': {
        const newRange: Range = [currentMin, numberToCompare - 1];
        return newRange;
      }
    }
  };

  const calculateNewRangesBasedOnCategoryOperatorAndNumberToCompare = (
    category: Category,
    operator: Operator,
    numberToCompare: number,
    xRange: Range,
    mRange: Range,
    aRange: Range,
    sRange: Range
  ) => {
    const toReturn = {
      xRange,
      mRange,
      aRange,
      sRange,
    };

    toReturn[`${category}Range`] =
      calculateNewRangeBasedOnCurrentRangeOperatorAndNumberToCompare(
        toReturn[`${category}Range`],
        operator,
        numberToCompare
      );

    return toReturn;
  };

  const calculateNewRangesBasedOnPreviousInstructionsUpToPoint = (
    previousInstructions: WorkflowInstruction[],
    _xRange: Range,
    _mRange: Range,
    _aRange: Range,
    _sRange: Range
  ) => {
    let xmasRanges = {
      xRange: [..._xRange] as Range,
      mRange: [..._mRange] as Range,
      aRange: [..._aRange] as Range,
      sRange: [..._sRange] as Range,
    };
    for (let [
      i,
      { category, operator, numberToCompare },
    ] of previousInstructions.entries()) {
      const {
        xRange: currentXRange,
        mRange: currentMRange,
        aRange: currentARange,
        sRange: currentSRange,
      } = xmasRanges;
      // the workflow is basically an if-elseif-else statement. IE
      // a<2006:qkq,m>2090:A,rfg means
      // if (a < 2006) {
      //   goto "qkq"
      // } else if (m > 2090) {
      //   goto "a"
      // } else {
      //   goto rfg
      // }
      // however, my data structure isn't complex, it's basically a list of conditions to
      // get to this point. So we have to adjust the previous conditions before this one (only for the current label)
      // In the previous example, if we are in the "else-if" or "else" clause, that means the previous
      // clauses were false. So that means we have to adjust the valid ranges to account for those paths being false.
      // IE to get to else, !(a < 2006) -> a > 2005, !(m > 2090) -> m < 2090 however, we have accepted the last condition
      // in the list as true, which is why we don't do the inverse case for that one
      // IE (i === previousInstructions.length - 1)
      if (i === previousInstructions.length - 1) {
        xmasRanges =
          calculateNewRangesBasedOnCategoryOperatorAndNumberToCompare(
            category,
            operator,
            numberToCompare,
            currentXRange,
            currentMRange,
            currentARange,
            currentSRange
          );
        continue;
      }

      const {
        operator: inverseOperator,
        numberToCompare: inverseNumberToCompare,
      } = getInverseOfOperatorAndNumber(operator, numberToCompare);

      xmasRanges = calculateNewRangesBasedOnCategoryOperatorAndNumberToCompare(
        category,
        inverseOperator,
        inverseNumberToCompare,
        currentXRange,
        currentMRange,
        currentARange,
        currentSRange
      );
    }

    return xmasRanges;
  };

  const calculateTotalForAllAcceptedPaths = (
    labelToWorkflowInstructionsMap: Map<string, WorkflowInstruction[]>,
    startingLabel: string,
    defaultRange: Range
  ) => {
    const toExplore: ExplorationDto[] = [
      {
        key: startingLabel,
        xRange: [...defaultRange] as Range,
        mRange: [...defaultRange] as Range,
        aRange: [...defaultRange] as Range,
        sRange: [...defaultRange] as Range,
      },
    ];
    let total = 0;
    while (toExplore.length > 0) {
      const { key, xRange, mRange, aRange, sRange } = toExplore.pop()!;

      if (key === 'A') {
        total +=
          getRangeLength(xRange) *
          getRangeLength(mRange) *
          getRangeLength(aRange) *
          getRangeLength(sRange);
        continue;
      }

      if (key === 'R') {
        continue;
      }

      const instructionsForKey = labelToWorkflowInstructionsMap.get(key);

      if (!instructionsForKey) {
        continue;
      }

      toExplore.push(
        ...instructionsForKey.map(({ toLabel }, index) => {
          return {
            key: toLabel,
            // we pass the adjusted ranges through, accounting for instructions up to this point
            ...calculateNewRangesBasedOnPreviousInstructionsUpToPoint(
              instructionsForKey.slice(0, index + 1),
              xRange,
              mRange,
              aRange,
              sRange
            ),
          };
        })
      );
    }

    return total;
  };

  const getRangeLength = ([rangeMin, rangeMax]: Range) => {
    // why plus 1? No idea but it doesn't work without it...
    return Math.abs(rangeMax - rangeMin) + 1;
  };

  const { labelToWorkflowInstructionsMap } = extractInput(input);
  const startingLabel = 'in';
  const defaultRange: Range = [1, 4000];
  const total = calculateTotalForAllAcceptedPaths(
    labelToWorkflowInstructionsMap,
    startingLabel,
    defaultRange
  );

  return total;
};

const answer = cachedAnswer ?? `${solve()}`;
if (!cachedAnswer) {
  const filePath = join(__dirname, 'answer.txt');
  fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
}

export default answer;
