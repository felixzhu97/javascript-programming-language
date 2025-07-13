/**
 * JavaScript高级程序设计 - 第6章：Symbol
 *
 * 本文件演示ES6 Symbol的特性和应用场景
 */

console.log("=== JavaScript Symbol ===\n");

// =============================================
// 1. Symbol基础
// =============================================

console.log("1. Symbol基础");

// 创建Symbol
const sym1 = Symbol();
const sym2 = Symbol("description");
const sym3 = Symbol("description"); // 每个Symbol都是唯一的

console.log("Symbol基础:");
console.log("sym1:", sym1.toString());
console.log("sym2:", sym2.toString());
console.log("sym1 === sym2:", sym1 === sym2); // false
console.log("sym2 === sym3:", sym2 === sym3); // false，即使描述相同

// Symbol属性
console.log("Symbol描述:", sym2.description);
console.log("Symbol类型:", typeof sym1);

// Symbol不能使用new操作符
try {
  const invalidSym = new Symbol(); // 这会抛出错误
} catch (error) {
  console.log("Symbol构造错误:", error.message);
}

console.log();

// =============================================
// 2. Symbol作为对象属性
// =============================================

console.log("2. Symbol作为对象属性");

const idSymbol = Symbol("id");
const nameSymbol = Symbol("name");
const secretSymbol = Symbol("secret");

const user = {
  [idSymbol]: 12345,
  [nameSymbol]: "张三",
  [secretSymbol]: "这是秘密信息",
  publicName: "公开姓名",
  age: 30,
};

console.log("Symbol属性访问:");
console.log("ID:", user[idSymbol]);
console.log("姓名:", user[nameSymbol]);
console.log("秘密:", user[secretSymbol]);

// Symbol属性不会出现在常规遍历中
console.log("Object.keys():", Object.keys(user)); // 不包含Symbol属性
console.log("for...in遍历:");
for (const key in user) {
  console.log(`  ${key}: ${user[key]}`);
}

// 获取Symbol属性
console.log(
  "Object.getOwnPropertySymbols():",
  Object.getOwnPropertySymbols(user)
);
console.log("Reflect.ownKeys():", Reflect.ownKeys(user)); // 包含所有属性

console.log();

// =============================================
// 3. 全局Symbol注册表
// =============================================

console.log("3. 全局Symbol注册表");

// Symbol.for() 创建全局Symbol
const globalSym1 = Symbol.for("global.id");
const globalSym2 = Symbol.for("global.id"); // 返回相同的Symbol

console.log("全局Symbol:");
console.log("globalSym1 === globalSym2:", globalSym1 === globalSym2); // true

// Symbol.keyFor() 获取全局Symbol的key
console.log("Symbol.keyFor(globalSym1):", Symbol.keyFor(globalSym1));
console.log("Symbol.keyFor(sym1):", Symbol.keyFor(sym1)); // undefined，因为不是全局Symbol

// 全局Symbol应用示例
class EventBus {
  constructor() {
    this.events = {};
  }

  on(eventType, callback) {
    const eventSymbol = Symbol.for(`event.${eventType}`);
    if (!this.events[eventSymbol]) {
      this.events[eventSymbol] = [];
    }
    this.events[eventSymbol].push(callback);
    console.log(`注册事件: ${eventType}`);
  }

  emit(eventType, data) {
    const eventSymbol = Symbol.for(`event.${eventType}`);
    const callbacks = this.events[eventSymbol];
    if (callbacks) {
      callbacks.forEach((callback) => callback(data));
      console.log(`触发事件: ${eventType}`);
    }
  }

  off(eventType) {
    const eventSymbol = Symbol.for(`event.${eventType}`);
    delete this.events[eventSymbol];
    console.log(`移除事件: ${eventType}`);
  }
}

const eventBus = new EventBus();
eventBus.on("user.login", (data) => console.log("用户登录:", data));
eventBus.on("user.logout", (data) => console.log("用户登出:", data));

eventBus.emit("user.login", { userId: 123, timestamp: Date.now() });
eventBus.emit("user.logout", { userId: 123 });

console.log();

// =============================================
// 4. 内置Symbol
// =============================================

console.log("4. 内置Symbol");

// Symbol.iterator - 定义默认迭代器
class NumberRange {
  constructor(start, end) {
    this.start = start;
    this.end = end;
  }

  [Symbol.iterator]() {
    let current = this.start;
    const end = this.end;

    return {
      next() {
        if (current <= end) {
          return { value: current++, done: false };
        } else {
          return { done: true };
        }
      },
    };
  }
}

const range = new NumberRange(1, 5);
console.log("Symbol.iterator使用:");
for (const num of range) {
  console.log(`  数字: ${num}`);
}

// Symbol.toStringTag - 自定义toString标签
class CustomClass {
  get [Symbol.toStringTag]() {
    return "CustomClass";
  }
}

const customInstance = new CustomClass();
console.log(
  "Symbol.toStringTag:",
  Object.prototype.toString.call(customInstance)
);

// Symbol.hasInstance - 自定义instanceof行为
class SpecialArray {
  static [Symbol.hasInstance](instance) {
    return Array.isArray(instance) && instance.length > 0;
  }
}

console.log("Symbol.hasInstance:");
console.log("[] instanceof SpecialArray:", [] instanceof SpecialArray); // false
console.log(
  "[1,2,3] instanceof SpecialArray:",
  [1, 2, 3] instanceof SpecialArray
); // true

// Symbol.toPrimitive - 自定义类型转换
class Temperature {
  constructor(celsius) {
    this.celsius = celsius;
  }

  [Symbol.toPrimitive](hint) {
    switch (hint) {
      case "number":
        return this.celsius;
      case "string":
        return `${this.celsius}°C`;
      default:
        return this.celsius;
    }
  }
}

const temp = new Temperature(25);
console.log("Symbol.toPrimitive:");
console.log("转为数字:", +temp); // 25
console.log("转为字符串:", String(temp)); // "25°C"
console.log("默认转换:", temp + 5); // 30

console.log();

// =============================================
// 5. Symbol在设计模式中的应用
// =============================================

console.log("5. Symbol在设计模式中的应用");

// 单例模式中的私有标识
const SingletonSymbol = Symbol("singleton");

class Singleton {
  constructor(token) {
    if (token !== SingletonSymbol) {
      throw new Error("使用Singleton.getInstance()创建实例");
    }
    this.data = "单例数据";
  }

  static getInstance() {
    if (!this.instance) {
      this.instance = new Singleton(SingletonSymbol);
    }
    return this.instance;
  }
}

const singleton1 = Singleton.getInstance();
const singleton2 = Singleton.getInstance();
console.log("单例模式:", singleton1 === singleton2);

try {
  const invalidSingleton = new Singleton(); // 会抛出错误
} catch (error) {
  console.log("单例创建错误:", error.message);
}

// 观察者模式中的事件类型
const ObserverEvents = {
  UPDATE: Symbol("update"),
  DELETE: Symbol("delete"),
  CREATE: Symbol("create"),
};

class Observable {
  constructor() {
    this.observers = new Map();
  }

  subscribe(event, observer) {
    if (!this.observers.has(event)) {
      this.observers.set(event, []);
    }
    this.observers.get(event).push(observer);
    console.log(`订阅事件: ${event.description || event.toString()}`);
  }

  notify(event, data) {
    const eventObservers = this.observers.get(event);
    if (eventObservers) {
      eventObservers.forEach((observer) => observer(data));
      console.log(`通知事件: ${event.description || event.toString()}`);
    }
  }
}

const observable = new Observable();
observable.subscribe(ObserverEvents.UPDATE, (data) =>
  console.log("更新观察者:", data)
);
observable.subscribe(ObserverEvents.CREATE, (data) =>
  console.log("创建观察者:", data)
);

observable.notify(ObserverEvents.UPDATE, { id: 1, changes: ["name"] });
observable.notify(ObserverEvents.CREATE, { id: 2, type: "user" });

console.log();

// =============================================
// 6. Symbol与元编程
// =============================================

console.log("6. Symbol与元编程");

// 使用Symbol创建私有方法
const privateMethod = Symbol("privateMethod");
const privateData = Symbol("privateData");

class MetaClass {
  constructor(data) {
    this[privateData] = data;
  }

  [privateMethod](operation) {
    console.log(`执行私有操作: ${operation}`);
    return `处理了: ${this[privateData]}`;
  }

  publicMethod() {
    return this[privateMethod]("公共调用");
  }

  // 使用Proxy拦截属性访问
  static createProxy(instance) {
    return new Proxy(instance, {
      get(target, prop) {
        if (
          typeof prop === "symbol" &&
          prop.description?.startsWith("private")
        ) {
          console.log("警告: 尝试访问私有Symbol属性");
          return undefined;
        }
        // 如果是方法调用，需要绑定正确的this
        const value = target[prop];
        if (typeof value === "function") {
          return value.bind(target);
        }
        return value;
      },

      has(target, prop) {
        if (
          typeof prop === "symbol" &&
          prop.description?.startsWith("private")
        ) {
          return false; // 隐藏私有属性
        }
        return prop in target;
      },

      ownKeys(target) {
        return Reflect.ownKeys(target).filter(
          (key) =>
            !(typeof key === "symbol" && key.description?.startsWith("private"))
        );
      },
    });
  }
}

const metaInstance = new MetaClass("测试数据");
const proxiedInstance = MetaClass.createProxy(metaInstance);

console.log("元编程测试:");
console.log("公共方法调用:", proxiedInstance.publicMethod());
console.log("私有方法访问:", proxiedInstance[privateMethod]); // undefined
console.log("属性检查:", privateMethod in proxiedInstance); // false
console.log("可见属性:", Object.getOwnPropertyNames(proxiedInstance));

console.log();

// =============================================
// 7. Symbol在API设计中的应用
// =============================================

console.log("7. Symbol在API设计中的应用");

// 命名空间Symbol
const APINamespace = {
  INTERNAL: Symbol("internal"),
  DEBUG: Symbol("debug"),
  VERSION: Symbol("version"),
};

class API {
  constructor() {
    this[APINamespace.INTERNAL] = {
      requestCount: 0,
      errors: [],
    };
    this[APINamespace.DEBUG] = false;
    this[APINamespace.VERSION] = "1.0.0";
  }

  request(endpoint) {
    this[APINamespace.INTERNAL].requestCount++;

    if (this[APINamespace.DEBUG]) {
      console.log(`API请求: ${endpoint}`);
    }

    return {
      data: `来自 ${endpoint} 的数据`,
      version: this[APINamespace.VERSION],
    };
  }

  enableDebug() {
    this[APINamespace.DEBUG] = true;
    console.log("调试模式已启用");
  }

  getStats() {
    return {
      requests: this[APINamespace.INTERNAL].requestCount,
      errors: this[APINamespace.INTERNAL].errors.length,
      version: this[APINamespace.VERSION],
    };
  }

  // 提供内部访问接口（仅用于测试）
  static getInternalAccess(instance) {
    return {
      getInternal: () => instance[APINamespace.INTERNAL],
      setDebug: (value) => (instance[APINamespace.DEBUG] = value),
      getVersion: () => instance[APINamespace.VERSION],
    };
  }
}

const api = new API();
api.enableDebug();
console.log("API调用结果:", api.request("/users"));
console.log("API调用结果:", api.request("/posts"));
console.log("API统计:", api.getStats());

// 仅在开发环境下暴露内部接口
if (process.env.NODE_ENV === "development") {
  const internalAPI = API.getInternalAccess(api);
  console.log("内部数据:", internalAPI.getInternal());
}

console.log();

// =============================================
// 8. Symbol与序列化
// =============================================

console.log("8. Symbol与序列化");

// Symbol属性不会被JSON序列化
const dataWithSymbols = {
  name: "张三",
  age: 30,
  [Symbol("secret")]: "机密信息",
  [Symbol("id")]: 12345,
};

console.log("原始对象:", dataWithSymbols);
console.log("JSON序列化:", JSON.stringify(dataWithSymbols)); // Symbol属性被忽略

// 自定义序列化方法
class SerializableWithSymbols {
  constructor(data) {
    this.publicData = data.public;
    this[Symbol("private")] = data.private;
    this[Symbol("secret")] = data.secret;
  }

  toJSON() {
    const obj = { ...this };
    const symbols = Object.getOwnPropertySymbols(this);

    symbols.forEach((sym) => {
      const key = sym.description;
      if (key && !key.startsWith("secret")) {
        obj[`__symbol_${key}`] = this[sym];
      }
    });

    return obj;
  }

  static fromJSON(json) {
    const instance = Object.create(SerializableWithSymbols.prototype);

    Object.keys(json).forEach((key) => {
      if (key.startsWith("__symbol_")) {
        const symbolKey = Symbol(key.replace("__symbol_", ""));
        instance[symbolKey] = json[key];
      } else {
        instance[key] = json[key];
      }
    });

    return instance;
  }
}

const serializableObj = new SerializableWithSymbols({
  public: "公开数据",
  private: "私有数据",
  secret: "秘密数据",
});

console.log("自定义序列化:");
const serialized = JSON.stringify(serializableObj);
console.log("序列化结果:", serialized);

const deserialized = SerializableWithSymbols.fromJSON(JSON.parse(serialized));
console.log("反序列化对象:", deserialized);

console.log();

// =============================================
// 9. Symbol性能考虑
// =============================================

console.log("9. Symbol性能考虑");

// Symbol创建性能测试
function symbolPerformanceTest() {
  const iterations = 10000;

  // 测试Symbol创建
  console.time("Symbol创建");
  for (let i = 0; i < iterations; i++) {
    Symbol(`test_${i}`);
  }
  console.timeEnd("Symbol创建");

  // 测试全局Symbol创建
  console.time("全局Symbol创建");
  for (let i = 0; i < iterations; i++) {
    Symbol.for(`global_test_${i}`);
  }
  console.timeEnd("全局Symbol创建");

  // 测试Symbol属性访问
  const testObj = {};
  const symbols = [];
  for (let i = 0; i < 1000; i++) {
    const sym = Symbol(`prop_${i}`);
    testObj[sym] = i;
    symbols.push(sym);
  }

  console.time("Symbol属性访问");
  for (let i = 0; i < iterations; i++) {
    const sym = symbols[i % symbols.length];
    const value = testObj[sym];
  }
  console.timeEnd("Symbol属性访问");

  // 测试字符串属性访问对比
  const stringObj = {};
  for (let i = 0; i < 1000; i++) {
    stringObj[`prop_${i}`] = i;
  }

  console.time("字符串属性访问");
  for (let i = 0; i < iterations; i++) {
    const key = `prop_${i % 1000}`;
    const value = stringObj[key];
  }
  console.timeEnd("字符串属性访问");
}

symbolPerformanceTest();

// 内存使用监控
function symbolMemoryUsage() {
  const symbols = [];
  const startTime = Date.now();

  // 创建大量Symbol
  for (let i = 0; i < 10000; i++) {
    symbols.push(Symbol(`memory_test_${i}`));
  }

  const endTime = Date.now();
  console.log(`创建10000个Symbol耗时: ${endTime - startTime}ms`);
  console.log(`Symbol数组长度: ${symbols.length}`);

  // 清理引用
  symbols.length = 0;
  console.log("Symbol引用已清理");
}

symbolMemoryUsage();

console.log();

// =============================================
// 10. 最佳实践总结
// =============================================

console.log("10. 最佳实践总结");

console.log(`
Symbol最佳实践:

1. 使用场景:
   - 创建私有属性和方法
   - 定义唯一的常量标识符
   - 实现元编程和内置协议
   - 避免属性名冲突

2. 性能考虑:
   - Symbol创建有一定开销
   - 全局Symbol注册表查找需要时间
   - Symbol属性访问略慢于字符串属性
   - 避免在性能关键路径大量使用

3. 设计原则:
   - 为Symbol提供有意义的描述
   - 使用全局Symbol实现跨模块通信
   - 合理组织Symbol命名空间
   - 文档化Symbol的用途

4. 调试友好:
   - 使用描述性的Symbol描述
   - 提供调试时的Symbol访问方式
   - 在开发环境暴露内部Symbol
   - 记录Symbol的用途和生命周期

5. 安全考虑:
   - Symbol不能完全保证私有性
   - 可通过Object.getOwnPropertySymbols访问
   - 结合Proxy可增强隐私保护
   - 避免将敏感Symbol暴露到全局

常见陷阱:
- Symbol不会被JSON序列化
- Symbol('key') !== Symbol('key')
- 忘记使用Symbol.for创建全局Symbol
- 过度使用Symbol影响可读性
- 在for...in循环中Symbol不可枚举

使用建议:
- 库和框架的内部API设计
- 插件系统的扩展点标识
- 状态管理中的动作类型
- 组件系统的生命周期钩子
- 元数据和配置标识
`);

// 导出供测试使用
module.exports = {
  idSymbol,
  nameSymbol,
  secretSymbol,
  EventBus,
  NumberRange,
  CustomClass,
  SpecialArray,
  Temperature,
  Singleton,
  SingletonSymbol,
  ObserverEvents,
  Observable,
  MetaClass,
  privateMethod,
  privateData,
  APINamespace,
  API,
  SerializableWithSymbols,
  symbolPerformanceTest,
  symbolMemoryUsage,
};

console.log("Symbol演示完成\n");
