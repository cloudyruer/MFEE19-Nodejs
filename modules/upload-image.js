const multer = require('multer');
const { v4: uuidv4 } = require('uuid'); //unique id

// mimetype 對應
const extMap = {
  'image/jpeg': '.jpg',
  'image/png': '.png',
  'image/gif': '.gif',
};

// 這個後
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, __dirname + '/../public/img');
  },
  filename: (req, file, cb) => {
    cb(null, uuidv4() + extMap[file.mimetype]); //加上副檔名
  },
});

// 這個先: 如果過濾完 false 後面就不會執行
const fileFilter = (req, file, cb) => {
  cb(null, !!extMap[file.mimetype]); //!! 轉換成布林直
};

module.exports = multer({ storage, fileFilter });
