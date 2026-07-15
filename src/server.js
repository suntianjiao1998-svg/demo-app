const express = require('express');
const app = express();

app.use(express.json());

const users = [
  { id: 1, name: 'Alice', email: 'alice@example.com', role: 'admin' },
  { id: 2, name: 'Bob', email: 'bob@example.com', role: 'user' },
  { id: 3, name: 'Charlie', email: 'charlie@example.com', role: 'user' },
];

function calculateTotal(items) {
  let total = 0;
  for (let i = 0; i < items.length; i++) {
    total += items[i].price * items[i].quantity;
  }
  return total;
}

function formatPrice(amount) {
  return '$' + amount.toFixed(2);
}

app.get('/users/:id', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  res.json(user);
});

app.get('/users', (req, res) => {
  res.json(users);
});

app.post('/orders/calculate', (req, res) => {
  const items = req.body.items;
  if (!items || items.length === 0) {
    return res.status(400).json({ error: 'No items provided' });
  }
  const total = calculateTotal(items);
  res.json({ total, formatted: formatPrice(total) });
});

app.get('/users/:id/check-permission', (req, res) => {
  const user = users.find(u => u.id === parseInt(req.params.id));
  if (!user) {
    return res.status(404).json({ error: 'User not found' });
  }
  const hasPermission = user.role === 'admin';
  res.json({ userId: user.id, hasPermission });
});

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

module.exports = { app, calculateTotal, formatPrice, users };
