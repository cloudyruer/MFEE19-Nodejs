require('dotenv').config(); //載入 .env的設定

// 1. 引入 express
const express = require('express');
// 0908 multer
// 注意: Multer 不会处理任何非 multipart/form-data 类型的表单数据。
const multer = require('multer');
const upload = multer({ dest: 'tmp_uploads/' });
// 0908 下午 自製
const uploadImg = require('./modules/upload-image');

const fs = require('fs').promises;

// 2. 建立 web server 物件
const app = express();

// 不需要require 告訴樣板引擎是甚麼就好

// top-level middleware
// 將 body-parser 設定成頂層 middleware，放在所有路由之前。
// 其包含兩種解析功能： urlencoded 和 json 。
// for body!!!!!!!!!!!!!
// body-parser which cannot handle multipart requests
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

// NOTE 0908 表單
app.get('/try-post-form', (req, res) => {
  res.render('try-post-form');
});

app.post('/try-post-form', (req, res) => {
  res.render('try-post-form', req.body);
});

// app.post('/try-post-form', (req, res) => {
//   console.log(req.body);
//   res.send(req.body);
//   // res.render('try-post-form', req.body);
// });

// app.post('/try-post-form', upload.none(), function (req, res) {
//   console.log(req.body);
//   console.log(Date.now());
//   res.send(req.body);
// });

app.get('/pending', (req, res) => {});

// avatar 上傳的欄位名稱 範例中的欄位名稱為: avatar
app.post('/try-upload', upload.single('avatar'), async (req, res) => {
  console.log(req.file); //查看req.file的屬性
  if (req.file && req.file.mimetype === 'image/jpeg') {
    try {
      // rename 就是移動 移動檔案位置
      await fs.rename(
        req.file.path,
        __dirname + '/public/img/' + req.file.originalname
      );
      return res.json({ success: true, filename: req.file.originalname });
    } catch (err) {
      return res.json({ success: false, error: '無法存檔', err });
    }
  } else {
    // 不是的話就不要
    await fs.unlink(req.file.path); //刪除暫存檔案
    res.json({ success: false, error: '格式不對' });
  }
});

// 0908 下午
app.post('/try-upload2', uploadImg.single('avatar'), async (req, res) => {
  res.json(req.file);
});

// 一個欄位 但上傳多個圖檔 array
// 可以設定參數限制最高數量 uploadImg.array('photo',12)
app.post('/try-upload3', uploadImg.array('photo'), async (req, res) => {
  // NOTE 這邊要改成 files 有 s
  res.json(req.files);
});

// 要兩個 \\ 因為第一個是跳脫 但我們需要 \ 所以 \\
// reg 用來判斷字串 不會轉換類型
// :id(\\d+)? 可以有 也可以沒有  但如果有 就要符合格式
app.get('/my-params1/:action?/:id(\\d+)?', (req, res) => {
  // :action 路徑代稱
  // ? 選擇性
  // * 會變成陣列 '/my-params3/*/*?'
  res.json(req.params);
});

app.get(/^\/m\/09\d{2}-?\d{3}-?\d{3}$/i, (req, res) => {
  let u = req.url.split('?')[0];
  u = u.slice(3);
  u = u.split('-').join('');

  res.json({ url: req.url, mobile: u });
});

// routes/admin 那邊require 過來
app.use(require('./routes/admin2'));

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
