import { writeToCSV, writeToJSON } from './writers';

const baseName = process.env.BASE_NAME || __dirname;

import { duplicateFinder } from './duplicates-finder';

(async () => {
  const iterator = duplicateFinder(baseName)();

  const array = [];

  for await (const value of iterator) {
    array.push([JSON.parse(value[0]), value[1]]);
  }

  await Promise.all([
    writeToJSON(array),
    writeToCSV(array),
  ])

})().catch(console.error);
