const express = require('express');
const path = require('path');
const { register, getUserByUsername, getAllUsers, deleteCustomerById } = require('./auth');
const { addToCart, removeFromCart, getCartTotal, getCart, clearCart, seedCart } = require('./cart');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

// ===== 初始化种子数据 =====
function seedData() {
  // 注册初始客户
  const seedCustomers = [
    { username: '张伟', email: 'zhangwei@company.com', password: 'zhang123456' },
    { username: '李娜', email: 'lina@company.com', password: 'lina123456' },
    { username: '王强', email: 'wangqiang@company.com', password: 'wang123456' },
    { username: '刘洋', email: 'liuyang@company.com', password: 'liu123456' },
    { username: '陈静', email: 'chenjing@company.com', password: 'chen123456' },
    { username: '赵磊', email: 'zhaolei@company.com', password: 'zhao123456' },
    { username: '孙芳', email: 'sunfang@company.com', password: 'sun123456' },
    { username: '周明', email: 'zhouming@company.com', password: 'zhou123456' },
  ];
  seedCustomers.forEach(c => register(c.username, c.email, c.password));

  // 初始化购物车商品
  const seedCartItems = [
    { productId: 1001, name: '企业版授权 License', price: 2999.00, quantity: 2 },
    { productId: 1002, name: '技术支持服务包', price: 599.00, quantity: 3 },
    { productId: 1003, name: '数据存储扩容 1TB', price: 899.00, quantity: 1 },
    { productId: 1004, name: 'API 调用包 (10万次)', price: 199.00, quantity: 5 },
  ];
  seedCartItems.forEach(item => addToCart(item.productId, item.name, item.price, item.quantity));
}

// 启动时填充种子数据
seedData();

// ===== 客户管理 API =====

// 获取所有客户
app.get('/api/customers', (req, res) => {
  const users = getAllUsers();
  res.json(users.map(u => ({
    id: u.id,
    username: u.username,
    email: u.email,
    createdAt: u.createdAt,
  })));
});

// 注册新客户
app.post('/api/customers', (req, res) => {
  const { username, email, password } = req.body;
  if (!username || !email || !password) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const result = register(username, email, password);
  if (!result.success) {
    return res.status(400).json({ error: result.message });
  }
  res.status(201).json(result);
});

// 删除客户
app.delete('/api/customers/:id', (req, res) => {
  const id = parseInt(req.params.id);
  const result = deleteCustomerById(id);
  if (!result.success) {
    return res.status(404).json({ error: result.message });
  }
  res.json(result);
});

// ===== 购物车/订单 API =====

// 获取购物车
app.get('/api/cart', (req, res) => {
  const items = getCart();
  const total = getCartTotal();
  res.json({ items, total, formatted: '$' + total.toFixed(2) });
});

// 添加商品到购物车
app.post('/api/cart', (req, res) => {
  const { productId, name, price, quantity } = req.body;
  if (!productId || !name || price === undefined || !quantity) {
    return res.status(400).json({ error: 'Missing required fields' });
  }
  const item = addToCart(productId, name, price, quantity);
  res.status(201).json({ success: true, item, total: getCartTotal() });
});

// 从购物车移除商品
app.delete('/api/cart/:productId', (req, res) => {
  const productId = parseInt(req.params.productId);
  const result = removeFromCart(productId);
  if (!result.success) {
    return res.status(404).json({ error: result.message });
  }
  res.json({ success: true, total: getCartTotal() });
});

// 清空购物车
app.delete('/api/cart', (req, res) => {
  clearCart();
  res.json({ success: true, message: 'Cart cleared' });
});

// ===== 仪表盘统计 API =====

app.get('/api/dashboard', (req, res) => {
  const customers = getAllUsers();
  const cart = getCart();
  const total = getCartTotal();

  // 最近注册的客户（取后5个）
  const recentCustomers = customers.slice(-5).reverse().map(u => ({
    id: u.id,
    username: u.username,
    email: u.email,
    createdAt: u.createdAt,
  }));

  // 购物车商品摘要
  const cartSummary = cart.map(item => ({
    name: item.name,
    quantity: item.quantity,
    subtotal: item.price * item.quantity,
  }));

  res.json({
    customerCount: customers.length,
    cartItemCount: cart.length,
    cartTotal: total,
    recentCustomers,
    cartSummary,
  });
});

// 启动服务
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`CRM Server running on http://localhost:${PORT}`);
});

module.exports = { app };
