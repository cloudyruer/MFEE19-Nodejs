require('dotenv').config(); //載入 .env的設定
const http = require('http');

const server = http.createServer((req, res) => {
  res.writeHead(200, { 'Content-Type': 'text/html' });

  res.end(`<p>${process.env.PORT}</p>`);
});

server.listen(process.env.PORT, () => {
  console.log('success: on port 3000😆😆😆');
});
