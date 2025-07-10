# 第 3 章 - 对象和原型

## 📖 章节概述

本章深入探讨 JavaScript 中的对象系统和原型链机制。对象是 JavaScript 的核心，而原型链是 JavaScript 实现继承的基础。本章将帮助你全面理解 JavaScript 的面向对象编程思想。

## 🎯 学习目标

- 掌握 JavaScript 对象的创建、操作和管理
- 深入理解原型链的工作原理
- 学会实现各种继承模式
- 理解面向对象编程在 JavaScript 中的实现
- 掌握对象属性描述符和高级特性

## 📁 文件结构

```
03-对象和原型/
├── README.md           # 本文件
├── objects.js          # 对象操作
├── prototypes.js       # 原型链
└── inheritance.js      # 继承模式
```

## 📚 内容详解

### 1. objects.js - 对象操作

- **对象创建**: 字面量、构造函数、Object.create()
- **属性操作**: 添加、删除、枚举、检测属性
- **属性描述符**: configurable、enumerable、writable、value
- **访问器属性**: getter 和 setter
- **对象遍历**: for...in、Object.keys()、Object.entries()
- **对象复制**: 浅拷贝和深拷贝
- **对象代理**: Proxy 和 Reflect

**核心特性**:

```javascript
// 属性描述符
Object.defineProperty(obj, "name", {
  value: "JavaScript",
  writable: false,
  enumerable: true,
  configurable: false,
});

// 对象代理
const proxy = new Proxy(target, {
  get(target, property) {
    console.log(`Getting ${property}`);
    return target[property];
  },
});
```

### 2. prototypes.js - 原型链

- **原型概念**: [[Prototype]]、prototype、**proto**
- **原型链**: 属性查找机制和原型链遍历
- **构造函数**: 构造函数与原型的关系
- **原型方法**: 在原型上定义方法
- **原型修改**: 动态修改原型的影响
- **原型检测**: instanceof、isPrototypeOf()

**原型链示例**:

```javascript
function Person(name) {
  this.name = name;
}

Person.prototype.sayHello = function () {
  return `Hello, I'm ${this.name}`;
};

const person = new Person("Alice");
console.log(person.sayHello()); // 通过原型链调用
```

### 3. inheritance.js - 继承模式

- **原型链继承**: 经典的原型链继承
- **构造函数继承**: 借用构造函数模式
- **组合继承**: 结合原型链和构造函数
- **原型式继承**: Object.create()实现
- **寄生式继承**: 在原型式基础上增强
- **寄生组合继承**: 最理想的继承方式
- **ES6 类继承**: class 和 extends 关键字
- **Mixin 模式**: 多重继承的实现

**继承模式对比**:

```javascript
// ES6类继承
class Animal {
  constructor(name) {
    this.name = name;
  }

  speak() {
    console.log(`${this.name} makes a sound`);
  }
}

class Dog extends Animal {
  speak() {
    console.log(`${this.name} barks`);
  }
}

// 寄生组合继承
function inheritPrototype(child, parent) {
  const prototype = Object.create(parent.prototype);
  prototype.constructor = child;
  child.prototype = prototype;
}
```

## 🚀 快速开始

### 运行示例

```bash
# 运行对象操作示例
node src/03-对象和原型/objects.js

# 运行原型链示例
node src/03-对象和原型/prototypes.js

# 运行继承模式示例
node src/03-对象和原型/inheritance.js
```

### 学习路径

1. **对象基础** → 理解对象的基本操作和特性
2. **原型机制** → 深入理解原型链的工作原理
3. **继承模式** → 掌握各种继承的实现方式

## 💡 核心概念

### 对象的本质

- 对象是键值对的集合
- 属性可以是数据属性或访问器属性
- 对象具有内部槽位（如[[Prototype]]）
- 对象是引用类型

### 原型链机制

- 每个对象都有一个原型
- 原型链用于属性查找
- 构造函数的 prototype 属性指向原型对象
- 原型对象的 constructor 属性指向构造函数

### 继承的本质

- JavaScript 使用原型链实现继承
- 子类可以访问父类的属性和方法
- 继承是"is-a"关系的体现
- 组合优于继承

## 🔧 实际应用

### 1. 创建工厂函数

```javascript
function createPerson(name, age) {
  return {
    name,
    age,
    introduce() {
      return `Hi, I'm ${this.name}, ${this.age} years old`;
    },
  };
}
```

### 2. 实现观察者模式

```javascript
class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, listener) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(listener);
  }

  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach((listener) => {
        listener.apply(this, args);
      });
    }
  }
}
```

### 3. 对象池模式

```javascript
class ObjectPool {
  constructor(createFn, resetFn) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];
  }

  get() {
    if (this.pool.length > 0) {
      return this.pool.pop();
    }
    return this.createFn();
  }

  release(obj) {
    this.resetFn(obj);
    this.pool.push(obj);
  }
}
```

## 🔗 相关章节

- **上一章**: [第 2 章 - 函数和闭包](../02-函数和闭包/README.md)
- **下一章**: [第 4 章 - 异步编程](../04-异步编程/README.md)
- **相关章节**:
  - [第 6 章 - ES6+特性](../06-ES6+特性/README.md) - ES6 类和模块
  - [第 8 章 - 性能优化](../08-性能优化/README.md) - 对象性能优化

## 📝 练习建议

1. **对象操作练习**:

   - 实现一个深拷贝函数
   - 创建一个对象属性验证器
   - 使用 Proxy 实现数据绑定

2. **原型链练习**:

   - 手动实现 instanceof
   - 创建一个原型链可视化工具
   - 实验原型污染和防护

3. **继承练习**:
   - 实现所有 10 种继承模式
   - 创建一个类似 jQuery 的链式调用库
   - 设计一个插件系统

## ⚠️ 常见陷阱

1. **原型污染**: 修改内置对象的原型
2. **循环引用**: 对象间的循环引用导致内存泄漏
3. **属性枚举**: 继承属性在 for...in 中被枚举
4. **this 绑定**: 原型方法中 this 的指向问题
5. **属性遮蔽**: 实例属性遮蔽原型属性

## 🎨 最佳实践

1. **使用 Object.create()**: 创建具有指定原型的对象
2. **避免修改内置原型**: 不要修改 Object.prototype 等
3. **使用 hasOwnProperty()**: 检测自有属性
4. **优先使用 ES6 类**: 现代 JavaScript 推荐语法
5. **组合优于继承**: 考虑使用组合而不是继承

## 🔍 调试技巧

### 1. 查看原型链

```javascript
function getPrototypeChain(obj) {
  const chain = [];
  let current = obj;

  while (current) {
    chain.push(current);
    current = Object.getPrototypeOf(current);
  }

  return chain;
}
```

### 2. 对象属性分析

```javascript
function analyzeObject(obj) {
  const own = Object.getOwnPropertyNames(obj);
  const enumerable = Object.keys(obj);
  const prototype = Object.getPrototypeOf(obj);

  return { own, enumerable, prototype };
}
```

## 📊 性能考虑

1. **原型链长度**: 过长的原型链影响属性查找性能
2. **属性访问模式**: 经常访问的属性放在实例上
3. **对象创建**: 选择合适的对象创建方式
4. **内存使用**: 注意闭包和循环引用

---

**学习提示**: 对象和原型是 JavaScript 面向对象编程的基础，理解这些概念对于掌握现代 JavaScript 框架和库至关重要！
