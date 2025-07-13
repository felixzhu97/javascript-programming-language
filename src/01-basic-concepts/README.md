# 第 1 章 - JavaScript 基础概念

## 📖 章节概述

本章涵盖 JavaScript 编程的核心基础概念，包括变量声明、数据类型、作用域机制、运算符使用等基础但重要的知识点。这些概念是掌握 JavaScript 高级特性的基石。

## 🎯 学习目标

- 理解 JavaScript 的变量声明方式和数据类型
- 掌握作用域链和变量提升机制
- 熟练使用各种运算符和表达式
- 了解 JavaScript 的类型转换规则
- 掌握现代 JavaScript 的最佳实践

## 📁 文件结构

```
01-基础概念/
├── README.md           # 本文件
├── variables.js        # 变量和数据类型
├── scope.js           # 作用域和提升
└── operators.js       # 操作符和表达式
```

## 📚 内容详解

### 1. variables.js - 变量和数据类型

- **变量声明**: var、let、const 的区别和使用场景
- **基本数据类型**: Number、String、Boolean、undefined、null、Symbol、BigInt
- **引用数据类型**: Object、Array、Function 等
- **类型检测**: typeof、instanceof、Object.prototype.toString
- **类型转换**: 隐式转换和显式转换的规则

**主要特性**:

```javascript
// 现代变量声明
const name = "JavaScript";
let age = 25;

// 类型检测工具
const typeChecker = {
  getType: (value) => Object.prototype.toString.call(value).slice(8, -1),
};
```

### 2. scope.js - 作用域和提升

- **作用域类型**: 全局作用域、函数作用域、块级作用域
- **作用域链**: 变量查找机制
- **变量提升**: var 和函数声明的提升行为
- **暂时性死区**: let/const 的特殊行为
- **闭包基础**: 作用域与闭包的关系

**核心概念**:

```javascript
// 作用域链示例
function outer() {
  const outerVar = "outer";

  function inner() {
    const innerVar = "inner";
    console.log(outerVar); // 可以访问外层变量
  }

  return inner;
}
```

### 3. operators.js - 操作符和表达式

- **算术运算符**: +、-、\*、/、%、\*\*
- **比较运算符**: ==、===、!=、!==、>、<、>=、<=
- **逻辑运算符**: &&、||、!、??
- **赋值运算符**: =、+=、-=、\*=、/=等
- **位运算符**: &、|、^、~、<<、>>、>>>
- **运算符优先级**: 复杂表达式的计算顺序

**实用技巧**:

```javascript
// 空值合并运算符
const defaultValue = userInput ?? "default";

// 可选链运算符
const value = obj?.property?.subProperty;
```

## 🚀 快速开始

### 运行示例

```bash
# 在浏览器控制台或Node.js环境中运行
node src/01-基础概念/variables.js
node src/01-基础概念/scope.js
node src/01-基础概念/operators.js
```

### 学习建议

1. **按顺序学习**: 建议按照 variables → scope → operators 的顺序学习
2. **动手实践**: 每个概念都要在控制台中亲自测试
3. **理解原理**: 不要死记硬背，要理解背后的原理
4. **关注细节**: JavaScript 有很多细节和陷阱，要仔细观察

## 💡 重点概念

### 变量声明的最佳实践

- 优先使用 `const`，需要重新赋值时使用 `let`
- 避免使用 `var`，除非有特殊需求
- 变量名要有意义，使用驼峰命名法

### 类型转换的注意事项

- 理解 `==` 和 `===` 的区别
- 避免隐式类型转换带来的问题
- 使用 `Number()`、`String()`、`Boolean()` 进行显式转换

### 作用域的理解要点

- 理解作用域链的查找机制
- 注意变量提升和暂时性死区
- 合理利用块级作用域避免变量污染

## 🔗 相关章节

- **下一章**: [第 2 章 - 函数和闭包](../02-函数和闭包/README.md)
- **相关章节**:
  - [第 6 章 - ES6+特性](../06-ES6+特性/README.md) - 现代语法特性
  - [第 7 章 - 错误处理](../07-错误处理/README.md) - 类型错误处理

## 📝 练习建议

1. **变量练习**: 尝试不同的变量声明方式，观察它们的行为差异
2. **类型判断**: 编写函数判断各种数据类型
3. **作用域实验**: 创建嵌套函数，观察变量的访问规则
4. **运算符组合**: 尝试复杂的运算符组合，理解优先级规则

## ⚠️ 常见陷阱

1. **类型转换陷阱**: `[] == false` 为 `true`
2. **变量提升陷阱**: `var` 声明的变量可能在声明前被访问
3. **浮点数精度**: `0.1 + 0.2 !== 0.3`
4. **引用类型比较**: 对象比较的是引用而不是值

---

**学习提示**: 基础概念虽然简单，但是 JavaScript 的根基。掌握好这些概念，后续的学习会更加顺利！
