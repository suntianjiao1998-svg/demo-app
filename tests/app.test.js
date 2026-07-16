const {
  register,
  getUserByUsername,
  getAllUsers,
  deleteCustomerById,
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
assert(result.user.email === 'test@example.com', 'register should return email');

// 测试重复用户名
const dup = register('testuser', 'another@example.com', 'password456');
assert(dup.success === false, 'register should fail with duplicate username');

// 测试短密码
const short = register('newuser', 'new@example.com', '123');
assert(short.success === false, 'register should fail with short password');

// 测试获取用户
const found = getUserByUsername('testuser');
assert(found !== undefined, 'getUserByUsername should find existing user');
assert(found.email === 'test@example.com', 'getUserByUsername should return correct email');

// 测试获取所有用户
const allUsers = getAllUsers();
assert(allUsers.length === 1, 'getAllUsers should return 1 user after 1 successful registration');

// 测试删除客户
const delResult = deleteCustomerById(1);
assert(delResult.success === true, 'deleteCustomerById should succeed for existing user');
assert(getAllUsers().length === 0, 'getAllUsers should return 0 after deletion');
const delNotFound = deleteCustomerById(999);
assert(delNotFound.success === false, 'deleteCustomerById should fail for non-existent user');

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

// 测试同商品数量累加
clearCart();
addToCart(1, 'Apple', 2.5, 3);
const merged = addToCart(1, 'Apple', 2.5, 2);
assert(getCart().length === 1, 'cart should still have 1 item after adding same product');
assert(merged.quantity === 5, `quantity should be 5 after merge, got ${merged.quantity}`);
const mergedTotal = getCartTotal();
assert(mergedTotal === 12.5, `total should be 12.5 after merge, got ${mergedTotal}`);

// 测试对象引用泄露（Bug 2：返回内部对象引用）
clearCart();
const item1 = addToCart(1, 'Apple', 2.5, 3);
item1.quantity = 100;
const item2 = addToCart(1, 'Apple', 2.5, 2);
assert(item2.quantity === 5, `after external mutation, re-add should get quantity 5, got ${item2.quantity} (reference leak bug)`);

// 测试清空购物车
clearCart();
assert(getCart().length === 0, 'cart should be empty after clear');

console.log(`\nResults: ${passed} passed, ${failed} failed`);
process.exit(0);
