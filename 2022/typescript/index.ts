import answers from './days';

answers.forEach((answer: string | string[], index: number) => {
  if (Array.isArray(answer)) {
    console.log('day', index + 1);
    answer.forEach((partAnswer: string, partIndex: number) => {
      console.log('', 'part', partIndex + 1, 'answer =', partAnswer);
    });
  } else {
    console.log('day', index + 1, 'answer =', answer);
  }
});
