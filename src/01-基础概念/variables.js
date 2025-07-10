/**
 * JavaScript高级程序设计 - 第1章：变量和数据类型
 *
 * 本文件演示JavaScript中的变量声明、数据类型和类型转换
 */

console.log("=== JavaScript 变量和数据类型 ===\n");

// 1. 变量声明方式
console.log("1. 变量声明方式：");

// var - 函数作用域，存在变量提升
console.log("var声明：");
console.log("var声明前：", typeof varVariable); // undefined，但不报错
var varVariable = "var变量";
console.log("var声明后：", varVariable);

// let - 块级作用域，不存在变量提升
console.log("\nlet声明：");
let letVariable = "let变量";
console.log("let变量：", letVariable);

// const - 块级作用域，必须初始化，不能重新赋值
console.log("\nconst声明：");
const constVariable = "const变量";
console.log("const变量：", constVariable);

// 2. 数据类型
console.log("\n2. 基本数据类型：");

// 基本数据类型（原始类型）
const undefinedValue = undefined;
const nullValue = null;
const booleanValue = true;
const numberValue = 42;
const stringValue = "Hello World";
const symbolValue = Symbol("unique");
const bigintValue = 9007199254740991n;

console.log("undefined:", undefinedValue, typeof undefinedValue);
console.log("null:", nullValue, typeof nullValue); // 注意：typeof null === 'object'
console.log("boolean:", booleanValue, typeof booleanValue);
console.log("number:", numberValue, typeof numberValue);
console.log("string:", stringValue, typeof stringValue);
console.log("symbol:", symbolValue, typeof symbolValue);
console.log("bigint:", bigintValue, typeof bigintValue);

// 复杂数据类型（引用类型）
console.log("\n3. 引用数据类型：");
const objectValue = { name: "John", age: 30 };
const arrayValue = [1, 2, 3, 4, 5];
const functionValue = function () {
  return "Hello";
};
const dateValue = new Date();
const regexValue = /pattern/g;

console.log("object:", objectValue, typeof objectValue);
console.log("array:", arrayValue, typeof arrayValue); // 注意：typeof array === 'object'
console.log("function:", functionValue, typeof functionValue);
console.log("date:", dateValue, typeof dateValue);
console.log("regex:", regexValue, typeof regexValue);

// 4. 类型检测
console.log("\n4. 类型检测方法：");

function typeCheck(value) {
  console.log(`值: ${value}`);
  console.log(`typeof: ${typeof value}`);
  console.log(
    `Object.prototype.toString: ${Object.prototype.toString.call(value)}`
  );
  console.log(`Array.isArray: ${Array.isArray(value)}`);
  console.log("---");
}

typeCheck(null);
typeCheck([1, 2, 3]);
typeCheck(new Date());
typeCheck(function () {});

// 5. 类型转换
console.log("\n5. 类型转换：");

// 显式转换
console.log("显式转换：");
console.log('Number("123"):', Number("123"));
console.log('Number("123abc"):', Number("123abc")); // NaN
console.log('parseInt("123abc"):', parseInt("123abc"));
console.log('parseFloat("123.45abc"):', parseFloat("123.45abc"));
console.log("String(123):", String(123));
console.log("Boolean(0):", Boolean(0));
console.log('Boolean(""):', Boolean(""));
console.log('Boolean("hello"):', Boolean("hello"));

// 隐式转换
console.log("\n隐式转换：");
console.log('"5" + 3:', "5" + 3); // 字符串拼接
console.log('"5" - 3:', "5" - 3); // 数值运算
console.log('"5" * 3:', "5" * 3); // 数值运算
console.log("true + 1:", true + 1); // 布尔转数值
console.log("false + 1:", false + 1); // 布尔转数值

// 6. 特殊值
console.log("\n6. 特殊值：");

console.log("NaN === NaN:", NaN === NaN); // false
console.log("isNaN(NaN):", isNaN(NaN)); // true
console.log("Number.isNaN(NaN):", Number.isNaN(NaN)); // true
console.log('isNaN("hello"):', isNaN("hello")); // true (先转换为数值)
console.log('Number.isNaN("hello"):', Number.isNaN("hello")); // false (不转换)

console.log("\nInfinity:");
console.log("1 / 0:", 1 / 0); // Infinity
console.log("-1 / 0:", -1 / 0); // -Infinity
console.log("isFinite(Infinity):", isFinite(Infinity)); // false

// 7. 变量提升示例
console.log("\n7. 变量提升示例：");

function hoistingExample() {
  console.log("函数内部 - var变量提升前：", typeof hoistedVar); // undefined
  // console.log('函数内部 - let变量提升前：', typeof hoistedLet); // ReferenceError

  var hoistedVar = "var被提升";
  let hoistedLet = "let不被提升";

  console.log("函数内部 - var变量提升后：", hoistedVar);
  console.log("函数内部 - let变量：", hoistedLet);
}

hoistingExample();

// 8. 作用域示例
console.log("\n8. 作用域示例：");

var globalVar = "global";

function scopeExample() {
  var functionVar = "function";

  if (true) {
    var varInBlock = "var in block";
    let letInBlock = "let in block";
    const constInBlock = "const in block";

    console.log("块内访问：", varInBlock, letInBlock, constInBlock);
  }

  console.log("块外访问var：", varInBlock); // 可以访问
  // console.log('块外访问let：', letInBlock); // ReferenceError
  // console.log('块外访问const：', constInBlock); // ReferenceError
}

scopeExample();

// 9. 对象属性的动态特性
console.log("\n9. 对象属性的动态特性：");

const dynamicObj = {};
dynamicObj.name = "John";
dynamicObj["age"] = 30;
dynamicObj[Symbol("id")] = 123;

console.log("动态对象：", dynamicObj);
console.log("对象键：", Object.keys(dynamicObj));
console.log("对象符号键：", Object.getOwnPropertySymbols(dynamicObj));

// 10. 实用函数
console.log("\n10. 实用工具函数：");

// 深度类型检测
function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

// 安全的类型转换
function safeParseInt(value, defaultValue = 0) {
  const parsed = parseInt(value);
  return isNaN(parsed) ? defaultValue : parsed;
}

// 检查是否为空值
function isEmpty(value) {
  return value === null || value === undefined || value === "";
}

// 测试工具函数
const testValues = [null, undefined, "", 0, false, [], {}, "hello", 123];
testValues.forEach((value) => {
  console.log(
    `值: ${value}, 类型: ${getType(value)}, 是否为空: ${isEmpty(value)}`
  );
});

console.log("\n=== 变量和数据类型示例完成 ===");

// 导出供测试使用
module.exports = {
  getType,
  safeParseInt,
  isEmpty,
};
