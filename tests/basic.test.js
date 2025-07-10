/**
 * JavaScript高级程序设计 - 基础测试
 */

// 导入测试模块
const {
  getType,
  safeParseInt,
  isEmpty,
} = require("../src/01-基础概念/variables");
const { createCounters } = require("../src/02-函数和闭包/closures");
const { Person, deepClone } = require("../src/03-对象和原型/objects");

// 简单的测试框架
function test(name, fn) {
  try {
    fn();
    console.log(`✅ ${name}`);
  } catch (error) {
    console.log(`❌ ${name}: ${error.message}`);
  }
}

function expect(actual) {
  return {
    toBe: (expected) => {
      if (actual !== expected) {
        throw new Error(`Expected ${expected}, but got ${actual}`);
      }
    },
    toEqual: (expected) => {
      if (JSON.stringify(actual) !== JSON.stringify(expected)) {
        throw new Error(
          `Expected ${JSON.stringify(expected)}, but got ${JSON.stringify(
            actual
          )}`
        );
      }
    },
    toBeTruthy: () => {
      if (!actual) {
        throw new Error(`Expected truthy value, but got ${actual}`);
      }
    },
    toBeFalsy: () => {
      if (actual) {
        throw new Error(`Expected falsy value, but got ${actual}`);
      }
    },
  };
}

console.log("=== JavaScript高级程序设计 - 基础测试 ===\n");

// 变量和数据类型测试
console.log("1. 变量和数据类型测试：");

test("getType函数应该正确识别数据类型", () => {
  expect(getType(123)).toBe("number");
  expect(getType("hello")).toBe("string");
  expect(getType([])).toBe("array");
  expect(getType({})).toBe("object");
  expect(getType(null)).toBe("null");
});

test("safeParseInt函数应该安全解析整数", () => {
  expect(safeParseInt("123")).toBe(123);
  expect(safeParseInt("abc")).toBe(0);
  expect(safeParseInt("123abc")).toBe(123);
  expect(safeParseInt("abc", 999)).toBe(999);
});

test("isEmpty函数应该正确判断空值", () => {
  expect(isEmpty(null)).toBeTruthy();
  expect(isEmpty(undefined)).toBeTruthy();
  expect(isEmpty("")).toBeTruthy();
  expect(isEmpty(0)).toBeFalsy();
  expect(isEmpty("hello")).toBeFalsy();
});

// 闭包测试
console.log("\n2. 闭包测试：");

test("createCounters应该创建独立的计数器", () => {
  const counter1 = createCounters();
  const counter2 = createCounters();

  counter1.increment();
  counter1.increment();
  counter2.increment();

  expect(counter1.getCount()).toBe(2);
  expect(counter2.getCount()).toBe(1);
});

// 对象测试
console.log("\n3. 对象测试：");

test("Person构造函数应该正确创建对象", () => {
  const person = new Person("Alice", 25);
  expect(person.name).toBe("Alice");
  expect(person.age).toBe(25);
});

test("deepClone应该深度复制对象", () => {
  const original = {
    name: "Test",
    nested: {
      value: 42,
    },
  };

  const cloned = deepClone(original);
  original.nested.value = 100;

  expect(cloned.nested.value).toBe(42);
  expect(original.nested.value).toBe(100);
});

// 运行性能测试
console.log("\n4. 性能测试：");

test("大量数据处理性能", () => {
  const startTime = Date.now();

  // 创建大量数据
  const data = Array.from({ length: 10000 }, (_, i) => ({
    id: i,
    name: `Item ${i}`,
    value: Math.random(),
  }));

  // 处理数据
  const processed = data
    .filter((item) => item.value > 0.5)
    .map((item) => ({ ...item, processed: true }))
    .slice(0, 100);

  const endTime = Date.now();
  const duration = endTime - startTime;

  console.log(`   处理10000条数据用时: ${duration}ms`);
  expect(processed.length).toBe(100);
  expect(processed[0].processed).toBeTruthy();
});

console.log("\n=== 测试完成 ===");

// 导出测试工具供其他测试使用
module.exports = { test, expect };
