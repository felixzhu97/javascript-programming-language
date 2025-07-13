/**
 * JavaScript高级程序设计 - 第2章：闭包详解
 *
 * 本文件演示JavaScript中的闭包概念、用法和实际应用
 */

console.log("=== JavaScript 闭包详解 ===\n");

// 1. 闭包的基本概念
console.log("1. 闭包的基本概念：");

function outerFunction(x) {
  // 外部函数的变量
  const outerVariable = x;

  // 内部函数可以访问外部函数的变量
  function innerFunction(y) {
    return outerVariable + y;
  }

  // 返回内部函数
  return innerFunction;
}

const closure = outerFunction(10);
console.log("闭包调用：", closure(5)); // 15

// 2. 闭包的作用域链
console.log("\n2. 闭包的作用域链：");

let globalVar = "global";

function level1() {
  let level1Var = "level1";

  function level2() {
    let level2Var = "level2";

    function level3() {
      let level3Var = "level3";

      console.log("访问所有作用域：");
      console.log("- level3Var:", level3Var);
      console.log("- level2Var:", level2Var);
      console.log("- level1Var:", level1Var);
      console.log("- globalVar:", globalVar);
    }

    return level3;
  }

  return level2;
}

const nestedClosure = level1()();
nestedClosure();

// 3. 闭包的变量捕获
console.log("\n3. 闭包的变量捕获：");

function createCounters() {
  let count = 0;

  return {
    increment: function () {
      count++;
      console.log("计数器增加：", count);
      return count;
    },

    decrement: function () {
      count--;
      console.log("计数器减少：", count);
      return count;
    },

    getCount: function () {
      return count;
    },
  };
}

const counter = createCounters();
counter.increment(); // 1
counter.increment(); // 2
counter.decrement(); // 1
console.log("当前计数：", counter.getCount()); // 1

// 4. 多个闭包共享变量
console.log("\n4. 多个闭包共享变量：");

function createSharedCounter() {
  let sharedCount = 0;

  function increment() {
    sharedCount++;
    return sharedCount;
  }

  function decrement() {
    sharedCount--;
    return sharedCount;
  }

  function getCount() {
    return sharedCount;
  }

  return { increment, decrement, getCount };
}

const sharedCounter1 = createSharedCounter();
const sharedCounter2 = createSharedCounter();

console.log("共享计数器1增加：", sharedCounter1.increment()); // 1
console.log("共享计数器1增加：", sharedCounter1.increment()); // 2
console.log("共享计数器2增加：", sharedCounter2.increment()); // 1 (独立的)
console.log("共享计数器1当前值：", sharedCounter1.getCount()); // 2
console.log("共享计数器2当前值：", sharedCounter2.getCount()); // 1

// 5. 循环中的闭包问题
console.log("\n5. 循环中的闭包问题：");

// 问题示例：var的问题
console.log("var的问题：");
for (var i = 0; i < 3; i++) {
  setTimeout(function () {
    console.log("var循环问题：", i); // 都是3
  }, 100);
}

// 解决方案1：使用let
console.log("let解决方案：");
for (let j = 0; j < 3; j++) {
  setTimeout(function () {
    console.log("let循环解决：", j); // 0, 1, 2
  }, 150);
}

// 解决方案2：使用闭包
console.log("闭包解决方案：");
for (var k = 0; k < 3; k++) {
  (function (index) {
    setTimeout(function () {
      console.log("闭包循环解决：", index); // 0, 1, 2
    }, 200);
  })(k);
}

// 6. 闭包的实际应用
console.log("\n6. 闭包的实际应用：");

// 模块模式
const Calculator = (function () {
  let result = 0;

  function add(x) {
    result += x;
    return this;
  }

  function subtract(x) {
    result -= x;
    return this;
  }

  function multiply(x) {
    result *= x;
    return this;
  }

  function divide(x) {
    if (x !== 0) {
      result /= x;
    }
    return this;
  }

  function getResult() {
    return result;
  }

  function reset() {
    result = 0;
    return this;
  }

  return {
    add,
    subtract,
    multiply,
    divide,
    getResult,
    reset,
  };
})();

console.log("模块模式计算器：");
const calcResult = Calculator.add(10)
  .multiply(2)
  .subtract(5)
  .divide(3)
  .getResult();

console.log("计算结果：", calcResult); // (10 * 2 - 5) / 3 = 5

// 7. 闭包缓存
console.log("\n7. 闭包缓存：");

function createCache() {
  const cache = {};

  return {
    get: function (key) {
      return cache[key];
    },

    set: function (key, value) {
      cache[key] = value;
    },

    has: function (key) {
      return key in cache;
    },

    clear: function () {
      Object.keys(cache).forEach((key) => delete cache[key]);
    },

    size: function () {
      return Object.keys(cache).length;
    },
  };
}

const cache = createCache();
cache.set("user1", { name: "Alice", age: 25 });
cache.set("user2", { name: "Bob", age: 30 });

console.log("缓存获取：", cache.get("user1"));
console.log("缓存大小：", cache.size());
console.log("是否存在：", cache.has("user3"));

// 8. 函数工厂
console.log("\n8. 函数工厂：");

function createValidator(rule) {
  return function (value) {
    return rule(value);
  };
}

// 创建不同的验证器
const isEmail = createValidator(function (value) {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(value);
});

const isPhoneNumber = createValidator(function (value) {
  const phoneRegex = /^\d{3}-\d{3}-\d{4}$/;
  return phoneRegex.test(value);
});

const isPositiveNumber = createValidator(function (value) {
  return typeof value === "number" && value > 0;
});

console.log("邮箱验证：", isEmail("test@example.com"));
console.log("电话验证：", isPhoneNumber("123-456-7890"));
console.log("正数验证：", isPositiveNumber(42));

// 9. 私有变量和方法
console.log("\n9. 私有变量和方法：");

function createPerson(name, age) {
  // 私有变量
  let _name = name;
  let _age = age;

  // 私有方法
  function validateAge(newAge) {
    return typeof newAge === "number" && newAge >= 0 && newAge <= 150;
  }

  // 公共接口
  return {
    getName: function () {
      return _name;
    },

    setName: function (newName) {
      if (typeof newName === "string" && newName.length > 0) {
        _name = newName;
      }
    },

    getAge: function () {
      return _age;
    },

    setAge: function (newAge) {
      if (validateAge(newAge)) {
        _age = newAge;
      }
    },

    introduce: function () {
      return `Hi, I'm ${_name} and I'm ${_age} years old.`;
    },
  };
}

const person = createPerson("Alice", 25);
console.log("介绍：", person.introduce());
person.setAge(26);
console.log("更新后：", person.introduce());

// 10. 事件处理中的闭包
console.log("\n10. 事件处理中的闭包：");

function createEventHandler(eventName) {
  let eventCount = 0;

  return function (data) {
    eventCount++;
    console.log(`事件 ${eventName} 第 ${eventCount} 次触发，数据：`, data);
  };
}

const clickHandler = createEventHandler("click");
const hoverHandler = createEventHandler("hover");

// 模拟事件触发
clickHandler("按钮A");
clickHandler("按钮B");
hoverHandler("元素1");

// 11. 闭包的内存管理
console.log("\n11. 闭包的内存管理：");

function createMemoryDemo() {
  let largeData = new Array(1000000).fill("data");

  return {
    // 只返回需要的数据
    getDataLength: function () {
      return largeData.length;
    },

    // 清理引用
    cleanup: function () {
      largeData = null;
    },
  };
}

const memoryDemo = createMemoryDemo();
console.log("大数据长度：", memoryDemo.getDataLength());
memoryDemo.cleanup(); // 清理内存

// 12. 闭包与this绑定
console.log("\n12. 闭包与this绑定：");

const obj = {
  name: "MyObject",

  createMethod: function () {
    const self = this; // 保存this引用

    return function () {
      console.log("闭包中的this：", self.name);
    };
  },

  createArrowMethod: function () {
    // 箭头函数自动绑定this
    return () => {
      console.log("箭头函数中的this：", this.name);
    };
  },
};

const method1 = obj.createMethod();
const method2 = obj.createArrowMethod();

method1(); // MyObject
method2(); // MyObject

// 13. 闭包实现单例模式
console.log("\n13. 闭包实现单例模式：");

const Singleton = (function () {
  let instance = null;

  function createInstance() {
    return {
      name: "Singleton Instance",
      id: Math.random(),

      getName: function () {
        return this.name;
      },

      getId: function () {
        return this.id;
      },
    };
  }

  return {
    getInstance: function () {
      if (!instance) {
        instance = createInstance();
      }
      return instance;
    },
  };
})();

const singleton1 = Singleton.getInstance();
const singleton2 = Singleton.getInstance();

console.log("单例1 ID：", singleton1.getId());
console.log("单例2 ID：", singleton2.getId());
console.log("是否相同：", singleton1 === singleton2);

// 14. 实用工具函数
console.log("\n14. 实用工具函数：");

// 防抖函数（使用闭包）
function debounce(func, delay) {
  let timeoutId;

  return function (...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => func.apply(this, args), delay);
  };
}

// 节流函数（使用闭包）
function throttle(func, limit) {
  let inThrottle;

  return function (...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// 偏函数应用
function partial(func, ...partialArgs) {
  return function (...remainingArgs) {
    return func(...partialArgs, ...remainingArgs);
  };
}

// 记忆化函数
function memoize(func) {
  const cache = new Map();

  return function (...args) {
    const key = JSON.stringify(args);

    if (cache.has(key)) {
      return cache.get(key);
    }

    const result = func.apply(this, args);
    cache.set(key, result);
    return result;
  };
}

// 测试工具函数
const add = (a, b) => a + b;
const addFive = partial(add, 5);
const memoizedAdd = memoize(add);

console.log("偏函数应用：", addFive(3)); // 8
console.log("记忆化函数：", memoizedAdd(2, 3)); // 5

console.log("\n=== 闭包详解示例完成 ===");

// 导出供测试使用
module.exports = {
  createCounters,
  Calculator,
  createCache,
  createValidator,
  createPerson,
  debounce,
  throttle,
  partial,
  memoize,
  Singleton,
};
