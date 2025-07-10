/**
 * JavaScript高级程序设计 - 第5章：事件处理
 *
 * 本文件演示JavaScript事件处理的各种模式和技巧
 */

console.log("=== JavaScript 事件处理 ===\n");

// =============================================
// 1. 事件基础
// =============================================

console.log("1. 事件基础");

// 模拟事件系统
class EventSystem {
  constructor() {
    this.listeners = new Map();
    this.eventQueue = [];
  }

  addEventListener(target, type, listener, options = {}) {
    const key = `${target.id || "anonymous"}-${type}`;
    if (!this.listeners.has(key)) {
      this.listeners.set(key, []);
    }
    this.listeners.get(key).push({ listener, options });
    console.log(`添加事件监听器: ${key}`);
  }

  removeEventListener(target, type, listener) {
    const key = `${target.id || "anonymous"}-${type}`;
    const listeners = this.listeners.get(key);
    if (listeners) {
      const index = listeners.findIndex((l) => l.listener === listener);
      if (index > -1) {
        listeners.splice(index, 1);
        console.log(`移除事件监听器: ${key}`);
      }
    }
  }

  dispatchEvent(target, event) {
    const key = `${target.id || "anonymous"}-${event.type}`;
    const listeners = this.listeners.get(key);
    if (listeners) {
      listeners.forEach(({ listener, options }) => {
        if (options.once) {
          this.removeEventListener(target, event.type, listener);
        }
        try {
          listener.call(target, event);
        } catch (error) {
          console.error("事件处理器错误:", error);
        }
      });
    }
  }
}

// 模拟DOM元素
class MockElement {
  constructor(tagName, id) {
    this.tagName = tagName;
    this.id = id;
    this.children = [];
    this.parent = null;
    this.attributes = {};
    this.style = {};
    this.classList = new Set();
  }

  appendChild(child) {
    this.children.push(child);
    child.parent = this;
  }

  addEventListener(type, listener, options) {
    eventSystem.addEventListener(this, type, listener, options);
  }

  removeEventListener(type, listener) {
    eventSystem.removeEventListener(this, type, listener);
  }

  dispatchEvent(event) {
    eventSystem.dispatchEvent(this, event);
  }
}

// 模拟事件对象
class MockEvent {
  constructor(type, options = {}) {
    this.type = type;
    this.target = options.target || null;
    this.currentTarget = options.currentTarget || null;
    this.bubbles = options.bubbles || false;
    this.cancelable = options.cancelable || false;
    this.defaultPrevented = false;
    this.propagationStopped = false;
    this.immediatePropagationStopped = false;
    this.timestamp = Date.now();
  }

  preventDefault() {
    if (this.cancelable) {
      this.defaultPrevented = true;
      console.log("默认行为已阻止");
    }
  }

  stopPropagation() {
    this.propagationStopped = true;
    console.log("事件冒泡已停止");
  }

  stopImmediatePropagation() {
    this.immediatePropagationStopped = true;
    console.log("事件传播立即停止");
  }
}

const eventSystem = new EventSystem();

// 基础事件示例
const button = new MockElement("button", "testButton");

function clickHandler(event) {
  console.log(
    `按钮被点击! 时间: ${new Date(event.timestamp).toLocaleTimeString()}`
  );
}

button.addEventListener("click", clickHandler);
button.dispatchEvent(new MockEvent("click", { target: button }));

console.log();

// =============================================
// 2. 事件类型和属性
// =============================================

console.log("2. 事件类型和属性");

// 鼠标事件模拟
class MouseEvent extends MockEvent {
  constructor(type, options = {}) {
    super(type, options);
    this.clientX = options.clientX || 0;
    this.clientY = options.clientY || 0;
    this.button = options.button || 0;
    this.buttons = options.buttons || 0;
    this.ctrlKey = options.ctrlKey || false;
    this.shiftKey = options.shiftKey || false;
    this.altKey = options.altKey || false;
    this.metaKey = options.metaKey || false;
  }
}

// 键盘事件模拟
class KeyboardEvent extends MockEvent {
  constructor(type, options = {}) {
    super(type, options);
    this.key = options.key || "";
    this.code = options.code || "";
    this.keyCode = options.keyCode || 0;
    this.ctrlKey = options.ctrlKey || false;
    this.shiftKey = options.shiftKey || false;
    this.altKey = options.altKey || false;
    this.metaKey = options.metaKey || false;
  }
}

const mouseElement = new MockElement("div", "mouseTarget");

// 鼠标事件处理
mouseElement.addEventListener("mousedown", (event) => {
  console.log(
    `鼠标按下: (${event.clientX}, ${event.clientY}), 按钮: ${event.button}`
  );
});

mouseElement.addEventListener("mousemove", (event) => {
  console.log(`鼠标移动: (${event.clientX}, ${event.clientY})`);
});

mouseElement.addEventListener("mouseup", (event) => {
  console.log(`鼠标释放: (${event.clientX}, ${event.clientY})`);
});

// 模拟鼠标操作序列
console.log("模拟鼠标操作:");
mouseElement.dispatchEvent(
  new MouseEvent("mousedown", {
    target: mouseElement,
    clientX: 100,
    clientY: 200,
    button: 0,
  })
);

mouseElement.dispatchEvent(
  new MouseEvent("mousemove", {
    target: mouseElement,
    clientX: 150,
    clientY: 250,
  })
);

mouseElement.dispatchEvent(
  new MouseEvent("mouseup", {
    target: mouseElement,
    clientX: 150,
    clientY: 250,
    button: 0,
  })
);

// 键盘事件处理
const inputElement = new MockElement("input", "keyboardTarget");

inputElement.addEventListener("keydown", (event) => {
  console.log(`键盘按下: ${event.key} (${event.code})`);
  if (event.key === "Enter") {
    console.log("回车键按下，执行提交操作");
  }
});

inputElement.addEventListener("keyup", (event) => {
  console.log(`键盘释放: ${event.key}`);
});

console.log("\n模拟键盘操作:");
inputElement.dispatchEvent(
  new KeyboardEvent("keydown", {
    target: inputElement,
    key: "a",
    code: "KeyA",
    keyCode: 65,
  })
);

inputElement.dispatchEvent(
  new KeyboardEvent("keydown", {
    target: inputElement,
    key: "Enter",
    code: "Enter",
    keyCode: 13,
  })
);

console.log();

// =============================================
// 3. 事件委托
// =============================================

console.log("3. 事件委托");

class EventDelegation {
  constructor(container) {
    this.container = container;
    this.delegatedEvents = new Map();
    this.setupDelegation();
  }

  setupDelegation() {
    this.container.addEventListener("click", (event) => {
      this.handleDelegatedEvent("click", event);
    });

    this.container.addEventListener("change", (event) => {
      this.handleDelegatedEvent("change", event);
    });
  }

  delegate(selector, eventType, handler) {
    const key = `${selector}-${eventType}`;
    this.delegatedEvents.set(key, handler);
    console.log(`注册委托事件: ${key}`);
  }

  handleDelegatedEvent(eventType, event) {
    for (const [key, handler] of this.delegatedEvents) {
      const [selector, type] = key.split("-");
      if (type === eventType && this.matchesSelector(event.target, selector)) {
        handler.call(event.target, event);
      }
    }
  }

  matchesSelector(element, selector) {
    if (selector.startsWith(".")) {
      return element.classList.has(selector.slice(1));
    }
    if (selector.startsWith("#")) {
      return element.id === selector.slice(1);
    }
    return element.tagName.toLowerCase() === selector.toLowerCase();
  }
}

// 创建容器和子元素
const container = new MockElement("div", "container");
const delegation = new EventDelegation(container);

// 注册委托事件
delegation.delegate("button", "click", function (event) {
  console.log(`委托处理按钮点击: ${this.id}`);
});

delegation.delegate(".item", "click", function (event) {
  console.log(`委托处理项目点击: ${this.id}`);
});

// 创建动态按钮
function createDynamicButton(id, text) {
  const button = new MockElement("button", id);
  button.textContent = text;
  container.appendChild(button);
  return button;
}

function createDynamicItem(id, text) {
  const item = new MockElement("div", id);
  item.classList.add("item");
  item.textContent = text;
  container.appendChild(item);
  return item;
}

const btn1 = createDynamicButton("btn1", "按钮1");
const btn2 = createDynamicButton("btn2", "按钮2");
const item1 = createDynamicItem("item1", "项目1");
const item2 = createDynamicItem("item2", "项目2");

console.log("测试事件委托:");
btn1.dispatchEvent(new MockEvent("click", { target: btn1 }));
item1.dispatchEvent(new MockEvent("click", { target: item1 }));

console.log();

// =============================================
// 4. 自定义事件
// =============================================

console.log("4. 自定义事件");

class CustomEvent extends MockEvent {
  constructor(type, options = {}) {
    super(type, options);
    this.detail = options.detail || null;
  }
}

class EventPublisher {
  constructor() {
    this.element = new MockElement("div", "publisher");
    this.subscribers = new Map();
  }

  subscribe(eventType, callback) {
    if (!this.subscribers.has(eventType)) {
      this.subscribers.set(eventType, []);
    }
    this.subscribers.get(eventType).push(callback);

    this.element.addEventListener(eventType, callback);
    console.log(`订阅事件: ${eventType}`);
  }

  unsubscribe(eventType, callback) {
    const callbacks = this.subscribers.get(eventType);
    if (callbacks) {
      const index = callbacks.indexOf(callback);
      if (index > -1) {
        callbacks.splice(index, 1);
        this.element.removeEventListener(eventType, callback);
        console.log(`取消订阅事件: ${eventType}`);
      }
    }
  }

  publish(eventType, data) {
    const event = new CustomEvent(eventType, {
      detail: data,
      bubbles: true,
      cancelable: true,
    });

    this.element.dispatchEvent(event);
    console.log(`发布事件: ${eventType}`, data);
  }
}

// 使用发布订阅模式
const publisher = new EventPublisher();

// 订阅自定义事件
publisher.subscribe("userLogin", (event) => {
  console.log("用户登录事件处理:", event.detail);
});

publisher.subscribe("dataUpdate", (event) => {
  console.log("数据更新事件处理:", event.detail);
});

// 发布事件
publisher.publish("userLogin", {
  userId: 123,
  username: "john_doe",
  timestamp: Date.now(),
});

publisher.publish("dataUpdate", {
  table: "users",
  operation: "insert",
  recordId: 456,
});

console.log();

// =============================================
// 5. 事件性能优化
// =============================================

console.log("5. 事件性能优化");

// 事件池
class EventPool {
  constructor() {
    this.pools = new Map();
  }

  getEvent(type) {
    if (!this.pools.has(type)) {
      this.pools.set(type, []);
    }

    const pool = this.pools.get(type);
    if (pool.length > 0) {
      return pool.pop();
    }

    return new MockEvent(type);
  }

  releaseEvent(event) {
    const pool = this.pools.get(event.type) || [];
    if (pool.length < 50) {
      // 限制池大小
      // 重置事件属性
      event.target = null;
      event.currentTarget = null;
      event.defaultPrevented = false;
      event.propagationStopped = false;

      pool.push(event);
    }

    this.pools.set(event.type, pool);
  }

  getStats() {
    const stats = {};
    for (const [type, pool] of this.pools) {
      stats[type] = pool.length;
    }
    return stats;
  }
}

const eventPool = new EventPool();

// 防抖和节流在事件处理中的应用
function debounce(func, wait, immediate = false) {
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

// 滚动事件优化示例
const scrollElement = new MockElement("div", "scrollContainer");

const handleScroll = throttle((event) => {
  console.log("滚动处理 - 时间:", new Date().toLocaleTimeString());
}, 100);

const handleResize = debounce((event) => {
  console.log("窗口大小变化处理 - 时间:", new Date().toLocaleTimeString());
}, 250);

scrollElement.addEventListener("scroll", handleScroll);
scrollElement.addEventListener("resize", handleResize);

// 模拟滚动事件
console.log("模拟滚动事件:");
for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    scrollElement.dispatchEvent(
      new MockEvent("scroll", { target: scrollElement })
    );
  }, i * 50);
}

// 模拟窗口大小变化事件
console.log("模拟窗口大小变化事件:");
for (let i = 0; i < 3; i++) {
  setTimeout(() => {
    scrollElement.dispatchEvent(
      new MockEvent("resize", { target: scrollElement })
    );
  }, i * 100);
}

console.log("事件池统计:", eventPool.getStats());

console.log();

// =============================================
// 6. 异步事件处理
// =============================================

console.log("6. 异步事件处理");

class AsyncEventHandler {
  constructor() {
    this.eventQueue = [];
    this.processing = false;
  }

  async handleEvent(event, handler) {
    return new Promise((resolve, reject) => {
      this.eventQueue.push({
        event,
        handler,
        resolve,
        reject,
      });

      this.processQueue();
    });
  }

  async processQueue() {
    if (this.processing || this.eventQueue.length === 0) {
      return;
    }

    this.processing = true;

    while (this.eventQueue.length > 0) {
      const { event, handler, resolve, reject } = this.eventQueue.shift();

      try {
        const result = await handler(event);
        resolve(result);
      } catch (error) {
        reject(error);
      }
    }

    this.processing = false;
  }
}

const asyncHandler = new AsyncEventHandler();

// 异步事件处理器
async function asyncClickHandler(event) {
  console.log("异步处理开始...");

  // 模拟异步操作
  await new Promise((resolve) => setTimeout(resolve, 500));

  console.log("异步处理完成:", event.type);
  return `处理结果: ${event.type}`;
}

// 测试异步事件处理
const asyncButton = new MockElement("button", "asyncButton");

asyncButton.addEventListener("click", async (event) => {
  try {
    const result = await asyncHandler.handleEvent(event, asyncClickHandler);
    console.log("异步事件结果:", result);
  } catch (error) {
    console.error("异步事件错误:", error);
  }
});

console.log("触发异步事件:");
asyncButton.dispatchEvent(new MockEvent("click", { target: asyncButton }));

console.log();

// =============================================
// 7. 错误处理和调试
// =============================================

console.log("7. 错误处理和调试");

class EventErrorHandler {
  constructor() {
    this.errorCallbacks = [];
    this.eventLog = [];
    this.maxLogSize = 100;
  }

  onError(callback) {
    this.errorCallbacks.push(callback);
  }

  logEvent(event, handler, error = null) {
    const logEntry = {
      timestamp: Date.now(),
      eventType: event.type,
      target: event.target?.id || "unknown",
      handler: handler.name || "anonymous",
      error: error?.message || null,
    };

    this.eventLog.push(logEntry);

    if (this.eventLog.length > this.maxLogSize) {
      this.eventLog.shift();
    }

    if (error) {
      this.errorCallbacks.forEach((callback) => {
        try {
          callback(error, logEntry);
        } catch (callbackError) {
          console.error("错误回调本身出错:", callbackError);
        }
      });
    }
  }

  wrapHandler(handler) {
    return (event) => {
      try {
        const result = handler(event);
        this.logEvent(event, handler);
        return result;
      } catch (error) {
        this.logEvent(event, handler, error);
        throw error;
      }
    };
  }

  getEventLog() {
    return [...this.eventLog];
  }

  clearLog() {
    this.eventLog = [];
  }
}

const errorHandler = new EventErrorHandler();

// 注册错误回调
errorHandler.onError((error, logEntry) => {
  console.error(`事件处理错误: ${error.message}`);
  console.error(`事件信息:`, logEntry);
});

// 可能出错的事件处理器
function faultyHandler(event) {
  if (Math.random() < 0.5) {
    throw new Error("随机错误发生");
  }
  console.log("事件处理成功:", event.type);
}

// 包装处理器
const safeHandler = errorHandler.wrapHandler(faultyHandler);

const testElement = new MockElement("div", "testElement");
testElement.addEventListener("test", safeHandler);

// 测试错误处理
console.log("测试错误处理:");
for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    try {
      testElement.dispatchEvent(new MockEvent("test", { target: testElement }));
    } catch (error) {
      // 错误已被错误处理器处理
    }
  }, i * 200);
}

setTimeout(() => {
  console.log("事件日志条目数:", errorHandler.getEventLog().length);
}, 1500);

console.log();

// =============================================
// 8. 触摸和手势事件
// =============================================

console.log("8. 触摸和手势事件");

class TouchEvent extends MockEvent {
  constructor(type, options = {}) {
    super(type, options);
    this.touches = options.touches || [];
    this.targetTouches = options.targetTouches || [];
    this.changedTouches = options.changedTouches || [];
  }
}

class Touch {
  constructor(identifier, target, clientX, clientY) {
    this.identifier = identifier;
    this.target = target;
    this.clientX = clientX;
    this.clientY = clientY;
    this.pageX = clientX;
    this.pageY = clientY;
  }
}

class GestureRecognizer {
  constructor(element) {
    this.element = element;
    this.touches = new Map();
    this.startTime = 0;
    this.setupTouchEvents();
  }

  setupTouchEvents() {
    this.element.addEventListener(
      "touchstart",
      this.handleTouchStart.bind(this)
    );
    this.element.addEventListener("touchmove", this.handleTouchMove.bind(this));
    this.element.addEventListener("touchend", this.handleTouchEnd.bind(this));
  }

  handleTouchStart(event) {
    this.startTime = Date.now();
    event.changedTouches.forEach((touch) => {
      this.touches.set(touch.identifier, {
        startX: touch.clientX,
        startY: touch.clientY,
        currentX: touch.clientX,
        currentY: touch.clientY,
      });
    });

    console.log(`触摸开始: ${event.changedTouches.length}个触点`);
  }

  handleTouchMove(event) {
    event.changedTouches.forEach((touch) => {
      const touchData = this.touches.get(touch.identifier);
      if (touchData) {
        touchData.currentX = touch.clientX;
        touchData.currentY = touch.clientY;
      }
    });

    this.recognizeGesture(event);
  }

  handleTouchEnd(event) {
    const duration = Date.now() - this.startTime;

    event.changedTouches.forEach((touch) => {
      const touchData = this.touches.get(touch.identifier);
      if (touchData) {
        const deltaX = touchData.currentX - touchData.startX;
        const deltaY = touchData.currentY - touchData.startY;
        const distance = Math.sqrt(deltaX * deltaX + deltaY * deltaY);

        if (duration < 300 && distance < 10) {
          this.dispatchGesture("tap", { x: touch.clientX, y: touch.clientY });
        } else if (distance > 30) {
          this.recognizeSwipe(deltaX, deltaY);
        }

        this.touches.delete(touch.identifier);
      }
    });

    console.log(`触摸结束: 持续时间${duration}ms`);
  }

  recognizeSwipe(deltaX, deltaY) {
    const absX = Math.abs(deltaX);
    const absY = Math.abs(deltaY);

    if (absX > absY) {
      const direction = deltaX > 0 ? "right" : "left";
      this.dispatchGesture("swipe", { direction, distance: absX });
    } else {
      const direction = deltaY > 0 ? "down" : "up";
      this.dispatchGesture("swipe", { direction, distance: absY });
    }
  }

  recognizeGesture(event) {
    if (this.touches.size === 2) {
      const touchArray = Array.from(this.touches.values());
      const touch1 = touchArray[0];
      const touch2 = touchArray[1];

      const distance = Math.sqrt(
        Math.pow(touch1.currentX - touch2.currentX, 2) +
          Math.pow(touch1.currentY - touch2.currentY, 2)
      );

      // 简单的捏放手势识别
      console.log(`双指距离: ${distance.toFixed(2)}`);
    }
  }

  dispatchGesture(type, detail) {
    const gestureEvent = new CustomEvent(`gesture${type}`, { detail });
    this.element.dispatchEvent(gestureEvent);
    console.log(`识别手势: ${type}`, detail);
  }
}

// 创建触摸元素
const touchElement = new MockElement("div", "touchArea");
const gestureRecognizer = new GestureRecognizer(touchElement);

// 注册手势事件
touchElement.addEventListener("gesturetap", (event) => {
  console.log("点击手势:", event.detail);
});

touchElement.addEventListener("gestureswipe", (event) => {
  console.log("滑动手势:", event.detail);
});

// 模拟触摸序列
console.log("模拟触摸事件:");

// 模拟点击
const tapTouch = new Touch(1, touchElement, 100, 100);
touchElement.dispatchEvent(
  new TouchEvent("touchstart", {
    changedTouches: [tapTouch],
    target: touchElement,
  })
);

setTimeout(() => {
  touchElement.dispatchEvent(
    new TouchEvent("touchend", {
      changedTouches: [tapTouch],
      target: touchElement,
    })
  );
}, 100);

// 模拟滑动
setTimeout(() => {
  const swipeTouch = new Touch(2, touchElement, 50, 50);
  touchElement.dispatchEvent(
    new TouchEvent("touchstart", {
      changedTouches: [swipeTouch],
      target: touchElement,
    })
  );

  setTimeout(() => {
    swipeTouch.clientX = 150;
    touchElement.dispatchEvent(
      new TouchEvent("touchmove", {
        changedTouches: [swipeTouch],
        target: touchElement,
      })
    );

    setTimeout(() => {
      touchElement.dispatchEvent(
        new TouchEvent("touchend", {
          changedTouches: [swipeTouch],
          target: touchElement,
        })
      );
    }, 100);
  }, 50);
}, 500);

console.log();

// =============================================
// 9. 事件监控和分析
// =============================================

console.log("9. 事件监控和分析");

class EventAnalytics {
  constructor() {
    this.metrics = new Map();
    this.heatmap = new Map();
    this.userSessions = [];
    this.currentSession = null;
  }

  startSession(sessionId) {
    this.currentSession = {
      id: sessionId,
      startTime: Date.now(),
      events: [],
      interactions: 0,
    };
    console.log(`开始会话: ${sessionId}`);
  }

  endSession() {
    if (this.currentSession) {
      this.currentSession.endTime = Date.now();
      this.currentSession.duration =
        this.currentSession.endTime - this.currentSession.startTime;
      this.userSessions.push(this.currentSession);
      console.log(
        `结束会话: ${this.currentSession.id}, 持续: ${this.currentSession.duration}ms`
      );
      this.currentSession = null;
    }
  }

  trackEvent(element, event) {
    const eventKey = `${element.tagName}-${event.type}`;

    // 更新事件计数
    const count = this.metrics.get(eventKey) || 0;
    this.metrics.set(eventKey, count + 1);

    // 更新热力图
    if (event.clientX !== undefined && event.clientY !== undefined) {
      const positionKey = `${Math.floor(event.clientX / 50)}-${Math.floor(
        event.clientY / 50
      )}`;
      const heatCount = this.heatmap.get(positionKey) || 0;
      this.heatmap.set(positionKey, heatCount + 1);
    }

    // 记录到当前会话
    if (this.currentSession) {
      this.currentSession.events.push({
        timestamp: Date.now(),
        element: element.id || element.tagName,
        eventType: event.type,
        x: event.clientX,
        y: event.clientY,
      });
      this.currentSession.interactions++;
    }
  }

  getMetrics() {
    return {
      eventCounts: Object.fromEntries(this.metrics),
      heatmapData: Object.fromEntries(this.heatmap),
      sessionCount: this.userSessions.length,
      avgSessionDuration: this.getAverageSessionDuration(),
      totalInteractions: this.getTotalInteractions(),
    };
  }

  getAverageSessionDuration() {
    if (this.userSessions.length === 0) return 0;
    const total = this.userSessions.reduce(
      (sum, session) => sum + (session.duration || 0),
      0
    );
    return total / this.userSessions.length;
  }

  getTotalInteractions() {
    return this.userSessions.reduce(
      (sum, session) => sum + session.interactions,
      0
    );
  }

  generateReport() {
    const metrics = this.getMetrics();
    console.log("\n=== 事件分析报告 ===");
    console.log("事件统计:", metrics.eventCounts);
    console.log("热力图数据:", metrics.heatmapData);
    console.log("会话数量:", metrics.sessionCount);
    console.log("平均会话时长:", metrics.avgSessionDuration.toFixed(2), "ms");
    console.log("总交互次数:", metrics.totalInteractions);
  }
}

const analytics = new EventAnalytics();

// 创建分析包装器
function createAnalyticsWrapper(element) {
  const originalAddEventListener = element.addEventListener.bind(element);

  element.addEventListener = function (type, listener, options) {
    const wrappedListener = function (event) {
      analytics.trackEvent(element, event);
      return listener.call(this, event);
    };

    return originalAddEventListener(type, wrappedListener, options);
  };
}

// 创建测试元素并包装
const analyticsButton = new MockElement("button", "analyticsButton");
createAnalyticsWrapper(analyticsButton);

analyticsButton.addEventListener("click", (event) => {
  console.log("分析按钮被点击");
});

// 开始会话并模拟用户交互
analytics.startSession("session-001");

for (let i = 0; i < 5; i++) {
  setTimeout(() => {
    analyticsButton.dispatchEvent(
      new MouseEvent("click", {
        target: analyticsButton,
        clientX: 100 + i * 10,
        clientY: 100 + i * 5,
      })
    );
  }, i * 200);
}

setTimeout(() => {
  analytics.endSession();
  analytics.generateReport();
}, 1500);

console.log();

// =============================================
// 10. 最佳实践总结
// =============================================

console.log("10. 最佳实践总结");

console.log(`
事件处理最佳实践:

1. 性能优化:
   - 使用事件委托减少监听器数量
   - 对高频事件使用防抖和节流
   - 及时移除不需要的事件监听器
   - 使用passive监听器提高滚动性能

2. 错误处理:
   - 包装事件处理器进行错误捕获
   - 提供优雅的错误降级
   - 记录事件处理错误用于调试

3. 代码组织:
   - 分离事件逻辑和业务逻辑
   - 使用事件系统进行组件通信
   - 创建可重用的事件处理工具

4. 用户体验:
   - 提供即时的视觉反馈
   - 处理边缘情况和异常状态
   - 支持键盘导航和无障碍访问

5. 调试和监控:
   - 记录关键事件用于分析
   - 使用事件时序分析性能
   - 监控事件处理错误率

常见陷阱:
- 忘记移除事件监听器导致内存泄漏
- 高频事件没有节流导致性能问题
- 事件处理器中的错误传播
- 不正确的事件对象使用

工具推荐:
- 浏览器开发者工具Event Listeners面板
- 性能监控工具(Performance Observer)
- 事件调试库(EventSource, Custom Events)
- 手势识别库(Hammer.js, Interact.js)
`);

// 导出供测试使用
module.exports = {
  MockElement,
  MockEvent,
  MouseEvent,
  KeyboardEvent,
  TouchEvent,
  EventDelegation,
  EventPublisher,
  GestureRecognizer,
  EventAnalytics,
  debounce,
  throttle,
};
