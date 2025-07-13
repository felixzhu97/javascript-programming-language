/**
 * JavaScript高级程序设计 - 第2章：箭头函数
 *
 * 本文件演示ES6箭头函数的语法、特性和使用场景
 */

console.log("=== JavaScript 箭头函数 ===\n");

// 1. 箭头函数的基本语法
console.log("1. 箭头函数的基本语法：");

// 传统函数
function traditionalAdd(a, b) {
  return a + b;
}

// 箭头函数
const arrowAdd = (a, b) => a + b;

// 单参数可以省略括号
const square = (x) => x * x;

// 无参数需要空括号
const sayHello = () => "Hello World!";

// 多行函数体需要花括号和return
const complexFunction = (x, y) => {
  const sum = x + y;
  const product = x * y;
  return { sum, product };
};

console.log("传统函数：", traditionalAdd(3, 4));
console.log("箭头函数：", arrowAdd(3, 4));
console.log("单参数：", square(5));
console.log("无参数：", sayHello());
console.log("多行函数：", complexFunction(3, 4));

// 2. 箭头函数与this绑定
console.log("\n2. 箭头函数与this绑定：");

const obj = {
  name: "MyObject",

  // 传统方法
  traditionalMethod: function () {
    console.log("传统方法this：", this.name);

    // 内部函数的this指向全局对象
    function innerFunction() {
      console.log("内部函数this：", this.name || "undefined");
    }

    innerFunction();
  },

  // 箭头函数方法
  arrowMethod: function () {
    console.log("箭头函数方法this：", this.name);

    // 箭头函数继承外部this
    const innerArrow = () => {
      console.log("内部箭头函数this：", this.name);
    };

    innerArrow();
  },
};

obj.traditionalMethod();
obj.arrowMethod();

// 3. 箭头函数在数组方法中的应用
console.log("\n3. 箭头函数在数组方法中的应用：");

const numbers = [1, 2, 3, 4, 5];

// map
const doubled = numbers.map((x) => x * 2);
console.log("map结果：", doubled);

// filter
const evens = numbers.filter((x) => x % 2 === 0);
console.log("filter结果：", evens);

// reduce
const sum = numbers.reduce((acc, x) => acc + x, 0);
console.log("reduce结果：", sum);

// forEach
console.log("forEach结果：");
numbers.forEach((x) => console.log(`数字：${x}`));

// 4. 箭头函数的限制
console.log("\n4. 箭头函数的限制：");

// 箭头函数没有arguments对象
function traditionalFunction() {
  console.log("传统函数arguments：", arguments.length);
}

const arrowFunction = (...args) => {
  console.log("箭头函数剩余参数：", args.length);
};

traditionalFunction(1, 2, 3);
arrowFunction(1, 2, 3);

// 箭头函数不能作为构造函数
function TraditionalConstructor(name) {
  this.name = name;
}

const ArrowConstructor = (name) => {
  this.name = name;
};

const traditional = new TraditionalConstructor("Traditional");
console.log("传统构造函数：", traditional.name);

// const arrow = new ArrowConstructor('Arrow'); // TypeError

// 5. 箭头函数在事件处理中的应用
console.log("\n5. 箭头函数在事件处理中的应用：");

class EventHandler {
  constructor(name) {
    this.name = name;
    this.count = 0;
  }

  // 传统方法需要bind
  traditionalHandler() {
    this.count++;
    console.log(`${this.name} 传统处理器被调用 ${this.count} 次`);
  }

  // 箭头函数自动绑定this
  arrowHandler = () => {
    this.count++;
    console.log(`${this.name} 箭头处理器被调用 ${this.count} 次`);
  };

  setupHandlers() {
    // 模拟事件绑定
    const button1 = { addEventListener: (event, handler) => handler() };
    const button2 = { addEventListener: (event, handler) => handler() };

    // 传统方法需要bind
    button1.addEventListener("click", this.traditionalHandler.bind(this));

    // 箭头函数不需要bind
    button2.addEventListener("click", this.arrowHandler);
  }
}

const handler = new EventHandler("MyHandler");
handler.setupHandlers();

// 6. 箭头函数与闭包
console.log("\n6. 箭头函数与闭包：");

function createCounter() {
  let count = 0;

  return {
    // 传统函数
    increment: function () {
      count++;
      return count;
    },

    // 箭头函数
    decrement: () => {
      count--;
      return count;
    },

    // 箭头函数返回箭头函数
    getAdder: () => (value) => {
      count += value;
      return count;
    },
  };
}

const counter = createCounter();
console.log("increment：", counter.increment());
console.log("decrement：", counter.decrement());
const adder = counter.getAdder();
console.log("adder：", adder(5));

// 7. 箭头函数的链式调用
console.log("\n7. 箭头函数的链式调用：");

const pipeline = [(x) => x + 1, (x) => x * 2, (x) => x - 3, (x) => x / 2];

const result = pipeline.reduce((value, fn) => fn(value), 5);
console.log("管道结果：", result); // ((5 + 1) * 2 - 3) / 2 = 4.5

// 8. 箭头函数在Promise中的应用
console.log("\n8. 箭头函数在Promise中的应用：");

// 模拟异步操作
const fetchData = () => {
  return new Promise((resolve) => {
    setTimeout(() => resolve("数据"), 100);
  });
};

const processData = (data) => {
  return new Promise((resolve) => {
    setTimeout(() => resolve(`处理后的${data}`), 50);
  });
};

// 使用箭头函数简化Promise链
fetchData()
  .then((data) => {
    console.log("获取数据：", data);
    return processData(data);
  })
  .then((processedData) => {
    console.log("处理数据：", processedData);
  })
  .catch((error) => {
    console.error("错误：", error);
  });

// 9. 箭头函数与解构赋值
console.log("\n9. 箭头函数与解构赋值：");

const users = [
  { name: "Alice", age: 25, city: "New York" },
  { name: "Bob", age: 30, city: "London" },
  { name: "Charlie", age: 35, city: "Tokyo" },
];

// 解构参数
const getName = ({ name }) => name;
const getInfo = ({ name, age }) => `${name} (${age})`;

console.log("解构获取名字：", users.map(getName));
console.log("解构获取信息：", users.map(getInfo));

// 10. 高阶函数与箭头函数
console.log("\n10. 高阶函数与箭头函数：");

// 柯里化
const curry = (fn) => (a) => (b) => fn(a, b);
const add = (a, b) => a + b;
const curriedAdd = curry(add);

console.log("柯里化：", curriedAdd(3)(4));

// 组合函数
const compose = (f, g) => (x) => f(g(x));
const addOne = (x) => x + 1;
const multiplyTwo = (x) => x * 2;
const composed = compose(multiplyTwo, addOne);

console.log("组合函数：", composed(5)); // (5 + 1) * 2 = 12

// 11. 箭头函数的性能考虑
console.log("\n11. 箭头函数的性能考虑：");

// 在循环中创建箭头函数
const createHandlers = () => {
  const handlers = [];

  for (let i = 0; i < 3; i++) {
    // 每次迭代都创建新的箭头函数
    handlers.push(() => console.log(`处理器 ${i}`));
  }

  return handlers;
};

const handlers = createHandlers();
handlers.forEach((handler) => handler());

// 12. 箭头函数的最佳实践
console.log("\n12. 箭头函数的最佳实践：");

// 简短的函数表达式
const isEven = (x) => x % 2 === 0;
const isPositive = (x) => x > 0;

// 数组操作
const data = [1, 2, 3, 4, 5];
const processedData = data
  .filter(isPositive)
  .filter(isEven)
  .map((x) => x * x);

console.log("最佳实践结果：", processedData);

// 13. 箭头函数与对象方法
console.log("\n13. 箭头函数与对象方法：");

const calculator = {
  value: 0,

  // 不推荐：箭头函数作为对象方法
  arrowAdd: (x) => {
    // this不指向calculator对象
    console.log("箭头函数this：", this.value || "undefined");
  },

  // 推荐：传统函数作为对象方法
  traditionalAdd: function (x) {
    this.value += x;
    console.log("传统函数this：", this.value);
    return this;
  },

  // 推荐：简写方法
  multiply(x) {
    this.value *= x;
    console.log("简写方法：", this.value);
    return this;
  },
};

calculator.arrowAdd(5);
calculator.traditionalAdd(10).multiply(2);

// 14. 实用工具函数
console.log("\n14. 实用工具函数：");

// 函数式编程工具
const map = (fn) => (arr) => arr.map(fn);
const filter = (fn) => (arr) => arr.filter(fn);
const reduce = (fn) => (initial) => (arr) => arr.reduce(fn, initial);

// 组合使用
const processNumbers = compose(
  map((x) => x * 2),
  filter((x) => x > 0)
);

const testNumbers = [-2, -1, 0, 1, 2, 3];
console.log("函数式处理：", processNumbers(testNumbers));

// 防抖函数（箭头函数版本）
const debounce = (func, delay) => {
  let timeoutId;
  return (...args) => {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func(...args), delay);
  };
};

// 节流函数（箭头函数版本）
const throttle = (func, limit) => {
  let inThrottle;
  return (...args) => {
    if (!inThrottle) {
      func(...args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
};

// 管道函数
const pipe =
  (...fns) =>
  (value) =>
    fns.reduce((acc, fn) => fn(acc), value);

const mathPipe = pipe(
  (x) => x + 1,
  (x) => x * 2,
  (x) => x - 3
);

console.log("管道函数：", mathPipe(5));

console.log("\n=== 箭头函数示例完成 ===");

// 导出供测试使用
module.exports = {
  arrowAdd,
  square,
  sayHello,
  complexFunction,
  curry,
  compose,
  debounce,
  throttle,
  pipe,
  map,
  filter,
  reduce,
};
