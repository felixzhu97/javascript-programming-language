# 第 2 章 - 函数和闭包

## 📖 章节概述

本章深入探讨 JavaScript 中的函数概念和闭包机制。函数是 JavaScript 的第一等公民，而闭包是 JavaScript 最强大和最重要的特性之一。掌握这些概念对于编写高质量的 JavaScript 代码至关重要。

## 🎯 学习目标

- 深入理解 JavaScript 函数的各种形式和特性
- 掌握闭包的原理、应用场景和最佳实践
- 理解箭头函数与普通函数的区别
- 学会使用高阶函数和函数式编程技巧
- 掌握函数性能优化和内存管理

## 📁 文件结构

```
02-函数和闭包/
├── README.md           # 本文件
├── functions.js        # 函数基础
├── closures.js         # 闭包详解
└── arrow-functions.js  # 箭头函数
```

## 📚 内容详解

### 1. functions.js - 函数基础

- **函数声明和表达式**: 不同声明方式的区别
- **参数处理**: 默认参数、剩余参数、参数解构
- **返回值**: 单值返回、多值返回、条件返回
- **高阶函数**: 函数作为参数和返回值
- **函数组合**: 组合多个函数创建复杂逻辑
- **递归函数**: 递归实现和优化技巧

**核心特性**:

```javascript
// 高阶函数示例
function createMultiplier(factor) {
  return function (number) {
    return number * factor;
  };
}

// 函数组合
const compose =
  (...fns) =>
  (x) =>
    fns.reduceRight((v, f) => f(v), x);
```

### 2. closures.js - 闭包详解

- **闭包原理**: 词法作用域和环境记录
- **闭包应用**: 数据封装、模块模式、回调函数
- **内存管理**: 闭包的内存使用和垃圾回收
- **性能考虑**: 闭包对性能的影响和优化策略
- **实际案例**: 计数器、缓存、事件处理等

**经典案例**:

```javascript
// 模块模式
const counterModule = (function () {
  let count = 0;

  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
})();
```

### 3. arrow-functions.js - 箭头函数

- **语法形式**: 各种箭头函数的写法
- **this 绑定**: 箭头函数的 this 行为
- **使用场景**: 何时使用箭头函数，何时避免
- **性能对比**: 箭头函数与普通函数的性能差异
- **最佳实践**: 箭头函数的使用指南

**重要区别**:

```javascript
// 普通函数 - this动态绑定
function regularFunction() {
  console.log(this);
}

// 箭头函数 - this词法绑定
const arrowFunction = () => {
  console.log(this);
};
```

## 🚀 快速开始

### 运行示例

```bash
# 运行函数示例
node src/02-函数和闭包/functions.js

# 运行闭包示例
node src/02-函数和闭包/closures.js

# 运行箭头函数示例
node src/02-函数和闭包/arrow-functions.js
```

### 学习路径

1. **函数基础** → 理解函数的基本概念和特性
2. **闭包机制** → 深入理解闭包的原理和应用
3. **箭头函数** → 掌握现代 JavaScript 的函数语法

## 💡 核心概念

### 函数的第一等公民特性

- 函数可以作为值赋给变量
- 函数可以作为参数传递
- 函数可以作为返回值
- 函数可以在运行时创建

### 闭包的本质

- 闭包 = 函数 + 词法环境
- 内部函数可以访问外部函数的变量
- 外部函数执行完毕后，变量仍然保持在内存中
- 闭包提供了数据私有化的能力

### 箭头函数的特点

- 更简洁的语法
- 没有自己的 this 绑定
- 不能用作构造函数
- 没有 arguments 对象

## 🔧 实际应用

### 1. 模块模式

```javascript
const myModule = (function () {
  // 私有变量
  let privateVar = "secret";

  // 公共接口
  return {
    getPrivateVar: () => privateVar,
    setPrivateVar: (value) => (privateVar = value),
  };
})();
```

### 2. 函数缓存

```javascript
function memoize(fn) {
  const cache = new Map();
  return function (...args) {
    const key = JSON.stringify(args);
    if (cache.has(key)) {
      return cache.get(key);
    }
    const result = fn.apply(this, args);
    cache.set(key, result);
    return result;
  };
}
```

### 3. 事件处理

```javascript
function createEventHandler(element) {
  let clickCount = 0;

  return function (event) {
    clickCount++;
    console.log(`Element clicked ${clickCount} times`);
  };
}
```

## 🔗 相关章节

- **上一章**: [第 1 章 - 基础概念](../01-基础概念/README.md)
- **下一章**: [第 3 章 - 对象和原型](../03-对象和原型/README.md)
- **相关章节**:
  - [第 4 章 - 异步编程](../04-异步编程/README.md) - 回调函数和 Promise
  - [第 8 章 - 性能优化](../08-性能优化/README.md) - 函数性能优化

## 📝 练习建议

1. **函数练习**:

   - 实现一个通用的 curry 函数
   - 创建一个函数组合工具
   - 编写递归函数解决经典问题

2. **闭包练习**:

   - 实现一个私有变量的计数器
   - 创建一个简单的模块系统
   - 编写一个函数缓存系统

3. **箭头函数练习**:
   - 重写普通函数为箭头函数
   - 体验 this 绑定的差异
   - 在不同场景下选择合适的函数类型

## ⚠️ 常见陷阱

1. **闭包内存泄漏**: 注意清理不需要的闭包引用
2. **循环中的闭包**: 理解循环变量的作用域问题
3. **箭头函数的 this**: 不要在需要动态 this 的场景使用箭头函数
4. **函数提升**: 理解函数声明和函数表达式的提升行为

## 🎨 最佳实践

1. **优先使用 const 声明函数**: `const fn = () => {}`
2. **合理使用闭包**: 避免不必要的闭包创建
3. **选择合适的函数类型**: 根据需要选择普通函数或箭头函数
4. **函数保持纯净**: 尽量避免副作用，提高可测试性

---

**学习提示**: 函数和闭包是 JavaScript 的精华，花时间深入理解这些概念，会让你的 JavaScript 编程能力有质的飞跃！
