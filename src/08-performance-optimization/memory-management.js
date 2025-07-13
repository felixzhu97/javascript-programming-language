/**
 * JavaScript高级程序设计 - 第8章：内存管理
 *
 * 本文件演示JavaScript内存管理、垃圾回收和内存泄漏防护
 */

console.log("=== JavaScript 内存管理 ===\n");

// =============================================
// 1. 垃圾回收机制
// =============================================

console.log("1. 垃圾回收机制");

class GarbageCollectionDemo {
  // 引用计数示例
  static demonstrateReferenceCounting() {
    console.log("引用计数演示:");

    // 创建对象
    let obj1 = { name: "对象1" };
    let obj2 = { name: "对象2" };

    console.log("创建两个对象");

    // 互相引用
    obj1.ref = obj2;
    obj2.ref = obj1;

    console.log("建立互相引用");

    // 解除引用
    obj1 = null;
    obj2 = null;

    console.log("解除外部引用 - 但互相引用仍存在（可能导致内存泄漏）");

    // 在现代JavaScript引擎中，标记-清除算法会处理循环引用
    // 但在某些情况下仍需要小心
  }

  // 标记-清除演示
  static demonstrateMarkAndSweep() {
    console.log("\n标记-清除演示:");

    function createObjects() {
      const root = { name: "根对象" };
      const child1 = { name: "子对象1", parent: root };
      const child2 = { name: "子对象2", parent: root };

      root.children = [child1, child2];

      // 创建一个不可达的对象
      const isolated = { name: "孤立对象" };

      return root; // 只返回根对象，isolated变为不可达
    }

    let rootObject = createObjects();
    console.log("创建对象树:", rootObject.name);

    // 模拟垃圾回收
    setTimeout(() => {
      rootObject = null; // 使整个对象树不可达
      console.log("根对象置为null，触发垃圾回收");

      // 强制垃圾回收（在支持的环境中）
      if (typeof global !== "undefined" && global.gc) {
        global.gc();
        console.log("强制垃圾回收完成");
      }
    }, 1000);
  }

  // 分代垃圾回收
  static demonstrateGenerationalGC() {
    console.log("\n分代垃圾回收演示:");

    // 年轻代对象（短期存活）
    function createYoungGeneration() {
      const temp = Array.from({ length: 1000 }, (_, i) => ({
        id: i,
        data: `临时数据${i}`,
      }));

      return temp.filter((item) => item.id % 2 === 0);
    }

    // 老年代对象（长期存活）
    const oldGeneration = {
      cache: new Map(),
      config: { maxSize: 1000 },
      stats: { hits: 0, misses: 0 },
    };

    console.log("创建年轻代对象（短期）");
    let youngObjects = createYoungGeneration();

    console.log("创建老年代对象（长期）");
    oldGeneration.cache.set("persistent", "long-lived data");

    // 年轻代对象很快被回收
    setTimeout(() => {
      youngObjects = null;
      console.log("年轻代对象置为null - 应该被快速回收");
    }, 100);

    // 老年代对象继续存在
    setTimeout(() => {
      console.log("老年代对象仍然存在:", oldGeneration.config);
    }, 500);
  }
}

GarbageCollectionDemo.demonstrateReferenceCounting();
GarbageCollectionDemo.demonstrateMarkAndSweep();
GarbageCollectionDemo.demonstrateGenerationalGC();

console.log();

// =============================================
// 2. 内存泄漏检测与防护
// =============================================

console.log("2. 内存泄漏检测与防护");

class MemoryLeakDetector {
  constructor() {
    this.trackedObjects = new WeakSet();
    this.memorySnapshots = [];
    this.leakPatterns = [];
  }

  // 常见内存泄漏模式
  static demonstrateCommonLeaks() {
    console.log("常见内存泄漏模式:");

    // 1. 全局变量泄漏
    console.log("\n1. 全局变量泄漏:");
    function createGlobalLeak() {
      // 意外创建全局变量
      accidentalGlobal = "这会成为全局变量";

      // 显式全局变量未清理
      window.globalCache = window.globalCache || {};
      window.globalCache[Math.random()] = new Array(1000).fill("data");
    }

    // 2. 闭包泄漏
    console.log("2. 闭包泄漏:");
    function createClosureLeak() {
      const largeData = new Array(100000).fill("large data");

      return function (input) {
        // 即使不使用largeData，它仍被闭包持有
        return `处理: ${input}`;
      };
    }

    // 3. 事件监听器泄漏
    console.log("3. 事件监听器泄漏:");
    function createEventListenerLeak() {
      const element = {
        addEventListener: () => {},
        removeEventListener: () => {},
      };
      const data = new Array(10000).fill("event data");

      function handleEvent() {
        console.log(data.length); // 持有data引用
      }

      element.addEventListener("click", handleEvent);
      // 忘记移除监听器
      // element.removeEventListener('click', handleEvent);

      return element;
    }

    // 4. 定时器泄漏
    console.log("4. 定时器泄漏:");
    function createTimerLeak() {
      const largeObject = { data: new Array(50000).fill("timer data") };

      const intervalId = setInterval(() => {
        console.log(largeObject.data.length); // 持有largeObject引用
      }, 1000);

      // 忘记清除定时器
      // clearInterval(intervalId);

      return intervalId;
    }

    // 演示泄漏
    createGlobalLeak();
    const leakyFunction = createClosureLeak();
    const leakyElement = createEventListenerLeak();
    const leakyTimer = createTimerLeak();

    console.log("已创建多种内存泄漏示例");

    // 清理演示
    setTimeout(() => {
      // 清理定时器
      clearInterval(leakyTimer);
      console.log("清理定时器泄漏");
    }, 3000);
  }

  // 内存泄漏防护
  static createMemoryLeakProtection() {
    console.log("\n内存泄漏防护策略:");

    return {
      // 自动清理事件监听器
      createAutoCleanupEventManager() {
        const listeners = new Map();
        const elements = new WeakMap();

        return {
          on(element, event, handler) {
            const key = Symbol();
            listeners.set(key, { element, event, handler });

            if (!elements.has(element)) {
              elements.set(element, new Set());
            }
            elements.get(element).add(key);

            element.addEventListener(event, handler);
            console.log(`添加事件监听器: ${event}`);

            return key;
          },

          off(key) {
            const listener = listeners.get(key);
            if (listener) {
              const { element, event, handler } = listener;
              element.removeEventListener(event, handler);
              listeners.delete(key);

              const elementKeys = elements.get(element);
              if (elementKeys) {
                elementKeys.delete(key);
              }

              console.log(`移除事件监听器: ${event}`);
            }
          },

          cleanup() {
            for (const [key, listener] of listeners) {
              const { element, event, handler } = listener;
              element.removeEventListener(event, handler);
            }
            listeners.clear();
            console.log("清理所有事件监听器");
          },
        };
      },

      // 自动清理定时器
      createTimerManager() {
        const timers = new Set();

        return {
          setTimeout(callback, delay) {
            const id = setTimeout((...args) => {
              timers.delete(id);
              callback(...args);
            }, delay);
            timers.add(id);
            return id;
          },

          setInterval(callback, delay) {
            const id = setInterval(callback, delay);
            timers.add(id);
            return id;
          },

          clearTimeout(id) {
            clearTimeout(id);
            timers.delete(id);
          },

          clearInterval(id) {
            clearInterval(id);
            timers.delete(id);
          },

          cleanup() {
            for (const id of timers) {
              clearTimeout(id);
              clearInterval(id);
            }
            timers.clear();
            console.log(`清理 ${timers.size} 个定时器`);
          },
        };
      },

      // WeakMap缓存（自动清理）
      createWeakCache() {
        const cache = new WeakMap();
        const metadata = new Map();

        return {
          set(key, value, ttl = Infinity) {
            cache.set(key, value);
            if (ttl !== Infinity) {
              metadata.set(key, {
                expiry: Date.now() + ttl,
                timer: setTimeout(() => {
                  this.delete(key);
                }, ttl),
              });
            }
          },

          get(key) {
            const meta = metadata.get(key);
            if (meta && Date.now() > meta.expiry) {
              this.delete(key);
              return undefined;
            }
            return cache.get(key);
          },

          delete(key) {
            cache.delete(key);
            const meta = metadata.get(key);
            if (meta) {
              clearTimeout(meta.timer);
              metadata.delete(key);
            }
          },

          cleanup() {
            for (const [key, meta] of metadata) {
              clearTimeout(meta.timer);
            }
            metadata.clear();
            console.log("清理WeakMap缓存");
          },
        };
      },
    };
  }

  // 内存使用监控
  startMemoryMonitoring(interval = 5000) {
    const monitorId = setInterval(() => {
      const memoryInfo = this.getMemoryInfo();
      this.memorySnapshots.push({
        timestamp: Date.now(),
        ...memoryInfo,
      });

      // 保持最近50个快照
      if (this.memorySnapshots.length > 50) {
        this.memorySnapshots.shift();
      }

      this.detectMemoryLeaks();
    }, interval);

    console.log("开始内存监控");
    return monitorId;
  }

  getMemoryInfo() {
    // 在真实环境中使用 performance.memory
    const mockMemory = {
      usedJSHeapSize: Math.random() * 50000000 + (Date.now() % 10000000),
      totalJSHeapSize: Math.random() * 100000000 + 50000000,
      jsHeapSizeLimit: 2000000000,
    };

    return {
      used: mockMemory.usedJSHeapSize,
      total: mockMemory.totalJSHeapSize,
      limit: mockMemory.jsHeapSizeLimit,
      usage: mockMemory.usedJSHeapSize / mockMemory.totalJSHeapSize,
    };
  }

  detectMemoryLeaks() {
    if (this.memorySnapshots.length < 10) return;

    const recent = this.memorySnapshots.slice(-10);
    const trend = this.calculateMemoryTrend(recent);

    if (trend.isIncreasing && trend.rate > 0.1) {
      console.warn("⚠️ 检测到潜在内存泄漏:");
      console.warn(`  内存增长率: ${(trend.rate * 100).toFixed(2)}%`);
      console.warn(
        `  当前使用: ${(recent[recent.length - 1].used / 1024 / 1024).toFixed(
          2
        )} MB`
      );
    }
  }

  calculateMemoryTrend(snapshots) {
    if (snapshots.length < 2) return { isIncreasing: false, rate: 0 };

    const first = snapshots[0];
    const last = snapshots[snapshots.length - 1];

    const rate = (last.used - first.used) / first.used;
    const isIncreasing = rate > 0;

    return { isIncreasing, rate };
  }

  generateMemoryReport() {
    const current = this.getMemoryInfo();
    const snapshots = this.memorySnapshots.slice(-20);

    return {
      current: {
        used: `${(current.used / 1024 / 1024).toFixed(2)} MB`,
        total: `${(current.total / 1024 / 1024).toFixed(2)} MB`,
        usage: `${(current.usage * 100).toFixed(2)}%`,
      },
      trend: snapshots.length > 1 ? this.calculateMemoryTrend(snapshots) : null,
      recommendations: this.getMemoryRecommendations(current),
    };
  }

  getMemoryRecommendations(memoryInfo) {
    const recommendations = [];

    if (memoryInfo.usage > 0.8) {
      recommendations.push("内存使用率过高，考虑清理不必要的对象");
    }

    if (memoryInfo.usage > 0.9) {
      recommendations.push("内存使用率危险，立即检查内存泄漏");
    }

    const trend =
      this.memorySnapshots.length > 10
        ? this.calculateMemoryTrend(this.memorySnapshots.slice(-10))
        : null;

    if (trend && trend.isIncreasing && trend.rate > 0.05) {
      recommendations.push("检测到内存持续增长，可能存在内存泄漏");
    }

    return recommendations;
  }
}

// 测试内存泄漏检测
console.log("内存泄漏演示:");
MemoryLeakDetector.demonstrateCommonLeaks();

const protection = MemoryLeakDetector.createMemoryLeakProtection();

// 测试自动清理功能
const eventManager = protection.createAutoCleanupEventManager();
const timerManager = protection.createTimerManager();
const weakCache = protection.createWeakCache();

console.log("\n测试内存泄漏防护:");

// 模拟元素
const mockElement = {
  addEventListener: (event, handler) => console.log(`绑定事件: ${event}`),
  removeEventListener: (event, handler) => console.log(`解绑事件: ${event}`),
};

const eventKey = eventManager.on(mockElement, "click", () => {});
const timerId = timerManager.setTimeout(() => console.log("定时器执行"), 1000);

setTimeout(() => {
  eventManager.cleanup();
  timerManager.cleanup();
  weakCache.cleanup();
}, 2000);

// 启动内存监控
const detector = new MemoryLeakDetector();
const monitorId = detector.startMemoryMonitoring(2000);

setTimeout(() => {
  clearInterval(monitorId);
  console.log("内存报告:", detector.generateMemoryReport());
}, 8000);

console.log();

// =============================================
// 3. 对象池管理
// =============================================

console.log("3. 对象池管理");

class ObjectPoolManager {
  constructor() {
    this.pools = new Map();
  }

  // 创建对象池
  createPool(name, factory, reset, options = {}) {
    const {
      maxSize = 100,
      initialSize = 10,
      shrinkInterval = 60000,
      maxIdleTime = 30000,
    } = options;

    const pool = {
      name,
      factory,
      reset,
      objects: [],
      maxSize,
      created: 0,
      acquired: 0,
      released: 0,
      lastShrink: Date.now(),
      shrinkInterval,
      maxIdleTime,
    };

    // 预创建对象
    for (let i = 0; i < initialSize; i++) {
      pool.objects.push({
        object: factory(),
        createdAt: Date.now(),
        lastUsed: Date.now(),
      });
      pool.created++;
    }

    this.pools.set(name, pool);
    console.log(`创建对象池: ${name} (初始大小: ${initialSize})`);

    return pool;
  }

  // 获取对象
  acquire(poolName) {
    const pool = this.pools.get(poolName);
    if (!pool) {
      throw new Error(`对象池不存在: ${poolName}`);
    }

    let pooledObject;

    if (pool.objects.length > 0) {
      pooledObject = pool.objects.pop();
      pooledObject.lastUsed = Date.now();
    } else {
      pooledObject = {
        object: pool.factory(),
        createdAt: Date.now(),
        lastUsed: Date.now(),
      };
      pool.created++;
    }

    pool.acquired++;
    return pooledObject.object;
  }

  // 释放对象
  release(poolName, object) {
    const pool = this.pools.get(poolName);
    if (!pool) {
      throw new Error(`对象池不存在: ${poolName}`);
    }

    if (pool.objects.length < pool.maxSize) {
      pool.reset(object);
      pool.objects.push({
        object,
        createdAt: Date.now(),
        lastUsed: Date.now(),
      });
      pool.released++;
    }
    // 如果池已满，让对象被垃圾回收
  }

  // 收缩对象池
  shrinkPool(poolName) {
    const pool = this.pools.get(poolName);
    if (!pool) return;

    const now = Date.now();
    const initialSize = pool.objects.length;

    pool.objects = pool.objects.filter(
      (item) => now - item.lastUsed < pool.maxIdleTime
    );

    const removed = initialSize - pool.objects.length;
    if (removed > 0) {
      console.log(`收缩对象池 ${poolName}: 移除 ${removed} 个闲置对象`);
    }

    pool.lastShrink = now;
  }

  // 自动维护
  startMaintenance() {
    const maintenanceId = setInterval(() => {
      for (const [name, pool] of this.pools) {
        if (Date.now() - pool.lastShrink > pool.shrinkInterval) {
          this.shrinkPool(name);
        }
      }
    }, 30000);

    console.log("开始对象池自动维护");
    return maintenanceId;
  }

  // 获取统计信息
  getStats(poolName) {
    const pool = this.pools.get(poolName);
    if (!pool) return null;

    return {
      name: pool.name,
      size: pool.objects.length,
      maxSize: pool.maxSize,
      created: pool.created,
      acquired: pool.acquired,
      released: pool.released,
      hitRate:
        pool.acquired > 0
          ? ((pool.released / pool.acquired) * 100).toFixed(2) + "%"
          : "0%",
    };
  }

  // 清理所有对象池
  cleanup() {
    for (const [name, pool] of this.pools) {
      pool.objects.length = 0;
      console.log(`清理对象池: ${name}`);
    }
    this.pools.clear();
  }
}

// 测试对象池
const poolManager = new ObjectPoolManager();

// 创建不同类型的对象池
poolManager.createPool(
  "vectors",
  () => ({ x: 0, y: 0, z: 0 }),
  (vector) => {
    vector.x = 0;
    vector.y = 0;
    vector.z = 0;
  },
  { maxSize: 50, initialSize: 10 }
);

poolManager.createPool(
  "buffers",
  () => new ArrayBuffer(1024),
  (buffer) => {
    /* 重置buffer */
  },
  { maxSize: 20, initialSize: 5 }
);

// 使用对象池
console.log("对象池使用测试:");

for (let i = 0; i < 15; i++) {
  const vector = poolManager.acquire("vectors");
  vector.x = Math.random() * 100;
  vector.y = Math.random() * 100;
  vector.z = Math.random() * 100;

  // 模拟使用后释放
  setTimeout(() => {
    poolManager.release("vectors", vector);
  }, Math.random() * 1000);
}

// 获取统计信息
setTimeout(() => {
  console.log("对象池统计:", poolManager.getStats("vectors"));
}, 1500);

// 启动维护
const maintenanceId = poolManager.startMaintenance();

setTimeout(() => {
  clearInterval(maintenanceId);
  poolManager.cleanup();
}, 5000);

console.log();

// =============================================
// 4. 内存优化策略
// =============================================

console.log("4. 内存优化策略");

class MemoryOptimizationStrategies {
  // 字符串优化
  static stringOptimization() {
    console.log("字符串优化策略:");

    // 避免字符串连接
    console.time("低效字符串连接");
    let inefficientString = "";
    for (let i = 0; i < 10000; i++) {
      inefficientString += `Item ${i} `;
    }
    console.timeEnd("低效字符串连接");

    // 使用数组join
    console.time("高效字符串连接");
    const stringArray = [];
    for (let i = 0; i < 10000; i++) {
      stringArray.push(`Item ${i} `);
    }
    const efficientString = stringArray.join("");
    console.timeEnd("高效字符串连接");

    // 字符串模板优化
    const template = (name, age) => `姓名: ${name}, 年龄: ${age}`;

    // 字符串池化
    const stringPool = new Map();
    const getPooledString = (key) => {
      if (!stringPool.has(key)) {
        stringPool.set(key, key);
      }
      return stringPool.get(key);
    };

    console.log("字符串池化示例:", getPooledString("常用字符串"));
  }

  // 数组优化
  static arrayOptimization() {
    console.log("\n数组优化策略:");

    // 预分配数组大小
    console.time("动态数组增长");
    const dynamicArray = [];
    for (let i = 0; i < 100000; i++) {
      dynamicArray.push(i);
    }
    console.timeEnd("动态数组增长");

    console.time("预分配数组");
    const preallocatedArray = new Array(100000);
    for (let i = 0; i < 100000; i++) {
      preallocatedArray[i] = i;
    }
    console.timeEnd("预分配数组");

    // 使用TypedArray优化数值数组
    console.time("普通数组");
    const normalArray = new Array(100000);
    for (let i = 0; i < 100000; i++) {
      normalArray[i] = Math.random();
    }
    console.timeEnd("普通数组");

    console.time("TypedArray");
    const typedArray = new Float32Array(100000);
    for (let i = 0; i < 100000; i++) {
      typedArray[i] = Math.random();
    }
    console.timeEnd("TypedArray");

    // 数组清理
    const clearArray = (arr) => {
      arr.length = 0; // 快速清空数组
    };

    console.log("数组内存占用对比:");
    console.log(`普通数组估计内存: ${normalArray.length * 8} 字节`);
    console.log(`TypedArray内存: ${typedArray.byteLength} 字节`);
  }

  // 对象优化
  static objectOptimization() {
    console.log("\n对象优化策略:");

    // 使用Object.create(null)减少原型链
    const optimizedObject = Object.create(null);
    optimizedObject.name = "优化对象";
    optimizedObject.value = 42;

    // 使用Map而非对象作为字典
    console.time("对象作为字典");
    const objectDict = {};
    for (let i = 0; i < 10000; i++) {
      objectDict[`key${i}`] = `value${i}`;
    }
    console.timeEnd("对象作为字典");

    console.time("Map作为字典");
    const mapDict = new Map();
    for (let i = 0; i < 10000; i++) {
      mapDict.set(`key${i}`, `value${i}`);
    }
    console.timeEnd("Map作为字典");

    // 冻结对象减少内存碎片
    const frozenConfig = Object.freeze({
      version: "1.0",
      debug: false,
      features: Object.freeze(["feature1", "feature2"]),
    });

    console.log("对象优化完成");
  }

  // 函数优化
  static functionOptimization() {
    console.log("\n函数优化策略:");

    // 避免函数重复创建
    class BadExample {
      constructor() {
        this.data = [];
      }

      process() {
        // 每次调用都创建新函数
        return this.data.map((item) => item * 2);
      }
    }

    class GoodExample {
      constructor() {
        this.data = [];
        // 预绑定函数
        this.doubleValue = this.doubleValue.bind(this);
      }

      doubleValue(item) {
        return item * 2;
      }

      process() {
        // 重用函数引用
        return this.data.map(this.doubleValue);
      }
    }

    // 函数记忆化
    const memoize = (fn) => {
      const cache = new Map();
      return (...args) => {
        const key = JSON.stringify(args);
        if (cache.has(key)) {
          return cache.get(key);
        }
        const result = fn(...args);
        cache.set(key, result);
        return result;
      };
    };

    const expensiveFunction = memoize((n) => {
      let result = 0;
      for (let i = 0; i < n; i++) {
        result += Math.sqrt(i);
      }
      return result;
    });

    console.log("函数优化完成");

    // 测试记忆化效果
    console.time("首次计算");
    expensiveFunction(10000);
    console.timeEnd("首次计算");

    console.time("缓存命中");
    expensiveFunction(10000);
    console.timeEnd("缓存命中");
  }

  // 综合优化策略
  static comprehensiveOptimization() {
    console.log("\n综合内存优化策略:");

    const strategies = {
      // 1. 及时释放引用
      releaseReferences() {
        let largeObject = { data: new Array(100000).fill("data") };

        // 使用完毕后立即释放
        setTimeout(() => {
          largeObject = null;
          console.log("释放大对象引用");
        }, 1000);
      },

      // 2. 使用WeakMap避免强引用
      useWeakReferences() {
        const weakCache = new WeakMap();
        const regularCache = new Map();

        const obj = { id: 1 };

        // WeakMap不会阻止对象被垃圾回收
        weakCache.set(obj, "缓存数据");

        // Map会阻止对象被垃圾回收
        regularCache.set(obj, "缓存数据");

        console.log("设置弱引用缓存");
      },

      // 3. 批量处理减少内存峰值
      batchProcessing(largeArray) {
        const batchSize = 1000;
        const results = [];

        for (let i = 0; i < largeArray.length; i += batchSize) {
          const batch = largeArray.slice(i, i + batchSize);
          const batchResult = batch.map((item) => item * 2);
          results.push(...batchResult);

          // 给垃圾回收器机会
          if (i % (batchSize * 10) === 0) {
            setTimeout(() => {}, 0);
          }
        }

        return results;
      },

      // 4. 使用对象字面量而非构造函数
      useObjectLiterals() {
        // 低效：构造函数
        function BadPoint(x, y) {
          this.x = x;
          this.y = y;
        }

        // 高效：对象字面量工厂
        const createPoint = (x, y) => ({ x, y });

        console.log("使用对象字面量工厂");
      },
    };

    // 执行优化策略
    strategies.releaseReferences();
    strategies.useWeakReferences();
    strategies.useObjectLiterals();

    const testArray = Array.from({ length: 50000 }, (_, i) => i);
    strategies.batchProcessing(testArray);

    console.log("综合优化策略执行完成");
  }
}

// 执行内存优化策略测试
MemoryOptimizationStrategies.stringOptimization();
MemoryOptimizationStrategies.arrayOptimization();
MemoryOptimizationStrategies.objectOptimization();
MemoryOptimizationStrategies.functionOptimization();
MemoryOptimizationStrategies.comprehensiveOptimization();

console.log();

// =============================================
// 5. 最佳实践总结
// =============================================

console.log("5. 最佳实践总结");

console.log(`
JavaScript内存管理最佳实践:

1. 垃圾回收理解:
   - 了解标记-清除算法
   - 理解分代垃圾回收
   - 避免循环引用
   - 合理使用WeakMap/WeakSet

2. 内存泄漏防护:
   - 及时移除事件监听器
   - 清理定时器和间隔器
   - 避免意外的全局变量
   - 小心闭包中的变量引用

3. 对象池管理:
   - 对频繁创建的对象使用对象池
   - 合理设置池的大小限制
   - 实施自动回收机制
   - 监控池的使用效率

4. 内存优化技巧:
   - 使用TypedArray处理数值数据
   - 预分配数组大小
   - 使用Object.create(null)创建纯对象
   - 函数记忆化避免重复计算

5. 监控和诊断:
   - 定期监控内存使用情况
   - 使用性能分析工具
   - 建立内存使用基准
   - 实施自动告警机制

6. 代码编写规范:
   - 避免不必要的闭包
   - 及时释放大对象引用
   - 使用合适的数据结构
   - 批量处理大量数据

常用工具:
- Chrome DevTools Memory面板
- Node.js process.memoryUsage()
- Performance Observer API
- WeakRef和FinalizationRegistry

内存优化指标:
- 堆内存使用量
- 垃圾回收频率
- 内存泄漏率
- 对象池命中率
- 内存增长趋势
`);

// 导出供测试使用
module.exports = {
  GarbageCollectionDemo,
  MemoryLeakDetector,
  ObjectPoolManager,
  MemoryOptimizationStrategies,
};

console.log("内存管理演示完成\n");
