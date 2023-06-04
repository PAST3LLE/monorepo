'use strict';

const forgeCli = require('..');
const assert = require('assert').strict;

assert.strictEqual(forgeCli(), 'Hello from forgeCli');
console.info('forgeCli tests passed');
