require('dotenv').config(); //載入 .env的設定

// 1. 引入 express
const express = require('express');

// 2. 建立 web server 物件
const app = express();

app.use(express.static('public'));

// 3. *** 路由定義開始: BEGIN
app.get('/', (req, res) => {
  res.send('Hello World!');
});

// *** 路由定義結束: END
app.use((req, res) => {
  res.status(404).send(`<h1>找不到頁面</h1>`);
});

// 4. Server 偵聽 NOTE
// 老師的 process.env.PORT 是 3001
// 但我這邊改回習慣的3000
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`NODE_ENV: ${process.env.NODE_ENV}`);
  console.log(`App running on port ${port}...😊`);
});
