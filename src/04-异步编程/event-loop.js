/**
 * JavaScript高级程序设计 - 第4章：事件循环
 *
 * 本文件深入解释JavaScript的事件循环机制
 */

console.log("=== JavaScript 事件循环 ===\n");

// =============================================
// 1. 事件循环基础概念
// =============================================

console.log("1. 事件循环基础概念");

console.log("同步代码开始");

setTimeout(() => {
  console.log("宏任务: setTimeout");
}, 0);

Promise.resolve().then(() => {
  console.log("微任务: Promise.then");
});

console.log("同步代码结束");

// 输出顺序：
// 同步代码开始
// 同步代码结束
// 微任务: Promise.then
// 宏任务: setTimeout

console.log();

// =============================================
// 2. 宏任务 vs 微任务
// =============================================

console.log("2. 宏任务 vs 微任务");

// 宏任务示例
setTimeout(() => console.log("宏任务1: setTimeout"), 0);
setImmediate(() => console.log("宏任务2: setImmediate"));

// 微任务示例
Promise.resolve().then(() => console.log("微任务1: Promise"));
queueMicrotask(() => console.log("微任务2: queueMicrotask"));

// 复杂的执行顺序
setTimeout(() => {
  console.log("宏任务中的同步代码");
  Promise.resolve().then(() => {
    console.log("宏任务中的微任务");
  });
}, 0);

Promise.resolve().then(() => {
  console.log("微任务中的同步代码");
  setTimeout(() => {
    console.log("微任务中的宏任务");
  }, 0);
});

console.log();

// =============================================
// 3. 任务队列优先级
// =============================================

console.log("3. 任务队列优先级");

function demonstratePriority() {
  console.log("=== 优先级演示开始 ===");

  // 1. 同步代码
  console.log("1. 同步代码");

  // 2. 微任务
  Promise.resolve().then(() => {
    console.log("2. Promise微任务");

    // 在微任务中添加新的微任务
    Promise.resolve().then(() => {
      console.log("3. 嵌套Promise微任务");
    });

    queueMicrotask(() => {
      console.log("4. 嵌套queueMicrotask");
    });
  });

  queueMicrotask(() => {
    console.log("5. queueMicrotask");
  });

  // 3. 宏任务
  setTimeout(() => {
    console.log("6. setTimeout宏任务");

    // 在宏任务中添加微任务
    Promise.resolve().then(() => {
      console.log("7. 宏任务中的微任务");
    });
  }, 0);

  setImmediate(() => {
    console.log("8. setImmediate宏任务");
  });

  console.log("9. 更多同步代码");
}

setTimeout(() => demonstratePriority(), 100);

console.log();

// =============================================
// 4. 事件循环阶段详解
// =============================================

console.log("4. 事件循环阶段详解");

function demonstrateEventLoopPhases() {
  console.log("=== 事件循环阶段演示 ===");

  // Timer阶段
  setTimeout(() => {
    console.log("Timer阶段: setTimeout");
  }, 0);

  // Poll阶段 - I/O操作
  const fs = require("fs");
  if (fs && fs.readFile) {
    fs.readFile(__filename, () => {
      console.log("Poll阶段: 文件读取完成");

      // Check阶段
      setImmediate(() => {
        console.log("Check阶段: setImmediate");
      });

      // 添加新的Timer
      setTimeout(() => {
        console.log("Timer阶段: 新的setTimeout");
      }, 0);
    });
  }

  // Close阶段
  const server = {
    close: (callback) => {
      setTimeout(callback, 10);
    },
  };

  server.close(() => {
    console.log("Close阶段: 连接关闭");
  });

  // 微任务在每个阶段之间执行
  Promise.resolve().then(() => {
    console.log("微任务: 在阶段间执行");
  });
}

setTimeout(() => demonstrateEventLoopPhases(), 200);

console.log();

// =============================================
// 5. 异步操作的执行时机
// =============================================

console.log("5. 异步操作的执行时机");

async function asyncTimingDemo() {
  console.log("=== 异步时机演示 ===");

  console.log("1. async函数开始");

  await new Promise((resolve) => {
    console.log("2. Promise执行器(同步)");
    setTimeout(() => {
      console.log("3. Promise resolve(宏任务)");
      resolve();
    }, 0);
  });

  console.log("4. await之后(微任务)");

  setTimeout(() => {
    console.log("5. 函数内的setTimeout(宏任务)");
  }, 0);

  return "6. async函数返回";
}

asyncTimingDemo().then((result) => {
  console.log("7. async函数then:", result);
});

console.log("8. async函数调用后的同步代码");

console.log();

// =============================================
// 6. 常见的事件循环陷阱
// =============================================

console.log("6. 常见的事件循环陷阱");

// 陷阱1: 无限微任务
function microtaskTrap() {
  console.log("=== 微任务陷阱演示 ===");

  let count = 0;
  function addMicrotask() {
    if (count < 5) {
      // 限制次数避免真正的无限循环
      count++;
      console.log(`微任务 ${count}`);
      queueMicrotask(addMicrotask);
    }
  }

  addMicrotask();

  setTimeout(() => {
    console.log("这个宏任务会被延迟很久才执行");
  }, 0);
}

setTimeout(() => microtaskTrap(), 300);

// 陷阱2: 错误的执行顺序假设
function orderTrap() {
  console.log("=== 执行顺序陷阱 ===");

  for (let i = 0; i < 3; i++) {
    setTimeout(() => {
      console.log("setTimeout", i); // 输出: 3, 3, 3
    }, 0);
  }

  for (let i = 0; i < 3; i++) {
    ((index) => {
      setTimeout(() => {
        console.log("闭包修复", index); // 输出: 0, 1, 2
      }, 0);
    })(i);
  }

  for (let i = 0; i < 3; i++) {
    setTimeout(
      (index) => {
        console.log("参数传递", index); // 输出: 0, 1, 2
      },
      0,
      i
    );
  }
}

setTimeout(() => orderTrap(), 400);

console.log();

// =============================================
// 7. 性能监控和调试
// =============================================

console.log("7. 性能监控和调试");

class EventLoopMonitor {
  constructor() {
    this.metrics = {
      macrotasks: 0,
      microtasks: 0,
      avgMacrotaskTime: 0,
      avgMicrotaskTime: 0,
    };
  }

  wrapMacrotask(fn, name = "macrotask") {
    return (...args) => {
      const start = performance.now();
      this.metrics.macrotasks++;

      const result = fn(...args);

      const end = performance.now();
      const duration = end - start;

      this.metrics.avgMacrotaskTime =
        (this.metrics.avgMacrotaskTime + duration) / 2;

      console.log(`宏任务 ${name}: ${duration.toFixed(2)}ms`);
      return result;
    };
  }

  wrapMicrotask(fn, name = "microtask") {
    return (...args) => {
      const start = performance.now();
      this.metrics.microtasks++;

      const result = fn(...args);

      const end = performance.now();
      const duration = end - start;

      this.metrics.avgMicrotaskTime =
        (this.metrics.avgMicrotaskTime + duration) / 2;

      console.log(`微任务 ${name}: ${duration.toFixed(2)}ms`);
      return result;
    };
  }

  getMetrics() {
    return { ...this.metrics };
  }
}

const monitor = new EventLoopMonitor();

// 监控示例
setTimeout(
  monitor.wrapMacrotask(() => {
    // 模拟耗时操作
    let sum = 0;
    for (let i = 0; i < 1000000; i++) {
      sum += i;
    }
    return sum;
  }, "计算密集任务"),
  500
);

Promise.resolve().then(
  monitor.wrapMicrotask(() => {
    // 模拟微任务
    return "微任务完成";
  }, "快速微任务")
);

setTimeout(() => {
  console.log("监控指标:", monitor.getMetrics());
}, 600);

console.log();

// =============================================
// 8. 事件循环优化策略
// =============================================

console.log("8. 事件循环优化策略");

// 策略1: 任务分片
function chunkTask(array, chunkSize, processor) {
  let index = 0;

  function processChunk() {
    const chunk = array.slice(index, index + chunkSize);
    if (chunk.length === 0) {
      console.log("分片处理完成");
      return;
    }

    processor(chunk);
    index += chunkSize;

    // 让出控制权给其他任务
    setTimeout(processChunk, 0);
  }

  processChunk();
}

// 测试分片处理
const largeArray = Array.from({ length: 1000 }, (_, i) => i);

setTimeout(() => {
  console.log("开始分片处理...");
  chunkTask(largeArray, 100, (chunk) => {
    console.log(`处理分片: ${chunk[0]} - ${chunk[chunk.length - 1]}`);
  });
}, 700);

// 策略2: 优先级队列
class PriorityTaskQueue {
  constructor() {
    this.queues = {
      high: [],
      normal: [],
      low: [],
    };
    this.processing = false;
  }

  add(task, priority = "normal") {
    this.queues[priority].push(task);
    this.process();
  }

  async process() {
    if (this.processing) return;
    this.processing = true;

    while (this.hasTask()) {
      const task = this.getNextTask();
      if (task) {
        try {
          await task();
        } catch (error) {
          console.error("任务执行错误:", error);
        }
      }

      // 让出控制权
      await new Promise((resolve) => setTimeout(resolve, 0));
    }

    this.processing = false;
  }

  hasTask() {
    return (
      this.queues.high.length > 0 ||
      this.queues.normal.length > 0 ||
      this.queues.low.length > 0
    );
  }

  getNextTask() {
    if (this.queues.high.length > 0) {
      return this.queues.high.shift();
    }
    if (this.queues.normal.length > 0) {
      return this.queues.normal.shift();
    }
    if (this.queues.low.length > 0) {
      return this.queues.low.shift();
    }
    return null;
  }
}

const taskQueue = new PriorityTaskQueue();

setTimeout(() => {
  console.log("=== 优先级队列测试 ===");

  taskQueue.add(() => console.log("低优先级任务1"), "low");
  taskQueue.add(() => console.log("高优先级任务1"), "high");
  taskQueue.add(() => console.log("普通优先级任务1"), "normal");
  taskQueue.add(() => console.log("高优先级任务2"), "high");
  taskQueue.add(() => console.log("低优先级任务2"), "low");
}, 800);

console.log();

// =============================================
// 9. 内存泄漏防护
// =============================================

console.log("9. 内存泄漏防护");

class LeakSafeTimer {
  constructor() {
    this.timers = new Set();
    this.intervals = new Set();
  }

  setTimeout(callback, delay, ...args) {
    const timer = setTimeout(
      (...timerArgs) => {
        this.timers.delete(timer);
        callback(...timerArgs);
      },
      delay,
      ...args
    );

    this.timers.add(timer);
    return timer;
  }

  setInterval(callback, delay, ...args) {
    const interval = setInterval(callback, delay, ...args);
    this.intervals.add(interval);
    return interval;
  }

  clearTimeout(timer) {
    clearTimeout(timer);
    this.timers.delete(timer);
  }

  clearInterval(interval) {
    clearInterval(interval);
    this.intervals.delete(interval);
  }

  clearAll() {
    this.timers.forEach((timer) => clearTimeout(timer));
    this.intervals.forEach((interval) => clearInterval(interval));
    this.timers.clear();
    this.intervals.clear();
    console.log("清理所有定时器");
  }

  getActiveCount() {
    return {
      timers: this.timers.size,
      intervals: this.intervals.size,
    };
  }
}

const safeTimer = new LeakSafeTimer();

setTimeout(() => {
  console.log("=== 内存泄漏防护测试 ===");

  // 创建一些定时器
  safeTimer.setTimeout(() => console.log("安全定时器1"), 100);
  safeTimer.setTimeout(() => console.log("安全定时器2"), 200);

  const interval = safeTimer.setInterval(() => {
    console.log("安全间隔器");
  }, 150);

  console.log("活动定时器:", safeTimer.getActiveCount());

  // 5秒后清理所有定时器
  setTimeout(() => {
    safeTimer.clearAll();
    console.log("清理后活动定时器:", safeTimer.getActiveCount());
  }, 500);
}, 900);

console.log();

// =============================================
// 10. 最佳实践总结
// =============================================

console.log("10. 最佳实践总结");

console.log(`
事件循环最佳实践:

1. 理解执行顺序:
   - 同步代码 → 微任务 → 宏任务
   - 微任务总是在下一个宏任务之前执行
   - 每个宏任务后都会执行所有微任务

2. 避免阻塞:
   - 将长时间运行的任务分片处理
   - 使用setTimeout(0)让出控制权
   - 避免无限的微任务循环

3. 性能优化:
   - 批量处理DOM操作
   - 使用requestAnimationFrame处理动画
   - 合理使用Promise.all进行并行处理

4. 内存管理:
   - 及时清理定时器和监听器
   - 避免创建不必要的闭包
   - 使用WeakMap/WeakSet防止内存泄漏

5. 调试技巧:
   - 使用Performance API监控性能
   - 理解调用栈和任务队列
   - 使用开发者工具的Performance面板

常见陷阱:
- 在循环中创建定时器导致变量捕获错误
- 微任务无限循环阻塞宏任务
- 错误估计异步操作的执行顺序
- 忘记清理定时器导致内存泄漏
`);

// 导出供测试使用
module.exports = {
  EventLoopMonitor,
  chunkTask,
  PriorityTaskQueue,
  LeakSafeTimer,
};
