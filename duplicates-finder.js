import fs from 'fs';
import path from 'path';
import Promise from 'bluebird';

async function *readFullFilenames(filepath) {
  const files = await Promise.promisify(fs.readdir, { context: fs })(filepath);
  
  for (const filename of files) {
    yield path.join(filepath, filename);
  }
}

async function *getStatistic(files) {
  for await (const filename of files) {
    const stat = await Promise.promisify(fs.stat, { context: fs })(filename);
    stat.fullpath = filename;

    yield stat;
  }
}

const duplicateFinder = (basePath) => {
  const memory = new Map();

  // memory[Symbol.iterator] = function() {
  //   let entries = null;
  //   let i = 0;

  //   const sortedArray = [...this.entries()].sort((a, b) => b[1] - a[1]);

  //   return ({
  //     // Show with and without this line and explain difference
  //     [Symbol.iterator]() { return this; },
 
  //     next() {
  //       if (i === sortedArray.length) return { done: true, value: undefined };
  //       return { done: false, value: sortedArray[i++] };
  //     },
  //   });
  // };

  memory[Symbol.iterator] = function *() {
    let sortedEntries = [...this.entries()].sort((a, b) => b[1] - a[1]); // https://stackoverflow.com/a/48324540

    yield *sortedEntries;
  }

  async function *walk(filepath) {
    const filesIterator = readFullFilenames(filepath);
  
    for await (const fileStats of getStatistic(filesIterator)) {
      if (fileStats.isDirectory()) {
        const { fullpath } = fileStats;
        yield *walk(fullpath);
        continue;
      }
      // To produce the same strings to compare
      const key = JSON.stringify({ size: fileStats.size, filename: path.basename(fileStats.fullpath) });
      const cnt = memory.get(key) || 0;

      memory.set(key, cnt + 1);
      yield fileStats;
    }
  }
  
  return async function *walkWrapper() {
    for await (const fileStats of walk(basePath));

    const iterator = memory[Symbol.iterator]();

    for (const value of iterator) {
      yield value;
    }
  };;
};

(async () => {
  // const iterator = fsgen(path.join(__dirname, 'test-dir'))();
  const iterator = duplicateFinder('/Users/vviital/projects/learning/js')();

  for await (const value of iterator) {
    console.log('value', value);
  }
})().then(console.log).catch(console.error);
