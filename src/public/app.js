// ===== CRM 前端交互逻辑 =====

let logCount = 0;

// ===== Tab 切换 =====
function switchTab(tab) {
  document.querySelectorAll('.tab-content').forEach(el => el.classList.remove('active'));
  const target = document.getElementById('tab-' + tab);
  if (target) target.classList.add('active');
  document.querySelectorAll('.nav-item').forEach(el => el.classList.remove('active'));
  const navItems = document.querySelectorAll('.nav-item');
  const tabMap = { dashboard: 0, customers: 1, orders: 2, logs: 3 };
  if (navItems[tabMap[tab]]) navItems[tabMap[tab]].classList.add('active');
  const titles = { dashboard: '仪表盘', customers: '客户管理', orders: '订单管理', logs: '操作日志' };
  document.getElementById('pageTitle').textContent = titles[tab] || '';
  document.getElementById('breadcrumbCurrent').textContent = titles[tab] || '';
  if (tab === 'dashboard') renderDashboard();
  if (tab === 'customers') renderCustomers();
  if (tab === 'orders') renderCart();
}

// ===== 添加客户表单切换 =====
function toggleAddForm() {
  const form = document.getElementById('addForm');
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

// ===== 添加客户 =====
async function addCustomer() {
  const username = document.getElementById('username').value.trim();
  const email = document.getElementById('email').value.trim();
  const password = document.getElementById('password').value.trim();

  if (!username || !email || !password) {
    log('请填写所有字段', 'error');
    return;
  }

  try {
    const res = await fetch('/api/customers', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password }),
    });
    const data = await res.json();
    if (!res.ok) {
      log('注册失败：' + data.error, 'error');
      return;
    }
    log('客户添加成功：' + data.user.username, 'success');
    document.getElementById('username').value = '';
    document.getElementById('email').value = '';
    document.getElementById('password').value = '';
    renderCustomers();
  } catch (err) {
    log('网络错误：' + err.message, 'error');
  }
}

// ===== 删除客户 =====
async function deleteCustomer(id) {
  try {
    const res = await fetch('/api/customers/' + id, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      log('删除失败：' + data.error, 'error');
      return;
    }
    log('客户已删除，ID：' + id, 'success');
    renderCustomers();
  } catch (err) {
    log('网络错误：' + err.message, 'error');
  }
}

// ===== 渲染客户列表 =====
async function renderCustomers() {
  try {
    const res = await fetch('/api/customers');
    const customers = await res.json();
    const tbody = document.getElementById('customerList');
    if (customers.length === 0) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="5">暂无客户数据</td></tr>';
      return;
    }
    tbody.innerHTML = customers.map(c => `
      <tr>
        <td>${c.id}</td>
        <td>${c.username}</td>
        <td>${c.email}</td>
        <td>${c.createdAt ? new Date(c.createdAt).toLocaleString('zh-CN') : '-'}</td>
        <td><button class="delete-btn" onclick="deleteCustomer(${c.id})">删除</button></td>
      </tr>
    `).join('');
  } catch (err) {
    log('加载客户列表失败：' + err.message, 'error');
  }
}

// ===== 添加商品到购物车 =====
async function addToCart() {
  const productId = parseInt(document.getElementById('productId').value);
  const name = document.getElementById('productName').value.trim();
  const price = parseFloat(document.getElementById('productPrice').value);
  const quantity = parseInt(document.getElementById('productQty').value);

  if (!productId || !name || isNaN(price) || !quantity) {
    log('请填写完整的商品信息', 'error');
    return;
  }

  try {
    const res = await fetch('/api/cart', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ productId, name, price, quantity }),
    });
    const data = await res.json();
    if (!res.ok) {
      log('添加失败：' + data.error, 'error');
      return;
    }
    log(`商品已添加：${name} ×${quantity}，当前总价：$${data.total.toFixed(2)}`, 'success');
    document.getElementById('productId').value = '';
    document.getElementById('productName').value = '';
    document.getElementById('productPrice').value = '';
    document.getElementById('productQty').value = '1';
    renderCart();
  } catch (err) {
    log('网络错误：' + err.message, 'error');
  }
}

// ===== 从购物车移除商品 =====
async function removeFromCart(productId) {
  try {
    const res = await fetch('/api/cart/' + productId, { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      log('移除失败：' + data.error, 'error');
      return;
    }
    log('商品已移除，当前总价：$' + data.total.toFixed(2), 'success');
    renderCart();
  } catch (err) {
    log('网络错误：' + err.message, 'error');
  }
}

// ===== 清空购物车 =====
async function clearCart() {
  try {
    const res = await fetch('/api/cart', { method: 'DELETE' });
    const data = await res.json();
    if (!res.ok) {
      log('清空失败：' + data.error, 'error');
      return;
    }
    log('购物车已清空', 'success');
    renderCart();
  } catch (err) {
    log('网络错误：' + err.message, 'error');
  }
}

// ===== 渲染购物车 =====
async function renderCart() {
  try {
    const res = await fetch('/api/cart');
    const data = await res.json();
    const tbody = document.getElementById('cartList');
    if (data.items.length === 0) {
      tbody.innerHTML = '<tr class="empty-row"><td colspan="6">购物车为空</td></tr>';
    } else {
      tbody.innerHTML = data.items.map(item => `
        <tr>
          <td>${item.productId}</td>
          <td>${item.name}</td>
          <td>$${item.price.toFixed(2)}</td>
          <td>${item.quantity}</td>
          <td>$${(item.price * item.quantity).toFixed(2)}</td>
          <td><button class="delete-btn" onclick="removeFromCart(${item.productId})">移除</button></td>
        </tr>
      `).join('');
    }
    document.getElementById('cartTotal').textContent = '$' + data.total.toFixed(2);
  } catch (err) {
    log('加载购物车失败：' + err.message, 'error');
  }
}

// ===== 仪表盘渲染 =====
async function renderDashboard() {
  try {
    const res = await fetch('/api/dashboard');
    const data = await res.json();

    // 统计卡片
    document.getElementById('statCustomers').textContent = data.customerCount;
    document.getElementById('statCartItems').textContent = data.cartItemCount;
    document.getElementById('statCartTotal').textContent = '$' + data.cartTotal.toFixed(2);
    document.getElementById('statLogs').textContent = logCount;

    // 最近客户表
    const recentBody = document.getElementById('recentCustomerList');
    if (data.recentCustomers.length === 0) {
      recentBody.innerHTML = '<tr class="empty-row"><td colspan="4">暂无客户</td></tr>';
    } else {
      recentBody.innerHTML = data.recentCustomers.map(c => `
        <tr>
          <td>${c.id}</td>
          <td>${c.username}</td>
          <td>${c.email}</td>
          <td>${c.createdAt ? new Date(c.createdAt).toLocaleString('zh-CN') : '-'}</td>
        </tr>
      `).join('');
    }

    // 订单概览表
    const summaryBody = document.getElementById('cartSummaryList');
    if (data.cartSummary.length === 0) {
      summaryBody.innerHTML = '<tr class="empty-row"><td colspan="3">购物车为空</td></tr>';
    } else {
      summaryBody.innerHTML = data.cartSummary.map(item => `
        <tr>
          <td>${item.name}</td>
          <td>${item.quantity}</td>
          <td>$${item.subtotal.toFixed(2)}</td>
        </tr>
      `).join('');
    }
    document.getElementById('dashCartTotal').textContent = '$' + data.cartTotal.toFixed(2);
  } catch (err) {
    log('加载仪表盘失败：' + err.message, 'error');
  }
}

// ===== 日志输出 =====
function log(message, type) {
  const logArea = document.getElementById('logArea');
  const entry = document.createElement('p');
  entry.className = 'log-entry' + (type ? ' ' + type : '');
  const time = new Date().toLocaleTimeString('zh-CN');
  entry.textContent = `[${time}] ${message}`;
  logArea.appendChild(entry);
  logArea.scrollTop = logArea.scrollHeight;
  logCount++;
}

// ===== 清空日志 =====
function clearLogs() {
  const logArea = document.getElementById('logArea');
  logArea.innerHTML = '<p class="log-entry">[系统] 日志已清空</p>';
  logCount = 0;
}

// ===== 页面初始化 =====
renderDashboard();
