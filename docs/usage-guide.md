# JavaScript 高级程序设计 - 使用指南

## 项目概述

本项目是《JavaScript 高级程序设计》的完整案例集合，包含了书中所有重要概念的实践示例和详细说明。

## 项目结构

```
javascript-programming-language/
├── src/                    # 源代码
│   ├── 01-基础概念/         # 变量、数据类型、作用域
│   ├── 02-函数和闭包/       # 函数、闭包、箭头函数
│   ├── 03-对象和原型/       # 对象、原型链、继承
│   ├── 04-异步编程/         # Promise、async/await
│   ├── 05-DOM操作/          # DOM操作、事件处理
│   ├── 06-ES6+特性/         # 模块、类、解构等
│   ├── 07-错误处理/         # 异常处理、调试
│   ├── 08-性能优化/         # 性能优化技巧
│   └── 09-实战项目/         # 综合应用项目
├── tests/                  # 测试文件
├── examples/               # 示例页面
├── docs/                   # 文档
└── utils/                  # 工具函数
```

## 快速开始

### 1. 安装依赖

```bash
npm install
```

### 2. 运行项目

#### 查看项目菜单

```bash
node index.js
```

#### 运行特定示例

```bash
# 变量和数据类型
node src/01-基础概念/variables.js

# 闭包详解
node src/02-函数和闭包/closures.js

# 对象和原型
node src/03-对象和原型/objects.js
```

#### 启动 Web 演示

```bash
npm run serve
```

在浏览器中打开 http://localhost:8080 查看交互式演示

#### 运行测试

```bash
npm test
```

## 学习路径

### 第一阶段：基础概念 (1-3 章)

1. **变量和数据类型** - `src/01-基础概念/variables.js`

   - var、let、const 的区别
   - 七种数据类型详解
   - 类型检测和转换
   - 实用工具函数

2. **作用域和提升** - `src/01-基础概念/scope.js`

   - 函数作用域 vs 块级作用域
   - 变量提升机制
   - 暂时性死区
   - 立即执行函数表达式(IIFE)

3. **操作符和表达式** - `src/01-基础概念/operators.js`
   - 算术、比较、逻辑操作符
   - 位操作符详解
   - 操作符优先级
   - 类型转换在操作符中的应用

### 第二阶段：函数进阶 (4-6 章)

4. **函数基础** - `src/02-函数和闭包/functions.js`

   - 函数声明 vs 函数表达式
   - 参数处理和默认值
   - 高阶函数和函数组合
   - 函数记忆化和防抖节流

5. **闭包详解** - `src/02-函数和闭包/closures.js`

   - 闭包的形成和作用域链
   - 实际应用场景
   - 内存管理注意事项
   - 模块模式实现

6. **箭头函数** - `src/02-函数和闭包/arrow-functions.js`
   - 语法和特性
   - this 绑定差异
   - 使用场景和最佳实践
   - 与传统函数的对比

### 第三阶段：对象和原型 (7-9 章)

7. **对象创建和操作** - `src/03-对象和原型/objects.js`

   - 多种对象创建方式
   - 属性描述符和访问器
   - 对象遍历和操作
   - 对象冻结和密封

8. **原型链** - `src/03-对象和原型/prototypes.js`

   - 原型链机制详解
   - 继承模式实现
   - 原型污染和保护
   - 现代原型操作方法

9. **继承模式** - `src/03-对象和原型/inheritance.js`
   - 组合继承
   - 原型式继承
   - 寄生组合式继承
   - ES6 类继承

## 代码示例

### 基础概念示例

```javascript
// 数据类型检测
function getType(value) {
  return Object.prototype.toString.call(value).slice(8, -1).toLowerCase();
}

console.log(getType([])); // "array"
console.log(getType({})); // "object"
```

### 闭包示例

```javascript
// 计数器闭包
function createCounter() {
  let count = 0;
  return {
    increment: () => ++count,
    decrement: () => --count,
    getCount: () => count,
  };
}

const counter = createCounter();
counter.increment(); // 1
```

### 原型链示例

```javascript
// 继承实现
function Animal(name) {
  this.name = name;
}

Animal.prototype.speak = function () {
  return `${this.name} makes a sound`;
};

function Dog(name) {
  Animal.call(this, name);
}

Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;
```

## 测试说明

项目包含完整的测试套件，位于 `tests/` 目录：

- `basic.test.js` - 基础功能测试
- 自定义测试框架，无需额外依赖
- 涵盖所有核心功能的单元测试

运行测试：

```bash
node tests/basic.test.js
```

## Web 演示页面

`examples/index.html` 提供了交互式的 Web 演示：

- 美观的用户界面
- 实时代码执行
- 分章节展示
- 进度跟踪功能

功能特点：

- 📱 响应式设计
- 🎨 现代化 UI
- ⚡ 实时交互
- 📊 进度可视化

## 开发和构建

### 开发模式

```bash
npm run dev
```

### 构建生产版本

```bash
npm run build
```

### 启动 HTTP 服务器

```bash
npm run serve
```

## 学习建议

1. **循序渐进**：按照章节顺序学习，每个概念都有实际代码示例
2. **动手实践**：运行每个示例，修改参数观察结果
3. **理解原理**：不只是记住用法，要理解背后的机制
4. **编写测试**：为自己的代码编写测试用例
5. **查看源码**：阅读项目源码了解最佳实践

## 常见问题

### Q: 如何运行单个示例？

A: 使用 `node` 命令直接运行对应的 `.js` 文件

### Q: Web 演示页面无法访问？

A: 确保运行了 `npm run serve` 并访问 http://localhost:8080

### Q: 测试失败怎么办？

A: 检查 Node.js 版本（推荐 12+），确保所有依赖已安装

### Q: 如何贡献代码？

A: Fork 项目，创建分支，提交 Pull Request

## 相关资源

- [MDN JavaScript 指南](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Guide)
- [JavaScript 高级程序设计（原书）](https://book.douban.com/subject/35175321/)
- [ES6 入门教程](https://es6.ruanyifeng.com/)
- [JavaScript.info](https://zh.javascript.info/)

## 联系和反馈

如有问题或建议，欢迎：

- 提交 Issue
- 发起 Discussion
- 提交 Pull Request

---

**注意**：本项目仅供学习参考，请遵循开源协议使用。
