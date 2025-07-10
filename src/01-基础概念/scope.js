/**
 * JavaScript高级程序设计 - 第1章：作用域和提升
 *
 * 本文件演示JavaScript中的作用域、变量提升和执行上下文
 */

console.log("=== JavaScript 作用域和提升 ===\n");

// 1. 全局作用域
console.log("1. 全局作用域：");

var globalVar = "全局变量";
let globalLet = "全局let";
const globalConst = "全局const";

// 全局对象上的属性
console.log(
  "window.globalVar (Node.js中为global):",
  typeof window !== "undefined" ? window.globalVar : global.globalVar
);
console.log("var声明会成为全局对象的属性");

// 2. 函数作用域
console.log("\n2. 函数作用域：");

function functionScope() {
  var functionVar = "函数变量";
  let functionLet = "函数let";
  const functionConst = "函数const";

  console.log("函数内部可以访问：", functionVar, functionLet, functionConst);

  // 内部函数可以访问外部函数的变量
  function innerFunction() {
    console.log("内部函数访问外部函数变量：", functionVar);
  }

  innerFunction();
}

functionScope();

// console.log('函数外部无法访问：', functionVar); // ReferenceError

// 3. 块级作用域
console.log("\n3. 块级作用域：");

{
  var blockVar = "var在块中";
  let blockLet = "let在块中";
  const blockConst = "const在块中";

  console.log("块内部：", blockVar, blockLet, blockConst);
}

console.log("块外部访问var：", blockVar); // 可以访问
// console.log('块外部访问let：', blockLet); // ReferenceError
// console.log('块外部访问const：', blockConst); // ReferenceError

// 4. 变量提升（Hoisting）
console.log("\n4. 变量提升：");

console.log("var提升示例：");
console.log("提升前访问：", typeof hoistedVar); // undefined
var hoistedVar = "被提升的变量";
console.log("提升后访问：", hoistedVar);

// 函数提升
console.log("\n函数提升示例：");
console.log("函数提升前调用：", hoistedFunction()); // 可以调用

function hoistedFunction() {
  return "被提升的函数";
}

// 函数表达式不会提升
console.log("函数表达式提升：", typeof functionExpression); // undefined
var functionExpression = function () {
  return "函数表达式";
};

// 5. 暂时性死区（Temporal Dead Zone）
console.log("\n5. 暂时性死区：");

function temporalDeadZone() {
  console.log("TDZ示例：");
  // console.log('访问let变量：', letVariable); // ReferenceError
  // console.log('访问const变量：', constVariable); // ReferenceError

  let letVariable = "let变量";
  const constVariable = "const变量";

  console.log("声明后访问：", letVariable, constVariable);
}

temporalDeadZone();

// 6. 作用域链
console.log("\n6. 作用域链：");

var outerVar = "外层变量";

function outerFunction() {
  var middleVar = "中层变量";

  function innerFunction() {
    var innerVar = "内层变量";

    console.log("内层函数访问：");
    console.log("- 内层变量：", innerVar);
    console.log("- 中层变量：", middleVar);
    console.log("- 外层变量：", outerVar);
  }

  innerFunction();
}

outerFunction();

// 7. 立即执行函数表达式（IIFE）
console.log("\n7. 立即执行函数表达式：");

(function () {
  var iifeVar = "IIFE变量";
  console.log("IIFE内部：", iifeVar);
})();

// console.log('IIFE外部：', iifeVar); // ReferenceError

// 带参数的IIFE
(function (param) {
  console.log("带参数的IIFE：", param);
})("传递的参数");

// 8. 闭包和作用域
console.log("\n8. 闭包和作用域：");

function createCounter() {
  let count = 0;

  return function () {
    count++;
    console.log("计数器：", count);
    return count;
  };
}

const counter1 = createCounter();
const counter2 = createCounter();

counter1(); // 1
counter1(); // 2
counter2(); // 1 (独立的作用域)

// 9. 循环中的作用域问题
console.log("\n9. 循环中的作用域问题：");

console.log("var在循环中的问题：");
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log("var循环：", i); // 都是3
  }, 100 * i);
}

console.log("let在循环中的解决方案：");
for (let j = 0; j < 3; j++) {
  setTimeout(function () {
    console.log("let循环：", j); // 0, 1, 2
  }, 100 * j + 50);
}

// IIFE解决var的问题
console.log("IIFE解决var问题：");
for (var k = 0; k < 3; k++) {
  (function (index) {
    setTimeout(function () {
      console.log("IIFE循环：", index); // 0, 1, 2
    }, 100 * k + 25);
  })(k);
}

// 10. 模块模式
console.log("\n10. 模块模式：");

const Module = (function () {
  // 私有变量
  let privateVar = "私有变量";
  let privateCounter = 0;

  // 私有方法
  function privateMethod() {
    console.log("私有方法被调用");
  }

  // 公共接口
  return {
    publicMethod: function () {
      console.log("公共方法访问私有变量：", privateVar);
      privateMethod();
    },

    increment: function () {
      privateCounter++;
      console.log("计数器增加：", privateCounter);
    },

    getCounter: function () {
      return privateCounter;
    },
  };
})();

Module.publicMethod();
Module.increment();
console.log("获取计数器：", Module.getCounter());

// 11. 执行上下文示例
console.log("\n11. 执行上下文示例：");

function executionContext() {
  console.log("执行上下文创建阶段：");

  // 创建阶段：变量提升
  console.log("变量提升：", typeof hoistedVar); // undefined
  console.log("函数提升：", typeof hoistedFunc); // function

  var hoistedVar = "变量";

  function hoistedFunc() {
    return "函数";
  }

  console.log("执行阶段：", hoistedVar, hoistedFunc());
}

executionContext();

// 12. this绑定和作用域
console.log("\n12. this绑定和作用域：");

const obj = {
  name: "对象",

  regularFunction: function () {
    console.log("普通函数this：", this.name);

    // 内部函数的this指向
    function innerFunction() {
      console.log("内部函数this：", this === global || this === window);
    }

    innerFunction();

    // 箭头函数继承外部this
    const arrowFunction = () => {
      console.log("箭头函数this：", this.name);
    };

    arrowFunction();
  },
};

obj.regularFunction();

// 13. 实用工具函数
console.log("\n13. 实用工具函数：");

// 检查变量是否在作用域中
function isInScope(varName) {
  try {
    eval(varName);
    return true;
  } catch (e) {
    return false;
  }
}

// 创建命名空间
function createNamespace(name) {
  const namespace = {};

  return {
    add: function (key, value) {
      namespace[key] = value;
    },

    get: function (key) {
      return namespace[key];
    },

    has: function (key) {
      return key in namespace;
    },

    getName: function () {
      return name;
    },
  };
}

// 测试命名空间
const myNamespace = createNamespace("MyApp");
myNamespace.add("config", { debug: true });
myNamespace.add("utils", { log: console.log });

console.log("命名空间测试：", myNamespace.get("config"));
console.log("命名空间名称：", myNamespace.getName());

console.log("\n=== 作用域和提升示例完成 ===");

// 导出供测试使用
module.exports = {
  createCounter,
  Module,
  createNamespace,
};
