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

  type ExectorType = 'broadcaster' | 'conjunction' | 'flipFlop' | 'noOp';

  interface IPulseExecutor {
    name: string;
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

  class BroadcasterExecutor implements IPulseExecutor {
    private childNodes: IPulseExecutor[] = [];
    private parentNodes: IPulseExecutor[] = [];
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

    addChildNode(node: IPulseExecutor) {
      this.childNodes.push(node);
    }

    addParentNode(node: IPulseExecutor) {
      this.parentNodes.push(node);
    }

    sendPulse(pulse: Pulse) {
      const pulseToSend: Pulse = { ...pulse, sender: this.name };
      this.pulseQueue.push(
        ...this.childNodes.map((attachedNode) => ({
          pulse: pulseToSend,
          executor: attachedNode,
        }))
      );
    }
  }

  class FlipFlopExecutor implements IPulseExecutor {
    private state: FlipFlopState = 'off';
    private childNodes: IPulseExecutor[] = [];
    private parentNodes: IPulseExecutor[] = [];
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

    addChildNode(node: IPulseExecutor) {
      this.childNodes.push(node);
    }

    addParentNode(node: IPulseExecutor) {
      this.parentNodes.push(node);
    }

    sendPulse({ type }: Pulse) {
      if (type === 'high') {
        return;
      }

      const pulseToSend: Pulse = {
        type: this.state === 'on' ? 'low' : 'high',
        sender: this.name,
      };

      switch (this.state) {
        case 'off': {
          this.state = 'on';
          break;
        }

        case 'on': {
          this.state = 'off';
          break;
        }
      }

      this.pulseQueue.push(
        ...this.childNodes.map((attachedNode) => ({
          pulse: pulseToSend,
          executor: attachedNode,
        }))
      );
    }
  }

  class ConjunctionExecutor implements IPulseExecutor {
    private senderToLastPulseDictionary = new Map<
      string,
      Omit<Pulse, 'sender'>
    >();
    private childNodes: IPulseExecutor[] = [];
    private parentNodes: IPulseExecutor[] = [];
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

    addChildNode(node: IPulseExecutor) {
      this.childNodes.push(node);
    }

    addParentNode(node: IPulseExecutor) {
      this.parentNodes.push(node);
      this.senderToLastPulseDictionary.set(node.name, { type: 'low' });
    }

    sendPulse({ sender, type }: Pulse) {
      this.senderToLastPulseDictionary.set(sender, { type });
      const allRememberedPulsesWereHigh = [
        ...this.senderToLastPulseDictionary.values(),
      ].every(({ type }) => type === 'high');

      const pulseToSend: Pulse = {
        type: allRememberedPulsesWereHigh ? 'low' : 'high',
        sender: this.name,
      };

      this.pulseQueue.push(
        ...this.childNodes.map((attachedNode) => ({
          pulse: pulseToSend,
          executor: attachedNode,
        }))
      );
    }
  }

  class NoOpExecutor implements IPulseExecutor {
    private childNodes: IPulseExecutor[] = [];
    private parentNodes: IPulseExecutor[] = [];
    private _name: string;

    constructor(name: string) {
      this._name = name;
    }

    get name() {
      return this._name;
    }

    addChildNode(node: IPulseExecutor) {
      this.childNodes.push(node);
    }

    addParentNode(node: IPulseExecutor) {
      this.parentNodes.push(node);
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

  const pushButtonNTimesAndReturnHighAndLowCount = (n: number) => {
    let lowCount = 0;
    let highCount = 0;
    const pulseQueue: PulseQueueType[] = [];
    const broadcaster = extractBroadcastModulesFromInput(input, pulseQueue);
    for (let i = 0; i < n; i++) {
      pulseQueue.push({
        pulse: { type: 'low', sender: '' },
        executor: broadcaster,
      });
      while (pulseQueue.length > 0) {
        const { pulse, executor } = pulseQueue.shift()!;
        executor.sendPulse(pulse);
        if (pulse.type === 'low') {
          lowCount++;
        } else {
          highCount++;
        }
      }
    }

    return { lowCount, highCount };
  };

  const { lowCount, highCount } =
    pushButtonNTimesAndReturnHighAndLowCount(1000);
  console.log(lowCount, highCount);
  return lowCount * highCount;
};

const answer = cachedAnswer ?? `${solve()}`;
if (!cachedAnswer) {
  const filePath = join(__dirname, 'answer.txt');
  fs.writeFileSync(filePath, answer, { encoding: 'utf-8' });
}

export default answer;
