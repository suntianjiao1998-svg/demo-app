# demo-app

CodeM 售前演示用项目 — 包含预埋的 Bug，用于演示 CodeM 自动修复能力。

## 项目结构

```
src/
├── auth.js      登录鉴权模块（含 3 个 Bug）
├── user.js      用户管理模块（含 2 个 Bug）
├── utils.js     工具函数（含 2 个 Bug）
└── server.js    入口文件
tests/
└── auth.test.js 测试文件
```

## 使用

```bash
npm install
npm start
npm test
```
