const f1 = (a) => a * a;
const f3 = (a) => a ** 3;

// console.log('來自arrow-fun: ', f1(7));
// console.log('來自arrow-fun: ', __dirname);
// console.log('來自arrow-fun: ', __filename);

// module.exports = f1; //匯出
module.exports = { f1, f3 }; //匯出

// console.log('來自arrow-fun(匯出後): ', f1(7));
