const {
  register,
  getUserByUsername,
  getAllUsers,
} = require('../src/auth');
const {
  addToCart,
  removeFromCart,
  getCartTotal,
  getCart,
  clearCart,
} = require('../src/cart');

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

// 测试注册
const result = register('testuser', 'test@example.com', 'password123');
assert(result.success === true, 'register should succeed with valid data');
assert(result.user.username === 'testuser', 'register should return username');

// 测试重复用户名
const dup = register('testuser', 'another@example.com', 'password456');
assert(dup.success === false, 'register should fail with duplicate username');

// 测试短密码
const short = register('newuser', 'new@example.com', '123');
assert(short.success === false, 'register should fail with short password');

console.log('\nTesting cart module...');

// 测试添加商品
clearCart();
addToCart(1, 'Apple', 2.5, 3);
addToCart(2, 'Banana', 1.0, 2);
assert(getCart().length === 2, 'cart should have 2 items');

// 测试购物车总价
const total = getCartTotal();
assert(total === 9.5, `cart total should be 9.5, got ${total}`);

// 测试移除商品
removeFromCart(1);
assert(getCart().length === 1, 'cart should have 1 item after removal');

console.log(`\nResults: ${passed} passed, ${failed} failed`);
