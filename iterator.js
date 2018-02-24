// Iterate over array
const arr = [1, 2, 3];
let it = arr[Symbol.iterator]();

console.log(it.next());
console.log(it.next());
console.log(it.next());

console.log(it.next());

// Iterate over string

const greeting = 'hello world';

it = greeting[Symbol.iterator]();

for (const char of it) {
  console.log('char', char);
}

let string = 'a';

for (let i = 0; i < 21; ++i) {
  string = string + string;
}

// Compare speed of iterators and direct access to characters of string
console.time('for loop');
let cnt1 = 0;
for (let j = 0; j < 100; ++j) {
  for(let i = 0; i < string.length; ++i) {
    cnt1 += string.charCodeAt(i);
  }
}
console.timeEnd('for loop', cnt1);
console.time('for of loop');
let cnt2 = 0;
for(let j = 0; j < 100; ++j) {
  for(let value of string) {
    cnt2 += string.charCodeAt(0);
  }
}
console.timeEnd('for of loop', cnt2);

const m = new Map();
m.set('foo', 42);
m.set({ cool: true }, 'hello world');

let mit1 = m[Symbol.iterator]();
let mit2 = m.entries();

console.log('mit1.next()', mit1.next());
console.log('mit1.next()', mit1.next());
console.log('mit1.next()', mit1.next());

console.log('mit1.next()', mit2.next());
console.log('mit1.next()', mit2.next());
console.log('mit1.next()', mit2.next());

const array = [1, 2, 3];

console.log('array === array[Symbol.iterator]', array === array[Symbol.iterator]());
console.log('array[Symbol.iterator]', array[Symbol.iterator]);
console.log('array[Symbol.iterator]()', array[Symbol.iterator]());
console.log('array[Symbol.iterator]().next()', array[Symbol.iterator]().next());
