/**
 * JavaScript高级程序设计 - 第6章：ES6模块系统
 *
 * 本文件演示ES6模块的导入导出和模块化最佳实践
 */

console.log("=== JavaScript ES6模块系统 ===\n");

// =============================================
// 1. 模块导出基础
// =============================================

console.log("1. 模块导出基础");

// 命名导出示例
export const PI = 3.14159;
export const E = 2.71828;

export function add(a, b) {
  return a + b;
}

export function multiply(a, b) {
  return a * b;
}

// 批量导出
const subtract = (a, b) => a - b;
const divide = (a, b) => (b !== 0 ? a / b : NaN);

export { subtract, divide };

// 重命名导出
function power(base, exponent) {
  return Math.pow(base, exponent);
}

export { power as pow };

console.log("基础导出函数定义完成");

// =============================================
// 2. 默认导出
// =============================================

console.log("2. 默认导出");

// 默认导出类
export default class Calculator {
  constructor() {
    this.history = [];
    this.current = 0;
  }

  add(value) {
    this.current += value;
    this.history.push(`+ ${value}`);
    return this;
  }

  subtract(value) {
    this.current -= value;
    this.history.push(`- ${value}`);
    return this;
  }

  multiply(value) {
    this.current *= value;
    this.history.push(`* ${value}`);
    return this;
  }

  divide(value) {
    if (value !== 0) {
      this.current /= value;
      this.history.push(`/ ${value}`);
    }
    return this;
  }

  getResult() {
    return this.current;
  }

  getHistory() {
    return [...this.history];
  }

  clear() {
    this.current = 0;
    this.history = [];
    return this;
  }
}

console.log("Calculator类定义完成");

// =============================================
// 3. 模块内部示例
// =============================================

console.log("3. 模块内部功能演示");

// 模拟不同的模块功能
class MathUtils {
  static factorial(n) {
    if (n <= 1) return 1;
    return n * this.factorial(n - 1);
  }

  static fibonacci(n) {
    if (n <= 1) return n;
    return this.fibonacci(n - 1) + this.fibonacci(n - 2);
  }

  static isPrime(num) {
    if (num <= 1) return false;
    if (num <= 3) return true;
    if (num % 2 === 0 || num % 3 === 0) return false;

    for (let i = 5; i * i <= num; i += 6) {
      if (num % i === 0 || num % (i + 2) === 0) {
        return false;
      }
    }
    return true;
  }

  static gcd(a, b) {
    return b === 0 ? a : this.gcd(b, a % b);
  }

  static lcm(a, b) {
    return Math.abs(a * b) / this.gcd(a, b);
  }
}

// 导出工具类
export { MathUtils };

// 私有模块功能（不导出）
function internalHelper(data) {
  return `Internal: ${data}`;
}

// 模块级变量
let moduleState = {
  initialized: false,
  version: "1.0.0",
  author: "JavaScript高级程序设计",
};

// 初始化函数
export function initializeModule() {
  if (!moduleState.initialized) {
    console.log("模块初始化...");
    moduleState.initialized = true;
    console.log(`模块版本: ${moduleState.version}`);
    console.log(`作者: ${moduleState.author}`);
  }
  return moduleState.initialized;
}

// 获取模块信息
export function getModuleInfo() {
  return {
    ...moduleState,
    exports: [
      "PI",
      "E",
      "add",
      "multiply",
      "subtract",
      "divide",
      "pow",
      "Calculator",
      "MathUtils",
    ],
  };
}

// =============================================
// 4. 模拟动态导入
// =============================================

console.log("4. 动态导入模拟");

// 模拟动态导入功能
class DynamicImporter {
  static moduleCache = new Map();

  static async import(modulePath) {
    // 模拟异步加载
    return new Promise((resolve) => {
      setTimeout(() => {
        if (this.moduleCache.has(modulePath)) {
          console.log(`从缓存加载模块: ${modulePath}`);
          resolve(this.moduleCache.get(modulePath));
        } else {
          console.log(`动态加载模块: ${modulePath}`);
          const mockModule = this.createMockModule(modulePath);
          this.moduleCache.set(modulePath, mockModule);
          resolve(mockModule);
        }
      }, 100);
    });
  }

  static createMockModule(path) {
    const modules = {
      "./utils": {
        format: (str) => `[${str}]`,
        validate: (data) => data != null,
        transform: (data) => data.toString().toUpperCase(),
      },
      "./api": {
        get: async (url) => ({ data: `Mock data from ${url}` }),
        post: async (url, data) => ({ success: true, data }),
        delete: async (url) => ({ deleted: true }),
      },
      "./config": {
        API_URL: "https://api.example.com",
        TIMEOUT: 5000,
        VERSION: "2.0.0",
      },
    };

    return modules[path] || { default: `Mock module for ${path}` };
  }

  static clearCache() {
    this.moduleCache.clear();
    console.log("模块缓存已清理");
  }

  static getCacheInfo() {
    return {
      size: this.moduleCache.size,
      modules: Array.from(this.moduleCache.keys()),
    };
  }
}

// 测试动态导入
async function testDynamicImport() {
  console.log("测试动态导入:");

  const utils = await DynamicImporter.import("./utils");
  console.log("Utils模块:", utils.format("测试"));

  const api = await DynamicImporter.import("./api");
  const response = await api.get("/users");
  console.log("API响应:", response);

  const config = await DynamicImporter.import("./config");
  console.log("配置:", config.VERSION);

  console.log("缓存信息:", DynamicImporter.getCacheInfo());
}

testDynamicImport();

// =============================================
// 5. 模块依赖管理
// =============================================

console.log("\n5. 模块依赖管理");

class DependencyManager {
  constructor() {
    this.dependencies = new Map();
    this.loadedModules = new Set();
    this.loadingModules = new Set();
  }

  addDependency(module, dependencies) {
    this.dependencies.set(module, dependencies);
  }

  async loadModule(moduleName) {
    if (this.loadedModules.has(moduleName)) {
      console.log(`模块 ${moduleName} 已加载`);
      return true;
    }

    if (this.loadingModules.has(moduleName)) {
      console.log(`模块 ${moduleName} 正在加载中...`);
      return false;
    }

    this.loadingModules.add(moduleName);

    // 先加载依赖
    const deps = this.dependencies.get(moduleName) || [];
    for (const dep of deps) {
      await this.loadModule(dep);
    }

    // 模拟模块加载
    await new Promise((resolve) => setTimeout(resolve, 50));

    this.loadedModules.add(moduleName);
    this.loadingModules.delete(moduleName);

    console.log(`模块 ${moduleName} 加载完成`);
    return true;
  }

  getDependencyTree(moduleName, visited = new Set()) {
    if (visited.has(moduleName)) {
      return null; // 循环依赖
    }

    visited.add(moduleName);
    const deps = this.dependencies.get(moduleName) || [];

    return {
      module: moduleName,
      dependencies: deps.map((dep) =>
        this.getDependencyTree(dep, new Set(visited))
      ),
    };
  }

  hasCircularDependency(moduleName, path = []) {
    if (path.includes(moduleName)) {
      console.log(`发现循环依赖: ${path.join(" -> ")} -> ${moduleName}`);
      return true;
    }

    const deps = this.dependencies.get(moduleName) || [];
    for (const dep of deps) {
      if (this.hasCircularDependency(dep, [...path, moduleName])) {
        return true;
      }
    }

    return false;
  }

  getLoadOrder(moduleName) {
    const order = [];
    const visited = new Set();

    const visit = (name) => {
      if (visited.has(name)) return;
      visited.add(name);

      const deps = this.dependencies.get(name) || [];
      deps.forEach(visit);
      order.push(name);
    };

    visit(moduleName);
    return order;
  }
}

// 测试依赖管理
const depManager = new DependencyManager();

// 定义模块依赖关系
depManager.addDependency("app", ["router", "store", "utils"]);
depManager.addDependency("router", ["utils"]);
depManager.addDependency("store", ["api", "utils"]);
depManager.addDependency("api", ["http", "config"]);
depManager.addDependency("http", ["utils"]);
depManager.addDependency("config", []);
depManager.addDependency("utils", []);

console.log("依赖关系定义完成");
console.log("加载顺序:", depManager.getLoadOrder("app"));

// 检查循环依赖
console.log("循环依赖检查:", !depManager.hasCircularDependency("app"));

// 加载模块
depManager.loadModule("app").then(() => {
  console.log("所有模块加载完成");
});

// =============================================
// 6. 模块热重载
// =============================================

console.log("\n6. 模块热重载模拟");

class HotReloader {
  constructor() {
    this.modules = new Map();
    this.watchers = new Map();
    this.subscribers = new Map();
  }

  register(moduleName, moduleFactory) {
    const module = {
      name: moduleName,
      factory: moduleFactory,
      instance: null,
      version: 1,
      lastUpdate: Date.now(),
    };

    this.modules.set(moduleName, module);
    this.instantiate(moduleName);

    console.log(`注册模块: ${moduleName}`);
  }

  instantiate(moduleName) {
    const module = this.modules.get(moduleName);
    if (module) {
      module.instance = module.factory();
      module.lastUpdate = Date.now();
      this.notifySubscribers(moduleName, module.instance);
    }
  }

  subscribe(moduleName, callback) {
    if (!this.subscribers.has(moduleName)) {
      this.subscribers.set(moduleName, []);
    }
    this.subscribers.get(moduleName).push(callback);
  }

  notifySubscribers(moduleName, instance) {
    const subs = this.subscribers.get(moduleName) || [];
    subs.forEach((callback) => {
      try {
        callback(instance);
      } catch (error) {
        console.error(`热重载回调错误: ${error.message}`);
      }
    });
  }

  hotReload(moduleName, newFactory) {
    const module = this.modules.get(moduleName);
    if (!module) {
      console.log(`模块 ${moduleName} 不存在`);
      return false;
    }

    console.log(`热重载模块: ${moduleName}`);

    // 保存旧实例
    const oldInstance = module.instance;

    // 更新工厂函数
    module.factory = newFactory;
    module.version++;

    // 重新实例化
    this.instantiate(moduleName);

    console.log(`模块 ${moduleName} 热重载完成 (v${module.version})`);
    return true;
  }

  getModuleInfo(moduleName) {
    const module = this.modules.get(moduleName);
    if (!module) return null;

    return {
      name: module.name,
      version: module.version,
      lastUpdate: new Date(module.lastUpdate).toLocaleTimeString(),
      hasInstance: module.instance !== null,
      subscribers: (this.subscribers.get(moduleName) || []).length,
    };
  }

  getAllModules() {
    return Array.from(this.modules.keys()).map((name) =>
      this.getModuleInfo(name)
    );
  }
}

// 测试热重载
const hotReloader = new HotReloader();

// 注册初始模块
hotReloader.register("counter", () => {
  return {
    count: 0,
    increment() {
      this.count++;
    },
    getCount() {
      return this.count;
    },
  };
});

// 订阅模块更新
hotReloader.subscribe("counter", (newInstance) => {
  console.log("Counter模块已更新:", newInstance.getCount());
});

// 获取模块实例
const counterModule = hotReloader.modules.get("counter").instance;
counterModule.increment();
counterModule.increment();
console.log("计数器值:", counterModule.getCount());

// 模拟热重载
setTimeout(() => {
  hotReloader.hotReload("counter", () => {
    return {
      count: 10, // 新的初始值
      increment() {
        this.count += 2;
      }, // 修改增量逻辑
      decrement() {
        this.count--;
      }, // 新增方法
      getCount() {
        return this.count;
      },
    };
  });

  const newCounter = hotReloader.modules.get("counter").instance;
  console.log("热重载后计数器值:", newCounter.getCount());
  newCounter.increment();
  console.log("执行increment后:", newCounter.getCount());
}, 500);

// =============================================
// 7. 模块性能优化
// =============================================

console.log("\n7. 模块性能优化");

class ModuleOptimizer {
  constructor() {
    this.loadTimes = new Map();
    this.sizeMocks = new Map();
    this.usageStats = new Map();
  }

  // 模拟代码分割
  async splitChunks(modules) {
    console.log("代码分割分析:");

    // 分析模块依赖关系
    const chunks = {
      vendor: [], // 第三方库
      common: [], // 共同依赖
      app: [], // 应用代码
    };

    modules.forEach((module) => {
      if (module.includes("vendor") || module.includes("lib")) {
        chunks.vendor.push(module);
      } else if (this.isCommonModule(module)) {
        chunks.common.push(module);
      } else {
        chunks.app.push(module);
      }
    });

    console.log("分割结果:");
    Object.entries(chunks).forEach(([name, modules]) => {
      console.log(`  ${name}: ${modules.length} 个模块`);
    });

    return chunks;
  }

  isCommonModule(moduleName) {
    // 模拟检查模块是否被多个地方使用
    const usage = this.usageStats.get(moduleName) || 0;
    return usage > 2;
  }

  // 树摇优化模拟
  treeShake(moduleExports, usedExports) {
    console.log("树摇优化:");

    const originalSize = Object.keys(moduleExports).length;
    const shaken = {};

    usedExports.forEach((exportName) => {
      if (exportName in moduleExports) {
        shaken[exportName] = moduleExports[exportName];
      }
    });

    const finalSize = Object.keys(shaken).length;
    const reduction = (
      ((originalSize - finalSize) / originalSize) *
      100
    ).toFixed(1);

    console.log(`  原始导出: ${originalSize}`);
    console.log(`  使用导出: ${finalSize}`);
    console.log(`  减少: ${reduction}%`);

    return shaken;
  }

  // 懒加载模拟
  async lazyLoad(moduleFactory, condition) {
    return new Promise((resolve) => {
      const checkCondition = () => {
        if (condition()) {
          console.log("条件满足，加载模块...");
          const module = moduleFactory();
          resolve(module);
        } else {
          setTimeout(checkCondition, 100);
        }
      };

      checkCondition();
    });
  }

  // 预加载优化
  preloadModules(modules, priority = "low") {
    console.log(`预加载模块 (优先级: ${priority}):`);

    modules.forEach((module, index) => {
      setTimeout(() => {
        console.log(`  预加载: ${module}`);
        this.mockLoad(module);
      }, index * (priority === "high" ? 10 : 100));
    });
  }

  mockLoad(moduleName) {
    const startTime = Date.now();
    // 模拟加载时间
    setTimeout(() => {
      const endTime = Date.now();
      this.loadTimes.set(moduleName, endTime - startTime);
    }, Math.random() * 100);
  }

  getPerformanceReport() {
    console.log("\n性能报告:");

    let totalTime = 0;
    let moduleCount = 0;

    this.loadTimes.forEach((time, module) => {
      console.log(`  ${module}: ${time}ms`);
      totalTime += time;
      moduleCount++;
    });

    if (moduleCount > 0) {
      console.log(`  平均加载时间: ${(totalTime / moduleCount).toFixed(2)}ms`);
    }
  }
}

// 测试性能优化
const optimizer = new ModuleOptimizer();

// 测试代码分割
const testModules = [
  "vendor/react",
  "vendor/lodash",
  "utils/format",
  "utils/validate",
  "components/header",
  "pages/home",
];

optimizer.splitChunks(testModules);

// 测试树摇
const mockModuleExports = {
  add,
  multiply,
  subtract,
  divide,
  pow,
  unusedFunction1: () => {},
  unusedFunction2: () => {},
  PI,
  E,
};

const usedExports = ["add", "multiply", "PI"];
optimizer.treeShake(mockModuleExports, usedExports);

// 测试懒加载
let shouldLoad = false;
setTimeout(() => {
  shouldLoad = true;
}, 300);

optimizer
  .lazyLoad(
    () => ({ message: "懒加载的模块" }),
    () => shouldLoad
  )
  .then((module) => {
    console.log("懒加载完成:", module.message);
  });

// 测试预加载
optimizer.preloadModules(["analytics", "tracking", "ads"], "low");

console.log();

// =============================================
// 8. 最佳实践总结
// =============================================

console.log("8. 最佳实践总结");

console.log(`
ES6模块系统最佳实践:

1. 导出策略:
   - 优先使用命名导出
   - 一个模块一个默认导出
   - 保持导出接口稳定
   - 避免导出内部实现细节

2. 模块组织:
   - 单一职责原则
   - 合理的模块大小
   - 清晰的依赖关系
   - 避免循环依赖

3. 性能优化:
   - 代码分割和懒加载
   - 树摇优化移除死代码
   - 模块预加载
   - 合理的缓存策略

4. 开发体验:
   - 热重载支持
   - 清晰的错误信息
   - 类型定义支持
   - 文档和示例

5. 兼容性考虑:
   - 提供CommonJS兼容
   - 支持不同的模块系统
   - 浏览器兼容性检查
   - 适当的polyfill

常见陷阱:
- 循环依赖导致的问题
- 动态导入的错误处理
- 模块加载顺序问题
- 内存泄漏和模块卸载

工具推荐:
- Webpack/Rollup打包器
- Babel转译器
- ESLint模块规则
- TypeScript类型检查
`);

// 由于这是模块文件，在Node.js环境中使用module.exports
if (typeof module !== "undefined" && module.exports) {
  module.exports = {
    PI,
    E,
    add,
    multiply,
    subtract,
    divide,
    pow,
    Calculator: Calculator,
    MathUtils,
    initializeModule,
    getModuleInfo,
    DynamicImporter,
    DependencyManager,
    HotReloader,
    ModuleOptimizer,
  };
}

console.log("模块系统演示完成\n");
