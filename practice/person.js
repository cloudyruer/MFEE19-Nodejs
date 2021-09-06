class Person {
  constructor(name = 'noname', age = 20) {
    this.name = name;
    this.age = age;
  }
  toJSON() {
    return {
      name: this.name,
      age: this.age,
    };
  }

  toString() {
    //   NOTE 給以後回來看CODE的我:
    // 別懷疑 其實不用跑 this.toJSON()
    // 因為 this就已經指向該物件了
    // 除非以後還想要加東西 然後我們只要抓name和age吧
    // 但這邊先和老師的示範一致
    return JSON.stringify(this.toJSON(), null, 2); //最後的2 是設定空格 設了會變成以下格式:
  }

  //   {
  //     "name": "Bill",
  //     "age": 26
  //   }
}
module.exports = Person; // node 匯出類別
