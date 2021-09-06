const { f1: pikachu, f3 } = require('./arrow-fun');
const f2 = require(__dirname + '/arrow-fun');

console.log(pikachu(9));
console.log(f3(10));
// console.log(__dirname); //檔案位置
// console.log(__filename);
console.log(f2.f1(9));
console.log(f2.f3(10));
