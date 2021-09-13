const express = require('express');
const db = require('./../modules/connect-mysql');
const upload = require('./../modules/upload-image');

const router = express.Router();
// NOTE 謹記這邊開始都是 /address-book 裡面囉

// 進 address-book時
router.get('/', (req, res) => {
  res.render('address-book/main');
});

// 進 address-book/list 時
router.get('/list', async (req, res) => {
  res.locals.pageName = 'ab-list'; // 當前頁面 + css 用
  const perPage = 5;
  // 從這邊取得query string
  let page = parseInt(req.query.page) || 1;

  const output = {};

  const t_sql = 'SELECT COUNT(*) AS totalRows FROM address_book';
  const [[{ totalRows }]] = await db.query(t_sql);
  output.totalRows = totalRows;
  output.totalPages = Math.ceil(totalRows / perPage);
  output.perPage = perPage;
  output.rows = [];
  output.page = page;

  // 如果有資料才去取得真的資料
  // if(totalRows) //寫下面那樣的可讀性比較好
  if (totalRows > 0) {
    if (page < 1) {
      return res.redirect('?page=1');
    }

    if (page > output.totalPages) {
      return res.redirect('?page=' + output.totalPages);
    }

    const sql = `SELECT * FROM \`address_book\` ORDER BY sid DESC LIMIT ${
      (page - 1) * perPage
    }, ${perPage}`;

    const [rows] = await db.query(sql);
    output.rows = rows;
  }

  // res.json(output);
  res.render('address-book/list', output);
});

// [0-9]+ // 0~9  +代表一個以上
router.delete('/delete/:sid([0-9]+)', async (req, res) => {
  const sql = 'DELETE FROM address_book WHERE sid=?';

  const [r] = await db.query(sql, [req.params.sid]);
  console.log({ r });
  res.json(r);
});

// 先決定路徑 再看用甚麼方法
router
  .route('/add')
  .get(async (req, res) => {
    res.locals.pageName = 'ab-add';
    res.render('address-book/add');
  })
  .post(upload.none(), async (req, res) => {
    res.json(req.body);
  });

module.exports = router;
