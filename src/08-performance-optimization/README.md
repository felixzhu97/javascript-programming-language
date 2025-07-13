# 第 8 章 - 性能优化

## 📖 章节概述

本章全面介绍 JavaScript 性能优化的理论和实践。从算法优化到内存管理，从缓存策略到异步优化，深入了解如何构建高性能的 JavaScript 应用。

## 🎯 学习目标

- 掌握 JavaScript 性能分析和测量方法
- 学会算法和数据结构的优化技巧
- 理解内存管理和垃圾回收机制
- 掌握缓存策略和异步优化技术
- 了解性能监控和持续优化方法

## 📁 文件结构

```
08-性能优化/
├── README.md           # 本文件
├── performance.js      # 性能优化
└── memory-management.js # 内存管理
```

## 📚 内容详解

### 1. performance.js - 性能优化

- **性能测量**: Performance API、时间测量、性能指标
- **算法优化**: 时间复杂度、空间复杂度、算法选择
- **数据结构**: 高效数据结构的选择和使用
- **缓存策略**: LRU 缓存、缓存失效、缓存更新
- **DOM 优化**: 减少重排重绘、批量操作
- **异步优化**: 并发控制、任务调度、性能监控
- **代码拆分**: 懒加载、动态导入、打包优化

**性能优化示例**:

```javascript
// LRU缓存实现
class LRUCache {
  constructor(capacity) {
    this.capacity = capacity;
    this.cache = new Map();
  }

  get(key) {
    if (this.cache.has(key)) {
      // 移动到最新位置
      const value = this.cache.get(key);
      this.cache.delete(key);
      this.cache.set(key, value);
      return value;
    }
    return -1;
  }

  put(key, value) {
    if (this.cache.has(key)) {
      // 更新已存在的key
      this.cache.delete(key);
    } else if (this.cache.size >= this.capacity) {
      // 删除最久未使用的项目
      const firstKey = this.cache.keys().next().value;
      this.cache.delete(firstKey);
    }

    this.cache.set(key, value);
  }
}

// 防抖和节流
function debounce(func, wait, immediate = false) {
  let timeout;

  return function executedFunction(...args) {
    const later = () => {
      timeout = null;
      if (!immediate) func.apply(this, args);
    };

    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);

    if (callNow) func.apply(this, args);
  };
}

function throttle(func, limit) {
  let inThrottle;

  return function executedFunction(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => (inThrottle = false), limit);
    }
  };
}
```

### 2. memory-management.js - 内存管理

- **垃圾回收**: 标记清除、引用计数、分代回收
- **内存泄漏**: 常见泄漏场景、检测方法、预防策略
- **内存优化**: 对象池、内存复用、弱引用
- **性能监控**: 内存使用监控、性能分析工具
- **最佳实践**: 内存管理的编程模式和技巧

**内存管理示例**:

```javascript
// 对象池模式
class ObjectPool {
  constructor(createFn, resetFn, initialSize = 10) {
    this.createFn = createFn;
    this.resetFn = resetFn;
    this.pool = [];

    // 预创建对象
    for (let i = 0; i < initialSize; i++) {
      this.pool.push(this.createFn());
    }
  }

  acquire() {
    if (this.pool.length > 0) {
      return this.pool.pop();
    }
    return this.createFn();
  }

  release(obj) {
    if (this.resetFn) {
      this.resetFn(obj);
    }
    this.pool.push(obj);
  }

  size() {
    return this.pool.length;
  }
}

// 内存监控
class MemoryMonitor {
  constructor() {
    this.measurements = [];
    this.isRunning = false;
  }

  start(interval = 1000) {
    if (this.isRunning) return;

    this.isRunning = true;
    this.intervalId = setInterval(() => {
      if (performance.memory) {
        const memory = {
          used: performance.memory.usedJSHeapSize,
          total: performance.memory.totalJSHeapSize,
          limit: performance.memory.jsHeapSizeLimit,
          timestamp: Date.now(),
        };

        this.measurements.push(memory);
        this.onMeasurement(memory);

        // 保持最近100个测量值
        if (this.measurements.length > 100) {
          this.measurements.shift();
        }
      }
    }, interval);
  }

  stop() {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.isRunning = false;
    }
  }

  onMeasurement(memory) {
    const usagePercent = ((memory.used / memory.limit) * 100).toFixed(2);
    console.log(
      `Memory usage: ${usagePercent}% (${(memory.used / 1048576).toFixed(
        2
      )} MB)`
    );
  }

  getStats() {
    if (this.measurements.length === 0) return null;

    const latest = this.measurements[this.measurements.length - 1];
    const earliest = this.measurements[0];

    return {
      current: latest.used,
      peak: Math.max(...this.measurements.map((m) => m.used)),
      average:
        this.measurements.reduce((sum, m) => sum + m.used, 0) /
        this.measurements.length,
      growth: latest.used - earliest.used,
      usagePercent: ((latest.used / latest.limit) * 100).toFixed(2),
    };
  }
}
```

## 🚀 快速开始

### 运行示例

```bash
# 运行性能优化示例
node src/08-性能优化/performance.js

# 运行内存管理示例
node src/08-性能优化/memory-management.js

# 在浏览器中进行性能分析
# 使用Chrome DevTools的Performance面板
```

### 性能测试

```javascript
// 性能基准测试
function benchmark(name, fn, iterations = 1000) {
  const start = performance.now();

  for (let i = 0; i < iterations; i++) {
    fn();
  }

  const end = performance.now();
  const total = end - start;
  const average = total / iterations;

  console.log(`${name}:`);
  console.log(`  Total: ${total.toFixed(2)}ms`);
  console.log(`  Average: ${average.toFixed(4)}ms`);
  console.log(`  Ops/sec: ${(1000 / average).toFixed(0)}`);
}
```

## 💡 核心概念

### 性能优化原则

- **测量先行**: 先测量再优化，基于数据决策
- **找出瓶颈**: 识别性能瓶颈，重点优化
- **平衡权衡**: 在性能、可读性、维护性间平衡
- **持续监控**: 建立性能监控和告警机制

### 优化策略

- **算法优化**: 选择更高效的算法和数据结构
- **缓存策略**: 合理使用缓存减少重复计算
- **异步优化**: 优化异步操作和并发控制
- **内存管理**: 避免内存泄漏和优化内存使用

### 性能指标

- **首次内容绘制(FCP)**: 首次绘制任何内容的时间
- **最大内容绘制(LCP)**: 最大内容元素的渲染时间
- **首次输入延迟(FID)**: 用户首次交互的响应时间
- **累积布局偏移(CLS)**: 视觉稳定性指标

## 🔧 实际应用

### 1. 高性能数据处理

```javascript
class DataProcessor {
  constructor() {
    this.cache = new Map();
    this.processing = new Set();
  }

  async processLargeDataset(data, chunkSize = 1000) {
    const results = [];
    const chunks = this.chunkArray(data, chunkSize);

    // 使用Worker Pool进行并行处理
    const workerPool = new WorkerPool(navigator.hardwareConcurrency || 4);

    try {
      const promises = chunks.map((chunk) =>
        workerPool.execute("processChunk", chunk)
      );

      const chunkResults = await Promise.all(promises);
      results.push(...chunkResults.flat());

      return results;
    } finally {
      workerPool.terminate();
    }
  }

  chunkArray(array, size) {
    const chunks = [];
    for (let i = 0; i < array.length; i += size) {
      chunks.push(array.slice(i, i + size));
    }
    return chunks;
  }

  // 带缓存的计算
  async computeWithCache(key, computeFn) {
    // 检查缓存
    if (this.cache.has(key)) {
      return this.cache.get(key);
    }

    // 防止重复计算
    if (this.processing.has(key)) {
      return new Promise((resolve) => {
        const check = () => {
          if (this.cache.has(key)) {
            resolve(this.cache.get(key));
          } else {
            setTimeout(check, 10);
          }
        };
        check();
      });
    }

    this.processing.add(key);

    try {
      const result = await computeFn();
      this.cache.set(key, result);
      return result;
    } finally {
      this.processing.delete(key);
    }
  }
}

// Worker Pool实现
class WorkerPool {
  constructor(poolSize) {
    this.poolSize = poolSize;
    this.workers = [];
    this.queue = [];
    this.active = 0;

    this.initWorkers();
  }

  initWorkers() {
    for (let i = 0; i < this.poolSize; i++) {
      const worker = new Worker("/worker.js");
      worker.onmessage = (e) => this.handleMessage(worker, e);
      this.workers.push({ worker, busy: false });
    }
  }

  execute(method, data) {
    return new Promise((resolve, reject) => {
      const task = { method, data, resolve, reject };

      const availableWorker = this.workers.find((w) => !w.busy);
      if (availableWorker) {
        this.runTask(availableWorker, task);
      } else {
        this.queue.push(task);
      }
    });
  }

  runTask(workerInfo, task) {
    workerInfo.busy = true;
    workerInfo.currentTask = task;
    workerInfo.worker.postMessage({
      method: task.method,
      data: task.data,
    });
  }

  handleMessage(worker, event) {
    const workerInfo = this.workers.find((w) => w.worker === worker);
    const task = workerInfo.currentTask;

    if (event.data.error) {
      task.reject(new Error(event.data.error));
    } else {
      task.resolve(event.data.result);
    }

    workerInfo.busy = false;
    workerInfo.currentTask = null;

    // 处理队列中的下一个任务
    if (this.queue.length > 0) {
      const nextTask = this.queue.shift();
      this.runTask(workerInfo, nextTask);
    }
  }

  terminate() {
    this.workers.forEach(({ worker }) => worker.terminate());
    this.workers = [];
    this.queue = [];
  }
}
```

### 2. 虚拟列表组件

```javascript
class VirtualList {
  constructor(container, options) {
    this.container = container;
    this.itemHeight = options.itemHeight;
    this.data = options.data || [];
    this.renderItem = options.renderItem;
    this.buffer = options.buffer || 5;

    this.scrollTop = 0;
    this.visibleCount = Math.ceil(container.clientHeight / this.itemHeight);
    this.totalHeight = this.data.length * this.itemHeight;

    this.init();
  }

  init() {
    // 创建滚动容器
    this.scrollContainer = document.createElement("div");
    this.scrollContainer.style.height = `${this.totalHeight}px`;
    this.scrollContainer.style.position = "relative";

    // 创建视口
    this.viewport = document.createElement("div");
    this.viewport.style.position = "absolute";
    this.viewport.style.top = "0";
    this.viewport.style.width = "100%";

    this.scrollContainer.appendChild(this.viewport);
    this.container.appendChild(this.scrollContainer);

    // 监听滚动事件
    this.container.addEventListener(
      "scroll",
      this.throttle(this.onScroll.bind(this), 16)
    );

    this.render();
  }

  onScroll(event) {
    this.scrollTop = event.target.scrollTop;
    this.render();
  }

  render() {
    const startIndex = Math.max(
      0,
      Math.floor(this.scrollTop / this.itemHeight) - this.buffer
    );
    const endIndex = Math.min(
      this.data.length - 1,
      startIndex + this.visibleCount + this.buffer * 2
    );

    // 清空当前内容
    this.viewport.innerHTML = "";

    // 创建文档片段
    const fragment = document.createDocumentFragment();

    for (let i = startIndex; i <= endIndex; i++) {
      const item = this.renderItem(this.data[i], i);
      item.style.position = "absolute";
      item.style.top = `${i * this.itemHeight}px`;
      item.style.height = `${this.itemHeight}px`;
      fragment.appendChild(item);
    }

    this.viewport.appendChild(fragment);
  }

  throttle(func, limit) {
    let inThrottle;
    return function (...args) {
      if (!inThrottle) {
        func.apply(this, args);
        inThrottle = true;
        setTimeout(() => (inThrottle = false), limit);
      }
    };
  }

  updateData(newData) {
    this.data = newData;
    this.totalHeight = this.data.length * this.itemHeight;
    this.scrollContainer.style.height = `${this.totalHeight}px`;
    this.render();
  }
}
```

## 🔗 相关章节

- **上一章**: [第 7 章 - 错误处理](../07-错误处理/README.md)
- **下一章**: [第 9 章 - 实战项目](../09-实战项目/README.md)
- **相关章节**:
  - [第 4 章 - 异步编程](../04-异步编程/README.md) - 异步性能优化
  - [第 5 章 - DOM 操作](../05-DOM操作/README.md) - DOM 性能优化

## 📝 练习建议

1. **算法优化练习**:

   - 比较不同算法的性能差异
   - 实现高效的数据结构
   - 优化现有代码的时间复杂度

2. **内存管理练习**:

   - 检测和修复内存泄漏
   - 实现对象池和内存复用
   - 监控应用的内存使用

3. **缓存策略练习**:
   - 实现不同的缓存算法
   - 设计多级缓存系统
   - 优化缓存命中率

## ⚠️ 性能陷阱

1. **过早优化**: 在没有性能问题时就进行优化
2. **微优化**: 专注于微小的性能提升而忽视大的瓶颈
3. **内存泄漏**: 忽视内存管理导致内存不断增长
4. **阻塞操作**: 在主线程执行耗时的同步操作
5. **不必要的重渲染**: 频繁的 DOM 操作导致性能下降

## 🎨 最佳实践

1. **性能预算**: 设定性能目标和预算
2. **渐进优化**: 逐步优化，避免过度工程
3. **工具辅助**: 使用性能分析工具
4. **持续监控**: 建立性能监控体系
5. **用户体验**: 平衡性能和用户体验

## 🔍 性能工具

### 1. 浏览器工具

- **Chrome DevTools Performance**: 性能分析和火焰图
- **Memory 面板**: 内存使用和泄漏检测
- **Lighthouse**: 网站性能评估
- **Performance Observer**: 性能指标收集

### 2. 第三方工具

- **webpack-bundle-analyzer**: 打包分析
- **source-map-explorer**: 代码分析
- **Clinic.js**: Node.js 性能诊断
- **Artillery**: 负载测试

## 📊 性能指标

1. **加载性能**:

   - 首次内容绘制(FCP)
   - 最大内容绘制(LCP)
   - 首次有效绘制(FMP)

2. **交互性能**:

   - 首次输入延迟(FID)
   - 总阻塞时间(TBT)
   - 交互到绘制时间(TTI)

3. **视觉稳定性**:

   - 累积布局偏移(CLS)
   - 速度指数(SI)

4. **资源指标**:
   - 内存使用量
   - CPU 使用率
   - 网络传输量

---

**学习提示**: 性能优化是一个持续的过程，需要在开发过程中不断关注和改进。记住：测量、优化、验证的循环是关键！
