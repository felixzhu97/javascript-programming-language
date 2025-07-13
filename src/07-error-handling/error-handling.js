/**
 * JavaScript高级程序设计 - 第7章：错误处理
 *
 * 本文件演示JavaScript错误处理的各种模式和技巧
 */

console.log("=== JavaScript 错误处理 ===\n");

// =============================================
// 1. 基础错误类型
// =============================================

console.log("1. 基础错误类型");

// 内置错误类型示例
function demonstrateErrorTypes() {
  const errors = [];

  try {
    // SyntaxError - 语法错误（这里用eval模拟）
    eval("var a = ;");
  } catch (error) {
    errors.push({ type: "SyntaxError", message: error.message });
  }

  try {
    // ReferenceError - 引用错误
    console.log(undefinedVariable);
  } catch (error) {
    errors.push({ type: "ReferenceError", message: error.message });
  }

  try {
    // TypeError - 类型错误
    const obj = null;
    obj.someMethod();
  } catch (error) {
    errors.push({ type: "TypeError", message: error.message });
  }

  try {
    // RangeError - 范围错误
    const arr = new Array(-1);
  } catch (error) {
    errors.push({ type: "RangeError", message: error.message });
  }

  return errors;
}

const errorExamples = demonstrateErrorTypes();
console.log("常见错误类型:");
errorExamples.forEach((error) => {
  console.log(`  ${error.type}: ${error.message}`);
});

console.log();

// =============================================
// 2. 自定义错误类
// =============================================

console.log("2. 自定义错误类");

// 基础自定义错误
class CustomError extends Error {
  constructor(message, code = "CUSTOM_ERROR") {
    super(message);
    this.name = "CustomError";
    this.code = code;
    this.timestamp = new Date().toISOString();

    // 保持正确的堆栈跟踪
    if (Error.captureStackTrace) {
      Error.captureStackTrace(this, CustomError);
    }
  }

  toJSON() {
    return {
      name: this.name,
      message: this.message,
      code: this.code,
      timestamp: this.timestamp,
      stack: this.stack,
    };
  }
}

// 业务逻辑错误
class ValidationError extends CustomError {
  constructor(field, value, rule) {
    super(`验证失败: 字段 '${field}' 的值 '${value}' 不符合规则 '${rule}'`);
    this.name = "ValidationError";
    this.code = "VALIDATION_FAILED";
    this.field = field;
    this.value = value;
    this.rule = rule;
  }
}

// 网络错误
class NetworkError extends CustomError {
  constructor(url, status, statusText) {
    super(`网络请求失败: ${status} ${statusText} - ${url}`);
    this.name = "NetworkError";
    this.code = "NETWORK_ERROR";
    this.url = url;
    this.status = status;
    this.statusText = statusText;
  }

  get isRetryable() {
    return this.status >= 500 || this.status === 408 || this.status === 429;
  }
}

// 资源错误
class ResourceError extends CustomError {
  constructor(resource, operation) {
    super(`资源操作失败: 无法${operation} ${resource}`);
    this.name = "ResourceError";
    this.code = "RESOURCE_ERROR";
    this.resource = resource;
    this.operation = operation;
  }
}

// 测试自定义错误
function testCustomErrors() {
  console.log("自定义错误测试:");

  try {
    throw new ValidationError("email", "invalid-email", "email格式");
  } catch (error) {
    console.log("验证错误:", error.message);
    console.log("错误详情:", { field: error.field, code: error.code });
  }

  try {
    throw new NetworkError("https://api.example.com/users", 404, "Not Found");
  } catch (error) {
    console.log("网络错误:", error.message);
    console.log("可重试:", error.isRetryable);
  }

  try {
    throw new ResourceError("user.db", "连接");
  } catch (error) {
    console.log("资源错误:", error.message);
    console.log("JSON格式:", JSON.stringify(error, null, 2));
  }
}

testCustomErrors();

console.log();

// =============================================
// 3. 错误处理策略
// =============================================

console.log("3. 错误处理策略");

class ErrorHandler {
  constructor() {
    this.errorLog = [];
    this.handlers = new Map();
    this.fallbackHandler = this.defaultHandler.bind(this);
  }

  // 注册错误处理器
  registerHandler(errorType, handler) {
    this.handlers.set(errorType, handler);
    console.log(`注册错误处理器: ${errorType}`);
  }

  // 处理错误
  handle(error, context = {}) {
    // 记录错误
    this.logError(error, context);

    // 查找合适的处理器
    const handler = this.findHandler(error);

    try {
      return handler(error, context);
    } catch (handlerError) {
      console.error("错误处理器本身出错:", handlerError);
      return this.fallbackHandler(error, context);
    }
  }

  // 查找处理器
  findHandler(error) {
    // 优先匹配具体的错误类
    if (this.handlers.has(error.constructor.name)) {
      return this.handlers.get(error.constructor.name);
    }

    // 匹配错误码
    if (error.code && this.handlers.has(error.code)) {
      return this.handlers.get(error.code);
    }

    // 匹配错误名称
    if (this.handlers.has(error.name)) {
      return this.handlers.get(error.name);
    }

    // 使用默认处理器
    return this.fallbackHandler;
  }

  // 默认错误处理器
  defaultHandler(error, context) {
    console.error("未处理的错误:", error.message);
    return {
      handled: false,
      action: "log",
      message: "发生未知错误",
    };
  }

  // 记录错误
  logError(error, context) {
    const logEntry = {
      timestamp: new Date().toISOString(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code || "UNKNOWN",
      },
      context,
      id: Math.random().toString(36).substr(2, 9),
    };

    this.errorLog.push(logEntry);

    if (this.errorLog.length > 100) {
      this.errorLog.shift(); // 保持日志大小
    }
  }

  // 获取错误统计
  getErrorStats() {
    const stats = {};
    this.errorLog.forEach((entry) => {
      const errorType = entry.error.name;
      stats[errorType] = (stats[errorType] || 0) + 1;
    });

    return {
      total: this.errorLog.length,
      byType: stats,
      recent: this.errorLog.slice(-5),
    };
  }
}

// 设置错误处理器
const errorHandler = new ErrorHandler();

// 注册特定错误的处理器
errorHandler.registerHandler("ValidationError", (error, context) => {
  console.log(`验证错误处理: ${error.field} - ${error.message}`);
  return {
    handled: true,
    action: "show_validation_message",
    field: error.field,
    message: `请检查${error.field}字段的输入`,
  };
});

errorHandler.registerHandler("NetworkError", (error, context) => {
  console.log(`网络错误处理: ${error.status} - ${error.url}`);

  if (error.isRetryable) {
    return {
      handled: true,
      action: "retry",
      message: "网络错误，正在重试...",
      retryAfter: 1000,
    };
  } else {
    return {
      handled: true,
      action: "show_error",
      message: "请求失败，请稍后重试",
    };
  }
});

// 测试错误处理策略
function testErrorHandling() {
  console.log("错误处理策略测试:");

  // 测试验证错误
  const validationError = new ValidationError("phone", "123", "手机号格式");
  const result1 = errorHandler.handle(validationError, { userId: 123 });
  console.log("处理结果1:", result1);

  // 测试网络错误
  const networkError = new NetworkError(
    "/api/data",
    500,
    "Internal Server Error"
  );
  const result2 = errorHandler.handle(networkError, { operation: "fetchData" });
  console.log("处理结果2:", result2);

  // 测试未知错误
  const unknownError = new Error("未知错误");
  const result3 = errorHandler.handle(unknownError);
  console.log("处理结果3:", result3);

  console.log("错误统计:", errorHandler.getErrorStats());
}

testErrorHandling();

console.log();

// =============================================
// 4. 异步错误处理
// =============================================

console.log("4. 异步错误处理");

class AsyncErrorHandler {
  static async safeExecute(asyncFn, retries = 3, delay = 1000) {
    let lastError;

    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const result = await asyncFn();
        if (attempt > 1) {
          console.log(`重试成功 (第${attempt}次尝试)`);
        }
        return { success: true, data: result };
      } catch (error) {
        lastError = error;
        console.log(`第${attempt}次尝试失败:`, error.message);

        if (attempt < retries) {
          await this.delay(delay * attempt); // 指数退避
        }
      }
    }

    return { success: false, error: lastError };
  }

  static delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // Promise错误处理包装器
  static wrapPromise(promise) {
    return promise
      .then((data) => ({ success: true, data, error: null }))
      .catch((error) => ({ success: false, data: null, error }));
  }

  // 并行操作错误处理
  static async parallelSafeExecute(asyncFunctions) {
    const results = await Promise.allSettled(asyncFunctions.map((fn) => fn()));

    const successes = [];
    const failures = [];

    results.forEach((result, index) => {
      if (result.status === "fulfilled") {
        successes.push({ index, data: result.value });
      } else {
        failures.push({ index, error: result.reason });
      }
    });

    return { successes, failures };
  }
}

// 模拟异步操作
async function mockAsyncOperation(shouldFail = false, delay = 100) {
  await AsyncErrorHandler.delay(delay);

  if (shouldFail) {
    throw new Error("模拟异步操作失败");
  }

  return `操作成功 - ${Date.now()}`;
}

// 测试异步错误处理
async function testAsyncErrorHandling() {
  console.log("异步错误处理测试:");

  // 测试重试机制
  console.log("1. 重试机制测试:");
  const result1 = await AsyncErrorHandler.safeExecute(
    () => mockAsyncOperation(Math.random() < 0.7), // 70%失败率
    3,
    500
  );
  console.log("重试结果:", result1);

  // 测试Promise包装
  console.log("\n2. Promise包装测试:");
  const result2 = await AsyncErrorHandler.wrapPromise(mockAsyncOperation(true));
  console.log("包装结果:", result2);

  // 测试并行操作
  console.log("\n3. 并行操作测试:");
  const operations = [
    () => mockAsyncOperation(false, 100),
    () => mockAsyncOperation(true, 150),
    () => mockAsyncOperation(false, 200),
    () => mockAsyncOperation(true, 80),
  ];

  const result3 = await AsyncErrorHandler.parallelSafeExecute(operations);
  console.log("并行结果:");
  console.log("  成功:", result3.successes.length);
  console.log("  失败:", result3.failures.length);
  result3.failures.forEach((failure) => {
    console.log(`  失败详情 ${failure.index}:`, failure.error.message);
  });
}

testAsyncErrorHandling();

console.log();

// =============================================
// 5. 全局错误处理
// =============================================

console.log("5. 全局错误处理");

class GlobalErrorHandler {
  constructor() {
    this.errorQueue = [];
    this.isProcessing = false;
    this.maxQueueSize = 50;
    this.setupGlobalHandlers();
  }

  setupGlobalHandlers() {
    // 在浏览器环境中才设置这些处理器
    if (typeof window !== "undefined") {
      window.addEventListener("error", this.handleError.bind(this));
      window.addEventListener(
        "unhandledrejection",
        this.handleUnhandledRejection.bind(this)
      );
    }

    // Node.js环境
    if (typeof process !== "undefined") {
      process.on("uncaughtException", this.handleUncaughtException.bind(this));
      process.on(
        "unhandledRejection",
        this.handleUnhandledRejection.bind(this)
      );
    }
  }

  handleError(event) {
    const error = {
      type: "javascript_error",
      message: event.message,
      filename: event.filename,
      line: event.lineno,
      column: event.colno,
      stack: event.error?.stack,
      timestamp: Date.now(),
    };

    this.queueError(error);
  }

  handleUnhandledRejection(event) {
    const error = {
      type: "unhandled_promise_rejection",
      reason: event.reason?.message || event.reason,
      stack: event.reason?.stack,
      timestamp: Date.now(),
    };

    this.queueError(error);

    // 阻止默认的控制台错误输出（可选）
    // event.preventDefault();
  }

  handleUncaughtException(error) {
    const errorInfo = {
      type: "uncaught_exception",
      message: error.message,
      stack: error.stack,
      timestamp: Date.now(),
    };

    this.queueError(errorInfo);

    // 在生产环境中，通常需要优雅地关闭应用
    console.error("严重错误，应用即将退出:", error);
    // process.exit(1);
  }

  queueError(error) {
    this.errorQueue.push(error);

    if (this.errorQueue.length > this.maxQueueSize) {
      this.errorQueue.shift();
    }

    if (!this.isProcessing) {
      this.processErrorQueue();
    }
  }

  async processErrorQueue() {
    this.isProcessing = true;

    while (this.errorQueue.length > 0) {
      const error = this.errorQueue.shift();
      await this.reportError(error);
    }

    this.isProcessing = false;
  }

  async reportError(error) {
    try {
      // 模拟错误上报
      console.log("上报错误:", {
        type: error.type,
        message: error.message,
        timestamp: new Date(error.timestamp).toISOString(),
      });

      // 实际上报逻辑
      // await this.sendToErrorService(error);
    } catch (reportError) {
      console.error("错误上报失败:", reportError);
    }
  }

  // 模拟错误服务上报
  async sendToErrorService(error) {
    // 模拟网络请求
    await new Promise((resolve) => setTimeout(resolve, 100));

    if (Math.random() < 0.1) {
      // 10%失败率
      throw new Error("错误服务不可用");
    }

    return { success: true, errorId: Math.random().toString(36) };
  }

  getErrorSummary() {
    const summary = {
      totalErrors: this.errorQueue.length,
      errorTypes: {},
      recentErrors: this.errorQueue.slice(-5),
    };

    this.errorQueue.forEach((error) => {
      summary.errorTypes[error.type] =
        (summary.errorTypes[error.type] || 0) + 1;
    });

    return summary;
  }
}

// 初始化全局错误处理器
const globalErrorHandler = new GlobalErrorHandler();

// 测试全局错误处理
function testGlobalErrorHandling() {
  console.log("全局错误处理测试:");

  // 模拟JavaScript错误
  setTimeout(() => {
    try {
      globalErrorHandler.queueError({
        type: "javascript_error",
        message: "Uncaught TypeError: Cannot read property of undefined",
        filename: "app.js",
        line: 42,
        column: 15,
        timestamp: Date.now(),
      });
    } catch (error) {
      console.log("模拟错误处理完成");
    }
  }, 100);

  // 模拟Promise rejection
  setTimeout(() => {
    globalErrorHandler.queueError({
      type: "unhandled_promise_rejection",
      reason: "Network request failed",
      timestamp: Date.now(),
    });
  }, 200);

  // 获取错误摘要
  setTimeout(() => {
    console.log("错误摘要:", globalErrorHandler.getErrorSummary());
  }, 500);
}

testGlobalErrorHandling();

console.log();

// =============================================
// 6. 错误监控和分析
// =============================================

console.log("6. 错误监控和分析");

class ErrorMonitor {
  constructor() {
    this.errors = [];
    this.metrics = {
      errorCount: 0,
      errorRate: 0,
      topErrors: new Map(),
      userImpact: new Map(),
    };
    this.monitoringInterval = null;
  }

  startMonitoring(intervalMs = 5000) {
    this.monitoringInterval = setInterval(() => {
      this.updateMetrics();
      this.checkAlerts();
    }, intervalMs);

    console.log("错误监控已启动");
  }

  stopMonitoring() {
    if (this.monitoringInterval) {
      clearInterval(this.monitoringInterval);
      this.monitoringInterval = null;
      console.log("错误监控已停止");
    }
  }

  recordError(error, userInfo = {}) {
    const errorRecord = {
      id: Math.random().toString(36).substr(2, 9),
      timestamp: Date.now(),
      error: {
        name: error.name,
        message: error.message,
        stack: error.stack,
        code: error.code,
      },
      userInfo,
      severity: this.calculateSeverity(error),
      fingerprint: this.generateFingerprint(error),
    };

    this.errors.push(errorRecord);
    this.updateErrorMetrics(errorRecord);

    // 限制错误记录数量
    if (this.errors.length > 1000) {
      this.errors = this.errors.slice(-1000);
    }
  }

  calculateSeverity(error) {
    if (error instanceof NetworkError && error.status >= 500) {
      return "high";
    }
    if (error instanceof ValidationError) {
      return "low";
    }
    if (error.name === "TypeError" || error.name === "ReferenceError") {
      return "high";
    }
    return "medium";
  }

  generateFingerprint(error) {
    // 生成错误指纹用于去重
    const key = `${error.name}:${error.message}`.replace(/\d+/g, "X");
    return require("crypto")
      .createHash("md5")
      .update(key)
      .digest("hex")
      .substr(0, 8);
  }

  updateErrorMetrics(errorRecord) {
    this.metrics.errorCount++;

    // 更新热门错误
    const fingerprint = errorRecord.fingerprint;
    const count = this.metrics.topErrors.get(fingerprint) || 0;
    this.metrics.topErrors.set(fingerprint, count + 1);

    // 更新用户影响
    if (errorRecord.userInfo.userId) {
      const userId = errorRecord.userInfo.userId;
      const userErrorCount = this.metrics.userImpact.get(userId) || 0;
      this.metrics.userImpact.set(userId, userErrorCount + 1);
    }
  }

  updateMetrics() {
    const now = Date.now();
    const oneHourAgo = now - 60 * 60 * 1000;

    // 计算错误率
    const recentErrors = this.errors.filter((e) => e.timestamp >= oneHourAgo);
    this.metrics.errorRate = recentErrors.length;

    console.log(
      `错误监控更新: 总错误数 ${this.metrics.errorCount}, 小时错误率 ${this.metrics.errorRate}`
    );
  }

  checkAlerts() {
    // 检查错误率阈值
    if (this.metrics.errorRate > 100) {
      this.sendAlert("error_rate_high", {
        rate: this.metrics.errorRate,
        threshold: 100,
      });
    }

    // 检查用户影响
    for (const [userId, errorCount] of this.metrics.userImpact.entries()) {
      if (errorCount > 10) {
        this.sendAlert("user_impact_high", {
          userId,
          errorCount,
          threshold: 10,
        });
      }
    }
  }

  sendAlert(type, data) {
    console.log(`🚨 告警: ${type}`, data);
    // 实际告警逻辑：发送邮件、短信、钉钉等
  }

  getAnalytics() {
    const now = Date.now();
    const oneDay = 24 * 60 * 60 * 1000;

    // 按时间分组
    const timeGroups = {};
    this.errors.forEach((error) => {
      const hour = new Date(error.timestamp).getHours();
      timeGroups[hour] = (timeGroups[hour] || 0) + 1;
    });

    // 按严重程度分组
    const severityGroups = {};
    this.errors.forEach((error) => {
      severityGroups[error.severity] =
        (severityGroups[error.severity] || 0) + 1;
    });

    // 热门错误
    const topErrorsList = Array.from(this.metrics.topErrors.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 10);

    return {
      totalErrors: this.errors.length,
      errorRate: this.metrics.errorRate,
      timeDistribution: timeGroups,
      severityDistribution: severityGroups,
      topErrors: topErrorsList,
      affectedUsers: this.metrics.userImpact.size,
    };
  }
}

// 测试错误监控
const errorMonitor = new ErrorMonitor();
errorMonitor.startMonitoring(2000);

// 模拟错误产生
function simulateErrors() {
  console.log("模拟错误产生:");

  const errors = [
    new ValidationError("email", "test", "email格式"),
    new NetworkError("/api/users", 500, "Internal Server Error"),
    new TypeError("Cannot read property of undefined"),
    new CustomError("业务逻辑错误", "BUSINESS_ERROR"),
  ];

  errors.forEach((error, index) => {
    setTimeout(() => {
      errorMonitor.recordError(error, {
        userId: `user_${Math.floor(Math.random() * 10)}`,
        sessionId: `session_${index}`,
        userAgent: "TestBrowser/1.0",
      });
    }, index * 300);
  });

  // 获取分析报告
  setTimeout(() => {
    console.log("错误分析报告:", errorMonitor.getAnalytics());
    errorMonitor.stopMonitoring();
  }, 2000);
}

simulateErrors();

console.log();

// =============================================
// 7. 错误恢复策略
// =============================================

console.log("7. 错误恢复策略");

class ErrorRecovery {
  static createCircuitBreaker(fn, threshold = 5, timeout = 10000) {
    let failures = 0;
    let lastFailureTime = 0;
    let state = "CLOSED"; // CLOSED, OPEN, HALF_OPEN

    return async (...args) => {
      const now = Date.now();

      if (state === "OPEN") {
        if (now - lastFailureTime > timeout) {
          state = "HALF_OPEN";
          console.log("断路器转为半开状态");
        } else {
          throw new Error("断路器开启，拒绝请求");
        }
      }

      try {
        const result = await fn(...args);

        if (state === "HALF_OPEN") {
          state = "CLOSED";
          failures = 0;
          console.log("断路器恢复正常");
        }

        return result;
      } catch (error) {
        failures++;
        lastFailureTime = now;

        if (failures >= threshold) {
          state = "OPEN";
          console.log(`断路器开启 (失败次数: ${failures})`);
        }

        throw error;
      }
    };
  }

  static createBulkhead(fn, maxConcurrency = 3) {
    let running = 0;
    const queue = [];

    return (...args) => {
      return new Promise((resolve, reject) => {
        const execute = async () => {
          running++;
          try {
            const result = await fn(...args);
            resolve(result);
          } catch (error) {
            reject(error);
          } finally {
            running--;
            if (queue.length > 0) {
              const next = queue.shift();
              next();
            }
          }
        };

        if (running < maxConcurrency) {
          execute();
        } else {
          console.log("请求排队等待");
          queue.push(execute);
        }
      });
    };
  }

  static createFallback(primaryFn, fallbackFn) {
    return async (...args) => {
      try {
        return await primaryFn(...args);
      } catch (primaryError) {
        console.log("主要操作失败，使用备用方案:", primaryError.message);

        try {
          return await fallbackFn(...args);
        } catch (fallbackError) {
          console.log("备用方案也失败:", fallbackError.message);
          throw new Error(
            `所有恢复策略都失败: ${primaryError.message}, ${fallbackError.message}`
          );
        }
      }
    };
  }
}

// 模拟不稳定的服务
async function unstableService(data) {
  await new Promise((resolve) => setTimeout(resolve, 100));

  if (Math.random() < 0.6) {
    // 60%失败率
    throw new Error("服务暂时不可用");
  }

  return `处理成功: ${data}`;
}

// 备用服务
async function fallbackService(data) {
  await new Promise((resolve) => setTimeout(resolve, 50));
  return `备用处理: ${data}`;
}

// 测试错误恢复策略
async function testErrorRecovery() {
  console.log("错误恢复策略测试:");

  // 1. 断路器模式
  console.log("1. 断路器测试:");
  const circuitBreakerService = ErrorRecovery.createCircuitBreaker(
    unstableService,
    3,
    2000
  );

  for (let i = 0; i < 8; i++) {
    try {
      const result = await circuitBreakerService(`请求${i + 1}`);
      console.log(`  成功: ${result}`);
    } catch (error) {
      console.log(`  失败: ${error.message}`);
    }
    await new Promise((resolve) => setTimeout(resolve, 300));
  }

  // 2. 舱壁模式
  console.log("\n2. 舱壁模式测试:");
  const bulkheadService = ErrorRecovery.createBulkhead(unstableService, 2);

  const promises = Array.from({ length: 5 }, (_, i) =>
    bulkheadService(`并发请求${i + 1}`)
      .then((result) => console.log(`  成功: ${result}`))
      .catch((error) => console.log(`  失败: ${error.message}`))
  );

  await Promise.all(promises);

  // 3. 降级模式
  console.log("\n3. 降级模式测试:");
  const fallbackServiceWrapped = ErrorRecovery.createFallback(
    unstableService,
    fallbackService
  );

  for (let i = 0; i < 3; i++) {
    try {
      const result = await fallbackServiceWrapped(`降级测试${i + 1}`);
      console.log(`  结果: ${result}`);
    } catch (error) {
      console.log(`  最终失败: ${error.message}`);
    }
  }
}

testErrorRecovery();

console.log();

// =============================================
// 8. 最佳实践总结
// =============================================

console.log("8. 最佳实践总结");

console.log(`
错误处理最佳实践:

1. 错误分类和设计:
   - 创建有意义的自定义错误类
   - 为错误提供错误码和上下文信息
   - 区分可恢复和不可恢复错误
   - 使用错误继承体系

2. 错误处理策略:
   - 在合适的层级处理错误
   - 使用统一的错误处理机制
   - 提供优雅降级方案
   - 实现重试和断路器模式

3. 异步错误处理:
   - 使用try-catch包装async/await
   - 处理Promise rejection
   - 实现并行操作的错误聚合
   - 避免未处理的Promise rejection

4. 监控和日志:
   - 记录详细的错误信息和上下文
   - 实现错误聚合和去重
   - 设置关键错误的告警
   - 分析错误趋势和影响

5. 用户体验:
   - 提供友好的错误提示
   - 保持应用状态的一致性
   - 提供错误恢复操作
   - 避免错误信息泄露敏感信息

6. 开发和调试:
   - 保留完整的堆栈信息
   - 提供调试模式和详细日志
   - 使用Source Map定位源码位置
   - 集成错误追踪工具

常见陷阱:
- 忽略Promise rejection
- 过度捕获异常掩盖问题
- 错误信息不够详细
- 没有错误恢复机制
- 在错误处理中再次抛出错误

工具推荐:
- Sentry错误追踪
- LogRocket会话回放
- Bugsnag错误监控
- Rollbar实时错误追踪
- 自定义错误日志系统
`);

// 导出供测试使用
module.exports = {
  CustomError,
  ValidationError,
  NetworkError,
  ResourceError,
  ErrorHandler,
  AsyncErrorHandler,
  GlobalErrorHandler,
  ErrorMonitor,
  ErrorRecovery,
};

console.log("错误处理演示完成\n");
