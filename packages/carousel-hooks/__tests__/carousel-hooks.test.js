'use strict';

const carouselHooks = require('..');
const assert = require('assert').strict;

assert.strictEqual(carouselHooks(), 'Hello from carouselHooks');
console.info("carouselHooks tests passed");
