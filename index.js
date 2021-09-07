require('dotenv').config(); //載入 .env的設定

// 1. 引入 express
const express = require('express');

// 2. 建立 web server 物件
const app = express();

// 不需要require 告訴樣板引擎是甚麼就好

// top-level middleware
app.use(express.urlencoded({ extended: false }));
app.use(express.json());

app.set('view engine', 'ejs');

// 用此這方式設定 public相當於網站的根目錄
app.use(express.static('public'));

// 已經設定路徑 因此不是top level middleware
app.use('/jquery', express.static('node_modules/jquery/dist'));
app.use('/bootstrap', express.static('node_modules/bootstrap/dist'));
// app.use(express.static('public'));

// 3. *** 路由定義開始: BEGIN
// 路由在前面就會優先使用
app.get('/', (req, res) => {
  // 第一個參數樣板相對路徑 不會是斜線開頭
  // 第二個參數
  // 不用打附檔名 因為前面已經設定了樣板引擎
  res.render('home', { name: 'Joey' });
  // res.send('Hello World!');
});

app.get('/json-sales', (req, res) => {
  const sales = require('./data/sales.json'); //JSON 會自動轉換成原生的JS 陣列 或 物件
  // require 只有第一次會有載入
  // 所以如果第二次的話不會有所更改 要重新啟動

  console.log(sales);
  // 當傳遞物件或陣列時，這兩個方法是相同的，但是res.json()也會轉換非物件，如null和undefined，這些無效的JSON。
  // json() 把陣列或物件轉換成JSON 字串 再丟給用戶端
  // res.json(sales); //效果和send會一樣  但是更加明確
  // res.send(sales);
  // res.render('json-sales', { sales: sales });
  res.render('json-sales', { sales });
});

app.get('/try-qs', (req, res) => {
  res.json(req.query);
});

// 把 urlencodedParser 當 middleware
app.post('/try-post', (req, res) => {
  // 沒有middleware req.body 沒有東西
  res.json(req.body);
});

// NOTE
// https://stackoverflow.com/questions/19041837/difference-between-res-send-and-res-json-in-express-js
// app.get('/test', (req, res) => {
//   res.json('100');
// });

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
  console.log(`${new Date()}`);
  console.log(`App running on port ${port}...😊 `);
});
