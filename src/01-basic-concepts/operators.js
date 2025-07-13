/**
 * JavaScript高级程序设计 - 第1章：操作符和表达式
 *
 * 本文件演示JavaScript中的各种操作符和表达式
 */

console.log("=== JavaScript 操作符和表达式 ===\n");

// 1. 算术操作符
console.log("1. 算术操作符：");

const a = 10;
const b = 3;

console.log(`a = ${a}, b = ${b}`);
console.log("加法 (a + b):", a + b);
console.log("减法 (a - b):", a - b);
console.log("乘法 (a * b):", a * b);
console.log("除法 (a / b):", a / b);
console.log("取模 (a % b):", a % b);
console.log("幂运算 (a ** b):", a ** b);

// 特殊情况
console.log("\n特殊算术运算：");
console.log("0 / 0:", 0 / 0); // NaN
console.log("1 / 0:", 1 / 0); // Infinity
console.log("-1 / 0:", -1 / 0); // -Infinity
console.log("Infinity / Infinity:", Infinity / Infinity); // NaN

// 2. 赋值操作符
console.log("\n2. 赋值操作符：");

let x = 5;
console.log("初始值 x:", x);

x += 3; // x = x + 3
console.log("x += 3:", x);

x -= 2; // x = x - 2
console.log("x -= 2:", x);

x *= 2; // x = x * 2
console.log("x *= 2:", x);

x /= 3; // x = x / 3
console.log("x /= 3:", x);

x %= 3; // x = x % 3
console.log("x %= 3:", x);

x **= 2; // x = x ** 2
console.log("x **= 2:", x);

// 3. 比较操作符
console.log("\n3. 比较操作符：");

console.log("相等比较：");
console.log('5 == "5":', 5 == "5"); // true (类型转换)
console.log('5 === "5":', 5 === "5"); // false (严格相等)
console.log('5 != "5":', 5 != "5"); // false
console.log('5 !== "5":', 5 !== "5"); // true

console.log("\n大小比较：");
console.log("5 > 3:", 5 > 3);
console.log("5 < 3:", 5 < 3);
console.log("5 >= 5:", 5 >= 5);
console.log("5 <= 5:", 5 <= 5);

console.log("\n特殊比较：");
console.log("null == undefined:", null == undefined); // true
console.log("null === undefined:", null === undefined); // false
console.log("NaN == NaN:", NaN == NaN); // false
console.log("NaN === NaN:", NaN === NaN); // false

// 4. 逻辑操作符
console.log("\n4. 逻辑操作符：");

const t = true;
const f = false;

console.log("逻辑与 (&&)：");
console.log("true && true:", t && t);
console.log("true && false:", t && f);
console.log("false && true:", f && t);
console.log("false && false:", f && f);

console.log("\n逻辑或 (||)：");
console.log("true || true:", t || t);
console.log("true || false:", t || f);
console.log("false || true:", f || t);
console.log("false || false:", f || f);

console.log("\n逻辑非 (!)：");
console.log("!true:", !t);
console.log("!false:", !f);
console.log("!!true:", !!t); // 转换为布尔值

// 短路求值
console.log("\n短路求值：");
console.log('false && console.log("不会执行")'); // 不会执行
false && console.log("不会执行");

console.log('true || console.log("不会执行")'); // 不会执行
true || console.log("不会执行");

// 5. 位操作符
console.log("\n5. 位操作符：");

const num1 = 5; // 101
const num2 = 3; // 011

console.log(`num1 = ${num1} (${num1.toString(2)})`);
console.log(`num2 = ${num2} (${num2.toString(2)})`);

console.log("按位与 (&):", num1 & num2, `(${(num1 & num2).toString(2)})`);
console.log("按位或 (|):", num1 | num2, `(${(num1 | num2).toString(2)})`);
console.log("按位异或 (^):", num1 ^ num2, `(${(num1 ^ num2).toString(2)})`);
console.log("按位非 (~):", ~num1, `(${(~num1).toString(2)})`);

console.log("\n位移操作符：");
console.log("左移 (<<):", num1 << 1, `(${(num1 << 1).toString(2)})`);
console.log("右移 (>>):", num1 >> 1, `(${(num1 >> 1).toString(2)})`);
console.log("无符号右移 (>>>):", num1 >>> 1, `(${(num1 >>> 1).toString(2)})`);

// 6. 一元操作符
console.log("\n6. 一元操作符：");

let y = 5;
console.log("原始值 y:", y);

console.log("前置递增 (++y):", ++y); // 先增加，再返回
console.log("后置递增 (y++):", y++); // 先返回，再增加
console.log("递增后的值:", y);

console.log("前置递减 (--y):", --y); // 先减少，再返回
console.log("后置递减 (y--):", y--); // 先返回，再减少
console.log("递减后的值:", y);

// 一元加减
console.log("\n一元加减：");
console.log("+true:", +true); // 1
console.log("+false:", +false); // 0
console.log('+"123":', +"123"); // 123
console.log('-"123":', -"123"); // -123

// 7. 三元操作符
console.log("\n7. 三元操作符：");

const age = 18;
const message = age >= 18 ? "成年人" : "未成年人";
console.log(`年龄 ${age}: ${message}`);

// 嵌套三元操作符
const score = 85;
const grade = score >= 90 ? "A" : score >= 80 ? "B" : score >= 70 ? "C" : "D";
console.log(`分数 ${score}: ${grade}`);

// 8. 类型操作符
console.log("\n8. 类型操作符：");

console.log("typeof操作符：");
console.log("typeof 123:", typeof 123);
console.log('typeof "hello":', typeof "hello");
console.log("typeof true:", typeof true);
console.log("typeof undefined:", typeof undefined);
console.log("typeof null:", typeof null); // "object" (历史遗留问题)
console.log("typeof {}:", typeof {});
console.log("typeof []:", typeof []);
console.log("typeof function(){}:", typeof function () {});

console.log("\ninstanceof操作符：");
const arr = [1, 2, 3];
const obj = {};
const date = new Date();

console.log("arr instanceof Array:", arr instanceof Array);
console.log("obj instanceof Object:", obj instanceof Object);
console.log("date instanceof Date:", date instanceof Date);
console.log("date instanceof Object:", date instanceof Object);

// 9. in操作符
console.log("\n9. in操作符：");

const person = { name: "John", age: 30 };
console.log('"name" in person:', "name" in person);
console.log('"height" in person:', "height" in person);
console.log('"toString" in person:', "toString" in person); // 继承的属性

// 数组中的in操作符
const numbers = [1, 2, 3];
console.log("0 in numbers:", 0 in numbers); // 索引存在
console.log("3 in numbers:", 3 in numbers); // 索引不存在

// 10. 操作符优先级
console.log("\n10. 操作符优先级：");

console.log("算术优先级：");
console.log("2 + 3 * 4:", 2 + 3 * 4); // 14, 不是20
console.log("(2 + 3) * 4:", (2 + 3) * 4); // 20

console.log("\n逻辑优先级：");
console.log("true || false && false:", true || (false && false)); // true
console.log("(true || false) && false:", (true || false) && false); // false

console.log("\n赋值优先级：");
let z = 1;
console.log("z = z + 1:", (z = z + 1)); // 2
console.log("z += 1:", (z += 1)); // 3

// 11. 表达式求值
console.log("\n11. 表达式求值：");

console.log("复杂表达式：");
const result = 10 + 5 * 2 - 3 / 3 + 2 ** 3;
console.log("10 + 5 * 2 - 3 / 3 + 2 ** 3 =", result);

// 12. 类型转换在操作符中的应用
console.log("\n12. 类型转换在操作符中的应用：");

console.log("字符串转换：");
console.log('1 + "2":', 1 + "2"); // "12"
console.log('"1" + 2:', "1" + 2); // "12"
console.log('1 + 2 + "3":', 1 + 2 + "3"); // "33"
console.log('"1" + 2 + 3:', "1" + 2 + 3); // "123"

console.log("\n数值转换：");
console.log('"5" - 3:', "5" - 3); // 2
console.log('"5" * 3:', "5" * 3); // 15
console.log('"5" / 3:', "5" / 3); // 1.666...
console.log('"5" % 3:', "5" % 3); // 2

console.log("\n布尔转换：");
console.log("!0:", !0); // true
console.log('!"":', !""); // true
console.log("!null:", !null); // true
console.log("!undefined:", !undefined); // true
console.log("!NaN:", !NaN); // true

// 13. 实用工具函数
console.log("\n13. 实用工具函数：");

// 安全除法
function safeDivide(a, b) {
  if (b === 0) {
    return "Division by zero";
  }
  return a / b;
}

// 范围检查
function inRange(value, min, max) {
  return value >= min && value <= max;
}

// 类型检查
function isNumber(value) {
  return typeof value === "number" && !isNaN(value) && isFinite(value);
}

// 深度相等比较
function deepEqual(a, b) {
  if (a === b) return true;

  if (a == null || b == null) return false;

  if (typeof a !== typeof b) return false;

  if (typeof a !== "object") return false;

  const keysA = Object.keys(a);
  const keysB = Object.keys(b);

  if (keysA.length !== keysB.length) return false;

  for (let key of keysA) {
    if (!keysB.includes(key)) return false;
    if (!deepEqual(a[key], b[key])) return false;
  }

  return true;
}

// 测试工具函数
console.log("safeDivide(10, 2):", safeDivide(10, 2));
console.log("safeDivide(10, 0):", safeDivide(10, 0));
console.log("inRange(5, 1, 10):", inRange(5, 1, 10));
console.log("isNumber(123):", isNumber(123));
console.log('isNumber("123"):', isNumber("123"));
console.log("deepEqual({a: 1}, {a: 1}):", deepEqual({ a: 1 }, { a: 1 }));
console.log("deepEqual({a: 1}, {a: 2}):", deepEqual({ a: 1 }, { a: 2 }));

console.log("\n=== 操作符和表达式示例完成 ===");

// 导出供测试使用
module.exports = {
  safeDivide,
  inRange,
  isNumber,
  deepEqual,
};
