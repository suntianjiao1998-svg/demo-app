// 入口文件
const http = require('http');
const { login, verify } = require('./auth');
const { createUser, getUsers } = require('./user');

const server = http.createServer((req, res) => {
  if (req.url === '/login' && req.method === 'POST') {
    let body = '';
    req.on('data', chunk => body += chunk);
    req.on('end', () => {
      const { email, password } = JSON.parse(body);
      const result = login(email, password);
      res.writeHead(200, { 'Content-Type': 'application/json' });
      res.end(JSON.stringify(result));
    });
  } else {
    res.writeHead(404);
    res.end('Not Found');
  }
});

server.listen(3000, () => {
  console.log('Server running on port 3000');
});

module.exports = server;
