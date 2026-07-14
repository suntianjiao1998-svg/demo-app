// 用户管理模块 — 包含 2 个预埋 Bug

// BUG-004: 未校验 req.body 存在性，直接解构会崩溃
function createUser(req) {
  const { name, email } = req.body;  // 如果 req.body 为 undefined 会报错
  return { id: Date.now(), name, email };
}

// BUG-005: 分页 offset 从 1 开始，应为 0
function getUsers(page, size) {
  const offset = page * size;  // 第一页 page=1 → offset=size，跳过了第一批用户
  return `SELECT * FROM users LIMIT ${size} OFFSET ${offset}`;
}

module.exports = { createUser, getUsers };
