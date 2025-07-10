/**
 * JavaScript高级程序设计 - 第5章：DOM遍历
 *
 * 本文件演示DOM树遍历的各种方法和算法
 */

console.log("=== JavaScript DOM遍历 ===\n");

// =============================================
// 1. DOM树结构基础
// =============================================

console.log("1. DOM树结构基础");

// 模拟DOM节点
class DOMNode {
  constructor(nodeType, nodeName, textContent = "") {
    this.nodeType = nodeType; // 1: Element, 3: Text, 8: Comment
    this.nodeName = nodeName;
    this.textContent = textContent;
    this.childNodes = [];
    this.parentNode = null;
    this.attributes = {};
    this.classList = new Set();
    this.id = "";
  }

  appendChild(child) {
    this.childNodes.push(child);
    child.parentNode = this;
    return child;
  }

  removeChild(child) {
    const index = this.childNodes.indexOf(child);
    if (index > -1) {
      this.childNodes.splice(index, 1);
      child.parentNode = null;
    }
    return child;
  }

  insertBefore(newNode, referenceNode) {
    const index = this.childNodes.indexOf(referenceNode);
    if (index > -1) {
      this.childNodes.splice(index, 0, newNode);
      newNode.parentNode = this;
    }
    return newNode;
  }

  get firstChild() {
    return this.childNodes[0] || null;
  }

  get lastChild() {
    return this.childNodes[this.childNodes.length - 1] || null;
  }

  get nextSibling() {
    if (!this.parentNode) return null;
    const siblings = this.parentNode.childNodes;
    const index = siblings.indexOf(this);
    return siblings[index + 1] || null;
  }

  get previousSibling() {
    if (!this.parentNode) return null;
    const siblings = this.parentNode.childNodes;
    const index = siblings.indexOf(this);
    return index > 0 ? siblings[index - 1] : null;
  }

  get children() {
    return this.childNodes.filter((node) => node.nodeType === 1);
  }

  get firstElementChild() {
    return this.children[0] || null;
  }

  get lastElementChild() {
    const children = this.children;
    return children[children.length - 1] || null;
  }

  get nextElementSibling() {
    let sibling = this.nextSibling;
    while (sibling && sibling.nodeType !== 1) {
      sibling = sibling.nextSibling;
    }
    return sibling;
  }

  get previousElementSibling() {
    let sibling = this.previousSibling;
    while (sibling && sibling.nodeType !== 1) {
      sibling = sibling.previousSibling;
    }
    return sibling;
  }

  cloneNode(deep = false) {
    const clone = new DOMNode(this.nodeType, this.nodeName, this.textContent);
    clone.attributes = { ...this.attributes };
    clone.classList = new Set(this.classList);
    clone.id = this.id;

    if (deep) {
      this.childNodes.forEach((child) => {
        clone.appendChild(child.cloneNode(true));
      });
    }

    return clone;
  }
}

// 创建测试DOM结构
function createTestDOM() {
  const html = new DOMNode(1, "HTML");

  const head = new DOMNode(1, "HEAD");
  const title = new DOMNode(1, "TITLE");
  title.textContent = "Test Page";
  head.appendChild(title);

  const body = new DOMNode(1, "BODY");

  const header = new DOMNode(1, "HEADER");
  header.classList.add("page-header");
  header.id = "header";

  const nav = new DOMNode(1, "NAV");
  nav.classList.add("navigation");

  const ul = new DOMNode(1, "UL");
  ["首页", "关于", "联系"].forEach((text, index) => {
    const li = new DOMNode(1, "LI");
    const a = new DOMNode(1, "A");
    a.textContent = text;
    a.attributes.href = `#${text.toLowerCase()}`;
    li.appendChild(a);
    ul.appendChild(li);
  });
  nav.appendChild(ul);
  header.appendChild(nav);

  const main = new DOMNode(1, "MAIN");
  main.classList.add("content");

  const article = new DOMNode(1, "ARTICLE");
  article.classList.add("post");

  const h1 = new DOMNode(1, "H1");
  h1.textContent = "文章标题";

  const p1 = new DOMNode(1, "P");
  p1.textContent = "这是第一段内容。";

  const p2 = new DOMNode(1, "P");
  p2.textContent = "这是第二段内容。";

  const div = new DOMNode(1, "DIV");
  div.classList.add("highlight");
  div.textContent = "重要内容";

  article.appendChild(h1);
  article.appendChild(p1);
  article.appendChild(div);
  article.appendChild(p2);
  main.appendChild(article);

  const footer = new DOMNode(1, "FOOTER");
  footer.classList.add("page-footer");
  footer.textContent = "版权信息";

  body.appendChild(header);
  body.appendChild(main);
  body.appendChild(footer);

  html.appendChild(head);
  html.appendChild(body);

  return html;
}

const testDOM = createTestDOM();
console.log("创建测试DOM结构完成");
console.log("根节点:", testDOM.nodeName);
console.log("子节点数量:", testDOM.childNodes.length);

console.log();

// =============================================
// 2. 深度优先遍历
// =============================================

console.log("2. 深度优先遍历");

class DOMTraverser {
  // 深度优先遍历 - 递归实现
  static depthFirstRecursive(node, callback, depth = 0) {
    callback(node, depth);

    node.childNodes.forEach((child) => {
      this.depthFirstRecursive(child, callback, depth + 1);
    });
  }

  // 深度优先遍历 - 迭代实现
  static depthFirstIterative(node, callback) {
    const stack = [{ node, depth: 0 }];

    while (stack.length > 0) {
      const { node: current, depth } = stack.pop();
      callback(current, depth);

      // 反向添加子节点保持正确顺序
      for (let i = current.childNodes.length - 1; i >= 0; i--) {
        stack.push({ node: current.childNodes[i], depth: depth + 1 });
      }
    }
  }

  // 前序遍历
  static preorderTraversal(node, callback) {
    const traverse = (current, depth = 0) => {
      callback(current, depth); // 先访问当前节点
      current.childNodes.forEach((child) => {
        traverse(child, depth + 1);
      });
    };

    traverse(node);
  }

  // 后序遍历
  static postorderTraversal(node, callback) {
    const traverse = (current, depth = 0) => {
      current.childNodes.forEach((child) => {
        traverse(child, depth + 1);
      });
      callback(current, depth); // 后访问当前节点
    };

    traverse(node);
  }

  // 中序遍历（对于DOM不常用，但展示概念）
  static inorderTraversal(node, callback) {
    const traverse = (current, depth = 0) => {
      const children = current.childNodes;
      const mid = Math.floor(children.length / 2);

      // 遍历左半部分子节点
      for (let i = 0; i < mid; i++) {
        traverse(children[i], depth + 1);
      }

      // 访问当前节点
      callback(current, depth);

      // 遍历右半部分子节点
      for (let i = mid; i < children.length; i++) {
        traverse(children[i], depth + 1);
      }
    };

    traverse(node);
  }
}

console.log("深度优先遍历 - 递归:");
DOMTraverser.depthFirstRecursive(testDOM, (node, depth) => {
  const indent = "  ".repeat(depth);
  console.log(
    `${indent}${node.nodeName}${
      node.textContent ? ": " + node.textContent.slice(0, 20) : ""
    }`
  );
});

console.log("\n深度优先遍历 - 迭代:");
let nodeCount = 0;
DOMTraverser.depthFirstIterative(testDOM, (node, depth) => {
  nodeCount++;
  if (nodeCount <= 10) {
    // 只显示前10个节点
    const indent = "  ".repeat(depth);
    console.log(`${indent}${node.nodeName}`);
  }
});

console.log();

// =============================================
// 3. 广度优先遍历
// =============================================

console.log("3. 广度优先遍历");

class BreadthFirstTraverser {
  static breadthFirst(node, callback) {
    const queue = [{ node, depth: 0 }];

    while (queue.length > 0) {
      const { node: current, depth } = queue.shift();
      callback(current, depth);

      current.childNodes.forEach((child) => {
        queue.push({ node: child, depth: depth + 1 });
      });
    }
  }

  // 按层级遍历
  static levelOrder(node, callback) {
    let currentLevel = [node];
    let depth = 0;

    while (currentLevel.length > 0) {
      const nextLevel = [];

      callback(currentLevel, depth);

      currentLevel.forEach((current) => {
        current.childNodes.forEach((child) => {
          nextLevel.push(child);
        });
      });

      currentLevel = nextLevel;
      depth++;
    }
  }

  // 自上而下层级遍历
  static topDownLevelOrder(node, callback) {
    const levels = [];

    function traverse(current, depth) {
      if (!levels[depth]) {
        levels[depth] = [];
      }
      levels[depth].push(current);

      current.childNodes.forEach((child) => {
        traverse(child, depth + 1);
      });
    }

    traverse(node, 0);

    levels.forEach((level, depth) => {
      callback(level, depth);
    });
  }
}

console.log("广度优先遍历:");
BreadthFirstTraverser.breadthFirst(testDOM, (node, depth) => {
  console.log(`深度${depth}: ${node.nodeName}`);
});

console.log("\n按层级遍历:");
BreadthFirstTraverser.levelOrder(testDOM, (level, depth) => {
  const nodeNames = level.map((node) => node.nodeName).join(", ");
  console.log(`第${depth}层: [${nodeNames}]`);
});

console.log();

// =============================================
// 4. 专用遍历方法
// =============================================

console.log("4. 专用遍历方法");

class SpecializedTraverser {
  // 只遍历元素节点
  static elementTraversal(node, callback) {
    if (node.nodeType === 1) {
      callback(node);
    }

    node.children.forEach((child) => {
      this.elementTraversal(child, callback);
    });
  }

  // 按选择器查找
  static querySelector(root, selector) {
    let result = null;

    function traverse(node) {
      if (result) return;

      if (this.matchesSelector(node, selector)) {
        result = node;
        return;
      }

      node.childNodes.forEach((child) => traverse(child));
    }

    traverse(root);
    return result;
  }

  // 按选择器查找所有
  static querySelectorAll(root, selector) {
    const results = [];

    function traverse(node) {
      if (this.matchesSelector(node, selector)) {
        results.push(node);
      }

      node.childNodes.forEach((child) => traverse(child));
    }

    traverse(root);
    return results;
  }

  // 简单的选择器匹配
  static matchesSelector(node, selector) {
    if (node.nodeType !== 1) return false;

    if (selector.startsWith("#")) {
      return node.id === selector.slice(1);
    }

    if (selector.startsWith(".")) {
      return node.classList.has(selector.slice(1));
    }

    return node.nodeName.toLowerCase() === selector.toLowerCase();
  }

  // 查找父元素
  static findParent(node, condition) {
    let current = node.parentNode;

    while (current) {
      if (condition(current)) {
        return current;
      }
      current = current.parentNode;
    }

    return null;
  }

  // 查找所有祖先
  static getAncestors(node) {
    const ancestors = [];
    let current = node.parentNode;

    while (current) {
      ancestors.push(current);
      current = current.parentNode;
    }

    return ancestors;
  }

  // 查找最近的公共祖先
  static getCommonAncestor(node1, node2) {
    const ancestors1 = new Set(this.getAncestors(node1));
    let current = node2.parentNode;

    while (current) {
      if (ancestors1.has(current)) {
        return current;
      }
      current = current.parentNode;
    }

    return null;
  }
}

console.log("只遍历元素节点:");
SpecializedTraverser.elementTraversal(testDOM, (element) => {
  const classes =
    element.classList.size > 0
      ? ` class="${Array.from(element.classList).join(" ")}"`
      : "";
  const id = element.id ? ` id="${element.id}"` : "";
  console.log(`<${element.nodeName}${id}${classes}>`);
});

console.log("\n查找特定元素:");
const headerElement = SpecializedTraverser.querySelector(testDOM, "#header");
if (headerElement) {
  console.log("找到header:", headerElement.nodeName, headerElement.id);
}

const allParagraphs = SpecializedTraverser.querySelectorAll(testDOM, "p");
console.log("找到段落数量:", allParagraphs.length);

console.log();

// =============================================
// 5. 路径查找和导航
// =============================================

console.log("5. 路径查找和导航");

class PathFinder {
  // 获取元素的完整路径
  static getElementPath(element) {
    const path = [];
    let current = element;

    while (current && current.nodeType === 1) {
      let selector = current.nodeName.toLowerCase();

      if (current.id) {
        selector += `#${current.id}`;
        path.unshift(selector);
        break; // ID是唯一的，可以停止
      }

      if (current.classList.size > 0) {
        selector += `.${Array.from(current.classList).join(".")}`;
      }

      // 添加nth-child信息
      if (current.parentNode) {
        const siblings = current.parentNode.children;
        const index = Array.from(siblings).indexOf(current);
        if (index > 0) {
          selector += `:nth-child(${index + 1})`;
        }
      }

      path.unshift(selector);
      current = current.parentNode;
    }

    return path.join(" > ");
  }

  // 根据路径查找元素
  static findByPath(root, path) {
    const selectors = path.split(" > ");
    let current = root;

    for (const selector of selectors) {
      current = SpecializedTraverser.querySelector(current, selector);
      if (!current) {
        break;
      }
    }

    return current;
  }

  // 计算两个节点之间的距离
  static getDistance(node1, node2) {
    const commonAncestor = SpecializedTraverser.getCommonAncestor(node1, node2);
    if (!commonAncestor) {
      return -1; // 不在同一树中
    }

    const depth1 = this.getDepth(node1, commonAncestor);
    const depth2 = this.getDepth(node2, commonAncestor);

    return depth1 + depth2;
  }

  // 获取节点相对于祖先的深度
  static getDepth(node, ancestor) {
    let depth = 0;
    let current = node;

    while (current && current !== ancestor) {
      depth++;
      current = current.parentNode;
    }

    return current === ancestor ? depth : -1;
  }

  // 获取节点的兄弟节点
  static getSiblings(node, includeTextNodes = false) {
    if (!node.parentNode) return [];

    const siblings = includeTextNodes
      ? node.parentNode.childNodes
      : node.parentNode.children;

    return Array.from(siblings).filter((sibling) => sibling !== node);
  }

  // 获取下一个匹配条件的兄弟节点
  static getNextSibling(node, condition) {
    let current = node.nextSibling;

    while (current) {
      if (condition(current)) {
        return current;
      }
      current = current.nextSibling;
    }

    return null;
  }
}

// 测试路径查找
const highlightDiv = SpecializedTraverser.querySelector(testDOM, ".highlight");
if (highlightDiv) {
  const path = PathFinder.getElementPath(highlightDiv);
  console.log("高亮div的路径:", path);

  const foundElement = PathFinder.findByPath(testDOM, path);
  console.log("通过路径找回元素:", foundElement === highlightDiv);
}

// 测试距离计算
const h1Element = SpecializedTraverser.querySelector(testDOM, "h1");
const footerElement = SpecializedTraverser.querySelector(testDOM, "footer");
if (h1Element && footerElement) {
  const distance = PathFinder.getDistance(h1Element, footerElement);
  console.log("H1和Footer之间的距离:", distance);
}

console.log();

// =============================================
// 6. 性能优化遍历
// =============================================

console.log("6. 性能优化遍历");

class OptimizedTraverser {
  constructor() {
    this.nodeCache = new Map();
    this.pathCache = new Map();
    this.queryCache = new Map();
  }

  // 缓存节点查询结果
  cachedQuerySelector(root, selector) {
    const cacheKey = `${root.nodeName}-${selector}`;

    if (this.queryCache.has(cacheKey)) {
      console.log("命中查询缓存:", selector);
      return this.queryCache.get(cacheKey);
    }

    const result = SpecializedTraverser.querySelector(root, selector);
    this.queryCache.set(cacheKey, result);
    return result;
  }

  // 惰性遍历 - 生成器实现
  *lazyTraversal(node) {
    yield node;

    for (const child of node.childNodes) {
      yield* this.lazyTraversal(child);
    }
  }

  // 中断式遍历
  traverseUntilCondition(node, condition, callback) {
    const stack = [node];

    while (stack.length > 0) {
      const current = stack.pop();

      if (condition(current)) {
        callback(current);
        return current; // 找到目标，停止遍历
      }

      // 反向添加子节点
      for (let i = current.childNodes.length - 1; i >= 0; i--) {
        stack.push(current.childNodes[i]);
      }
    }

    return null;
  }

  // 批量查询优化
  batchQuery(root, selectors) {
    const results = {};

    DOMTraverser.depthFirstRecursive(root, (node) => {
      selectors.forEach((selector) => {
        if (SpecializedTraverser.matchesSelector(node, selector)) {
          if (!results[selector]) {
            results[selector] = [];
          }
          results[selector].push(node);
        }
      });
    });

    return results;
  }

  // 范围查询
  queryRange(root, startSelector, endSelector) {
    const results = [];
    let inRange = false;

    DOMTraverser.depthFirstRecursive(root, (node) => {
      if (SpecializedTraverser.matchesSelector(node, startSelector)) {
        inRange = true;
      }

      if (inRange) {
        results.push(node);
      }

      if (SpecializedTraverser.matchesSelector(node, endSelector)) {
        inRange = false;
      }
    });

    return results;
  }

  clearCache() {
    this.nodeCache.clear();
    this.pathCache.clear();
    this.queryCache.clear();
    console.log("缓存已清理");
  }

  getCacheStats() {
    return {
      nodeCache: this.nodeCache.size,
      pathCache: this.pathCache.size,
      queryCache: this.queryCache.size,
    };
  }
}

const optimizedTraverser = new OptimizedTraverser();

// 测试惰性遍历
console.log("惰性遍历前5个节点:");
let count = 0;
for (const node of optimizedTraverser.lazyTraversal(testDOM)) {
  if (count++ >= 5) break;
  console.log(`  ${node.nodeName}`);
}

// 测试条件中断遍历
console.log("\n查找第一个有class的元素:");
const elementWithClass = optimizedTraverser.traverseUntilCondition(
  testDOM,
  (node) => node.classList && node.classList.size > 0,
  (node) =>
    console.log(
      `  找到: ${node.nodeName}.${Array.from(node.classList).join(".")}`
    )
);

// 测试批量查询
console.log("\n批量查询:");
const batchResults = optimizedTraverser.batchQuery(testDOM, [
  "header",
  "footer",
  ".highlight",
]);
Object.entries(batchResults).forEach(([selector, nodes]) => {
  console.log(`  ${selector}: ${nodes.length}个节点`);
});

console.log("缓存统计:", optimizedTraverser.getCacheStats());

console.log();

// =============================================
// 7. DOM变化监听
// =============================================

console.log("7. DOM变化监听");

class DOMObserver {
  constructor() {
    this.observers = [];
    this.mutations = [];
  }

  observe(target, options, callback) {
    const observer = {
      target,
      options: {
        childList: options.childList || false,
        attributes: options.attributes || false,
        subtree: options.subtree || false,
        attributeOldValue: options.attributeOldValue || false,
        characterData: options.characterData || false,
      },
      callback,
    };

    this.observers.push(observer);
    console.log("开始观察DOM变化:", target.nodeName);
    return observer;
  }

  disconnect(observer) {
    const index = this.observers.indexOf(observer);
    if (index > -1) {
      this.observers.splice(index, 1);
      console.log("停止观察DOM变化");
    }
  }

  // 模拟DOM变化检测
  notifyMutation(
    type,
    target,
    addedNodes = [],
    removedNodes = [],
    attributeName = null
  ) {
    const mutation = {
      type,
      target,
      addedNodes: Array.from(addedNodes),
      removedNodes: Array.from(removedNodes),
      attributeName,
      timestamp: Date.now(),
    };

    this.mutations.push(mutation);

    this.observers.forEach((observer) => {
      if (this.shouldNotify(observer, mutation)) {
        observer.callback([mutation]);
      }
    });
  }

  shouldNotify(observer, mutation) {
    if (
      mutation.target !== observer.target &&
      !(
        observer.options.subtree &&
        this.isDescendant(mutation.target, observer.target)
      )
    ) {
      return false;
    }

    switch (mutation.type) {
      case "childList":
        return observer.options.childList;
      case "attributes":
        return observer.options.attributes;
      case "characterData":
        return observer.options.characterData;
      default:
        return false;
    }
  }

  isDescendant(node, ancestor) {
    let current = node.parentNode;
    while (current) {
      if (current === ancestor) {
        return true;
      }
      current = current.parentNode;
    }
    return false;
  }

  getMutations() {
    return [...this.mutations];
  }

  clearMutations() {
    this.mutations = [];
  }
}

const domObserver = new DOMObserver();

// 观察DOM变化
const bodyElement = SpecializedTraverser.querySelector(testDOM, "body");
if (bodyElement) {
  const observer = domObserver.observe(
    bodyElement,
    {
      childList: true,
      subtree: true,
      attributes: true,
    },
    (mutations) => {
      mutations.forEach((mutation) => {
        console.log(`DOM变化: ${mutation.type} on ${mutation.target.nodeName}`);
        if (mutation.addedNodes.length > 0) {
          console.log(`  添加了 ${mutation.addedNodes.length} 个节点`);
        }
        if (mutation.removedNodes.length > 0) {
          console.log(`  移除了 ${mutation.removedNodes.length} 个节点`);
        }
      });
    }
  );

  // 模拟DOM变化
  const newDiv = new DOMNode(1, "DIV");
  newDiv.textContent = "新添加的内容";
  bodyElement.appendChild(newDiv);
  domObserver.notifyMutation("childList", bodyElement, [newDiv]);

  bodyElement.removeChild(newDiv);
  domObserver.notifyMutation("childList", bodyElement, [], [newDiv]);
}

console.log();

// =============================================
// 8. 虚拟DOM对比
// =============================================

console.log("8. 虚拟DOM对比");

class VirtualDOMDiffer {
  static diff(oldNode, newNode) {
    const patches = [];
    this.diffNode(oldNode, newNode, patches, []);
    return patches;
  }

  static diffNode(oldNode, newNode, patches, path) {
    if (!oldNode && !newNode) {
      return;
    }

    if (!oldNode) {
      patches.push({
        type: "CREATE",
        path: [...path],
        node: newNode,
      });
      return;
    }

    if (!newNode) {
      patches.push({
        type: "REMOVE",
        path: [...path],
      });
      return;
    }

    if (oldNode.nodeName !== newNode.nodeName) {
      patches.push({
        type: "REPLACE",
        path: [...path],
        node: newNode,
      });
      return;
    }

    // 对比属性
    this.diffAttributes(oldNode, newNode, patches, path);

    // 对比文本内容
    if (oldNode.textContent !== newNode.textContent) {
      patches.push({
        type: "TEXT",
        path: [...path],
        text: newNode.textContent,
      });
    }

    // 对比子节点
    this.diffChildren(oldNode.childNodes, newNode.childNodes, patches, path);
  }

  static diffAttributes(oldNode, newNode, patches, path) {
    const oldAttrs = oldNode.attributes || {};
    const newAttrs = newNode.attributes || {};

    // 检查新增和修改的属性
    for (const [name, value] of Object.entries(newAttrs)) {
      if (oldAttrs[name] !== value) {
        patches.push({
          type: "ATTRIBUTE",
          path: [...path],
          name,
          value,
        });
      }
    }

    // 检查删除的属性
    for (const name of Object.keys(oldAttrs)) {
      if (!(name in newAttrs)) {
        patches.push({
          type: "REMOVE_ATTRIBUTE",
          path: [...path],
          name,
        });
      }
    }
  }

  static diffChildren(oldChildren, newChildren, patches, path) {
    const maxLength = Math.max(oldChildren.length, newChildren.length);

    for (let i = 0; i < maxLength; i++) {
      this.diffNode(oldChildren[i], newChildren[i], patches, [...path, i]);
    }
  }

  static applyPatches(root, patches) {
    patches.forEach((patch) => {
      const target = this.getNodeByPath(root, patch.path);

      switch (patch.type) {
        case "CREATE":
          if (target && target.parentNode) {
            target.parentNode.appendChild(patch.node);
          }
          break;

        case "REMOVE":
          if (target && target.parentNode) {
            target.parentNode.removeChild(target);
          }
          break;

        case "REPLACE":
          if (target && target.parentNode) {
            target.parentNode.insertBefore(patch.node, target);
            target.parentNode.removeChild(target);
          }
          break;

        case "TEXT":
          if (target) {
            target.textContent = patch.text;
          }
          break;

        case "ATTRIBUTE":
          if (target) {
            target.attributes[patch.name] = patch.value;
          }
          break;

        case "REMOVE_ATTRIBUTE":
          if (target && target.attributes) {
            delete target.attributes[patch.name];
          }
          break;
      }

      console.log(`应用补丁: ${patch.type} at path [${patch.path.join(", ")}]`);
    });
  }

  static getNodeByPath(root, path) {
    let current = root;

    for (const index of path) {
      if (current && current.childNodes && current.childNodes[index]) {
        current = current.childNodes[index];
      } else {
        return null;
      }
    }

    return current;
  }
}

// 创建新版本的DOM
const newTestDOM = createTestDOM();
const mainElement = SpecializedTraverser.querySelector(newTestDOM, "main");
if (mainElement) {
  const newSection = new DOMNode(1, "SECTION");
  newSection.textContent = "新添加的章节";
  mainElement.appendChild(newSection);
}

// 对比DOM
console.log("对比虚拟DOM:");
const patches = VirtualDOMDiffer.diff(testDOM, newTestDOM);
console.log(`发现 ${patches.length} 个差异`);

patches.slice(0, 5).forEach((patch, index) => {
  console.log(`  ${index + 1}. ${patch.type} at [${patch.path.join(", ")}]`);
});

console.log();

// =============================================
// 9. 遍历性能测试
// =============================================

console.log("9. 遍历性能测试");

class TraversalBenchmark {
  static createLargeDOM(depth, breadth) {
    const root = new DOMNode(1, "ROOT");

    function buildLevel(parent, currentDepth) {
      if (currentDepth >= depth) return;

      for (let i = 0; i < breadth; i++) {
        const child = new DOMNode(1, `NODE_${currentDepth}_${i}`);
        child.textContent = `Level ${currentDepth} Node ${i}`;
        parent.appendChild(child);

        buildLevel(child, currentDepth + 1);
      }
    }

    buildLevel(root, 0);
    return root;
  }

  static benchmark(name, fn, iterations = 1) {
    const start = Date.now();

    for (let i = 0; i < iterations; i++) {
      fn();
    }

    const end = Date.now();
    const avgTime = (end - start) / iterations;

    console.log(`${name}: ${avgTime.toFixed(2)}ms (平均)`);
    return avgTime;
  }

  static compareTraversalMethods() {
    const largeDOM = this.createLargeDOM(4, 5); // 4层深度，每层5个节点
    let nodeCount = 0;

    console.log("创建大型DOM完成，开始性能测试...");

    // 测试深度优先递归
    this.benchmark(
      "深度优先递归",
      () => {
        nodeCount = 0;
        DOMTraverser.depthFirstRecursive(largeDOM, () => nodeCount++);
      },
      100
    );

    // 测试深度优先迭代
    this.benchmark(
      "深度优先迭代",
      () => {
        nodeCount = 0;
        DOMTraverser.depthFirstIterative(largeDOM, () => nodeCount++);
      },
      100
    );

    // 测试广度优先
    this.benchmark(
      "广度优先",
      () => {
        nodeCount = 0;
        BreadthFirstTraverser.breadthFirst(largeDOM, () => nodeCount++);
      },
      100
    );

    // 测试惰性遍历
    this.benchmark(
      "惰性遍历",
      () => {
        nodeCount = 0;
        for (const node of optimizedTraverser.lazyTraversal(largeDOM)) {
          nodeCount++;
        }
      },
      100
    );

    console.log(`遍历的节点总数: ${nodeCount}`);
  }
}

TraversalBenchmark.compareTraversalMethods();

console.log();

// =============================================
// 10. 最佳实践总结
// =============================================

console.log("10. 最佳实践总结");

console.log(`
DOM遍历最佳实践:

1. 性能优化:
   - 缓存频繁访问的DOM引用
   - 使用文档片段减少重排
   - 选择合适的遍历算法（深度vs广度）
   - 使用惰性遍历处理大型DOM

2. 内存管理:
   - 及时清理不需要的引用
   - 避免创建循环引用
   - 使用WeakMap缓存节点信息

3. 查询优化:
   - 使用更具体的选择器
   - 从最近的祖先开始查询
   - 批量查询减少遍历次数
   - 合理使用查询缓存

4. 兼容性考虑:
   - 检查API支持情况
   - 提供降级方案
   - 使用标准化的遍历方法

5. 调试和监控:
   - 使用Performance API监控性能
   - 记录遍历路径便于调试
   - 监控DOM变化频率

常见陷阱:
- 在循环中进行DOM查询
- 忘记处理空节点引用
- 不必要的深度遍历
- 缓存失效导致的问题

算法选择:
- 查找特定元素：深度优先
- 层级处理：广度优先
- 大规模遍历：惰性遍历
- 实时监控：MutationObserver

工具推荐:
- 浏览器开发者工具Elements面板
- 性能分析工具(Performance, Memory)
- DOM查询分析器
- 虚拟化组件库
`);

// 导出供测试使用
module.exports = {
  DOMNode,
  DOMTraverser,
  BreadthFirstTraverser,
  SpecializedTraverser,
  PathFinder,
  OptimizedTraverser,
  DOMObserver,
  VirtualDOMDiffer,
  TraversalBenchmark,
};
