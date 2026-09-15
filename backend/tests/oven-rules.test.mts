import assert from 'node:assert/strict';
import test from 'node:test';

import {
  canReactToOven,
  canSubmitToOven,
  canUploadAfterImage,
  cleanOvenText,
  formatOvenBatchNumber,
  nextOvenBatchNumber,
} from '../src/oven-rules.ts';

test('炉号按三位展示，并在已有炉次后自动递增', () => {
  assert.equal(formatOvenBatchNumber(86), '086');
  assert.equal(nextOvenBatchNumber(86, undefined), 87);
  assert.equal(nextOvenBatchNumber(undefined, 86), 86);
  assert.equal(nextOvenBatchNumber(undefined, undefined), null);
});

test('炉次状态严格控制投稿、添柴和出炉照', () => {
  assert.equal(canSubmitToOven('preparing'), true);
  assert.equal(canSubmitToOven('baking'), false);
  assert.equal(canReactToOven('preparing'), true);
  assert.equal(canReactToOven('baking'), true);
  assert.equal(canReactToOven('ready'), true);
  assert.equal(canReactToOven('finished'), false);
  assert.equal(canUploadAfterImage('ready'), true);
  assert.equal(canUploadAfterImage('finished'), false);
});

test('顾客输入会清理多余空白并按长度截断', () => {
  assert.equal(cleanOvenText('  小雨\n 面包师  ', 20), '小雨 面包师');
  assert.equal(cleanOvenText('123456', 4), '1234');
  assert.equal(cleanOvenText(undefined, 20), '');
});
