import { duplicateFinder } from './duplicates-finder';

(async () => {
  const iterator = duplicateFinder('/Users/vviital/projects/learning/js/')();

  for await (const value of iterator) {
    console.log('value', value);
  }
})().then(console.log).catch(console.error);
