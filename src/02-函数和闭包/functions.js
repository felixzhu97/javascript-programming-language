/**
 * JavaScript高级程序设计 - 第2章：函数基础
 *
 * 本文件演示JavaScript中的函数定义、调用、参数和返回值
 */

console.log("=== JavaScript 函数基础 ===\n");

// 1. 函数声明
console.log("1. 函数声明：");

function greet(name) {
  return `Hello, ${name}!`;
}

console.log("函数声明调用：", greet("World"));

// 函数提升
console.log("函数提升：", hoistedFunction()); // 可以在声明前调用

function hoistedFunction() {
  return "这是被提升的函数";
}

// 2. 函数表达式
console.log("\n2. 函数表达式：");

const greetExpression = function (name) {
  return `Hi, ${name}!`;
};

console.log("函数表达式调用：", greetExpression("JavaScript"));

// 命名函数表达式
const factorial = function fact(n) {
  return n <= 1 ? 1 : n * fact(n - 1);
};

console.log("命名函数表达式：", factorial(5));

// 3. 函数参数
console.log("\n3. 函数参数：");

// 默认参数
function greetWithDefault(name = "Guest", greeting = "Hello") {
  return `${greeting}, ${name}!`;
}

console.log("默认参数：", greetWithDefault());
console.log("部分参数：", greetWithDefault("Alice"));
console.log("全部参数：", greetWithDefault("Bob", "Hi"));

// 剩余参数
function sum(...numbers) {
  return numbers.reduce((total, num) => total + num, 0);
}

console.log("剩余参数：", sum(1, 2, 3, 4, 5));

// arguments对象（传统方式）
function oldStyleSum() {
  let total = 0;
  for (let i = 0; i < arguments.length; i++) {
    total += arguments[i];
  }
  return total;
}

console.log("arguments对象：", oldStyleSum(1, 2, 3, 4, 5));

// 4. 函数返回值
console.log("\n4. 函数返回值：");

// 显式返回
function multiply(a, b) {
  return a * b;
}

// 隐式返回undefined
function noReturn() {
  console.log("没有返回值的函数");
}

// 返回多个值（通过数组或对象）
function getMinMax(numbers) {
  return {
    min: Math.min(...numbers),
    max: Math.max(...numbers),
  };
}

console.log("显式返回：", multiply(3, 4));
console.log("隐式返回：", noReturn());
console.log("返回对象：", getMinMax([1, 5, 3, 9, 2]));

// 5. 函数作为值
console.log("\n5. 函数作为值：");

// 函数赋值给变量
const operation = multiply;
console.log("函数赋值：", operation(6, 7));

// 函数作为参数
function calculate(a, b, operation) {
  return operation(a, b);
}

function add(x, y) {
  return x + y;
}

function subtract(x, y) {
  return x - y;
}

console.log("函数作为参数：", calculate(10, 5, add));
console.log("函数作为参数：", calculate(10, 5, subtract));

// 6. 高阶函数
console.log("\n6. 高阶函数：");

// 返回函数的函数
function createMultiplier(factor) {
  return function (number) {
    return number * factor;
  };
}

const double = createMultiplier(2);
const triple = createMultiplier(3);

console.log("返回函数：", double(5));
console.log("返回函数：", triple(5));

// 数组高阶函数
const numbers = [1, 2, 3, 4, 5];

console.log("原数组：", numbers);
console.log(
  "map：",
  numbers.map((x) => x * 2)
);
console.log(
  "filter：",
  numbers.filter((x) => x % 2 === 0)
);
console.log(
  "reduce：",
  numbers.reduce((sum, x) => sum + x, 0)
);

// 7. 递归函数
console.log("\n7. 递归函数：");

// 阶乘
function factorialRecursive(n) {
  if (n <= 1) return 1;
  return n * factorialRecursive(n - 1);
}

// 斐波那契数列
function fibonacci(n) {
  if (n <= 1) return n;
  return fibonacci(n - 1) + fibonacci(n - 2);
}

// 尾递归优化版本
function fibonacciTailRecursive(n, a = 0, b = 1) {
  if (n === 0) return a;
  if (n === 1) return b;
  return fibonacciTailRecursive(n - 1, b, a + b);
}

console.log("阶乘递归：", factorialRecursive(5));
console.log("斐波那契：", fibonacci(10));
console.log("尾递归斐波那契：", fibonacciTailRecursive(10));

// 8. 函数的属性和方法
console.log("\n8. 函数的属性和方法：");

function exampleFunction(a, b, c) {
  console.log("函数被调用");
  return a + b + c;
}

console.log("函数名：", exampleFunction.name);
console.log("参数长度：", exampleFunction.length);

// call方法
const result1 = exampleFunction.call(null, 1, 2, 3);
console.log("call方法：", result1);

// apply方法
const result2 = exampleFunction.apply(null, [4, 5, 6]);
console.log("apply方法：", result2);

// bind方法
const boundFunction = exampleFunction.bind(null, 7, 8);
const result3 = boundFunction(9);
console.log("bind方法：", result3);

// 9. 立即执行函数表达式（IIFE）
console.log("\n9. 立即执行函数表达式：");

(function () {
  console.log("IIFE执行");
})();

// 带参数的IIFE
(function (message) {
  console.log("带参数的IIFE：", message);
})("Hello IIFE!");

// 返回值的IIFE
const iifeResult = (function (x, y) {
  return x + y;
})(10, 20);

console.log("IIFE返回值：", iifeResult);

// 10. 函数柯里化
console.log("\n10. 函数柯里化：");

// 手动柯里化
function curriedAdd(a) {
  return function (b) {
    return function (c) {
      return a + b + c;
    };
  };
}

console.log("手动柯里化：", curriedAdd(1)(2)(3));

// 通用柯里化函数
function curry(fn) {
  return function curried(...args) {
    if (args.length >= fn.length) {
      return fn.apply(this, args);
    } else {
      return function (...args2) {
        return curried.apply(this, args.concat(args2));
      };
    }
  };
}

const curriedMultiply = curry(function (a, b, c) {
  return a * b * c;
});

console.log("通用柯里化：", curriedMultiply(2)(3)(4));
console.log("通用柯里化：", curriedMultiply(2, 3)(4));

// 11. 函数组合
console.log("\n11. 函数组合：");

// 简单组合
function compose(f, g) {
  return function (x) {
    return f(g(x));
  };
}

const addOne = (x) => x + 1;
const multiplyTwo = (x) => x * 2;

const addOneThenMultiplyTwo = compose(multiplyTwo, addOne);
console.log("函数组合：", addOneThenMultiplyTwo(5)); // (5 + 1) * 2 = 12

// 多函数组合
function composeMultiple(...fns) {
  return function (x) {
    return fns.reduceRight((acc, fn) => fn(acc), x);
  };
}

const pipeline = composeMultiple(
  (x) => x * 3,
  (x) => x + 2,
  (x) => x - 1
);

console.log("多函数组合：", pipeline(5)); // ((5 - 1) + 2) * 3 = 18

// 12. 函数记忆化
console.log("\n12. 函数记忆化：");

function memoize(fn) {
  const cache = {};
  return function (...args) {
    const key = JSON.stringify(args);
    if (key in cache) {
      console.log("从缓存获取：", key);
      return cache[key];
    }
    console.log("计算并缓存：", key);
    const result = fn.apply(this, args);
    cache[key] = result;
    return result;
  };
}

const memoizedFibonacci = memoize(function (n) {
  if (n <= 1) return n;
  return memoizedFibonacci(n - 1) + memoizedFibonacci(n - 2);
});

console.log("记忆化斐波那契：", memoizedFibonacci(10));
console.log("再次调用：", memoizedFibonacci(10));

// 13. 函数防抖和节流
console.log("\n13. 函数防抖和节流：");

// 防抖函数
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// 节流函数
function throttle(func, limit) {
  let inThrottle;
  return function () {
    const args = arguments;
    const context = this;
    if (!inThrottle) {
      func.apply(context, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}

// 测试防抖
const debouncedLog = debounce((message) => {
  console.log("防抖执行：", message);
}, 1000);

// 测试节流
const throttledLog = throttle((message) => {
  console.log("节流执行：", message);
}, 1000);

// 14. 实用工具函数
console.log("\n14. 实用工具函数：");

// 函数重试
function retry(fn, maxAttempts = 3) {
  return function (...args) {
    let attempts = 0;

    function attempt() {
      try {
        return fn.apply(this, args);
      } catch (error) {
        attempts++;
        if (attempts < maxAttempts) {
          console.log(`重试 ${attempts}/${maxAttempts}`);
          return attempt();
        }
        throw error;
      }
    }

    return attempt();
  };
}

// 函数超时
function timeout(fn, ms) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("Function timeout"));
      }, ms);

      try {
        const result = fn.apply(this, args);
        clearTimeout(timer);
        resolve(result);
      } catch (error) {
        clearTimeout(timer);
        reject(error);
      }
    });
  };
}

// 函数管道
function pipe(...fns) {
  return function (value) {
    return fns.reduce((acc, fn) => fn(acc), value);
  };
}

const mathPipeline = pipe(
  (x) => x + 1,
  (x) => x * 2,
  (x) => x - 3
);

console.log("函数管道：", mathPipeline(5)); // ((5 + 1) * 2) - 3 = 9

console.log("\n=== 函数基础示例完成 ===");

// 导出供测试使用
module.exports = {
  greet,
  sum,
  createMultiplier,
  curry,
  compose,
  memoize,
  debounce,
  throttle,
  retry,
  pipe,
};
