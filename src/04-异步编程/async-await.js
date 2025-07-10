/**
 * JavaScript高级程序设计 - 第4章：async/await
 *
 * 本文件演示async/await的语法、用法和最佳实践
 */

console.log("=== JavaScript async/await ===\n");

// =============================================
// 1. async/await基础
// =============================================

console.log("1. async/await基础");

// 基本语法
async function basicAsyncFunction() {
  return "Hello, async!";
}

// async函数总是返回Promise
console.log("async函数返回:", basicAsyncFunction());

basicAsyncFunction().then((result) => {
  console.log("async函数结果:", result);
});

// await只能在async函数中使用
async function awaitExample() {
  const result = await basicAsyncFunction();
  console.log("await结果:", result);
}

awaitExample();

console.log();

// =============================================
// 2. 将Promise转换为async/await
// =============================================

console.log("2. 将Promise转换为async/await");

// Promise版本
function fetchUserDataPromise(userId) {
  return fetch(`/api/users/${userId}`)
    .then((response) => response.json())
    .then((user) => {
      return fetch(`/api/users/${userId}/posts`);
    })
    .then((response) => response.json())
    .then((posts) => {
      return { user, posts };
    })
    .catch((error) => {
      console.error("Promise版本出错:", error);
    });
}

// async/await版本
async function fetchUserDataAsync(userId) {
  try {
    const userResponse = await fetch(`/api/users/${userId}`);
    const user = await userResponse.json();

    const postsResponse = await fetch(`/api/users/${userId}/posts`);
    const posts = await postsResponse.json();

    return { user, posts };
  } catch (error) {
    console.error("async/await版本出错:", error);
  }
}

// 模拟fetch函数
function fetch(url) {
  return new Promise((resolve) => {
    setTimeout(() => {
      if (url.includes("users/1")) {
        resolve({
          json: () => Promise.resolve({ id: 1, name: "John" }),
        });
      } else if (url.includes("posts")) {
        resolve({
          json: () =>
            Promise.resolve([
              { id: 1, title: "Post 1" },
              { id: 2, title: "Post 2" },
            ]),
        });
      }
    }, 500);
  });
}

fetchUserDataAsync(1).then((result) => {
  console.log("async/await获取数据:", result);
});

console.log();

// =============================================
// 3. 错误处理
// =============================================

console.log("3. 错误处理");

async function errorHandlingExample() {
  try {
    // 可能抛出错误的操作
    const result = await riskyOperation();
    console.log("成功结果:", result);
  } catch (error) {
    console.log("捕获错误:", error.message);
  } finally {
    console.log("清理操作完成");
  }
}

function riskyOperation() {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (Math.random() > 0.5) {
        resolve("操作成功");
      } else {
        reject(new Error("操作失败"));
      }
    }, 500);
  });
}

errorHandlingExample();

// 多个错误处理
async function multipleErrorHandling() {
  try {
    await riskyOperation();
    await riskyOperation();
    await riskyOperation();
    console.log("所有操作都成功");
  } catch (error) {
    console.log("某个操作失败:", error.message);
  }
}

setTimeout(() => multipleErrorHandling(), 1000);

console.log();

// =============================================
// 4. 并行执行
// =============================================

console.log("4. 并行执行");

// 串行执行（慢）
async function serialExecution() {
  console.log("开始串行执行...");
  const start = Date.now();

  const result1 = await delay(1000, "任务1");
  const result2 = await delay(1000, "任务2");
  const result3 = await delay(1000, "任务3");

  const end = Date.now();
  console.log("串行执行结果:", [result1, result2, result3]);
  console.log("串行执行时间:", end - start, "ms");
}

// 并行执行（快）
async function parallelExecution() {
  console.log("开始并行执行...");
  const start = Date.now();

  const [result1, result2, result3] = await Promise.all([
    delay(1000, "任务1"),
    delay(1000, "任务2"),
    delay(1000, "任务3"),
  ]);

  const end = Date.now();
  console.log("并行执行结果:", [result1, result2, result3]);
  console.log("并行执行时间:", end - start, "ms");
}

function delay(ms, value) {
  return new Promise((resolve) => {
    setTimeout(() => resolve(value), ms);
  });
}

serialExecution().then(() => {
  return parallelExecution();
});

console.log();

// =============================================
// 5. 循环中的async/await
// =============================================

console.log("5. 循环中的async/await");

// 串行处理
async function processArraySerial(items) {
  console.log("串行处理数组...");
  const results = [];

  for (const item of items) {
    const result = await processItem(item);
    results.push(result);
  }

  return results;
}

// 并行处理
async function processArrayParallel(items) {
  console.log("并行处理数组...");
  return Promise.all(items.map((item) => processItem(item)));
}

// 批量处理
async function processArrayBatch(items, batchSize = 3) {
  console.log(`批量处理数组，批次大小: ${batchSize}`);
  const results = [];

  for (let i = 0; i < items.length; i += batchSize) {
    const batch = items.slice(i, i + batchSize);
    const batchResults = await Promise.all(
      batch.map((item) => processItem(item))
    );
    results.push(...batchResults);

    console.log(`完成批次 ${Math.floor(i / batchSize) + 1}`);
  }

  return results;
}

function processItem(item) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`处理完成: ${item}`);
    }, Math.random() * 500);
  });
}

const items = ["A", "B", "C", "D", "E", "F"];

processArraySerial(items)
  .then((results) => {
    console.log("串行结果:", results);
    return processArrayParallel(items);
  })
  .then((results) => {
    console.log("并行结果:", results);
    return processArrayBatch(items, 2);
  })
  .then((results) => {
    console.log("批量结果:", results);
  });

console.log();

// =============================================
// 6. 条件和控制流
// =============================================

console.log("6. 条件和控制流");

async function conditionalExecution(userId) {
  try {
    // 获取用户信息
    const user = await getUser(userId);
    console.log("获取用户:", user.name);

    // 根据用户权限执行不同操作
    if (user.role === "admin") {
      const adminData = await getAdminData();
      console.log("管理员数据:", adminData);
    } else if (user.role === "moderator") {
      const modData = await getModeratorData();
      console.log("版主数据:", modData);
    } else {
      const userData = await getUserData(userId);
      console.log("普通用户数据:", userData);
    }

    // 记录用户活动
    await logUserActivity(userId, "data_access");
    console.log("活动记录完成");
  } catch (error) {
    console.error("条件执行出错:", error.message);
  }
}

function getUser(id) {
  return Promise.resolve({
    id,
    name: `用户${id}`,
    role: ["admin", "moderator", "user"][id % 3],
  });
}

function getAdminData() {
  return delay(300, "管理员专用数据");
}

function getModeratorData() {
  return delay(300, "版主专用数据");
}

function getUserData(id) {
  return delay(300, `用户${id}的个人数据`);
}

function logUserActivity(userId, action) {
  return delay(100, `记录用户${userId}的${action}活动`);
}

conditionalExecution(1);
conditionalExecution(2);
conditionalExecution(3);

console.log();

// =============================================
// 7. 生成器与async/await
// =============================================

console.log("7. 生成器与async/await");

// 异步生成器
async function* asyncGenerator() {
  yield await delay(500, "第一个值");
  yield await delay(500, "第二个值");
  yield await delay(500, "第三个值");
}

async function consumeAsyncGenerator() {
  console.log("消费异步生成器:");
  for await (const value of asyncGenerator()) {
    console.log("生成器值:", value);
  }
}

consumeAsyncGenerator();

// 分页数据获取
async function* fetchPages(baseUrl) {
  let page = 1;
  let hasMore = true;

  while (hasMore) {
    const response = await fetchPage(baseUrl, page);
    yield response.data;

    hasMore = response.hasNext;
    page++;
  }
}

function fetchPage(baseUrl, page) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve({
        data: `第${page}页数据`,
        hasNext: page < 3,
      });
    }, 300);
  });
}

async function getAllPages() {
  console.log("获取所有分页数据:");
  for await (const pageData of fetchPages("/api/data")) {
    console.log("页面数据:", pageData);
  }
}

setTimeout(() => getAllPages(), 3000);

console.log();

// =============================================
// 8. 高级模式和技巧
// =============================================

console.log("8. 高级模式和技巧");

// 超时控制
async function withTimeout(promise, timeoutMs) {
  const timeout = new Promise((_, reject) =>
    setTimeout(() => reject(new Error("操作超时")), timeoutMs)
  );

  return Promise.race([promise, timeout]);
}

// 重试机制
async function retryWithBackoff(fn, maxRetries = 3, baseDelay = 1000) {
  for (let attempt = 1; attempt <= maxRetries; attempt++) {
    try {
      return await fn();
    } catch (error) {
      if (attempt === maxRetries) {
        throw error;
      }

      const delayMs = baseDelay * Math.pow(2, attempt - 1);
      console.log(`重试 ${attempt}/${maxRetries}，${delayMs}ms后重试`);
      await delay(delayMs);
    }
  }
}

// 缓存装饰器
function cacheAsync(fn, ttl = 60000) {
  const cache = new Map();

  return async function (...args) {
    const key = JSON.stringify(args);
    const cached = cache.get(key);

    if (cached && Date.now() - cached.timestamp < ttl) {
      console.log("返回缓存结果");
      return cached.value;
    }

    const result = await fn(...args);
    cache.set(key, { value: result, timestamp: Date.now() });
    console.log("缓存新结果");
    return result;
  };
}

const expensiveOperation = cacheAsync(async (input) => {
  await delay(1000);
  return `处理结果: ${input}`;
});

// 测试高级模式
async function testAdvancedPatterns() {
  // 测试超时
  try {
    const result = await withTimeout(delay(2000, "慢操作"), 1500);
    console.log("超时测试结果:", result);
  } catch (error) {
    console.log("超时测试:", error.message);
  }

  // 测试重试
  let attemptCount = 0;
  const unreliableOp = async () => {
    attemptCount++;
    if (attemptCount < 3) {
      throw new Error(`第${attemptCount}次失败`);
    }
    return "最终成功";
  };

  try {
    const result = await retryWithBackoff(unreliableOp);
    console.log("重试测试结果:", result);
  } catch (error) {
    console.log("重试最终失败:", error.message);
  }

  // 测试缓存
  console.log("第一次调用:", await expensiveOperation("test"));
  console.log("第二次调用:", await expensiveOperation("test"));
}

setTimeout(() => testAdvancedPatterns(), 5000);

console.log();

// =============================================
// 9. 性能优化
// =============================================

console.log("9. 性能优化");

// 预加载数据
async function preloadData() {
  console.log("开始预加载数据...");

  // 同时开始多个请求
  const userPromise = getUser(1);
  const settingsPromise = getUserSettings(1);
  const notificationsPromise = getNotifications(1);

  // 处理可以立即开始的任务
  console.log("处理其他任务...");
  await delay(200);

  // 等待所有数据
  const [user, settings, notifications] = await Promise.all([
    userPromise,
    settingsPromise,
    notificationsPromise,
  ]);

  console.log("预加载完成:", { user, settings, notifications });
}

function getUserSettings(userId) {
  return delay(800, `用户${userId}的设置`);
}

function getNotifications(userId) {
  return delay(600, `用户${userId}的通知`);
}

preloadData();

// 资源池管理
class AsyncResourcePool {
  constructor(createResource, maxSize = 5) {
    this.createResource = createResource;
    this.maxSize = maxSize;
    this.pool = [];
    this.waiting = [];
  }

  async acquire() {
    if (this.pool.length > 0) {
      return this.pool.pop();
    }

    if (this.waiting.length < this.maxSize) {
      return await this.createResource();
    }

    return new Promise((resolve) => {
      this.waiting.push(resolve);
    });
  }

  release(resource) {
    if (this.waiting.length > 0) {
      const resolve = this.waiting.shift();
      resolve(resource);
    } else {
      this.pool.push(resource);
    }
  }
}

const dbPool = new AsyncResourcePool(async () => {
  await delay(100); // 模拟连接建立
  return { id: Math.random(), connected: true };
}, 3);

async function useResourcePool() {
  console.log("使用资源池...");

  const tasks = Array.from({ length: 6 }, async (_, i) => {
    const resource = await dbPool.acquire();
    console.log(`任务${i}获取资源:`, resource.id.toFixed(6));

    await delay(500); // 模拟使用资源

    dbPool.release(resource);
    console.log(`任务${i}释放资源`);
  });

  await Promise.all(tasks);
  console.log("资源池测试完成");
}

setTimeout(() => useResourcePool(), 7000);

console.log();

// =============================================
// 10. 最佳实践总结
// =============================================

console.log("10. 最佳实践总结");

console.log(`
async/await最佳实践:

1. 错误处理:
   - 总是使用try/catch包装await调用
   - 考虑使用finally进行清理

2. 性能优化:
   - 并行执行独立的异步操作
   - 避免在循环中串行等待
   - 使用Promise.all处理并行任务

3. 控制流:
   - 合理使用条件语句和循环
   - 考虑使用生成器处理流式数据

4. 资源管理:
   - 实现超时机制
   - 使用重试策略处理失败
   - 合理使用缓存减少重复请求

5. 代码组织:
   - 将复杂的异步逻辑拆分为小函数
   - 使用类型检查和文档注释
   - 编写单元测试覆盖异步逻辑

常见陷阱:
- 忘记在async函数中使用await
- 在循环中不必要的串行执行
- 缺少错误处理导致未捕获的异常
- 内存泄漏（未正确清理资源）
`);

// 导出供测试使用
module.exports = {
  basicAsyncFunction,
  fetchUserDataAsync,
  delay,
  processArraySerial,
  processArrayParallel,
  processArrayBatch,
  withTimeout,
  retryWithBackoff,
  cacheAsync,
  AsyncResourcePool,
};
