'use strict';

const web3Modal = require('..');
const assert = require('assert').strict;

assert.strictEqual(web3Modal(), 'Hello from web3Modal');
console.info('web3Modal tests passed');
