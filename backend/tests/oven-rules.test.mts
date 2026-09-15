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
import {
  decryptPhone,
  effectiveOrderStatus,
  encryptPhone,
  formatOrderSerial,
  normalizeCustomerName,
  normalizePhone,
  phoneDigest,
  phoneLast4,
} from '../src/oven-orders.ts';

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

test('出炉进度登记会规范姓名、电话和连续序号展示', () => {
  assert.equal(normalizeCustomerName('  李阿姨\n  '), '李阿姨');
  assert.equal(normalizePhone('138-0000-5678'), '13800005678');
  assert.equal(normalizePhone('123'), '');
  assert.equal(phoneLast4('13800005678'), '5678');
  assert.equal(formatOrderSerial(1), '0001');
  assert.equal(formatOrderSerial(10235), '10235');
});

test('90分钟结束后仅把制作中记录视为可以取啦', () => {
  const estimatedReadyAt = '2026-09-15T10:30:00.000Z';
  assert.equal(effectiveOrderStatus({ status: 'processing', estimatedReadyAt }, Date.parse('2026-09-15T10:29:59.000Z')), 'processing');
  assert.equal(effectiveOrderStatus({ status: 'processing', estimatedReadyAt }, Date.parse('2026-09-15T10:30:00.000Z')), 'ready');
  assert.equal(effectiveOrderStatus({ status: 'cancelled', estimatedReadyAt }, Date.parse('2026-09-15T12:00:00.000Z')), 'cancelled');
});

test('完整电话加密保存且查询摘要稳定', () => {
  const fakeStrapi = { config: { get: () => ['test-only-oven-phone-secret-with-32-chars'] } };
  const phone = '13800005678';
  const encrypted = encryptPhone(fakeStrapi, phone);
  assert.notEqual(encrypted, phone);
  assert.equal(decryptPhone(fakeStrapi, encrypted), phone);
  assert.equal(phoneDigest(fakeStrapi, phone), phoneDigest(fakeStrapi, phone));
  assert.notEqual(phoneDigest(fakeStrapi, phone), phoneDigest(fakeStrapi, '13800001234'));
});
