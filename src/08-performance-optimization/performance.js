/**
 * JavaScript高级程序设计 - 第8章：性能优化
 *
 * 本文件演示JavaScript性能优化的各种技术和策略
 */

console.log("=== JavaScript 性能优化 ===\n");

// =============================================
// 1. 算法优化
// =============================================

console.log("1. 算法优化");

class AlgorithmOptimization {
  // 低效的查找算法
  static inefficientSearch(arr, target) {
    for (let i = 0; i < arr.length; i++) {
      if (arr[i] === target) {
        return i;
      }
    }
    return -1;
  }

  // 优化的二分查找（针对有序数组）
  static binarySearch(sortedArr, target) {
    let left = 0;
    let right = sortedArr.length - 1;

    while (left <= right) {
      const mid = Math.floor((left + right) / 2);

      if (sortedArr[mid] === target) {
        return mid;
      } else if (sortedArr[mid] < target) {
        left = mid + 1;
      } else {
        right = mid - 1;
      }
    }

    return -1;
  }

  // 低效的去重算法
  static inefficientUnique(arr) {
    const result = [];
    for (let i = 0; i < arr.length; i++) {
      if (result.indexOf(arr[i]) === -1) {
        result.push(arr[i]);
      }
    }
    return result;
  }

  // 优化的去重算法
  static efficientUnique(arr) {
    return [...new Set(arr)];
  }

  // 低效的数组合并
  static inefficientMerge(...arrays) {
    let result = [];
    for (const arr of arrays) {
      for (const item of arr) {
        result.push(item);
      }
    }
    return result;
  }

  // 优化的数组合并
  static efficientMerge(...arrays) {
    return [].concat(...arrays);
  }

  // 性能对比测试
  static performanceComparison() {
    console.log("算法性能对比:");

    // 测试数据
    const largeArray = Array.from({ length: 100000 }, (_, i) => i);
    const sortedArray = [...largeArray];
    const target = 75000;

    // 搜索算法对比
    console.time("线性搜索");
    this.inefficientSearch(largeArray, target);
    console.timeEnd("线性搜索");

    console.time("二分搜索");
    this.binarySearch(sortedArray, target);
    console.timeEnd("二分搜索");

    // 去重算法对比
    const duplicateArray = Array.from({ length: 10000 }, () =>
      Math.floor(Math.random() * 1000)
    );

    console.time("低效去重");
    this.inefficientUnique(duplicateArray.slice(0, 1000)); // 减少数据量避免太慢
    console.timeEnd("低效去重");

    console.time("高效去重");
    this.efficientUnique(duplicateArray);
    console.timeEnd("高效去重");

    // 数组合并对比
    const arrays = Array.from({ length: 100 }, () =>
      Array.from({ length: 100 }, (_, i) => i)
    );

    console.time("低效合并");
    this.inefficientMerge(...arrays);
    console.timeEnd("低效合并");

    console.time("高效合并");
    this.efficientMerge(...arrays);
    console.timeEnd("高效合并");
  }
}

AlgorithmOptimization.performanceComparison();

console.log();

// =============================================
// 2. 缓存优化
// =============================================

console.log("2. 缓存优化");

class CacheOptimization {
  constructor() {
    this.cache = new Map();
    this.lruCache = new LRUCache(100);
  }

  // 基础记忆化
  memoize(fn) {
    const cache = new Map();

    return function (...args) {
      const key = JSON.stringify(args);

      if (cache.has(key)) {
        console.log(`缓存命中: ${key}`);
        return cache.get(key);
      }

      console.log(`计算结果: ${key}`);
      const result = fn.apply(this, args);
      cache.set(key, result);
      return result;
    };
  }

  // 高级记忆化（支持过期时间）
  advancedMemoize(fn, ttl = 60000) {
    const cache = new Map();

    return function (...args) {
      const key = JSON.stringify(args);
      const cached = cache.get(key);

      if (cached && Date.now() - cached.timestamp < ttl) {
        console.log(`缓存命中 (TTL): ${key}`);
        return cached.value;
      }

      console.log(`计算结果 (TTL): ${key}`);
      const result = fn.apply(this, args);
      cache.set(key, {
        value: result,
        timestamp: Date.now(),
      });

      return result;
    };
  }

  // 函数结果缓存
  createCachedFunction(fn, maxSize = 1000) {
    const cache = new Map();
    const accessOrder = [];

    return function (...args) {
      const key = JSON.stringify(args);

      if (cache.has(key)) {
        // 更新访问顺序
        const index = accessOrder.indexOf(key);
        if (index > -1) {
          accessOrder.splice(index, 1);
        }
        accessOrder.push(key);

        return cache.get(key);
      }

      const result = fn.apply(this, args);

      // 如果缓存已满，删除最久未使用的
      if (cache.size >= maxSize) {
        const oldestKey = accessOrder.shift();
        cache.delete(oldestKey);
      }

      cache.set(key, result);
      accessOrder.push(key);

      return result;
    };
  }
}

// LRU缓存实现
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (this.cache.has(key)) {
      const value = this.cache.get(key);
      // 重新插入以更新顺序
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return -1;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // 删除最久未使用的（Map中的第一个）
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }

  size() {
    return this.cache.size;
  }

  clear() {
    this.cache.clear();
  }
}

// 测试缓存优化
const cacheOpt = new CacheOptimization();

// 昂贵的计算函数
function expensiveCalculation(n) {
  let result = 0;
  for (let i = 0; i < n * 1000; i++) {
    result += Math.sqrt(i);
  }
  return result;
}

// 创建缓存版本
const memoizedCalc = cacheOpt.memoize(expensiveCalculation);
const advancedMemoizedCalc = cacheOpt.advancedMemoize(
  expensiveCalculation,
  5000
);

console.log("缓存优化测试:");

console.time("首次计算");
memoizedCalc(100);
console.timeEnd("首次计算");

console.time("缓存命中");
memoizedCalc(100);
console.timeEnd("缓存命中");

console.time("不同参数");
memoizedCalc(200);
console.timeEnd("不同参数");

// 测试TTL缓存
console.log("\nTTL缓存测试:");
advancedMemoizedCalc(50);
advancedMemoizedCalc(50); // 应该命中缓存

setTimeout(() => {
  advancedMemoizedCalc(50); // 可能需要重新计算（如果超过TTL）
}, 1000);

console.log();

// =============================================
// 3. DOM操作优化
// =============================================

console.log("3. DOM操作优化");

class DOMOptimization {
  // 低效的DOM操作
  static inefficientDOMOperations() {
    const container = { innerHTML: "", appendChild: () => {}, children: [] };

    // 模拟低效操作：多次DOM修改
    console.time("低效DOM操作");
    for (let i = 0; i < 1000; i++) {
      const element = { textContent: `Item ${i}` };
      container.appendChild(element); // 每次都触发重排
    }
    console.timeEnd("低效DOM操作");
  }

  // 优化的DOM操作
  static efficientDOMOperations() {
    const container = { innerHTML: "" };

    console.time("高效DOM操作");
    // 使用文档片段或字符串拼接
    let htmlString = "";
    for (let i = 0; i < 1000; i++) {
      htmlString += `<div>Item ${i}</div>`;
    }
    container.innerHTML = htmlString; // 只触发一次重排
    console.timeEnd("高效DOM操作");
  }

  // 批量DOM更新
  static batchDOMUpdate(elements, updates) {
    // 读取所有值
    const measurements = elements.map((el) => ({
      element: el,
      rect: el.getBoundingClientRect?.() || { width: 100, height: 50 },
    }));

    // 批量写入
    measurements.forEach(({ element }, index) => {
      if (updates[index]) {
        Object.assign(element.style || {}, updates[index]);
      }
    });
  }

  // 虚拟滚动实现
  static createVirtualScroller(totalItems, itemHeight, containerHeight) {
    const visibleCount = Math.ceil(containerHeight / itemHeight);
    const buffer = 5; // 缓冲区

    return {
      getVisibleRange(scrollTop) {
        const start = Math.floor(scrollTop / itemHeight);
        const end = Math.min(start + visibleCount + buffer, totalItems);

        return {
          start: Math.max(0, start - buffer),
          end,
          offset: start * itemHeight,
        };
      },

      getTotalHeight() {
        return totalItems * itemHeight;
      },
    };
  }
}

// 测试DOM优化
console.log("DOM操作优化测试:");
DOMOptimization.inefficientDOMOperations();
DOMOptimization.efficientDOMOperations();

// 测试虚拟滚动
const virtualScroller = DOMOptimization.createVirtualScroller(10000, 50, 600);
const range = virtualScroller.getVisibleRange(2500);
console.log("虚拟滚动范围:", range);
console.log("总高度:", virtualScroller.getTotalHeight());

console.log();

// =============================================
// 4. 事件优化
// =============================================

console.log("4. 事件优化");

class EventOptimization {
  // 防抖函数
  static debounce(func, wait, immediate = false) {
    let timeout;

    return function executedFunction(...args) {
      const later = () => {
        timeout = null;
        if (!immediate) func(...args);
      };

      const callNow = immediate && !timeout;
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);

      if (callNow) func(...args);
    };
  }

  // 节流函数
  static throttle(func, limit) {
    let inThrottle;

    return function executedFunction(...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  // 高级节流（支持立即执行和尾随执行）
  static advancedThrottle(func, wait, options = {}) {
    let timeout, context, args, result;
    let previous = 0;

    const { leading = true, trailing = true } = options;

    const later = function () {
      previous = leading === false ? 0 : Date.now();
      timeout = null;
      result = func.apply(context, args);
      if (!timeout) context = args = null;
    };

    return function () {
      const now = Date.now();
      if (!previous && leading === false) previous = now;

      const remaining = wait - (now - previous);
      context = this;
      args = arguments;

      if (remaining <= 0 || remaining > wait) {
        if (timeout) {
          clearTimeout(timeout);
          timeout = null;
        }
        previous = now;
        result = func.apply(context, args);
        if (!timeout) context = args = null;
      } else if (!timeout && trailing !== false) {
        timeout = setTimeout(later, remaining);
      }

      return result;
    };
  }

  // 事件委托
  static delegate(container, selector, event, handler) {
    container.addEventListener(event, function (e) {
      // 模拟选择器匹配
      if (e.target.matches && e.target.matches(selector)) {
        handler.call(e.target, e);
      }
    });
  }

  // 被动事件监听器
  static addPassiveListener(element, event, handler) {
    element.addEventListener(event, handler, { passive: true });
  }
}

// 测试事件优化
console.log("事件优化测试:");

let callCount = 0;
const testFunction = () => {
  callCount++;
  console.log(`函数调用次数: ${callCount}`);
};

// 防抖测试
const debouncedFn = EventOptimization.debounce(testFunction, 100);
console.log("防抖测试 - 连续调用:");
debouncedFn();
debouncedFn();
debouncedFn();

setTimeout(() => {
  console.log("防抖结果 - 应该只调用一次");
}, 200);

// 节流测试
callCount = 0;
const throttledFn = EventOptimization.throttle(testFunction, 100);
console.log("\n节流测试 - 连续调用:");

for (let i = 0; i < 5; i++) {
  setTimeout(() => throttledFn(), i * 20);
}

console.log();

// =============================================
// 5. 内存优化
// =============================================

console.log("5. 内存优化");

class MemoryOptimization {
  constructor() {
    this.objectPool = [];
    this.weakCache = new WeakMap();
  }

  // 对象池模式
  createObjectPool(createFn, resetFn, maxSize = 100) {
    const pool = [];

    return {
      acquire() {
        if (pool.length > 0) {
          const obj = pool.pop();
          return obj;
        }
        return createFn();
      },

      release(obj) {
        if (pool.length < maxSize) {
          resetFn(obj);
          pool.push(obj);
        }
      },

      size() {
        return pool.length;
      },
    };
  }

  // WeakMap缓存（避免内存泄漏）
  createWeakCache() {
    const cache = new WeakMap();

    return {
      set(key, value) {
        cache.set(key, value);
      },

      get(key) {
        return cache.get(key);
      },

      has(key) {
        return cache.has(key);
      },
    };
  }

  // 大数组分片处理
  static processLargeArray(array, processor, chunkSize = 1000) {
    return new Promise((resolve) => {
      let index = 0;
      const results = [];

      function processChunk() {
        const chunk = array.slice(index, index + chunkSize);

        for (const item of chunk) {
          results.push(processor(item));
        }

        index += chunkSize;

        if (index < array.length) {
          // 使用setTimeout避免阻塞主线程
          setTimeout(processChunk, 0);
        } else {
          resolve(results);
        }
      }

      processChunk();
    });
  }

  // 内存使用监控
  static monitorMemoryUsage() {
    // 在真实环境中使用 performance.memory
    const mockMemory = {
      usedJSHeapSize: Math.random() * 50000000,
      totalJSHeapSize: Math.random() * 100000000,
      jsHeapSizeLimit: 2000000000,
    };

    return {
      used: (mockMemory.usedJSHeapSize / 1024 / 1024).toFixed(2) + " MB",
      total: (mockMemory.totalJSHeapSize / 1024 / 1024).toFixed(2) + " MB",
      limit: (mockMemory.jsHeapSizeLimit / 1024 / 1024).toFixed(2) + " MB",
      usage:
        (
          (mockMemory.usedJSHeapSize / mockMemory.totalJSHeapSize) *
          100
        ).toFixed(2) + "%",
    };
  }

  // 清理事件监听器
  static createEventManager() {
    const listeners = new Map();

    return {
      on(element, event, handler) {
        const key = `${element}_${event}`;
        if (!listeners.has(key)) {
          listeners.set(key, []);
        }
        listeners.get(key).push(handler);
        element.addEventListener(event, handler);
      },

      off(element, event, handler) {
        element.removeEventListener(event, handler);
        const key = `${element}_${event}`;
        const handlers = listeners.get(key);
        if (handlers) {
          const index = handlers.indexOf(handler);
          if (index > -1) {
            handlers.splice(index, 1);
          }
        }
      },

      cleanup() {
        for (const [key, handlers] of listeners) {
          const [element, event] = key.split("_");
          handlers.forEach((handler) => {
            element.removeEventListener(event, handler);
          });
        }
        listeners.clear();
      },
    };
  }
}

// 测试内存优化
const memOpt = new MemoryOptimization();

// 对象池测试
const pointPool = memOpt.createObjectPool(
  () => ({ x: 0, y: 0, z: 0 }),
  (point) => {
    point.x = 0;
    point.y = 0;
    point.z = 0;
  },
  50
);

console.log("对象池测试:");
const point1 = pointPool.acquire();
point1.x = 10;
point1.y = 20;
console.log("获取对象:", point1);

pointPool.release(point1);
console.log("池大小:", pointPool.size());

const point2 = pointPool.acquire();
console.log("重用对象:", point2); // 应该是重置后的对象

// 大数组处理测试
const largeArray = Array.from({ length: 10000 }, (_, i) => i);
MemoryOptimization.processLargeArray(largeArray, (x) => x * 2, 2000).then(
  (results) => {
    console.log("大数组处理完成，结果长度:", results.length);
  }
);

// 内存监控
console.log("内存使用情况:", MemoryOptimization.monitorMemoryUsage());

console.log();

// =============================================
// 6. 异步优化
// =============================================

console.log("6. 异步优化");

class AsyncOptimization {
  // 并发控制
  static createConcurrencyController(maxConcurrency = 3) {
    let running = 0;
    const queue = [];

    return async function (asyncFn) {
      return new Promise((resolve, reject) => {
        queue.push({ asyncFn, resolve, reject });
        tryNext();
      });

      async function tryNext() {
        if (running >= maxConcurrency || queue.length === 0) {
          return;
        }

        running++;
        const { asyncFn, resolve, reject } = queue.shift();

        try {
          const result = await asyncFn();
          resolve(result);
        } catch (error) {
          reject(error);
        } finally {
          running--;
          tryNext();
        }
      }
    };
  }

  // 请求去重
  static createRequestDeduplicator() {
    const pendingRequests = new Map();

    return function (key, requestFn) {
      if (pendingRequests.has(key)) {
        console.log(`请求去重: ${key}`);
        return pendingRequests.get(key);
      }

      const promise = requestFn().finally(() => {
        pendingRequests.delete(key);
      });

      pendingRequests.set(key, promise);
      return promise;
    };
  }

  // 批量请求优化
  static createBatchProcessor(batchSize = 10, delay = 100) {
    let batch = [];
    let timeoutId;

    return function (item, processor) {
      return new Promise((resolve, reject) => {
        batch.push({ item, resolve, reject });

        if (batch.length >= batchSize) {
          processBatch();
        } else if (!timeoutId) {
          timeoutId = setTimeout(processBatch, delay);
        }
      });

      async function processBatch() {
        const currentBatch = batch;
        batch = [];

        if (timeoutId) {
          clearTimeout(timeoutId);
          timeoutId = null;
        }

        try {
          const items = currentBatch.map((b) => b.item);
          const results = await processor(items);

          currentBatch.forEach((b, index) => {
            b.resolve(results[index]);
          });
        } catch (error) {
          currentBatch.forEach((b) => {
            b.reject(error);
          });
        }
      }
    };
  }

  // Promise池
  static createPromisePool(promiseFactories, concurrency = 3) {
    return new Promise((resolve, reject) => {
      const results = new Array(promiseFactories.length);
      let completed = 0;
      let nextIndex = 0;

      async function runNext() {
        if (nextIndex >= promiseFactories.length) {
          return;
        }

        const index = nextIndex++;
        const factory = promiseFactories[index];

        try {
          results[index] = await factory();
          completed++;

          if (completed === promiseFactories.length) {
            resolve(results);
          } else {
            runNext();
          }
        } catch (error) {
          reject(error);
        }
      }

      // 启动初始并发
      for (let i = 0; i < Math.min(concurrency, promiseFactories.length); i++) {
        runNext();
      }
    });
  }
}

// 测试异步优化
console.log("异步优化测试:");

// 模拟异步操作
const mockAsyncOperation = (id, delay) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(`操作${id}完成`);
    }, delay);
  });
};

// 并发控制测试
const concurrencyController = AsyncOptimization.createConcurrencyController(2);

console.log("并发控制测试:");
const tasks = Array.from(
  { length: 5 },
  (_, i) => () => concurrencyController(() => mockAsyncOperation(i + 1, 100))
);

Promise.all(tasks.map((task) => task())).then((results) => {
  console.log("并发控制结果:", results);
});

// 请求去重测试
const deduplicator = AsyncOptimization.createRequestDeduplicator();

console.log("\n请求去重测试:");
const duplicateRequests = [
  deduplicator("user:1", () => mockAsyncOperation("user:1", 200)),
  deduplicator("user:1", () => mockAsyncOperation("user:1", 200)), // 应该被去重
  deduplicator("user:2", () => mockAsyncOperation("user:2", 200)),
];

Promise.all(duplicateRequests).then((results) => {
  console.log("去重请求结果:", results);
});

console.log();

// =============================================
// 7. 性能监控
// =============================================

console.log("7. 性能监控");

class PerformanceMonitor {
  constructor() {
    this.metrics = new Map();
    this.observers = [];
  }

  // 性能标记
  mark(name) {
    const timestamp = performance.now();
    this.metrics.set(name, timestamp);

    if (typeof performance.mark === "function") {
      performance.mark(name);
    }
  }

  // 性能测量
  measure(name, startMark, endMark) {
    const startTime = this.metrics.get(startMark);
    const endTime = endMark ? this.metrics.get(endMark) : performance.now();

    if (startTime === undefined) {
      throw new Error(`开始标记不存在: ${startMark}`);
    }

    const duration = endTime - startTime;

    if (typeof performance.measure === "function") {
      try {
        performance.measure(name, startMark, endMark);
      } catch (error) {
        // 忽略性能API错误
      }
    }

    this.notifyObservers({
      type: "measure",
      name,
      duration,
      startMark,
      endMark,
    });

    return duration;
  }

  // 性能观察者
  observe(callback) {
    this.observers.push(callback);

    return () => {
      const index = this.observers.indexOf(callback);
      if (index > -1) {
        this.observers.splice(index, 1);
      }
    };
  }

  notifyObservers(event) {
    this.observers.forEach((callback) => {
      try {
        callback(event);
      } catch (error) {
        console.error("性能观察者错误:", error);
      }
    });
  }

  // 获取运行时性能
  getRuntimeMetrics() {
    const navigation = performance.navigation || {};
    const timing = performance.timing || {};

    return {
      // 页面加载时间（模拟）
      domContentLoaded: Math.random() * 1000,
      loadComplete: Math.random() * 2000,

      // 导航类型（模拟）
      navigationType: navigation.type || 0,

      // 重定向次数（模拟）
      redirectCount: navigation.redirectCount || 0,

      // 内存使用（模拟）
      memory: this.getMemoryInfo(),
    };
  }

  getMemoryInfo() {
    // 模拟内存信息
    return {
      used: Math.random() * 50,
      total: Math.random() * 100,
      limit: 2000,
    };
  }

  // 性能报告
  generateReport() {
    const metrics = this.getRuntimeMetrics();

    return {
      timestamp: Date.now(),
      metrics,
      customMarks: Object.fromEntries(this.metrics),
      recommendations: this.getRecommendations(metrics),
    };
  }

  getRecommendations(metrics) {
    const recommendations = [];

    if (metrics.domContentLoaded > 800) {
      recommendations.push("DOM解析时间过长，考虑减少DOM复杂度");
    }

    if (metrics.memory.used > metrics.memory.total * 0.8) {
      recommendations.push("内存使用率较高，检查是否存在内存泄漏");
    }

    return recommendations;
  }
}

// 测试性能监控
const perfMonitor = new PerformanceMonitor();

// 添加性能观察者
const unobserve = perfMonitor.observe((event) => {
  console.log(`性能事件: ${event.name} = ${event.duration.toFixed(2)}ms`);
});

console.log("性能监控测试:");

perfMonitor.mark("task-start");

// 模拟一些工作
setTimeout(() => {
  perfMonitor.mark("task-middle");

  setTimeout(() => {
    perfMonitor.mark("task-end");

    perfMonitor.measure("第一阶段", "task-start", "task-middle");
    perfMonitor.measure("第二阶段", "task-middle", "task-end");
    perfMonitor.measure("总时间", "task-start", "task-end");

    console.log("性能报告:", perfMonitor.generateReport());

    unobserve(); // 停止观察
  }, 150);
}, 100);

console.log();

// =============================================
// 8. 最佳实践总结
// =============================================

console.log("8. 最佳实践总结");

console.log(`
JavaScript性能优化最佳实践:

1. 算法优化:
   - 选择合适的数据结构和算法
   - 避免不必要的循环和计算
   - 使用高效的查找和排序算法
   - 减少算法复杂度

2. 内存优化:
   - 及时清理不需要的引用
   - 使用对象池减少GC压力
   - 避免内存泄漏
   - 使用WeakMap/WeakSet避免强引用

3. DOM优化:
   - 减少DOM操作次数
   - 使用文档片段批量更新
   - 实施虚拟滚动
   - 避免强制同步布局

4. 事件优化:
   - 使用事件委托减少监听器
   - 实施防抖和节流
   - 使用被动事件监听器
   - 及时移除事件监听器

5. 异步优化:
   - 控制并发数量
   - 实施请求去重
   - 使用批量处理
   - 合理使用Promise和async/await

6. 缓存策略:
   - 实施适当的缓存机制
   - 使用记忆化优化重复计算
   - 设置合理的缓存过期时间
   - 监控缓存命中率

7. 代码优化:
   - 避免全局变量污染
   - 使用严格模式
   - 减少作用域链查找
   - 优化循环性能

8. 监控和分析:
   - 使用性能分析工具
   - 监控关键性能指标
   - 建立性能基准
   - 持续优化和改进

常用工具:
- Chrome DevTools
- Lighthouse
- WebPageTest
- Performance Observer API
- Memory profiling tools

性能指标:
- First Contentful Paint (FCP)
- Largest Contentful Paint (LCP)
- First Input Delay (FID)
- Cumulative Layout Shift (CLS)
- Time to Interactive (TTI)
`);

// 导出供测试使用
module.exports = {
  AlgorithmOptimization,
  CacheOptimization,
  LRUCache,
  DOMOptimization,
  EventOptimization,
  MemoryOptimization,
  AsyncOptimization,
  PerformanceMonitor,
};

console.log("性能优化演示完成\n");
