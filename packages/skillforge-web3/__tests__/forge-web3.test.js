'use strict';

const forgeWeb3 = require('..');
const assert = require('assert').strict;

assert.strictEqual(forgeWeb3(), 'Hello from forgeWeb3');
console.info("forgeWeb3 tests passed");
