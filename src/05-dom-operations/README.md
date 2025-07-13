# 第 5 章 - DOM 操作

## 📖 章节概述

本章深入介绍 DOM（文档对象模型）操作技术。从基础的 DOM 操作到高级的性能优化技巧，涵盖事件处理、DOM 遍历、虚拟滚动等现代 Web 开发必备技能。

## 🎯 学习目标

- 掌握 DOM 操作的基础和高级技巧
- 理解 DOM 事件机制和事件处理模式
- 学会 DOM 遍历和查找的各种方法
- 掌握 DOM 性能优化的最佳实践
- 了解虚拟 DOM 的概念和实现

## 📁 文件结构

```
05-DOM操作/
├── README.md           # 本文件
├── dom-manipulation.js # DOM操作
├── event-handling.js   # 事件处理
└── dom-traversal.js    # DOM遍历
```

## 📚 内容详解

### 1. dom-manipulation.js - DOM 操作

- **元素选择**: querySelector、querySelectorAll 等选择器
- **元素创建**: createElement、createTextNode、cloneNode
- **元素修改**: innerHTML、textContent、属性操作
- **元素插入**: appendChild、insertBefore、append 等
- **元素移除**: removeChild、remove 等
- **样式操作**: style 属性、classList、CSS 类操作
- **性能优化**: DocumentFragment、批量操作
- **虚拟滚动**: 大数据列表的性能优化

**核心操作示例**:

```javascript
// 高效的DOM操作
const fragment = document.createDocumentFragment();
const items = Array.from({ length: 1000 }, (_, i) => {
  const div = document.createElement("div");
  div.textContent = `Item ${i}`;
  div.className = "list-item";
  return div;
});

items.forEach((item) => fragment.appendChild(item));
document.getElementById("container").appendChild(fragment);
```

### 2. event-handling.js - 事件处理

- **事件基础**: 事件类型、事件对象、事件流
- **事件监听**: addEventListener、removeEventListener
- **事件委托**: 利用事件冒泡优化性能
- **自定义事件**: CustomEvent、事件分发
- **事件防抖**: 防止重复触发的优化技巧
- **事件节流**: 控制事件触发频率
- **现代事件**: Pointer Events、Intersection Observer

**事件处理示例**:

```javascript
// 事件委托模式
document.getElementById("list").addEventListener("click", (e) => {
  if (e.target.classList.contains("delete-btn")) {
    e.target.closest(".list-item").remove();
  }
});

// 防抖函数
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
```

### 3. dom-traversal.js - DOM 遍历

- **基础遍历**: parentNode、childNodes、siblings
- **现代遍历**: children、firstElementChild、lastElementChild
- **查找方法**: getElementById、getElementsByClassName、querySelector
- **树遍历**: 深度优先、广度优先遍历算法
- **范围查询**: 在特定范围内查找元素
- **性能对比**: 不同查找方法的性能分析

**遍历算法示例**:

```javascript
// 深度优先遍历
function* traverseDepthFirst(element) {
  yield element;

  for (const child of element.children) {
    yield* traverseDepthFirst(child);
  }
}

// 广度优先遍历
function* traverseBreadthFirst(element) {
  const queue = [element];

  while (queue.length > 0) {
    const current = queue.shift();
    yield current;
    queue.push(...current.children);
  }
}
```

## 🚀 快速开始

### 运行示例

```bash
# 在浏览器中运行，需要HTML环境
# 推荐使用Live Server或类似工具

# 或者在Node.js中使用JSDOM
npm install jsdom
node -r jsdom-global/register src/05-DOM操作/dom-manipulation.js
```

### 学习路径

1. **DOM 操作基础** → 掌握基本的增删改查
2. **事件处理** → 理解事件机制和优化技巧
3. **DOM 遍历** → 学会高效的元素查找和遍历

## 💡 核心概念

### DOM 的本质

- DOM 是 HTML 文档的程序接口
- DOM 树是浏览器解析 HTML 后的结构
- 每个 HTML 元素都是 DOM 节点
- DOM 操作会触发浏览器重排和重绘

### 事件机制

- 事件捕获：从根节点到目标元素
- 事件冒泡：从目标元素到根节点
- 事件委托：利用冒泡机制优化性能
- 自定义事件：扩展浏览器事件系统

### 性能优化原则

- 减少 DOM 查询次数
- 批量修改 DOM
- 使用 DocumentFragment
- 避免强制同步布局

## 🔧 实际应用

### 1. 动态表格组件

```javascript
class DataTable {
  constructor(container, data) {
    this.container = container;
    this.data = data;
    this.render();
    this.bindEvents();
  }

  render() {
    const table = document.createElement("table");
    table.className = "data-table";

    // 创建表头
    const thead = this.createHeader();
    table.appendChild(thead);

    // 创建表体
    const tbody = this.createBody();
    table.appendChild(tbody);

    this.container.appendChild(table);
  }

  createHeader() {
    const thead = document.createElement("thead");
    const headerRow = document.createElement("tr");

    Object.keys(this.data[0] || {}).forEach((key) => {
      const th = document.createElement("th");
      th.textContent = key;
      th.dataset.column = key;
      headerRow.appendChild(th);
    });

    thead.appendChild(headerRow);
    return thead;
  }

  createBody() {
    const tbody = document.createElement("tbody");
    const fragment = document.createDocumentFragment();

    this.data.forEach((row) => {
      const tr = document.createElement("tr");

      Object.values(row).forEach((value) => {
        const td = document.createElement("td");
        td.textContent = value;
        tr.appendChild(td);
      });

      fragment.appendChild(tr);
    });

    tbody.appendChild(fragment);
    return tbody;
  }

  bindEvents() {
    // 使用事件委托处理排序
    this.container.addEventListener("click", (e) => {
      if (e.target.tagName === "TH") {
        this.sort(e.target.dataset.column);
      }
    });
  }
}
```

### 2. 虚拟滚动实现

```javascript
class VirtualScroll {
  constructor(container, itemHeight, totalItems, renderItem) {
    this.container = container;
    this.itemHeight = itemHeight;
    this.totalItems = totalItems;
    this.renderItem = renderItem;
    this.visibleCount = Math.ceil(container.clientHeight / itemHeight) + 2;
    this.startIndex = 0;

    this.init();
  }

  init() {
    // 创建滚动容器
    this.scrollContainer = document.createElement("div");
    this.scrollContainer.style.height = `${
      this.totalItems * this.itemHeight
    }px`;
    this.scrollContainer.style.position = "relative";

    // 创建可见区域
    this.viewport = document.createElement("div");
    this.viewport.style.position = "absolute";
    this.viewport.style.top = "0";
    this.viewport.style.width = "100%";

    this.scrollContainer.appendChild(this.viewport);
    this.container.appendChild(this.scrollContainer);

    // 绑定滚动事件
    this.container.addEventListener(
      "scroll",
      this.debounce(this.onScroll.bind(this), 16)
    );

    this.render();
  }

  onScroll() {
    const scrollTop = this.container.scrollTop;
    const newStartIndex = Math.floor(scrollTop / this.itemHeight);

    if (newStartIndex !== this.startIndex) {
      this.startIndex = newStartIndex;
      this.render();
    }
  }

  render() {
    const endIndex = Math.min(
      this.startIndex + this.visibleCount,
      this.totalItems
    );

    // 清空当前视图
    this.viewport.innerHTML = "";

    // 渲染可见项
    for (let i = this.startIndex; i < endIndex; i++) {
      const item = this.renderItem(i);
      item.style.position = "absolute";
      item.style.top = `${i * this.itemHeight}px`;
      item.style.height = `${this.itemHeight}px`;
      this.viewport.appendChild(item);
    }
  }

  debounce(func, wait) {
    let timeout;
    return function (...args) {
      clearTimeout(timeout);
      timeout = setTimeout(() => func.apply(this, args), wait);
    };
  }
}
```

## 🔗 相关章节

- **上一章**: [第 4 章 - 异步编程](../04-异步编程/README.md)
- **下一章**: [第 6 章 - ES6+特性](../06-ES6+特性/README.md)
- **相关章节**:
  - [第 8 章 - 性能优化](../08-性能优化/README.md) - DOM 性能优化
  - [第 9 章 - 实战项目](../09-实战项目/README.md) - DOM 实际应用

## 📝 练习建议

1. **DOM 操作练习**:

   - 实现一个简单的 TODO 应用
   - 创建动态表单验证器
   - 构建可拖拽的元素排序

2. **事件处理练习**:

   - 实现自定义的图片轮播组件
   - 创建键盘快捷键系统
   - 构建触摸手势识别

3. **DOM 遍历练习**:
   - 实现 DOM 树的可视化
   - 创建元素选择器引擎
   - 构建 XPath 查询工具

## ⚠️ 常见陷阱

1. **频繁 DOM 查询**: 重复查询相同元素
2. **强制同步布局**: 读取样式后立即修改
3. **内存泄漏**: 未移除事件监听器
4. **事件处理器过多**: 为每个元素添加监听器
5. **innerHTML 安全**: XSS 攻击风险

## 🎨 最佳实践

1. **缓存 DOM 查询**: 将查询结果保存到变量
2. **使用事件委托**: 减少事件监听器数量
3. **批量 DOM 操作**: 使用 DocumentFragment
4. **避免样式抖动**: 分离读写操作
5. **及时清理**: 移除不需要的事件监听器

## 🔍 调试技巧

### 1. DOM 性能监控

```javascript
// 监控DOM操作性能
function measureDOMOperation(name, operation) {
  performance.mark(`${name}-start`);
  operation();
  performance.mark(`${name}-end`);
  performance.measure(name, `${name}-start`, `${name}-end`);

  const measure = performance.getEntriesByName(name)[0];
  console.log(`${name}: ${measure.duration.toFixed(2)}ms`);
}
```

### 2. 元素变化观察

```javascript
// 观察DOM变化
const observer = new MutationObserver((mutations) => {
  mutations.forEach((mutation) => {
    console.log("DOM changed:", mutation.type, mutation.target);
  });
});

observer.observe(document.body, {
  childList: true,
  subtree: true,
  attributes: true,
});
```

## 📊 性能指标

1. **重排和重绘**: 最小化布局和绘制操作
2. **事件处理延迟**: 保持事件响应的及时性
3. **内存使用**: 监控 DOM 节点数量和事件监听器
4. **首次渲染时间**: 优化初始 DOM 构建

---

**学习提示**: DOM 操作是前端开发的基础技能，掌握高效的 DOM 操作技巧对于构建高性能的 Web 应用至关重要！
