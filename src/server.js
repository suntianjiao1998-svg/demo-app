const express = require('express');
const path = require('path');
const { register, getUserByUsername, getAllUsers } = require('./auth');
const { addToCart, removeFromCart, getCartTotal, getCart, clearCart } = require('./cart');

const app = express();
app.use(express.json());
app.use(express.static(path.join(__dirname, 'public')));

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
  const users = getAllUsers();
  const index = users.findIndex(u => u.id === id);
  if (index === -1) {
    return res.status(404).json({ error: 'Customer not found' });
  }
  users.splice(index, 1);
  res.json({ success: true, message: 'Customer deleted' });
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

// 启动服务
const PORT = 3000;
app.listen(PORT, () => {
  console.log(`CRM Server running on http://localhost:${PORT}`);
});

module.exports = { app };
