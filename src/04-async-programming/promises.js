/**
 * JavaScript高级程序设计 - 第4章：Promise详解
 *
 * 本文件演示Promise的创建、使用和高级特性
 */

console.log("=== JavaScript Promise详解 ===\n");

// =============================================
// 1. Promise基础
// =============================================

console.log("1. Promise基础");

// 创建Promise
const basicPromise = new Promise((resolve, reject) => {
  const success = Math.random() > 0.5;

  setTimeout(() => {
    if (success) {
      resolve("操作成功!");
    } else {
      reject(new Error("操作失败!"));
    }
  }, 1000);
});

// 使用Promise
basicPromise
  .then((result) => {
    console.log("成功:", result);
  })
  .catch((error) => {
    console.log("失败:", error.message);
  });

// Promise的三种状态
console.log("\nPromise状态示例:");

const pendingPromise = new Promise(() => {
  // 永远不resolve或reject，保持pending状态
});

const resolvedPromise = Promise.resolve("已解决");
const rejectedPromise = Promise.reject(new Error("已拒绝"));

console.log("pending promise:", pendingPromise);
console.log("resolved promise:", resolvedPromise);
console.log("rejected promise:", rejectedPromise);

console.log();

// =============================================
// 2. Promise链式调用
// =============================================

console.log("2. Promise链式调用");

// 模拟异步操作
function asyncOperation(value, delay = 1000) {
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log(`处理: ${value}`);
      resolve(value * 2);
    }, delay);
  });
}

// 链式调用示例
asyncOperation(5, 500)
  .then((result) => {
    console.log("第一步结果:", result);
    return asyncOperation(result, 300);
  })
  .then((result) => {
    console.log("第二步结果:", result);
    return asyncOperation(result, 200);
  })
  .then((result) => {
    console.log("最终结果:", result);
  })
  .catch((error) => {
    console.error("链式调用出错:", error);
  });

console.log();

// =============================================
// 3. Promise.all() 并行执行
// =============================================

console.log("3. Promise.all() 并行执行");

function fetchData(id, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      if (id === "error") {
        reject(new Error(`获取数据${id}失败`));
      } else {
        resolve(`数据${id}`);
      }
    }, delay);
  });
}

// 所有Promise都成功
const promises1 = [
  fetchData("A", 1000),
  fetchData("B", 800),
  fetchData("C", 600),
];

Promise.all(promises1)
  .then((results) => {
    console.log("Promise.all 成功结果:", results);
  })
  .catch((error) => {
    console.error("Promise.all 失败:", error.message);
  });

// 有一个Promise失败
const promises2 = [
  fetchData("A", 500),
  fetchData("error", 300),
  fetchData("C", 400),
];

Promise.all(promises2)
  .then((results) => {
    console.log("Promise.all 成功结果:", results);
  })
  .catch((error) => {
    console.error("Promise.all 失败:", error.message);
  });

console.log();

// =============================================
// 4. Promise.allSettled() 获取所有结果
// =============================================

console.log("4. Promise.allSettled() 获取所有结果");

const mixedPromises = [
  Promise.resolve("成功1"),
  Promise.reject(new Error("失败1")),
  Promise.resolve("成功2"),
  Promise.reject(new Error("失败2")),
];

Promise.allSettled(mixedPromises).then((results) => {
  console.log("Promise.allSettled 结果:");
  results.forEach((result, index) => {
    if (result.status === "fulfilled") {
      console.log(`  ${index}: 成功 - ${result.value}`);
    } else {
      console.log(`  ${index}: 失败 - ${result.reason.message}`);
    }
  });
});

console.log();

// =============================================
// 5. Promise.race() 竞速
// =============================================

console.log("5. Promise.race() 竞速");

const racePromises = [
  new Promise((resolve) => setTimeout(() => resolve("快速完成"), 800)),
  new Promise((resolve) => setTimeout(() => resolve("中等速度"), 1200)),
  new Promise((resolve) => setTimeout(() => resolve("慢速完成"), 1600)),
];

Promise.race(racePromises).then((result) => {
  console.log("Promise.race 获胜者:", result);
});

// 超时模式
function withTimeout(promise, timeout) {
  const timeoutPromise = new Promise((_, reject) => {
    setTimeout(() => reject(new Error("超时")), timeout);
  });

  return Promise.race([promise, timeoutPromise]);
}

const slowPromise = new Promise((resolve) =>
  setTimeout(() => resolve("慢操作完成"), 2000)
);

withTimeout(slowPromise, 1500)
  .then((result) => {
    console.log("带超时的结果:", result);
  })
  .catch((error) => {
    console.log("超时错误:", error.message);
  });

console.log();

// =============================================
// 6. Promise.any() 第一个成功
// =============================================

console.log("6. Promise.any() 第一个成功");

const anyPromises = [
  Promise.reject(new Error("失败1")),
  new Promise((resolve) => setTimeout(() => resolve("第一个成功"), 1000)),
  Promise.reject(new Error("失败2")),
  new Promise((resolve) => setTimeout(() => resolve("第二个成功"), 1500)),
];

Promise.any(anyPromises)
  .then((result) => {
    console.log("Promise.any 第一个成功:", result);
  })
  .catch((error) => {
    console.log("Promise.any 全部失败:", error);
  });

console.log();

// =============================================
// 7. 错误处理最佳实践
// =============================================

console.log("7. 错误处理最佳实践");

// 错误传播
function errorPropagateDemo() {
  return Promise.resolve(42)
    .then((value) => {
      console.log("步骤1:", value);
      return value * 2;
    })
    .then((value) => {
      console.log("步骤2:", value);
      throw new Error("步骤2出错");
    })
    .then((value) => {
      console.log("步骤3:", value); // 不会执行
      return value * 2;
    })
    .catch((error) => {
      console.log("捕获错误:", error.message);
      return "错误恢复值";
    })
    .then((value) => {
      console.log("最终值:", value);
    });
}

errorPropagateDemo();

// 多重错误处理
function multipleErrorHandling() {
  return Promise.resolve()
    .then(() => {
      throw new Error("第一个错误");
    })
    .catch((error) => {
      console.log("处理第一个错误:", error.message);
      throw new Error("第二个错误");
    })
    .catch((error) => {
      console.log("处理第二个错误:", error.message);
      return "恢复正常";
    })
    .then((result) => {
      console.log("最终恢复:", result);
    });
}

setTimeout(() => multipleErrorHandling(), 2000);

console.log();

// =============================================
// 8. Promise实用工具函数
// =============================================

console.log("8. Promise实用工具函数");

// 延迟函数
function delay(ms) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

// 重试函数
function retry(fn, retries = 3, delayMs = 1000) {
  return new Promise((resolve, reject) => {
    function attempt(remainingRetries) {
      fn()
        .then(resolve)
        .catch((error) => {
          if (remainingRetries <= 0) {
            reject(error);
          } else {
            console.log(`重试中... 剩余次数: ${remainingRetries}`);
            setTimeout(() => {
              attempt(remainingRetries - 1);
            }, delayMs);
          }
        });
    }

    attempt(retries);
  });
}

// 测试重试
function unreliableOperation() {
  return new Promise((resolve, reject) => {
    if (Math.random() < 0.7) {
      reject(new Error("随机失败"));
    } else {
      resolve("成功!");
    }
  });
}

retry(unreliableOperation, 3, 500)
  .then((result) => {
    console.log("重试成功:", result);
  })
  .catch((error) => {
    console.log("重试最终失败:", error.message);
  });

// 并发限制
function limitConcurrency(tasks, limit) {
  return new Promise((resolve) => {
    let index = 0;
    let running = 0;
    let results = [];

    function runNext() {
      if (index >= tasks.length && running === 0) {
        resolve(results);
        return;
      }

      while (running < limit && index < tasks.length) {
        const currentIndex = index++;
        running++;

        tasks[currentIndex]()
          .then((result) => {
            results[currentIndex] = result;
          })
          .catch((error) => {
            results[currentIndex] = error;
          })
          .finally(() => {
            running--;
            runNext();
          });
      }
    }

    runNext();
  });
}

// 测试并发限制
const concurrentTasks = Array.from(
  { length: 10 },
  (_, i) => () => delay(Math.random() * 1000).then(() => `任务${i}完成`)
);

limitConcurrency(concurrentTasks, 3).then((results) => {
  console.log("并发限制结果:", results);
});

console.log();

// =============================================
// 9. Promise性能优化
// =============================================

console.log("9. Promise性能优化");

// 批处理优化
class BatchProcessor {
  constructor(batchSize = 10, delayMs = 100) {
    this.batchSize = batchSize;
    this.delayMs = delayMs;
    this.queue = [];
    this.processing = false;
  }

  add(item) {
    return new Promise((resolve, reject) => {
      this.queue.push({ item, resolve, reject });
      this.process();
    });
  }

  async process() {
    if (this.processing) return;
    this.processing = true;

    while (this.queue.length > 0) {
      const batch = this.queue.splice(0, this.batchSize);
      await this.processBatch(batch);

      if (this.queue.length > 0) {
        await delay(this.delayMs);
      }
    }

    this.processing = false;
  }

  async processBatch(batch) {
    console.log(`处理批次，大小: ${batch.length}`);

    // 模拟批处理
    await delay(200);

    batch.forEach(({ item, resolve }) => {
      resolve(`处理完成: ${item}`);
    });
  }
}

const processor = new BatchProcessor(3, 50);

// 添加多个任务
for (let i = 0; i < 8; i++) {
  processor.add(`项目${i}`).then((result) => console.log(result));
}

console.log();

// =============================================
// 10. 自定义Promise实现
// =============================================

console.log("10. 自定义Promise实现");

class MyPromise {
  constructor(executor) {
    this.state = "pending";
    this.value = undefined;
    this.reason = undefined;
    this.onFulfilledCallbacks = [];
    this.onRejectedCallbacks = [];

    const resolve = (value) => {
      if (this.state === "pending") {
        this.state = "fulfilled";
        this.value = value;
        this.onFulfilledCallbacks.forEach((callback) => callback());
      }
    };

    const reject = (reason) => {
      if (this.state === "pending") {
        this.state = "rejected";
        this.reason = reason;
        this.onRejectedCallbacks.forEach((callback) => callback());
      }
    };

    try {
      executor(resolve, reject);
    } catch (error) {
      reject(error);
    }
  }

  then(onFulfilled, onRejected) {
    return new MyPromise((resolve, reject) => {
      if (this.state === "fulfilled") {
        setTimeout(() => {
          try {
            const result = onFulfilled ? onFulfilled(this.value) : this.value;
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      } else if (this.state === "rejected") {
        setTimeout(() => {
          try {
            const result = onRejected ? onRejected(this.reason) : this.reason;
            resolve(result);
          } catch (error) {
            reject(error);
          }
        });
      } else {
        this.onFulfilledCallbacks.push(() => {
          setTimeout(() => {
            try {
              const result = onFulfilled ? onFulfilled(this.value) : this.value;
              resolve(result);
            } catch (error) {
              reject(error);
            }
          });
        });

        this.onRejectedCallbacks.push(() => {
          setTimeout(() => {
            try {
              const result = onRejected ? onRejected(this.reason) : this.reason;
              resolve(result);
            } catch (error) {
              reject(error);
            }
          });
        });
      }
    });
  }

  catch(onRejected) {
    return this.then(null, onRejected);
  }
}

// 测试自定义Promise
const myPromise = new MyPromise((resolve, reject) => {
  setTimeout(() => {
    resolve("自定义Promise成功!");
  }, 1000);
});

myPromise
  .then((result) => {
    console.log("自定义Promise结果:", result);
    return "链式调用";
  })
  .then((result) => {
    console.log("自定义Promise链式:", result);
  })
  .catch((error) => {
    console.log("自定义Promise错误:", error);
  });

// 导出供测试使用
module.exports = {
  asyncOperation,
  fetchData,
  delay,
  retry,
  limitConcurrency,
  BatchProcessor,
  MyPromise,
  withTimeout,
};
