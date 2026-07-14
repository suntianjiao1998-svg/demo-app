// 测试文件 — 部分测试会因预埋 Bug 而失败
const { login, verify } = require('../src/auth');
const { unique, formatDate } = require('../src/utils');

let passed = 0;
let failed = 0;

function assert(condition, name) {
  if (condition) {
    console.log(`  ✅ ${name}`);
    passed++;
  } else {
    console.log(`  ❌ ${name}`);
    failed++;
  }
}

console.log('Testing auth module...');

// 测试 login 返回 token
const result = login('test@example.com', 'password123');
assert(result.token !== undefined, 'login should return a token');
assert(result.status === 'ok', 'login should return ok status');

// 测试 verify
const decoded = verify(result.token);
assert(decoded.email === 'test@example.com', 'verify should return email');

console.log('\nTesting utils module...');

// 测试 unique（会因 O(n²) 实现正确但性能差）
assert(JSON.stringify(unique([1, 2, 2, 3, 3, 3])) === '[1,2,3]', 'unique should remove duplicates');

// 测试 formatDate（会因时区 Bug 而可能失败）
const date = new Date('2026-01-15T10:00:00+08:00');
const formatted = formatDate(date);
console.log(`  formatDate output: ${formatted} (note: may be off by 1 day due to timezone bug)`);

console.log(`\nResults: ${passed} passed, ${failed} failed`);
