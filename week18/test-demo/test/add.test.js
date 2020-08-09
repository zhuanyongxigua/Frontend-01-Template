import { add } from '../src/add.js';
import assert from 'assert';

it('should add to numbers from an es module', () => {
  assert.equal(add(3, 5), 8);
})