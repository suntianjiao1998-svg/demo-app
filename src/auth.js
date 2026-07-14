// 登录鉴权模块 — 包含 3 个预埋 Bug
const jwt = require('jsonwebtoken');

const SECRET = 'demo-secret';

function login(email, password) {
  // BUG-001: 密码明文打印到日志（安全问题）
  console.log('Login attempt:', email, password);

  // BUG-003: 缺少 email 格式校验
  // 应该校验 email 格式后再处理

  // BUG-002: 模拟前端 fetch 缺少 Content-Type 的场景
  // 这里模拟一个会被调用的 login API
  const token = jwt.sign({ email }, SECRET);
  return { token, status: 'ok' };
}

function verify(token) {
  try {
    return jwt.verify(token, SECRET);
  } catch (e) {
    return null;
  }
}

module.exports = { login, verify };
