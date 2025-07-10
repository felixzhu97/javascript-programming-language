# 第 7 章 - 错误处理

## 📖 章节概述

本章深入介绍 JavaScript 中的错误处理机制和调试技术。从基础的 try-catch 到高级的错误监控，涵盖错误类型、处理策略、调试技巧和生产环境的错误管理。

## 🎯 学习目标

- 掌握 JavaScript 的错误类型和错误处理机制
- 学会设计健壮的错误处理策略
- 了解调试技巧和工具的使用
- 掌握生产环境的错误监控和分析
- 学会错误恢复和用户体验优化

## 📁 文件结构

```
07-错误处理/
├── README.md           # 本文件
├── error-handling.js   # 错误处理策略
└── debugging.js        # 调试技巧
```

## 📚 内容详解

### 1. error-handling.js - 错误处理策略

- **错误类型**: Error、TypeError、ReferenceError 等内置错误
- **自定义错误**: 创建自定义错误类和错误层次
- **错误捕获**: try-catch、finally、全局错误处理
- **异步错误**: Promise 错误、async/await 错误处理
- **错误传播**: 错误冒泡和错误边界
- **错误恢复**: 自动重试和降级策略
- **错误监控**: 错误收集和分析系统

**错误处理示例**:

```javascript
// 自定义错误类
class ValidationError extends Error {
  constructor(field, message) {
    super(`Validation failed for ${field}: ${message}`);
    this.name = "ValidationError";
    this.field = field;
  }
}

class NetworkError extends Error {
  constructor(status, message) {
    super(`Network error ${status}: ${message}`);
    this.name = "NetworkError";
    this.status = status;
    this.retryable = status >= 500;
  }
}

// 错误处理策略
class ApiClient {
  async request(url, options = {}) {
    const maxRetries = 3;
    let lastError;

    for (let attempt = 1; attempt <= maxRetries; attempt++) {
      try {
        const response = await fetch(url, options);

        if (!response.ok) {
          throw new NetworkError(response.status, response.statusText);
        }

        return await response.json();
      } catch (error) {
        lastError = error;

        if (
          error instanceof NetworkError &&
          error.retryable &&
          attempt < maxRetries
        ) {
          await this.delay(Math.pow(2, attempt) * 1000); // 指数退避
          continue;
        }

        throw error;
      }
    }

    throw lastError;
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }
}
```

### 2. debugging.js - 调试技巧

- **控制台调试**: console 方法的高级用法
- **断点调试**: debugger 语句和浏览器调试器
- **性能调试**: 性能分析和性能监控
- **内存调试**: 内存泄漏检测和分析
- **网络调试**: 网络请求的调试和分析
- **调试工具**: Chrome DevTools、Node.js 调试器
- **生产调试**: 生产环境的调试策略

**调试工具示例**:

```javascript
// 高级控制台调试
class Logger {
  static levels = {
    ERROR: 0,
    WARN: 1,
    INFO: 2,
    DEBUG: 3,
  };

  constructor(level = Logger.levels.INFO) {
    this.level = level;
  }

  error(message, ...args) {
    if (this.level >= Logger.levels.ERROR) {
      console.error(`[ERROR] ${message}`, ...args);
      console.trace();
    }
  }

  warn(message, ...args) {
    if (this.level >= Logger.levels.WARN) {
      console.warn(`[WARN] ${message}`, ...args);
    }
  }

  info(message, ...args) {
    if (this.level >= Logger.levels.INFO) {
      console.info(`[INFO] ${message}`, ...args);
    }
  }

  debug(message, ...args) {
    if (this.level >= Logger.levels.DEBUG) {
      console.debug(`[DEBUG] ${message}`, ...args);
    }
  }

  group(label, callback) {
    console.group(label);
    try {
      callback();
    } finally {
      console.groupEnd();
    }
  }

  time(label, callback) {
    console.time(label);
    try {
      return callback();
    } finally {
      console.timeEnd(label);
    }
  }
}

// 性能监控装饰器
function monitor(target, propertyKey, descriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = async function (...args) {
    const start = performance.now();

    try {
      const result = await originalMethod.apply(this, args);
      const duration = performance.now() - start;

      console.log(`${propertyKey} completed in ${duration.toFixed(2)}ms`);
      return result;
    } catch (error) {
      const duration = performance.now() - start;
      console.error(
        `${propertyKey} failed after ${duration.toFixed(2)}ms:`,
        error
      );
      throw error;
    }
  };

  return descriptor;
}
```

## 🚀 快速开始

### 运行示例

```bash
# 运行错误处理示例
node src/07-错误处理/error-handling.js

# 运行调试示例
node src/07-错误处理/debugging.js

# 在浏览器中调试
# 推荐使用Chrome DevTools
```

### 学习路径

1. **错误类型和捕获** → 理解 JavaScript 错误机制
2. **错误处理策略** → 设计健壮的错误处理
3. **调试技巧** → 掌握高效的调试方法
4. **生产监控** → 了解生产环境错误管理

## 💡 核心概念

### 错误处理原则

- 快速失败：尽早发现和报告错误
- 优雅降级：在错误发生时提供备选方案
- 错误隔离：防止错误传播影响其他功能
- 用户友好：提供有意义的错误信息

### 调试策略

- 重现问题：创建可重现的测试用例
- 缩小范围：使用二分法定位问题
- 假设验证：提出假设并验证
- 工具辅助：充分利用调试工具

### 生产监控

- 错误收集：自动收集和上报错误
- 错误分析：分析错误模式和趋势
- 告警机制：及时通知关键错误
- 性能监控：监控应用性能指标

## 🔧 实际应用

### 1. 全局错误处理系统

```javascript
class ErrorHandler {
  constructor() {
    this.handlers = new Map();
    this.setupGlobalHandlers();
  }

  setupGlobalHandlers() {
    // 捕获未处理的错误
    window.addEventListener("error", (event) => {
      this.handleError(event.error, {
        type: "javascript",
        filename: event.filename,
        lineno: event.lineno,
        colno: event.colno,
      });
    });

    // 捕获未处理的Promise拒绝
    window.addEventListener("unhandledrejection", (event) => {
      this.handleError(event.reason, {
        type: "promise",
        promise: event.promise,
      });
    });
  }

  register(errorType, handler) {
    if (!this.handlers.has(errorType)) {
      this.handlers.set(errorType, []);
    }
    this.handlers.get(errorType).push(handler);
  }

  handleError(error, context = {}) {
    const errorType = error.constructor.name;
    const handlers =
      this.handlers.get(errorType) || this.handlers.get("Error") || [];

    // 记录错误
    this.logError(error, context);

    // 执行处理器
    handlers.forEach((handler) => {
      try {
        handler(error, context);
      } catch (handlerError) {
        console.error("Error in error handler:", handlerError);
      }
    });

    // 上报错误
    this.reportError(error, context);
  }

  logError(error, context) {
    const errorInfo = {
      message: error.message,
      stack: error.stack,
      name: error.name,
      context,
      timestamp: new Date().toISOString(),
      userAgent: navigator.userAgent,
      url: window.location.href,
    };

    console.error("Error occurred:", errorInfo);
  }

  async reportError(error, context) {
    try {
      await fetch("/api/errors", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          error: {
            message: error.message,
            stack: error.stack,
            name: error.name,
          },
          context,
          timestamp: new Date().toISOString(),
        }),
      });
    } catch (reportError) {
      console.error("Failed to report error:", reportError);
    }
  }
}
```

### 2. 断路器模式

```javascript
class CircuitBreaker {
  constructor(threshold = 5, timeout = 60000, monitor = console.log) {
    this.threshold = threshold; // 失败阈值
    this.timeout = timeout; // 恢复超时
    this.monitor = monitor;
    this.reset();
  }

  reset() {
    this.state = "CLOSED"; // CLOSED, OPEN, HALF_OPEN
    this.failureCount = 0;
    this.nextAttempt = Date.now();
  }

  async call(fn, ...args) {
    if (this.state === "OPEN") {
      if (Date.now() < this.nextAttempt) {
        throw new Error("Circuit breaker is OPEN");
      }
      this.state = "HALF_OPEN";
    }

    try {
      const result = await fn.apply(null, args);
      this.onSuccess();
      return result;
    } catch (error) {
      this.onFailure();
      throw error;
    }
  }

  onSuccess() {
    this.reset();
    this.monitor("Circuit breaker: SUCCESS");
  }

  onFailure() {
    this.failureCount++;
    this.monitor(
      `Circuit breaker: FAILURE (${this.failureCount}/${this.threshold})`
    );

    if (this.failureCount >= this.threshold) {
      this.state = "OPEN";
      this.nextAttempt = Date.now() + this.timeout;
      this.monitor("Circuit breaker: OPENED");
    }
  }
}
```

### 3. 错误边界组件

```javascript
class ErrorBoundary {
  constructor(fallback, onError) {
    this.fallback = fallback;
    this.onError = onError;
    this.hasError = false;
  }

  wrap(fn) {
    return (...args) => {
      if (this.hasError) {
        return this.fallback;
      }

      try {
        const result = fn.apply(null, args);

        // 处理Promise返回值
        if (result && typeof result.catch === "function") {
          return result.catch((error) => {
            this.handleError(error);
            return this.fallback;
          });
        }

        return result;
      } catch (error) {
        this.handleError(error);
        return this.fallback;
      }
    };
  }

  handleError(error) {
    this.hasError = true;

    if (this.onError) {
      this.onError(error);
    }

    console.error("Error boundary caught error:", error);
  }

  reset() {
    this.hasError = false;
  }
}
```

## 🔗 相关章节

- **上一章**: [第 6 章 - ES6+特性](../06-ES6+特性/README.md)
- **下一章**: [第 8 章 - 性能优化](../08-性能优化/README.md)
- **相关章节**:
  - [第 4 章 - 异步编程](../04-异步编程/README.md) - 异步错误处理
  - [第 9 章 - 实战项目](../09-实战项目/README.md) - 错误处理实践

## 📝 练习建议

1. **错误处理练习**:

   - 实现自定义错误类层次
   - 创建重试机制和断路器
   - 设计错误恢复策略

2. **调试技巧练习**:

   - 使用 Chrome DevTools 进行性能分析
   - 实现自定义调试工具
   - 创建日志系统

3. **监控系统练习**:
   - 实现错误收集和上报
   - 创建性能监控面板
   - 设计告警系统

## ⚠️ 常见陷阱

1. **忽略错误**: 使用空的 catch 块
2. **错误吞噬**: 捕获错误但不处理
3. **过度捕获**: 在不合适的层级捕获错误
4. **信息不足**: 错误信息不够详细
5. **性能影响**: 过度的错误处理影响性能

## 🎨 最佳实践

1. **明确错误策略**: 定义清晰的错误处理策略
2. **分层错误处理**: 在合适的层级处理错误
3. **有意义的错误**: 提供有用的错误信息
4. **快速失败**: 尽早发现和报告错误
5. **用户体验**: 为用户提供友好的错误提示

## 🔍 调试工具推荐

### 1. Chrome DevTools

- **Console**: 控制台调试和日志查看
- **Sources**: 断点调试和代码查看
- **Performance**: 性能分析和优化
- **Memory**: 内存使用和泄漏检测
- **Network**: 网络请求分析

### 2. Node.js 调试

```bash
# 启用调试器
node --inspect app.js
node --inspect-brk app.js # 在第一行断点

# 使用Chrome调试
# 打开chrome://inspect
```

### 3. 第三方工具

- **Sentry**: 错误监控和追踪
- **LogRocket**: 用户会话重放
- **Bugsnag**: 错误报告和分析
- **New Relic**: 应用性能监控

## 📊 错误监控指标

1. **错误率**: 错误数量 / 总请求数
2. **错误类型分布**: 不同错误类型的占比
3. **错误趋势**: 错误数量随时间的变化
4. **受影响用户**: 遇到错误的用户数量
5. **恢复时间**: 从错误发生到修复的时间

---

**学习提示**: 良好的错误处理是软件质量的重要标志，掌握这些技能对于构建稳定可靠的应用至关重要！
