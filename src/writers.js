import fs from 'fs';
import Promise from 'bluebird';
import path from 'path';

function convertArrayToObject(array) {
  const object = {};

  for (const value of array) {
    const record = object[value[0].filename];

    if (record) {
      object[value[0].filename] = { 
        count: [...record.count, value[1]],
        size: [...record.size, value[0].size],
      };
    } else {
      object[value[0].filename] = { count: [value[1]], size: [value[0].size] };
    }
  }

  return object;
}

async function writeToJSON(array) {
  const object = convertArrayToObject(array);

  const report = JSON.stringify(object, ' ', 1);
  const reportName = path.join(__dirname, '..', 'report.json');

  await Promise.promisify(fs.writeFile, { context: fs })(reportName, report);
}

async function writeToCSV(array) {
  const reportName = path.join(__dirname, '..', 'report.txt');

  await Promise.promisify(fs.writeFile, { context: fs })(reportName, 'Filename, size, count\n');

  for (const value of array) {
    const filename = value[0].filename;
    const size = value[0].size;
    const count = value[1];

    const csvString = `${filename}, ${size}, ${count}\n`;
    await Promise.promisify(fs.appendFile, { context: fs })(reportName, csvString);
  }
}

export {
  writeToJSON,
  writeToCSV,
};
