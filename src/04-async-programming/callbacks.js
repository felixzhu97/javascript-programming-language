/**
 * JavaScript高级程序设计 - 第4章：回调函数
 *
 * 本文件演示回调函数的基本用法、问题和解决方案
 */

console.log("=== JavaScript 回调函数 ===\n");

// =============================================
// 1. 回调函数基础
// =============================================

console.log("1. 回调函数基础");

// 简单的回调函数示例
function processData(data, callback) {
  console.log("正在处理数据:", data);

  // 模拟异步操作
  setTimeout(() => {
    const result = data.toUpperCase();
    callback(null, result);
  }, 1000);
}

// 使用回调函数
processData("hello world", (error, result) => {
  if (error) {
    console.error("处理失败:", error);
  } else {
    console.log("处理结果:", result);
  }
});

// 高阶函数中的回调
function calculate(x, y, operation) {
  return operation(x, y);
}

const add = (a, b) => a + b;
const multiply = (a, b) => a * b;

console.log("10 + 5 =", calculate(10, 5, add));
console.log("10 * 5 =", calculate(10, 5, multiply));

console.log();

// =============================================
// 2. 异步回调模式
// =============================================

console.log("2. 异步回调模式");

// 文件读取模拟
function readFile(filename, callback) {
  console.log(`开始读取文件: ${filename}`);

  setTimeout(() => {
    if (filename.includes("error")) {
      callback(new Error("文件读取失败"), null);
    } else {
      const content = `这是 ${filename} 的内容`;
      callback(null, content);
    }
  }, Math.random() * 1000);
}

// Node.js 风格的错误优先回调
readFile("data.txt", (err, data) => {
  if (err) {
    console.error("读取失败:", err.message);
  } else {
    console.log("读取成功:", data);
  }
});

readFile("error.txt", (err, data) => {
  if (err) {
    console.error("读取失败:", err.message);
  } else {
    console.log("读取成功:", data);
  }
});

console.log();

// =============================================
// 3. 回调地狱问题
// =============================================

console.log("3. 回调地狱问题");

// 模拟数据库操作
function queryUser(userId, callback) {
  setTimeout(() => {
    console.log(`查询用户 ${userId}`);
    callback(null, { id: userId, name: `User${userId}` });
  }, 100);
}

function queryUserPosts(userId, callback) {
  setTimeout(() => {
    console.log(`查询用户 ${userId} 的帖子`);
    callback(null, [
      { id: 1, title: "Post 1", userId },
      { id: 2, title: "Post 2", userId },
    ]);
  }, 100);
}

function queryPostComments(postId, callback) {
  setTimeout(() => {
    console.log(`查询帖子 ${postId} 的评论`);
    callback(null, [
      { id: 1, content: "Great post!", postId },
      { id: 2, content: "Thanks for sharing", postId },
    ]);
  }, 100);
}

// 回调地狱示例
function getUserData(userId) {
  queryUser(userId, (err, user) => {
    if (err) {
      console.error("查询用户失败:", err);
      return;
    }

    queryUserPosts(userId, (err, posts) => {
      if (err) {
        console.error("查询帖子失败:", err);
        return;
      }

      if (posts.length > 0) {
        queryPostComments(posts[0].id, (err, comments) => {
          if (err) {
            console.error("查询评论失败:", err);
            return;
          }

          console.log("完整的用户数据:");
          console.log("用户:", user);
          console.log("帖子:", posts);
          console.log("第一篇帖子的评论:", comments);
        });
      }
    });
  });
}

getUserData(1);

console.log();

// =============================================
// 4. 错误处理模式
// =============================================

console.log("4. 错误处理模式");

// 错误优先回调模式
function riskyOperation(shouldFail, callback) {
  setTimeout(() => {
    if (shouldFail) {
      callback(new Error("操作失败"));
    } else {
      callback(null, "操作成功");
    }
  }, 100);
}

// 统一错误处理
function handleCallback(callback) {
  return (err, result) => {
    if (err) {
      console.error("操作失败:", err.message);
      return;
    }
    callback(result);
  };
}

riskyOperation(
  false,
  handleCallback((result) => {
    console.log("成功结果:", result);
  })
);

riskyOperation(
  true,
  handleCallback((result) => {
    console.log("成功结果:", result);
  })
);

console.log();

// =============================================
// 5. 回调函数的控制流
// =============================================

console.log("5. 回调函数的控制流");

// 串行执行
function runSequential(tasks, finalCallback) {
  let currentIndex = 0;
  const results = [];

  function runNext() {
    if (currentIndex >= tasks.length) {
      finalCallback(null, results);
      return;
    }

    const currentTask = tasks[currentIndex];
    currentTask((err, result) => {
      if (err) {
        finalCallback(err);
        return;
      }

      results.push(result);
      currentIndex++;
      runNext();
    });
  }

  runNext();
}

// 并行执行
function runParallel(tasks, finalCallback) {
  let completedCount = 0;
  let hasError = false;
  const results = new Array(tasks.length);

  if (tasks.length === 0) {
    finalCallback(null, []);
    return;
  }

  tasks.forEach((task, index) => {
    task((err, result) => {
      if (hasError) return;

      if (err) {
        hasError = true;
        finalCallback(err);
        return;
      }

      results[index] = result;
      completedCount++;

      if (completedCount === tasks.length) {
        finalCallback(null, results);
      }
    });
  });
}

// 测试任务
const testTasks = [
  (callback) => setTimeout(() => callback(null, "Task 1"), 300),
  (callback) => setTimeout(() => callback(null, "Task 2"), 100),
  (callback) => setTimeout(() => callback(null, "Task 3"), 200),
];

console.log("串行执行:");
runSequential(testTasks, (err, results) => {
  if (err) {
    console.error("串行执行失败:", err);
  } else {
    console.log("串行执行结果:", results);
  }
});

console.log("并行执行:");
runParallel(testTasks, (err, results) => {
  if (err) {
    console.error("并行执行失败:", err);
  } else {
    console.log("并行执行结果:", results);
  }
});

console.log();

// =============================================
// 6. 事件驱动回调
// =============================================

console.log("6. 事件驱动回调");

class EventEmitter {
  constructor() {
    this.events = {};
  }

  on(event, callback) {
    if (!this.events[event]) {
      this.events[event] = [];
    }
    this.events[event].push(callback);
  }

  emit(event, ...args) {
    if (this.events[event]) {
      this.events[event].forEach((callback) => {
        callback(...args);
      });
    }
  }

  off(event, callback) {
    if (this.events[event]) {
      this.events[event] = this.events[event].filter((cb) => cb !== callback);
    }
  }
}

const emitter = new EventEmitter();

// 注册事件监听器
emitter.on("data", (data) => {
  console.log("收到数据:", data);
});

emitter.on("error", (error) => {
  console.error("发生错误:", error.message);
});

// 触发事件
emitter.emit("data", { id: 1, message: "Hello" });
emitter.emit("error", new Error("Something went wrong"));

console.log();

// =============================================
// 7. 回调函数优化技巧
// =============================================

console.log("7. 回调函数优化技巧");

// 函数命名优化
function fetchUserProfile(userId, onSuccess, onError) {
  queryUser(userId, (err, user) => {
    if (err) {
      onError(err);
    } else {
      onSuccess(user);
    }
  });
}

// 使用函数分离
function handleUserSuccess(user) {
  console.log("用户资料:", user);
}

function handleUserError(error) {
  console.error("获取用户资料失败:", error.message);
}

fetchUserProfile(2, handleUserSuccess, handleUserError);

// 回调函数包装器
function callbackWrapper(fn, context = null) {
  return function (...args) {
    try {
      return fn.apply(context, args);
    } catch (error) {
      console.error("回调函数执行出错:", error);
    }
  };
}

const safeCallback = callbackWrapper((data) => {
  console.log("安全回调:", data);
  // 可能抛出错误的代码
});

safeCallback("test data");

console.log();

// =============================================
// 8. 回调转Promise实用工具
// =============================================

console.log("8. 回调转Promise实用工具");

// promisify 实用函数
function promisify(fn) {
  return function (...args) {
    return new Promise((resolve, reject) => {
      fn(...args, (err, result) => {
        if (err) {
          reject(err);
        } else {
          resolve(result);
        }
      });
    });
  };
}

// 将回调风格的函数转换为Promise
const readFileAsync = promisify(readFile);
const queryUserAsync = promisify(queryUser);

// 现在可以使用 Promise 链
readFileAsync("config.txt")
  .then((content) => {
    console.log("Promise方式读取文件:", content);
    return queryUserAsync(3);
  })
  .then((user) => {
    console.log("Promise方式查询用户:", user);
  })
  .catch((error) => {
    console.error("Promise链出错:", error.message);
  });

console.log();

// =============================================
// 9. 性能监控和调试
// =============================================

console.log("9. 性能监控和调试");

// 回调函数性能监控
function timeCallback(name, fn) {
  return function (...args) {
    const start = Date.now();
    const callback = args[args.length - 1];

    args[args.length - 1] = function (...callbackArgs) {
      const end = Date.now();
      console.log(`${name} 执行时间: ${end - start}ms`);
      callback(...callbackArgs);
    };

    fn(...args);
  };
}

const timedReadFile = timeCallback("文件读取", readFile);
timedReadFile("performance.txt", (err, data) => {
  if (!err) {
    console.log("性能测试完成:", data);
  }
});

// 回调函数调用栈跟踪
function traceCallback(name, fn) {
  return function (...args) {
    console.log(`调用 ${name}:`, args.slice(0, -1));
    fn(...args);
  };
}

const tracedQueryUser = traceCallback("查询用户", queryUser);
tracedQueryUser(4, (err, user) => {
  console.log("跟踪结果:", user);
});

console.log();

// =============================================
// 10. 最佳实践总结
// =============================================

console.log("10. 最佳实践总结");

console.log(`
回调函数最佳实践:

1. 错误优先 - 第一个参数总是错误对象
2. 一致性 - 保持回调参数的顺序一致
3. 早期返回 - 在错误处理后立即返回
4. 函数命名 - 给回调函数有意义的名字
5. 避免嵌套 - 将回调函数提取为命名函数
6. 错误处理 - 总是处理可能的错误
7. 性能考虑 - 避免在循环中创建回调函数
8. 调试友好 - 保持调用栈的可读性

常见问题:
- 回调地狱：嵌套过深，难以维护
- 错误处理：容易遗漏错误处理逻辑
- 控制流：串行和并行执行复杂
- 调试困难：异步调用栈难以跟踪

解决方案:
- 使用Promise或async/await
- 使用async.js等控制流库
- 合理拆分和命名函数
- 使用调试工具和日志
`);

// 导出供测试使用
module.exports = {
  processData,
  readFile,
  queryUser,
  queryUserPosts,
  queryPostComments,
  runSequential,
  runParallel,
  EventEmitter,
  promisify,
};
