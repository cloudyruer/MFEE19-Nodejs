const db = require('./../modules/connect-mysql');

db.query('SELECT * FROM address_book LIMIT 5')
  .then(([r]) => {
    console.log(r);
    process.exit();
  })
  .catch((ex) => {
    console.log(ex);
  });
