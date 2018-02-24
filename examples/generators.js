// function *foo() {
//   while (true) {
//     yield Math.random();
//   }
// }

// const it = foo();

// for(let i = 0; i < 100; ++i) {
//   console.log('it.next()', it.next().value);
// }

function *foo1() {
  const arr = [yield 1, yield 2, yield 3, yield 4];

  return arr;
}

const it1 = foo1(2);

console.log('it1.next()', it1.next());
console.log('it1.next()', it1.next(4));
console.log('it1.next()', it1.next(3));
console.log('it1.next()', it1.next(2));
console.log('it1.next()', it1.next(1));

const result = it1.next().value;

console.log('result', result);

function *foo2() {
  yield *[1, 2, 3];

  return 4;
}

for (const value of foo2()) {
  console.log('value', value);
}

// recursion
function *foo3(x) {
  let res = 1;
  if (x < 10) {
    res = yield *foo3(x + 1);
  }
  console.log('res * x', res * x);
  return res * x;
}

const it3 = foo3(1);

for (const value of it3) {
  console.log('value', value);
}

console.log('it3.next()', it3.next());

// return method
function *foo4() {
  try {
    yield 1;
    yield 2;
    yield 3;
  } catch (err) {
    console.log('err', err);
  }
 }

const it4 = foo4();
console.log('it4.next()', it4.next());
console.log('it4.return(42)', it4.return(42));
console.log('it4.next()', it4.next());

// throw method

const it5 = foo4();
console.log('it4.next()', it5.next());
console.log('it4.return(42)', it5.throw(new Error()));
console.log('it4.next()', it5.next());
