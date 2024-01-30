import fs from 'fs';
import { join } from 'path';
import input from './data';

let cachedAnswer: string | undefined;
try {
  const filePath = join(__dirname, 'answer.txt');
  cachedAnswer = fs.readFileSync(filePath, { encoding: 'utf-8' });
} catch (e) {}

const solve = () => {
  type FlipFlopState = 'on' | 'off';

  type ConjunctionState = Map<string, Omit<Pulse, 'sender'>>;

  type ExectorType = 'broadcaster' | 'conjunction' | 'flipFlop' | 'noOp';

  interface IPulseExecutor<TState = any> {
    name: string;
    type: ExectorType;
    state: TState;
    childNodes: IPulseExecutor[];
    parentNodes: IPulseExecutor[];
    addChildNode(node: IPulseExecutor): void;
    addParentNode(node: IPulseExecutor): void;
    sendPulse(pulse: Pulse): void;
  }

  type PulseType = 'high' | 'low';

  type PulseQueueType = {
    pulse: Pulse;
    executor: IPulseExecutor;
  };

  type Pulse = { type: PulseType; sender: string };

  type PriorityQueueItem<TValue> = { priority: number; value: TValue };

  type PriorityQueueComparator<TValue> = (
    a: PriorityQueueItem<TValue>,
    b: PriorityQueueItem<TValue>
  ) => number;

  class PriorityArray<TValue> {
    constructor(
      private items: Array<PriorityQueueItem<TValue>> = [],
      private priorityComparator: PriorityQueueComparator<TValue> = (a, b) =>
        a.priority - b.priority
    ) {
      items.sort(priorityComparator);
    }

    push(...items: Array<PriorityQueueItem<TValue>>): void {
      this.items.push(...items);
      this.items.sort(this.priorityComparator);
    }

    pop(): TValue | undefined {
      return this.items.shift()?.value;
    }

    get length() {
      return this.items.length;
    }
  }

  class BroadcasterExecutor implements IPulseExecutor<undefined> {
    private _state = undefined;
    private _childNodes: IPulseExecutor[] = [];
    private _parentNodes: IPulseExecutor[] = [];
    private _name: string;

    constructor(
      name: string,
      private pulseQueue: Array<{ pulse: Pulse; executor: IPulseExecutor }>
    ) {
      this._name = name;
    }

    get name() {
      return this._name;
    }

    get type(): ExectorType {
      return 'broadcaster';
    }

    get state() {
      return this._state;
    }

    get childNodes() {
      return this._childNodes;
    }

    get parentNodes() {
      return this._parentNodes;
    }

    addChildNode(node: IPulseExecutor) {
      this._childNodes.push(node);
    }

    addParentNode(node: IPulseExecutor) {
      this._parentNodes.push(node);
    }

    sendPulse(pulse: Pulse) {
      const pulseToSend: Pulse = { ...pulse, sender: this.name };
      this.pulseQueue.push(
        ...this._childNodes.map((attachedNode) => ({
          pulse: pulseToSend,
          executor: attachedNode,
        }))
      );
    }
  }

  class FlipFlopExecutor implements IPulseExecutor<FlipFlopState> {
    private _state: FlipFlopState = 'off';
    private _childNodes: IPulseExecutor[] = [];
    private _parentNodes: IPulseExecutor[] = [];
    private _name;

    constructor(
      name: string,
      private pulseQueue: Array<{ pulse: Pulse; executor: IPulseExecutor }>
    ) {
      this._name = name;
    }

    get name() {
      return this._name;
    }

    get type(): ExectorType {
      return 'flipFlop';
    }

    get state() {
      return this._state;
    }

    get childNodes() {
      return this._childNodes;
    }

    get parentNodes() {
      return this._parentNodes;
    }

    addChildNode(node: IPulseExecutor) {
      this._childNodes.push(node);
    }

    addParentNode(node: IPulseExecutor) {
      this._parentNodes.push(node);
    }

    sendPulse({ type }: Pulse) {
      if (type === 'high') {
        return;
      }

      const pulseToSend: Pulse = {
        type: this._state === 'on' ? 'low' : 'high',
        sender: this.name,
      };

      switch (this._state) {
        case 'off': {
          this._state = 'on';
          break;
        }

        case 'on': {
          this._state = 'off';
          break;
        }
      }

      this.pulseQueue.push(
        ...this._childNodes.map((attachedNode) => ({
          pulse: pulseToSend,
          executor: attachedNode,
        }))
      );
    }
  }

  class ConjunctionExecutor implements IPulseExecutor<ConjunctionState> {
    private _state = new Map<string, Omit<Pulse, 'sender'>>();
    private _childNodes: IPulseExecutor[] = [];
    private _parentNodes: IPulseExecutor[] = [];
    private _name: string;

    constructor(
      name: string,
      private pulseQueue: Array<{ pulse: Pulse; executor: IPulseExecutor }>
    ) {
      this._name = name;
    }

    get name() {
      return this._name;
    }

    get childNodes() {
      return this._childNodes;
    }

    get state() {
      return this._state;
    }

    get parentNodes() {
      return this._parentNodes;
    }

    get type(): ExectorType {
      return 'conjunction';
    }

    addChildNode(node: IPulseExecutor) {
      this._childNodes.push(node);
    }

    addParentNode(node: IPulseExecutor) {
      this._parentNodes.push(node);
      this._state.set(node.name, { type: 'low' });
    }

    sendPulse({ sender, type }: Pulse) {
      this._state.set(sender, { type });
      const allRememberedPulsesWereHigh = [...this._state.values()].every(
        ({ type }) => type === 'high'
      );

      const pulseToSend: Pulse = {
        type: allRememberedPulsesWereHigh ? 'low' : 'high',
        sender: this.name,
      };

      this.pulseQueue.push(
        ...this._childNodes.map((attachedNode) => ({
          pulse: pulseToSend,
          executor: attachedNode,
        }))
      );
    }
  }

  class NoOpExecutor implements IPulseExecutor<undefined> {
    private _state = undefined;
    private _childNodes: IPulseExecutor[] = [];
    private _parentNodes: IPulseExecutor[] = [];
    private _name: string;

    constructor(name: string) {
      this._name = name;
    }

    get name() {
      return this._name;
    }

    get type(): ExectorType {
      return 'noOp';
    }

    get state() {
      return this._state;
    }

    get childNodes() {
      return this._childNodes;
    }

    get parentNodes() {
      return this._parentNodes;
    }

    addChildNode(node: IPulseExecutor) {
      this._childNodes.push(node);
    }

    addParentNode(node: IPulseExecutor) {
      this._parentNodes.push(node);
    }

    sendPulse(_pulse: Pulse) {}
  }

  type ModuleMetaData = {
    type: ExectorType;
    attachedNodes: string[];
  };

  class PulseExecutorFactory {
    constructor() {}

    createExecutor(
      type: ExectorType,
      name: string,
      pulseQueue: Array<{ pulse: Pulse; executor: IPulseExecutor }>
    ): IPulseExecutor {
      switch (type) {
        case 'broadcaster': {
          const executor = new BroadcasterExecutor(name, pulseQueue);
          return executor;
        }

        case 'conjunction': {
          const executor = new ConjunctionExecutor(name, pulseQueue);
          return executor;
        }

        case 'flipFlop': {
          const executor = new FlipFlopExecutor(name, pulseQueue);
          return executor;
        }

        default: {
          const executor = new NoOpExecutor(name);
          return executor;
        }
      }
    }
  }

  const extractBroadcastModulesFromInput = (
    input: string,
    pulseQueue: PulseQueueType[]
  ) => {
    const lines = input.split('\n');
    const nameToMetaDataMap = new Map<string, ModuleMetaData>();
    const nameToExecutorMap = new Map<string, IPulseExecutor>();
    const executorFactory = new PulseExecutorFactory();
    for (const line of lines) {
      const [labelString, attachedNodesString] = line.split(' -> ');
      const attachedNodes = attachedNodesString.split(', ');
      if (labelString === 'broadcaster') {
        nameToMetaDataMap.set(labelString, {
          type: 'broadcaster',
          attachedNodes,
        });
        continue;
      }
      let executorType: ExectorType;
      switch (labelString[0]) {
        case '%': {
          executorType = 'flipFlop';
          break;
        }

        case '&': {
          executorType = 'conjunction';
          break;
        }

        default: {
          executorType = 'noOp';
          break;
        }
      }

      const moduleName =
        executorType === 'noOp' ? labelString : labelString.substring(1);

      nameToMetaDataMap.set(moduleName, { type: executorType, attachedNodes });
    }

    for (const [key, { type }] of nameToMetaDataMap.entries()) {
      nameToExecutorMap.set(
        key,
        executorFactory.createExecutor(type, key, pulseQueue)
      );
    }

    // for leaf nodes that are not a parent
    [
      ...new Set([
        ...nameToMetaDataMap.keys(),
        ...[...nameToMetaDataMap.values()].flatMap(
          ({ attachedNodes }) => attachedNodes
        ),
      ]),
    ]
      .filter((node) => nameToExecutorMap.get(node) === undefined)
      .forEach((node) =>
        nameToExecutorMap.set(
          node,
          executorFactory.createExecutor('noOp', node, pulseQueue)
        )
      );
    4;

    for (const [key, { attachedNodes }] of nameToMetaDataMap.entries()) {
      const currentModule = nameToExecutorMap.get(key)!;
      for (const attachedNode of attachedNodes) {
        const attachedNodeModule = nameToExecutorMap.get(attachedNode)!;
        currentModule.addChildNode(attachedNodeModule);
        attachedNodeModule.addParentNode(currentModule);
      }
    }

    return nameToExecutorMap.get('broadcaster')!;
  };

  const getAllExecutorNamesPointedToParentsOfGoalNode = (
    broadcaster: IPulseExecutor,
    goalNodeKey: string
  ) => {
    let toExplore = [broadcaster];
    const seenKeys = new Set<string>();
    while (toExplore.length > 0) {
      const currentNode = toExplore.shift()!;

      if (currentNode.name === goalNodeKey) {
        return currentNode.parentNodes.flatMap((goalNodeParent) =>
          goalNodeParent.parentNodes.map(({ name }) => name)
        );
      }

      if (seenKeys.has(currentNode.name)) {
        continue;
      }
      seenKeys.add(currentNode.name);

      toExplore.push(...currentNode.childNodes);
    }

    return [];
  };

  const gcd = (a: number, b: number) => {
    while (b !== 0) {
      let t = b;
      b = a % b;
      a = t;
    }
    return a;
  };

  const lcm = (a: number, b: number) => {
    return (a * b) / gcd(a, b);
  };

  const lcmOfArray = (numbers: number[]) => {
    let multiple = numbers[0];
    for (let i = 1; i < numbers.length; i++) {
      multiple = lcm(multiple, numbers[i]);
    }
    return multiple;
  };

  const findNumberOfButtonPressesForRxToReceiveOneLowPulse = () => {
    const pulseQueue: PulseQueueType[] = [];
    const broadcaster = extractBroadcastModulesFromInput(input, pulseQueue);
    let i = 0;
    const allExecutorsPointedToParentsOfGoalNode =
      getAllExecutorNamesPointedToParentsOfGoalNode(broadcaster, 'rx');
    const allExecutorNamesPointedToParentOfGoalNodeEntries =
      allExecutorsPointedToParentsOfGoalNode.map<[string, number]>((name) => [
        name,
        -1,
      ]);
    const executorNameToFirstLowPulseMap = new Map<string, number>(
      allExecutorNamesPointedToParentOfGoalNodeEntries
    );
    while (true) {
      pulseQueue.push({
        pulse: { type: 'low', sender: '' },
        executor: broadcaster,
      });
      while (pulseQueue.length > 0) {
        const { pulse, executor } = pulseQueue.shift()!;
        if (
          pulse.type === 'low' &&
          executorNameToFirstLowPulseMap.has(executor.name)
        ) {
          executorNameToFirstLowPulseMap.set(executor.name, i + 1);
          const firstLowPulseValues = [
            ...executorNameToFirstLowPulseMap.values(),
          ];
          const allValuesAreFilledOut = firstLowPulseValues.every(
            (value) => value !== -1
          );

          if (allValuesAreFilledOut) {
            return lcmOfArray(firstLowPulseValues);
          }
        }
        executor.sendPulse(pulse);
      }
      i++;
    }
  };

  return findNumberOfButtonPressesForRxToReceiveOneLowPulse();
};

const answer = cachedAnswer ?? `${solve()}`;
if (!cachedAnswer) {
  const filePath = join(__dirname, 'answer.txt');
  fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
}

export default answer;
