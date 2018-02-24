const factorial = {
  [Symbol.iterator]: () => {
    let fact = 1, i = 1;
    let isFinished = false;
    console.log('outer iterator');

    return {
      // make iterator iterable
      [Symbol.iterator]() { 
        console.log('inner iterator');
        return this;
      },

      next() {
        if (isFinished) return { done: true, value: undefined };

        fact *= i;
        i += 1;
        return { done: false, value: fact };
      },
      return() {
        isFinished = true;

        console.log('return called');

        return { done: true, value: fact };
      }
    }
  },
};

const iterator1 = factorial[Symbol.iterator]();
const iterator2 = factorial[Symbol.iterator]();

for (const fact of iterator1) {
  console.log('fact', fact);

  if (fact > 1e+18) iterator1.return();
}

for (const fact of iterator2) {
  console.log('fact', fact);

  if (fact > 1e+18) iterator2.return();
}
