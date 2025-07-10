# 第 4 章 - 异步编程

## 📖 章节概述

本章全面介绍 JavaScript 中的异步编程概念和技术。从传统的回调函数到现代的 Promise 和 async/await，深入理解事件循环机制，掌握处理异步操作的各种模式和最佳实践。

## 🎯 学习目标

- 理解 JavaScript 异步编程的必要性和原理
- 掌握回调函数、Promise、async/await 的使用
- 深入理解事件循环和任务队列机制
- 学会处理异步错误和异常情况
- 掌握异步编程的性能优化技巧

## 📁 文件结构

```
04-异步编程/
├── README.md           # 本文件
├── callbacks.js        # 回调函数
├── promises.js         # Promise详解
├── async-await.js      # async/await
└── event-loop.js       # 事件循环
```

## 📚 内容详解

### 1. callbacks.js - 回调函数

- **回调基础**: 回调函数的定义和使用
- **异步回调**: 处理异步操作的回调模式
- **回调地狱**: 嵌套回调的问题和解决方案
- **错误处理**: 回调中的错误处理策略
- **回调优化**: 避免回调地狱的技巧

**回调模式示例**:

```javascript
// 传统回调
function fetchData(callback) {
  setTimeout(() => {
    callback(null, "data");
  }, 1000);
}

// 错误优先回调
function fetchUser(id, callback) {
  if (!id) {
    return callback(new Error("ID is required"));
  }
  // 异步操作...
  callback(null, user);
}
```

### 2. promises.js - Promise 详解

- **Promise 基础**: Promise 的三种状态和基本用法
- **Promise 方法**: then()、catch()、finally()
- **Promise 静态方法**: all()、race()、allSettled()、any()
- **Promise 链**: 链式调用和值传递
- **错误处理**: Promise 的错误传播机制
- **Promise 实现**: 手写 Promise 实现

**Promise 示例**:

```javascript
// Promise链式调用
fetch("/api/user")
  .then((response) => response.json())
  .then((user) => fetch(`/api/posts/${user.id}`))
  .then((response) => response.json())
  .then((posts) => console.log(posts))
  .catch((error) => console.error(error));

// Promise并发处理
Promise.all([fetch("/api/users"), fetch("/api/posts"), fetch("/api/comments")])
  .then((responses) => {
    return Promise.all(responses.map((r) => r.json()));
  })
  .then((data) => {
    console.log("All data loaded:", data);
  });
```

### 3. async-await.js - async/await

- **async 函数**: async 关键字的作用和特性
- **await 表达式**: await 的使用和限制
- **错误处理**: try/catch 处理异步错误
- **并发处理**: 结合 Promise.all 使用 await
- **迭代处理**: 在循环中使用 await
- **性能考虑**: async/await 的性能优化

**async/await 示例**:

```javascript
// 现代异步处理
async function fetchUserData(userId) {
  try {
    const user = await fetch(`/api/users/${userId}`);
    const userData = await user.json();

    const posts = await fetch(`/api/posts?userId=${userId}`);
    const postsData = await posts.json();

    return { user: userData, posts: postsData };
  } catch (error) {
    console.error("Failed to fetch user data:", error);
    throw error;
  }
}

// 并发异步处理
async function fetchAllData() {
  const [users, posts, comments] = await Promise.all([
    fetch("/api/users").then((r) => r.json()),
    fetch("/api/posts").then((r) => r.json()),
    fetch("/api/comments").then((r) => r.json()),
  ]);

  return { users, posts, comments };
}
```

### 4. event-loop.js - 事件循环

- **事件循环原理**: JavaScript 运行时的事件循环机制
- **执行栈**: 同步代码的执行方式
- **任务队列**: 宏任务和微任务的区别
- **定时器**: setTimeout 和 setInterval 的执行时机
- **Promise 任务**: Promise 的微任务执行
- **性能监控**: 事件循环的性能监控

**事件循环示例**:

```javascript
// 执行顺序演示
console.log("1");

setTimeout(() => console.log("2"), 0);

Promise.resolve().then(() => console.log("3"));

console.log("4");

// 输出顺序: 1, 4, 3, 2
// 同步 → 微任务 → 宏任务
```

## 🚀 快速开始

### 运行示例

```bash
# 运行回调示例
node src/04-异步编程/callbacks.js

# 运行Promise示例
node src/04-异步编程/promises.js

# 运行async/await示例
node src/04-异步编程/async-await.js

# 运行事件循环示例
node src/04-异步编程/event-loop.js
```

### 学习路径

1. **回调函数** → 理解异步编程的起源
2. **Promise** → 掌握现代异步处理方式
3. **async/await** → 学习最优雅的异步语法
4. **事件循环** → 深入理解异步执行原理

## 💡 核心概念

### 异步编程的必要性

- JavaScript 是单线程语言
- 避免阻塞用户界面
- 处理 I/O 密集型操作
- 提高应用响应性

### Promise 的优势

- 解决回调地狱问题
- 更好的错误处理机制
- 支持链式调用
- 可组合性和可读性

### async/await 的特点

- 同步风格的异步代码
- 更直观的错误处理
- 更好的调试体验
- 基于 Promise 的语法糖

## 🔧 实际应用

### 1. 网络请求封装

```javascript
class ApiClient {
  constructor(baseURL) {
    this.baseURL = baseURL;
  }

  async request(url, options = {}) {
    const response = await fetch(`${this.baseURL}${url}`, {
      headers: {
        "Content-Type": "application/json",
        ...options.headers,
      },
      ...options,
    });

    if (!response.ok) {
      throw new Error(`HTTP ${response.status}: ${response.statusText}`);
    }

    return response.json();
  }

  get(url) {
    return this.request(url);
  }

  post(url, data) {
    return this.request(url, {
      method: "POST",
      body: JSON.stringify(data),
    });
  }
}
```

### 2. 异步队列管理

```javascript
class AsyncQueue {
  constructor(concurrency = 1) {
    this.concurrency = concurrency;
    this.running = 0;
    this.queue = [];
  }

  async add(task) {
    return new Promise((resolve, reject) => {
      this.queue.push({
        task,
        resolve,
        reject,
      });
      this.tryNext();
    });
  }

  async tryNext() {
    if (this.running >= this.concurrency || this.queue.length === 0) {
      return;
    }

    this.running++;
    const { task, resolve, reject } = this.queue.shift();

    try {
      const result = await task();
      resolve(result);
    } catch (error) {
      reject(error);
    } finally {
      this.running--;
      this.tryNext();
    }
  }
}
```

### 3. 超时控制

```javascript
function withTimeout(promise, timeoutMs) {
  const timeout = new Promise((_, reject) => {
    setTimeout(() => {
      reject(new Error(`Operation timed out after ${timeoutMs}ms`));
    }, timeoutMs);
  });

  return Promise.race([promise, timeout]);
}

// 使用示例
const fetchWithTimeout = withTimeout(
  fetch("/api/data"),
  5000 // 5秒超时
);
```

## 🔗 相关章节

- **上一章**: [第 3 章 - 对象和原型](../03-对象和原型/README.md)
- **下一章**: [第 5 章 - DOM 操作](../05-DOM操作/README.md)
- **相关章节**:
  - [第 7 章 - 错误处理](../07-错误处理/README.md) - 异步错误处理
  - [第 8 章 - 性能优化](../08-性能优化/README.md) - 异步性能优化

## 📝 练习建议

1. **回调练习**:

   - 实现一个简单的异步控制流库
   - 将回调地狱重构为 Promise
   - 创建错误优先的回调模式

2. **Promise 练习**:

   - 手写 Promise/A+规范实现
   - 实现 Promise.all 和 Promise.race
   - 创建可取消的 Promise

3. **async/await 练习**:
   - 重构 Promise 链为 async/await
   - 实现异步迭代器
   - 处理并发和串行异步操作

## ⚠️ 常见陷阱

1. **回调地狱**: 过度嵌套的回调函数
2. **Promise 忘记返回**: 在 then 中忘记返回 Promise
3. **错误处理遗漏**: 未正确处理异步错误
4. **串行执行误用**: 在可以并行时使用串行
5. **内存泄漏**: 未清理的定时器和事件监听器

## 🎨 最佳实践

1. **优先使用 async/await**: 现代异步编程首选
2. **正确处理错误**: 每个异步操作都要有错误处理
3. **避免阻塞**: 不要在 async 函数中使用同步阻塞操作
4. **合理并发**: 在合适的场景使用 Promise.all
5. **超时控制**: 为网络请求添加超时机制

## 🔍 调试技巧

### 1. 异步调试工具

```javascript
// 异步操作跟踪
function traceAsync(name, promise) {
  console.log(`[${name}] 开始`);
  const start = Date.now();

  return promise
    .then((result) => {
      console.log(`[${name}] 成功 (${Date.now() - start}ms)`);
      return result;
    })
    .catch((error) => {
      console.error(`[${name}] 失败 (${Date.now() - start}ms):`, error);
      throw error;
    });
}
```

### 2. Promise 状态检查

```javascript
function promiseState(promise) {
  const pending = Symbol("pending");

  return Promise.race([promise, Promise.resolve(pending)]).then(
    (result) => {
      return result === pending ? "pending" : "resolved";
    },
    () => "rejected"
  );
}
```

## 📊 性能考虑

1. **避免不必要的异步**: 简单操作不需要异步化
2. **批量操作**: 合并多个小请求为一个大请求
3. **缓存策略**: 避免重复的异步操作
4. **资源管理**: 及时清理异步资源

---

**学习提示**: 异步编程是现代 JavaScript 的核心技能，掌握好这些概念对于构建响应式的 Web 应用至关重要！
