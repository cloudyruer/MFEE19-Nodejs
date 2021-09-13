const express = require('express');
const db = require('./../modules/connect-mysql');
const upload = require('./../modules/upload-image');

const router = express.Router();
// NOTE 謹記這邊開始都是 /address-book 裡面囉

// 0913 3:00
async function getListData(req, res) {
  const perPage = 5;
  // 從這邊取得query string
  let page = parseInt(req.query.page) || 1;

  // 0913
  let keyword = req.query.keyword || '';
  keyword = keyword.trim();

  // res.locals.keyword = keyword; //傳給template 要放回search bar

  const output = {};

  let where = ' WHERE 1 ';
  // db.escape 跳脫 防sql injection
  if (keyword) {
    output.keyword = keyword;
    where += ` AND \`name\` LIKE ${db.escape('%' + keyword + '%')}`;
  }

  //
  const t_sql = `SELECT COUNT(*) AS totalRows FROM address_book ${where}`;
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
      // 不要在function 裡面 redirect
      // return res.redirect('?page=1');
      output.redirect = '?page=1';
      return output;
    }

    if (page > output.totalPages) {
      // return res.redirect('?page=' + output.totalPages);
      output.redirect = '?page=' + output.totalPages;
      return output;
    }

    const sql = `SELECT * FROM \`address_book\` ${where} ORDER BY sid DESC LIMIT ${
      (page - 1) * perPage
    }, ${perPage}`;

    const [rows] = await db.query(sql);
    output.rows = rows;
  }

  return output;
}

///////
// 進 address-book時
router.get('/', (req, res) => {
  res.render('address-book/main');
});

// 進 address-book/list 時
router.get('/list', async (req, res) => {
  res.locals.pageName = 'ab-list'; // 當前頁面 + css 用

  const output = await getListData(req, res);

  if (output.redirect) {
    return res.redirect(output.redirect);
  }

  // res.json(output);
  res.render('address-book/list', output);
});

router.get('/api/list', async (req, res) => {
  const output = await getListData(req, res);
  res.json(output);
});

// 這樣代表只有用戶是用數值才會進來
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
  // .post(upload.none(), async (req, res) => {
  .post(async (req, res) => {
    // TODO: 欄位檢查
    const output = {
      success: false,
    };

    // NOTE 第一種
    // const sql =
    //   'INSERT INTO `address_book`(' +
    //   '`name`, `email`, `mobile`, `birthday`, `address`, `created_at`) VALUES (?, ?, ?, ?, ?, NOW())';

    // const [result] = await db.query(sql, [
    //   req.body.name,
    //   req.body.email,
    //   req.body.mobile,
    //   req.body.birthday,
    //   req.body.address,
    // ]);

    // NOTE 第二種: 非標準的sql寫法 是MySQL2套件提供的寫法
    //  ? 裡面放得要是一個obj
    console.log(req.body);
    const input = { ...req.body, created_at: new Date() };
    // 必填欄位都要有
    const sql = 'INSERT INTO `address_book` SET ?';
    let result = {};
    // 處理新增資料時可能的錯誤
    try {
      [result] = await db.query(sql, [input]);
    } catch (ex) {
      // 有空的話 也可以根據錯誤訊息產生不同的客製化訊息
      // 例如 duplicate 開頭的 就可以說 "該email已被使用" 之類的 (如果有設unique)
      output.error = ex.toString();
    }

    output.result = result;
    // insertId 插進去的sid
    if (result.affectedRows && result.insertId) {
      output.success = true;
    }

    console.log({ result });
    /*
    {
      result: ResultSetHeader {
        fieldCount: 0,
        affectedRows: 1,
        insertId: 148,
        info: '',
        serverStatus: 2,
        warningStatus: 0
      }
    }
     */

    res.json(output);
  });

router
  .route('/edit/:sid')
  .get(async (req, res) => {
    const sql = 'SELECT * FROM address_book WHERE sid=?';
    const [rs] = await db.query(sql, [req.params.sid]);

    if (rs.length) {
      res.render('address-book/edit', { row: rs[0] });
    } else {
      res.redirect('/address-book/list');
    }
  })
  .post(async (req, res) => {
    // TODO: 欄位檢查
    const output = {
      success: false,
      postData: req.body,
    };

    const input = { ...req.body };
    const sql = 'UPDATE `address_book` SET ? WHERE sid=?';
    let result = {};
    // 處理修改資料時可能的錯誤
    try {
      [result] = await db.query(sql, [input, req.params.sid]);
    } catch (ex) {
      output.error = ex.toString();
    }
    output.result = result;

    // NOTE 重要 另外如果是要用RESTful的話 這邊用PUT
    // 找到row
    if (result.affectedRows === 1) {
      // 實際上有更動的row 亦及有更新成功才會有changeRows
      // 所以要兩個值都是1 才會是有修改成功
      if (result.changedRows === 1) {
        output.success = true;
      } else {
        output.error = '資料沒有變更';
      }
    }

    res.json(output);
  });

module.exports = router;
