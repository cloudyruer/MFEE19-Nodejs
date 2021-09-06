const Person = require('./person');

const p1 = new Person('Bill', 26);
const p2 = new Person();
console.log(p1.toJSON()); //注意 這個不是真的toJSON 只是跟隨範例
console.log(JSON.stringify(p1, null, 2));
console.log(p1.toString());
