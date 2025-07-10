/**
 * JavaScript高级程序设计 - 第5章：DOM操作
 *
 * 本文件演示DOM元素的创建、修改、删除和操作
 */

console.log("=== JavaScript DOM操作 ===\n");

// =============================================
// 1. DOM基础操作
// =============================================

console.log("1. DOM基础操作");

// 由于这是Node.js环境，我们需要模拟DOM环境
// 在实际浏览器环境中，可以直接使用document对象

// 模拟DOM环境
class MockElement {
  constructor(tagName) {
    this.tagName = tagName.toLowerCase();
    this.attributes = {};
    this.children = [];
    this.parentNode = null;
    this.textContent = "";
    this.innerHTML = "";
    this.style = {};
    this.classList = new MockClassList();
    this.eventListeners = {};
  }

  getAttribute(name) {
    return this.attributes[name] || null;
  }

  setAttribute(name, value) {
    this.attributes[name] = value;
  }

  removeAttribute(name) {
    delete this.attributes[name];
  }

  appendChild(child) {
    this.children.push(child);
    child.parentNode = this;
    return child;
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
      child.parentNode = null;
    }
    return child;
  }

  querySelector(selector) {
    // 简化实现
    for (const child of this.children) {
      if (this.matchesSelector(child, selector)) {
        return child;
      }
    }
    return null;
  }

  querySelectorAll(selector) {
    const results = [];
    for (const child of this.children) {
      if (this.matchesSelector(child, selector)) {
        results.push(child);
      }
    }
    return results;
  }

  matchesSelector(element, selector) {
    if (selector.startsWith(".")) {
      return element.classList.contains(selector.slice(1));
    }
    if (selector.startsWith("#")) {
      return element.getAttribute("id") === selector.slice(1);
    }
    return element.tagName === selector.toUpperCase();
  }

  addEventListener(event, callback) {
    if (!this.eventListeners[event]) {
      this.eventListeners[event] = [];
    }
    this.eventListeners[event].push(callback);
  }

  removeEventListener(event, callback) {
    if (this.eventListeners[event]) {
      const index = this.eventListeners[event].indexOf(callback);
      if (index > -1) {
        this.eventListeners[event].splice(index, 1);
      }
    }
  }

  dispatchEvent(event) {
    if (this.eventListeners[event.type]) {
      this.eventListeners[event.type].forEach((callback) => {
        callback(event);
      });
    }
  }

  cloneNode(deep = false) {
    const clone = new MockElement(this.tagName);
    clone.attributes = { ...this.attributes };
    clone.textContent = this.textContent;
    clone.innerHTML = this.innerHTML;

    if (deep) {
      this.children.forEach((child) => {
        clone.appendChild(child.cloneNode(true));
      });
    }

    return clone;
  }
}

class MockClassList {
  constructor() {
    this.classes = new Set();
  }

  add(...classes) {
    classes.forEach((cls) => this.classes.add(cls));
  }

  remove(...classes) {
    classes.forEach((cls) => this.classes.delete(cls));
  }

  toggle(className) {
    if (this.classes.has(className)) {
      this.classes.delete(className);
      return false;
    } else {
      this.classes.add(className);
      return true;
    }
  }

  contains(className) {
    return this.classes.has(className);
  }

  toString() {
    return Array.from(this.classes).join(" ");
  }
}

const mockDocument = {
  createElement(tagName) {
    return new MockElement(tagName);
  },

  getElementById(id) {
    // 简化实现
    return this.querySelector(`#${id}`);
  },

  querySelector(selector) {
    // 简化实现，在实际应用中会遍历整个DOM树
    return null;
  },

  querySelectorAll(selector) {
    // 简化实现
    return [];
  },
};

// 基本元素创建和操作
console.log("创建DOM元素:");
const div = mockDocument.createElement("div");
div.setAttribute("id", "myDiv");
div.setAttribute("class", "container");
div.textContent = "Hello World";

console.log("元素标签:", div.tagName);
console.log("元素ID:", div.getAttribute("id"));
console.log("元素内容:", div.textContent);

// 修改元素属性
div.setAttribute("data-role", "main");
console.log("自定义属性:", div.getAttribute("data-role"));

console.log();

// =============================================
// 2. 元素创建和插入
// =============================================

console.log("2. 元素创建和插入");

function createElementDemo() {
  // 创建复杂的DOM结构
  const container = mockDocument.createElement("div");
  container.setAttribute("id", "container");
  container.classList.add("main-container");

  // 创建标题
  const title = mockDocument.createElement("h1");
  title.textContent = "动态创建的标题";
  title.classList.add("title");

  // 创建段落
  const paragraph = mockDocument.createElement("p");
  paragraph.innerHTML = "这是一个<strong>动态创建</strong>的段落。";
  paragraph.classList.add("content");

  // 创建列表
  const list = mockDocument.createElement("ul");
  list.classList.add("item-list");

  const items = ["项目1", "项目2", "项目3"];
  items.forEach((itemText, index) => {
    const listItem = mockDocument.createElement("li");
    listItem.textContent = itemText;
    listItem.setAttribute("data-index", index);
    list.appendChild(listItem);
  });

  // 构建DOM结构
  container.appendChild(title);
  container.appendChild(paragraph);
  container.appendChild(list);

  console.log("创建的DOM结构:");
  console.log("容器子元素数量:", container.children.length);
  console.log("列表项数量:", list.children.length);

  return container;
}

const domStructure = createElementDemo();

// 文档片段优化
function createDocumentFragmentDemo() {
  console.log("\n使用文档片段优化性能:");

  // 模拟DocumentFragment
  class MockDocumentFragment {
    constructor() {
      this.children = [];
    }

    appendChild(child) {
      this.children.push(child);
      return child;
    }
  }

  const fragment = new MockDocumentFragment();

  // 批量创建元素
  for (let i = 0; i < 1000; i++) {
    const div = mockDocument.createElement("div");
    div.textContent = `项目 ${i}`;
    fragment.appendChild(div);
  }

  console.log("文档片段中的元素数量:", fragment.children.length);

  // 一次性插入到DOM中（在真实环境中这会更高效）
  const container = mockDocument.createElement("div");
  fragment.children.forEach((child) => container.appendChild(child));

  console.log("容器中的元素数量:", container.children.length);
}

createDocumentFragmentDemo();

console.log();

// =============================================
// 3. 元素查找和遍历
// =============================================

console.log("3. 元素查找和遍历");

function domTraversalDemo() {
  // 创建测试DOM结构
  const root = mockDocument.createElement("div");
  root.setAttribute("id", "root");

  const header = mockDocument.createElement("header");
  header.classList.add("header");

  const nav = mockDocument.createElement("nav");
  nav.classList.add("navigation");

  const main = mockDocument.createElement("main");
  main.classList.add("main-content");

  const footer = mockDocument.createElement("footer");
  footer.classList.add("footer");

  root.appendChild(header);
  root.appendChild(nav);
  root.appendChild(main);
  root.appendChild(footer);

  // 遍历子元素
  console.log("子元素遍历:");
  root.children.forEach((child, index) => {
    console.log(
      `  ${index}: ${child.tagName} (class: ${child.classList.toString()})`
    );
  });

  // 查找特定元素
  const mainElement = root.querySelector("main");
  if (mainElement) {
    console.log("找到main元素:", mainElement.tagName);
  }

  // 查找所有元素
  const allElements = root.querySelectorAll("*");
  console.log("所有子元素数量:", allElements.length);

  return root;
}

const testDOM = domTraversalDemo();

// 高级遍历功能
function advancedTraversal(root) {
  console.log("\n高级遍历功能:");

  // 深度优先遍历
  function depthFirstTraversal(element, callback, depth = 0) {
    callback(element, depth);
    element.children.forEach((child) => {
      depthFirstTraversal(child, callback, depth + 1);
    });
  }

  // 广度优先遍历
  function breadthFirstTraversal(element, callback) {
    const queue = [{ element, depth: 0 }];

    while (queue.length > 0) {
      const { element: current, depth } = queue.shift();
      callback(current, depth);

      current.children.forEach((child) => {
        queue.push({ element: child, depth: depth + 1 });
      });
    }
  }

  console.log("深度优先遍历:");
  depthFirstTraversal(root, (element, depth) => {
    const indent = "  ".repeat(depth);
    console.log(`${indent}${element.tagName}`);
  });

  console.log("\n广度优先遍历:");
  breadthFirstTraversal(root, (element, depth) => {
    console.log(`深度${depth}: ${element.tagName}`);
  });
}

advancedTraversal(testDOM);

console.log();

// =============================================
// 4. 样式操作
// =============================================

console.log("4. 样式操作");

function styleManipulationDemo() {
  const element = mockDocument.createElement("div");
  element.setAttribute("id", "styledElement");

  // 内联样式操作
  element.style.width = "200px";
  element.style.height = "100px";
  element.style.backgroundColor = "#3498db";
  element.style.color = "white";
  element.style.padding = "20px";
  element.style.borderRadius = "5px";

  console.log("设置的样式:");
  console.log("宽度:", element.style.width);
  console.log("背景色:", element.style.backgroundColor);

  // CSS类操作
  element.classList.add("primary");
  element.classList.add("large");
  element.classList.add("animated");

  console.log("CSS类:", element.classList.toString());

  // 类的动态操作
  console.log("包含primary类:", element.classList.contains("primary"));

  element.classList.remove("large");
  console.log("移除large后:", element.classList.toString());

  element.classList.toggle("active");
  console.log("切换active后:", element.classList.toString());

  element.classList.toggle("active");
  console.log("再次切换active后:", element.classList.toString());

  return element;
}

const styledElement = styleManipulationDemo();

// 样式计算和动画
function advancedStyling() {
  console.log("\n高级样式操作:");

  // 样式批量操作
  function applyStyles(element, styles) {
    Object.assign(element.style, styles);
  }

  const animatedElement = mockDocument.createElement("div");

  const baseStyles = {
    position: "absolute",
    width: "50px",
    height: "50px",
    backgroundColor: "#e74c3c",
    borderRadius: "50%",
    transition: "all 0.3s ease",
  };

  applyStyles(animatedElement, baseStyles);
  console.log("应用基础样式完成");

  // 模拟动画帧
  function animateElement(element, keyframes, duration = 1000) {
    const steps = keyframes.length;
    const stepDuration = duration / steps;

    keyframes.forEach((frame, index) => {
      setTimeout(() => {
        applyStyles(element, frame);
        console.log(`动画帧 ${index + 1}:`, frame);
      }, stepDuration * index);
    });
  }

  const animationKeyframes = [
    { left: "0px", top: "0px" },
    { left: "100px", top: "0px" },
    { left: "100px", top: "100px" },
    { left: "0px", top: "100px" },
    { left: "0px", top: "0px" },
  ];

  console.log("开始动画序列...");
  animateElement(animatedElement, animationKeyframes, 2000);
}

advancedStyling();

console.log();

// =============================================
// 5. 事件处理基础
// =============================================

console.log("5. 事件处理基础");

function eventHandlingDemo() {
  const button = mockDocument.createElement("button");
  button.textContent = "点击我";
  button.setAttribute("id", "clickButton");

  // 模拟事件对象
  class MockEvent {
    constructor(type, options = {}) {
      this.type = type;
      this.target = options.target || null;
      this.currentTarget = options.currentTarget || null;
      this.bubbles = options.bubbles || false;
      this.cancelable = options.cancelable || false;
      this.defaultPrevented = false;
      this.timestamp = Date.now();
    }

    preventDefault() {
      if (this.cancelable) {
        this.defaultPrevented = true;
      }
    }

    stopPropagation() {
      console.log("事件传播已停止");
    }

    stopImmediatePropagation() {
      console.log("事件传播立即停止");
    }
  }

  // 添加事件监听器
  const clickHandler = (event) => {
    console.log(`按钮被点击! 事件类型: ${event.type}`);
    console.log(`时间戳: ${event.timestamp}`);
  };

  button.addEventListener("click", clickHandler);

  // 多个监听器
  button.addEventListener("click", () => {
    console.log("第二个点击监听器");
  });

  // 模拟事件触发
  const clickEvent = new MockEvent("click", {
    target: button,
    currentTarget: button,
    bubbles: true,
    cancelable: true,
  });

  console.log("模拟按钮点击:");
  button.dispatchEvent(clickEvent);

  // 移除事件监听器
  button.removeEventListener("click", clickHandler);
  console.log("\n移除第一个监听器后再次点击:");
  button.dispatchEvent(new MockEvent("click", { target: button }));

  return button;
}

const interactiveButton = eventHandlingDemo();

console.log();

// =============================================
// 6. 高级DOM操作
// =============================================

console.log("6. 高级DOM操作");

// DOM克隆
function domCloningDemo() {
  const original = mockDocument.createElement("div");
  original.setAttribute("id", "original");
  original.setAttribute("class", "source");
  original.textContent = "原始元素";

  const child = mockDocument.createElement("span");
  child.textContent = "子元素";
  original.appendChild(child);

  // 浅克隆
  const shallowClone = original.cloneNode(false);
  console.log("浅克隆子元素数量:", shallowClone.children.length);

  // 深克隆
  const deepClone = original.cloneNode(true);
  console.log("深克隆子元素数量:", deepClone.children.length);
  console.log("深克隆内容:", deepClone.textContent);

  return { original, shallowClone, deepClone };
}

const cloneDemo = domCloningDemo();

// DOM操作优化
function optimizedDOMOperations() {
  console.log("\nDOM操作优化技巧:");

  // 批量操作
  function batchDOMOperations() {
    const container = mockDocument.createElement("div");
    const startTime = Date.now();

    // 批量插入元素
    const elements = [];
    for (let i = 0; i < 1000; i++) {
      const element = mockDocument.createElement("div");
      element.textContent = `Element ${i}`;
      elements.push(element);
    }

    // 一次性添加到容器
    elements.forEach((element) => container.appendChild(element));

    const endTime = Date.now();
    console.log(`批量操作1000个元素耗时: ${endTime - startTime}ms`);
    console.log(`容器子元素数量: ${container.children.length}`);

    return container;
  }

  // 虚拟滚动实现
  class VirtualScroller {
    constructor(itemCount, itemHeight, visibleCount) {
      this.itemCount = itemCount;
      this.itemHeight = itemHeight;
      this.visibleCount = visibleCount;
      this.scrollTop = 0;
      this.container = mockDocument.createElement("div");
      this.renderedItems = new Map();
    }

    getVisibleRange() {
      const startIndex = Math.floor(this.scrollTop / this.itemHeight);
      const endIndex = Math.min(startIndex + this.visibleCount, this.itemCount);
      return { startIndex, endIndex };
    }

    render() {
      const { startIndex, endIndex } = this.getVisibleRange();
      console.log(`渲染项目 ${startIndex} 到 ${endIndex}`);

      // 清理不可见的元素
      this.renderedItems.forEach((element, index) => {
        if (index < startIndex || index >= endIndex) {
          this.container.removeChild(element);
          this.renderedItems.delete(index);
        }
      });

      // 创建可见的元素
      for (let i = startIndex; i < endIndex; i++) {
        if (!this.renderedItems.has(i)) {
          const element = mockDocument.createElement("div");
          element.textContent = `虚拟项目 ${i}`;
          element.style.height = `${this.itemHeight}px`;
          element.style.top = `${i * this.itemHeight}px`;

          this.container.appendChild(element);
          this.renderedItems.set(i, element);
        }
      }

      console.log(`当前渲染的DOM元素数量: ${this.renderedItems.size}`);
    }

    scrollTo(scrollTop) {
      this.scrollTop = scrollTop;
      this.render();
    }
  }

  batchDOMOperations();

  // 测试虚拟滚动
  console.log("\n虚拟滚动演示:");
  const scroller = new VirtualScroller(10000, 50, 10);
  scroller.render(); // 初始渲染
  scroller.scrollTo(2500); // 滚动到中间
  scroller.scrollTo(0); // 滚动回顶部
}

optimizedDOMOperations();

console.log();

// =============================================
// 7. 表单操作
// =============================================

console.log("7. 表单操作");

function formHandlingDemo() {
  // 创建表单结构
  const form = mockDocument.createElement("form");
  form.setAttribute("id", "userForm");

  const nameInput = mockDocument.createElement("input");
  nameInput.setAttribute("type", "text");
  nameInput.setAttribute("name", "name");
  nameInput.setAttribute("placeholder", "请输入姓名");

  const emailInput = mockDocument.createElement("input");
  emailInput.setAttribute("type", "email");
  emailInput.setAttribute("name", "email");
  emailInput.setAttribute("placeholder", "请输入邮箱");

  const submitButton = mockDocument.createElement("button");
  submitButton.setAttribute("type", "submit");
  submitButton.textContent = "提交";

  form.appendChild(nameInput);
  form.appendChild(emailInput);
  form.appendChild(submitButton);

  // 表单验证
  function validateForm(formElement) {
    const formData = new FormData();

    // 模拟FormData
    class MockFormData {
      constructor() {
        this.data = new Map();
      }

      append(name, value) {
        this.data.set(name, value);
      }

      get(name) {
        return this.data.get(name);
      }

      entries() {
        return this.data.entries();
      }
    }

    const formData2 = new MockFormData();

    // 收集表单数据
    const inputs = [nameInput, emailInput];
    inputs.forEach((input) => {
      const name = input.getAttribute("name");
      const value = input.value || ""; // 模拟值
      formData2.append(name, value);
    });

    // 验证规则
    const validationRules = {
      name: {
        required: true,
        minLength: 2,
        message: "姓名至少2个字符",
      },
      email: {
        required: true,
        pattern: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        message: "请输入有效的邮箱地址",
      },
    };

    const errors = [];

    for (const [name, value] of formData2.entries()) {
      const rule = validationRules[name];
      if (!rule) continue;

      if (rule.required && !value.trim()) {
        errors.push(`${name}: 此字段必填`);
        continue;
      }

      if (rule.minLength && value.length < rule.minLength) {
        errors.push(`${name}: ${rule.message}`);
      }

      if (rule.pattern && !rule.pattern.test(value)) {
        errors.push(`${name}: ${rule.message}`);
      }
    }

    return { isValid: errors.length === 0, errors, data: formData2 };
  }

  // 添加表单提交事件
  form.addEventListener("submit", (event) => {
    event.preventDefault();
    console.log("表单提交被拦截");

    const validation = validateForm(form);
    if (validation.isValid) {
      console.log("表单验证通过");
      console.log("表单数据:", Array.from(validation.data.entries()));
    } else {
      console.log("表单验证失败:");
      validation.errors.forEach((error) => console.log("  " + error));
    }
  });

  // 模拟表单提交
  console.log("模拟表单提交:");
  nameInput.value = "张三";
  emailInput.value = "zhangsan@example.com";

  const submitEvent = new MockEvent("submit", {
    target: form,
    cancelable: true,
  });
  form.dispatchEvent(submitEvent);

  return form;
}

const testForm = formHandlingDemo();

console.log();

// =============================================
// 8. 动态内容生成
// =============================================

console.log("8. 动态内容生成");

function dynamicContentDemo() {
  // 模板系统
  class SimpleTemplateEngine {
    constructor() {
      this.templates = new Map();
    }

    register(name, template) {
      this.templates.set(name, template);
    }

    render(name, data) {
      const template = this.templates.get(name);
      if (!template) {
        throw new Error(`Template ${name} not found`);
      }

      return template.replace(/\{\{(\w+)\}\}/g, (match, key) => {
        return data[key] || "";
      });
    }

    renderToElement(name, data) {
      const html = this.render(name, data);
      const element = mockDocument.createElement("div");
      element.innerHTML = html;
      return element;
    }
  }

  const templateEngine = new SimpleTemplateEngine();

  // 注册模板
  templateEngine.register(
    "userCard",
    `
        <div class="user-card">
            <h3>{{name}}</h3>
            <p>邮箱: {{email}}</p>
            <p>角色: {{role}}</p>
        </div>
    `
  );

  templateEngine.register(
    "productList",
    `
        <ul class="product-list">
            {{items}}
        </ul>
    `
  );

  // 生成用户卡片
  const userData = {
    name: "李四",
    email: "lisi@example.com",
    role: "管理员",
  };

  const userCard = templateEngine.renderToElement("userCard", userData);
  console.log("生成用户卡片:");
  console.log("卡片HTML:", userCard.innerHTML);

  // 动态列表生成
  function generateDynamicList(items) {
    const container = mockDocument.createElement("div");
    container.classList.add("dynamic-list");

    items.forEach((item, index) => {
      const itemElement = mockDocument.createElement("div");
      itemElement.classList.add("list-item");
      itemElement.setAttribute("data-index", index);

      const title = mockDocument.createElement("h4");
      title.textContent = item.title;

      const description = mockDocument.createElement("p");
      description.textContent = item.description;

      const actions = mockDocument.createElement("div");
      actions.classList.add("actions");

      const editButton = mockDocument.createElement("button");
      editButton.textContent = "编辑";
      editButton.addEventListener("click", () => {
        console.log(`编辑项目: ${item.title}`);
      });

      const deleteButton = mockDocument.createElement("button");
      deleteButton.textContent = "删除";
      deleteButton.addEventListener("click", () => {
        console.log(`删除项目: ${item.title}`);
        container.removeChild(itemElement);
      });

      actions.appendChild(editButton);
      actions.appendChild(deleteButton);

      itemElement.appendChild(title);
      itemElement.appendChild(description);
      itemElement.appendChild(actions);

      container.appendChild(itemElement);
    });

    return container;
  }

  const listItems = [
    { title: "项目A", description: "这是项目A的描述" },
    { title: "项目B", description: "这是项目B的描述" },
    { title: "项目C", description: "这是项目C的描述" },
  ];

  const dynamicList = generateDynamicList(listItems);
  console.log("\n生成动态列表:");
  console.log("列表项数量:", dynamicList.children.length);

  return { templateEngine, dynamicList };
}

const contentDemo = dynamicContentDemo();

console.log();

// =============================================
// 9. 性能优化技巧
// =============================================

console.log("9. 性能优化技巧");

function performanceOptimizationDemo() {
  // 防抖和节流
  function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
      const later = () => {
        clearTimeout(timeout);
        func(...args);
      };
      clearTimeout(timeout);
      timeout = setTimeout(later, wait);
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

  // DOM操作缓存
  class DOMCache {
    constructor() {
      this.cache = new Map();
    }

    get(selector) {
      if (!this.cache.has(selector)) {
        const element = mockDocument.querySelector(selector);
        if (element) {
          this.cache.set(selector, element);
        }
      }
      return this.cache.get(selector);
    }

    clear() {
      this.cache.clear();
    }

    size() {
      return this.cache.size;
    }
  }

  const domCache = new DOMCache();

  // 批量样式更新
  function batchStyleUpdate(element, styles) {
    // 一次性应用所有样式
    const cssText = Object.entries(styles)
      .map(([property, value]) => `${property}: ${value}`)
      .join("; ");

    element.style.cssText = cssText;
    console.log("批量样式更新:", cssText);
  }

  // 测试性能优化
  const testElement = mockDocument.createElement("div");

  // 模拟用户输入事件处理
  const handleInput = debounce((value) => {
    console.log("防抖处理输入:", value);
  }, 300);

  const handleScroll = throttle((scrollTop) => {
    console.log("节流处理滚动:", scrollTop);
  }, 100);

  console.log("测试防抖:");
  ["a", "ab", "abc", "abcd"].forEach((value, index) => {
    setTimeout(() => handleInput(value), index * 100);
  });

  console.log("\n测试节流:");
  [0, 50, 100, 150, 200].forEach((scrollTop, index) => {
    setTimeout(() => handleScroll(scrollTop), index * 50);
  });

  // 测试批量样式更新
  setTimeout(() => {
    console.log("\n测试批量样式更新:");
    batchStyleUpdate(testElement, {
      width: "200px",
      height: "200px",
      "background-color": "#2ecc71",
      "border-radius": "10px",
      transform: "scale(1.1)",
    });
  }, 1000);

  console.log("DOM缓存大小:", domCache.size());

  return { debounce, throttle, DOMCache, batchStyleUpdate };
}

const perfDemo = performanceOptimizationDemo();

console.log();

// =============================================
// 10. 最佳实践总结
// =============================================

console.log("10. 最佳实践总结");

console.log(`
DOM操作最佳实践:

1. 性能优化:
   - 最小化DOM访问，缓存DOM引用
   - 使用文档片段进行批量操作
   - 避免强制重排和重绘
   - 使用事件委托处理大量元素

2. 内存管理:
   - 及时移除事件监听器
   - 避免创建循环引用
   - 合理使用WeakMap和WeakSet

3. 代码组织:
   - 分离DOM操作和业务逻辑
   - 使用模块化管理DOM操作函数
   - 编写可重用的组件

4. 安全考虑:
   - 验证用户输入
   - 避免XSS攻击
   - 使用textContent而不是innerHTML

5. 兼容性:
   - 检查API兼容性
   - 提供优雅降级
   - 使用polyfill填补功能空缺

常见陷阱:
- 频繁的DOM查询和操作
- 忘记清理事件监听器
- 不必要的强制同步布局
- 内存泄漏和循环引用

工具推荐:
- 浏览器开发者工具Performance面板
- DOM Mutation观察器
- 虚拟化库(react-window, vue-virtual-scroll)
- 性能监控工具
`);

// 导出供测试使用
module.exports = {
  MockElement,
  MockClassList,
  createElementDemo: dynamicContentDemo,
  performanceOptimizationDemo: perfDemo,
  debounce: perfDemo.debounce,
  throttle: perfDemo.throttle,
};
