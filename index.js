require('dotenv').config(); //載入 .env的設定

// 1. 引入 express
const express = require('express');

// 2. 建立 web server 物件
const app = express();

// 不需要require 告訴樣板引擎是甚麼就好
app.set('view engine', 'ejs');

// 用此這方式設定 public相當於網站的根目錄
app.use(express.static('public'));

app.use('/jquery', express.static('node_modules/jquery/dist'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
// app.use(express.static('public'));

// 3. *** 路由定義開始: BEGIN
// 路由在前面就會優先使用
app.get('/', (req, res) => {
  // 第一個參數樣板相對路徑 不會是斜線開頭
  // 第二個參數
  res.render('home', { name: 'Joey' });
  // res.send('Hello World!');
});

// *** 路由定義結束: END
// NOTE 順序重要 一定要在最後面
// 不然前面的會直接被這個取代[]
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
