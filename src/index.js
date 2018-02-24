import fs from 'fs';
import Promise from 'bluebird';
import path from 'path';

const baseName = process.env.BASE_NAME || __dirname;

import { duplicateFinder } from './duplicates-finder';

(async () => {
  const iterator = duplicateFinder(baseName)();

  const object = {};

  for await (const value of iterator) {
    const key = JSON.parse(value[0]);
    object[key.filename] = { count: value[1], size: key.size };
  }

  const report = JSON.stringify(object, ' ', 1);
  const reportName = path.join(__dirname, '..', 'report.json');

  await Promise.promisify(fs.writeFile, { context: fs })(reportName, report);
})().catch(console.error);
