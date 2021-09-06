const fs = require('fs');

const data = {
  name: 'David',
  age: 28,
};

// 檔名 / 資料 / callback
fs.writeFile(__dirname + '/data.json', JSON.stringify(data, null, 4), (err) => {
  // fs.writeFile('./data.json', JSON.stringify(data, null, 4), (err) => {
  if (err) {
    console.log('無法寫入檔案😜: ', err);
    process.exit(); //結束程序
  }

  console.log('寫入成功😎😎😎');
});
