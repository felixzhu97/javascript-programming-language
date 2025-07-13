/**
 * JavaScript高级程序设计 - 第9章：实战项目 - Todo应用
 *
 * 一个功能完整的Todo应用，演示现代JavaScript开发的最佳实践
 * 包含：状态管理、事件处理、数据持久化、性能优化等
 */

console.log("=== Todo应用实战项目 ===\n");

// =============================================
// 1. 应用架构设计
// =============================================

// 状态管理器
class StateManager {
  constructor(initialState = {}) {
    this.state = { ...initialState };
    this.listeners = new Set();
    this.middleware = [];
    this.history = [];
    this.maxHistorySize = 50;
  }

  // 添加中间件
  use(middleware) {
    this.middleware.push(middleware);
  }

  // 订阅状态变化
  subscribe(listener) {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // 获取状态
  getState() {
    return { ...this.state };
  }

  // 更新状态
  setState(updater, action = {}) {
    const prevState = { ...this.state };

    // 应用状态更新
    if (typeof updater === "function") {
      this.state = { ...this.state, ...updater(this.state) };
    } else {
      this.state = { ...this.state, ...updater };
    }

    // 记录历史
    this.history.push({
      action,
      prevState,
      nextState: { ...this.state },
      timestamp: Date.now(),
    });

    if (this.history.length > this.maxHistorySize) {
      this.history.shift();
    }

    // 应用中间件
    this.middleware.forEach((middleware) => {
      middleware(action, prevState, this.state);
    });

    // 通知监听器
    this.listeners.forEach((listener) => {
      listener(this.state, prevState, action);
    });
  }

  // 撤销操作
  undo() {
    if (this.history.length < 2) return false;

    const currentEntry = this.history.pop();
    const prevEntry = this.history[this.history.length - 1];

    this.state = { ...prevEntry.nextState };
    this.listeners.forEach((listener) => {
      listener(this.state, currentEntry.nextState, { type: "UNDO" });
    });

    return true;
  }
}

// 事件发射器
class EventEmitter {
  constructor() {
    this.events = new Map();
  }

  on(event, listener) {
    if (!this.events.has(event)) {
      this.events.set(event, new Set());
    }
    this.events.get(event).add(listener);

    return () => {
      const listeners = this.events.get(event);
      if (listeners) {
        listeners.delete(listener);
      }
    };
  }

  emit(event, ...args) {
    const listeners = this.events.get(event);
    if (listeners) {
      listeners.forEach((listener) => {
        try {
          listener(...args);
        } catch (error) {
          console.error(`事件监听器错误 (${event}):`, error);
        }
      });
    }
  }

  off(event, listener) {
    const listeners = this.events.get(event);
    if (listeners) {
      listeners.delete(listener);
    }
  }

  once(event, listener) {
    const removeListener = this.on(event, (...args) => {
      removeListener();
      listener(...args);
    });
    return removeListener;
  }
}

// =============================================
// 2. Todo数据模型
// =============================================

class TodoModel {
  constructor() {
    this.idCounter = 1;
  }

  // 创建Todo项
  createTodo(text, options = {}) {
    const {
      priority = "medium",
      category = "general",
      dueDate = null,
      tags = [],
    } = options;

    return {
      id: this.idCounter++,
      text: text.trim(),
      completed: false,
      priority,
      category,
      dueDate,
      tags: [...tags],
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
  }

  // 验证Todo项
  validateTodo(todo) {
    const errors = [];

    if (!todo.text || todo.text.trim().length === 0) {
      errors.push("Todo文本不能为空");
    }

    if (todo.text && todo.text.length > 200) {
      errors.push("Todo文本不能超过200个字符");
    }

    if (!["low", "medium", "high"].includes(todo.priority)) {
      errors.push("优先级必须是 low、medium 或 high");
    }

    if (todo.dueDate && new Date(todo.dueDate) < new Date()) {
      errors.push("截止日期不能是过去的时间");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // 更新Todo项
  updateTodo(todo, updates) {
    const updatedTodo = {
      ...todo,
      ...updates,
      updatedAt: new Date().toISOString(),
    };

    const validation = this.validateTodo(updatedTodo);
    if (!validation.isValid) {
      throw new Error(`Todo验证失败: ${validation.errors.join(", ")}`);
    }

    return updatedTodo;
  }

  // 切换完成状态
  toggleComplete(todo) {
    return this.updateTodo(todo, {
      completed: !todo.completed,
      completedAt: !todo.completed ? new Date().toISOString() : null,
    });
  }
}

// =============================================
// 3. 数据持久化
// =============================================

class StorageManager {
  constructor(storageKey = "todoApp") {
    this.storageKey = storageKey;
    this.storage =
      typeof localStorage !== "undefined" ? localStorage : new Map();
  }

  // 保存数据
  save(data) {
    try {
      const serialized = JSON.stringify({
        data,
        timestamp: Date.now(),
        version: "1.0",
      });

      if (this.storage instanceof Map) {
        this.storage.set(this.storageKey, serialized);
      } else {
        this.storage.setItem(this.storageKey, serialized);
      }

      return true;
    } catch (error) {
      console.error("保存数据失败:", error);
      return false;
    }
  }

  // 加载数据
  load() {
    try {
      const stored =
        this.storage instanceof Map
          ? this.storage.get(this.storageKey)
          : this.storage.getItem(this.storageKey);

      if (!stored) return null;

      const parsed = JSON.parse(stored);

      // 版本检查
      if (parsed.version !== "1.0") {
        console.warn("数据版本不匹配，可能需要迁移");
      }

      return parsed.data;
    } catch (error) {
      console.error("加载数据失败:", error);
      return null;
    }
  }

  // 清除数据
  clear() {
    try {
      if (this.storage instanceof Map) {
        this.storage.delete(this.storageKey);
      } else {
        this.storage.removeItem(this.storageKey);
      }
      return true;
    } catch (error) {
      console.error("清除数据失败:", error);
      return false;
    }
  }

  // 导出数据
  export() {
    const data = this.load();
    if (!data) return null;

    return {
      exportDate: new Date().toISOString(),
      appVersion: "1.0",
      data,
    };
  }

  // 导入数据
  import(exportedData) {
    try {
      if (!exportedData.data) {
        throw new Error("无效的导入数据格式");
      }

      return this.save(exportedData.data);
    } catch (error) {
      console.error("导入数据失败:", error);
      return false;
    }
  }
}

// =============================================
// 4. Todo服务层
// =============================================

class TodoService {
  constructor() {
    this.model = new TodoModel();
    this.storage = new StorageManager();
    this.eventEmitter = new EventEmitter();
  }

  // 获取所有Todos
  async getAllTodos() {
    const stored = this.storage.load();
    return stored?.todos || [];
  }

  // 添加Todo
  async addTodo(text, options) {
    const todo = this.model.createTodo(text, options);
    const validation = this.model.validateTodo(todo);

    if (!validation.isValid) {
      throw new Error(`添加Todo失败: ${validation.errors.join(", ")}`);
    }

    const todos = await this.getAllTodos();
    todos.push(todo);

    this.storage.save({ todos });
    this.eventEmitter.emit("todoAdded", todo);

    return todo;
  }

  // 更新Todo
  async updateTodo(id, updates) {
    const todos = await this.getAllTodos();
    const index = todos.findIndex((todo) => todo.id === id);

    if (index === -1) {
      throw new Error(`Todo不存在: ID ${id}`);
    }

    const updatedTodo = this.model.updateTodo(todos[index], updates);
    todos[index] = updatedTodo;

    this.storage.save({ todos });
    this.eventEmitter.emit("todoUpdated", updatedTodo);

    return updatedTodo;
  }

  // 删除Todo
  async deleteTodo(id) {
    const todos = await this.getAllTodos();
    const index = todos.findIndex((todo) => todo.id === id);

    if (index === -1) {
      throw new Error(`Todo不存在: ID ${id}`);
    }

    const deletedTodo = todos[index];
    todos.splice(index, 1);

    this.storage.save({ todos });
    this.eventEmitter.emit("todoDeleted", deletedTodo);

    return deletedTodo;
  }

  // 切换完成状态
  async toggleComplete(id) {
    const todos = await this.getAllTodos();
    const todo = todos.find((t) => t.id === id);

    if (!todo) {
      throw new Error(`Todo不存在: ID ${id}`);
    }

    const toggledTodo = this.model.toggleComplete(todo);
    return this.updateTodo(id, toggledTodo);
  }

  // 批量操作
  async batchUpdate(ids, updates) {
    const results = [];

    for (const id of ids) {
      try {
        const updated = await this.updateTodo(id, updates);
        results.push({ id, success: true, todo: updated });
      } catch (error) {
        results.push({ id, success: false, error: error.message });
      }
    }

    this.eventEmitter.emit("batchUpdated", results);
    return results;
  }

  // 搜索和过滤
  async searchTodos(query, filters = {}) {
    const todos = await this.getAllTodos();

    return todos.filter((todo) => {
      // 文本搜索
      if (query && !todo.text.toLowerCase().includes(query.toLowerCase())) {
        return false;
      }

      // 完成状态过滤
      if (
        filters.completed !== undefined &&
        todo.completed !== filters.completed
      ) {
        return false;
      }

      // 优先级过滤
      if (filters.priority && todo.priority !== filters.priority) {
        return false;
      }

      // 分类过滤
      if (filters.category && todo.category !== filters.category) {
        return false;
      }

      // 标签过滤
      if (filters.tags && filters.tags.length > 0) {
        const hasAllTags = filters.tags.every((tag) => todo.tags.includes(tag));
        if (!hasAllTags) return false;
      }

      // 日期范围过滤
      if (filters.dateRange) {
        const todoDate = new Date(todo.createdAt);
        if (
          filters.dateRange.start &&
          todoDate < new Date(filters.dateRange.start)
        ) {
          return false;
        }
        if (
          filters.dateRange.end &&
          todoDate > new Date(filters.dateRange.end)
        ) {
          return false;
        }
      }

      return true;
    });
  }

  // 获取统计信息
  async getStatistics() {
    const todos = await this.getAllTodos();

    const stats = {
      total: todos.length,
      completed: todos.filter((t) => t.completed).length,
      pending: todos.filter((t) => !t.completed).length,
      byPriority: {
        high: todos.filter((t) => t.priority === "high").length,
        medium: todos.filter((t) => t.priority === "medium").length,
        low: todos.filter((t) => t.priority === "low").length,
      },
      byCategory: {},
      overdue: 0,
    };

    // 按分类统计
    todos.forEach((todo) => {
      stats.byCategory[todo.category] =
        (stats.byCategory[todo.category] || 0) + 1;
    });

    // 过期统计
    const now = new Date();
    stats.overdue = todos.filter(
      (todo) => todo.dueDate && new Date(todo.dueDate) < now && !todo.completed
    ).length;

    return stats;
  }
}

// =============================================
// 5. Todo应用控制器
// =============================================

class TodoApp {
  constructor() {
    this.service = new TodoService();
    this.state = new StateManager({
      todos: [],
      filter: "all", // all, active, completed
      searchQuery: "",
      sortBy: "createdAt",
      sortOrder: "desc",
      selectedTodos: [],
      loading: false,
      error: null,
    });

    this.setupEventListeners();
    this.setupMiddleware();
    this.init();
  }

  // 初始化应用
  async init() {
    try {
      this.state.setState({ loading: true });
      const todos = await this.service.getAllTodos();
      this.state.setState({
        todos,
        loading: false,
        error: null,
      });
      console.log("Todo应用初始化完成");
    } catch (error) {
      this.state.setState({
        loading: false,
        error: error.message,
      });
      console.error("应用初始化失败:", error);
    }
  }

  // 设置事件监听
  setupEventListeners() {
    // 监听Todo服务事件
    this.service.eventEmitter.on("todoAdded", (todo) => {
      const todos = [...this.state.getState().todos, todo];
      this.state.setState({ todos }, { type: "ADD_TODO", payload: todo });
    });

    this.service.eventEmitter.on("todoUpdated", (updatedTodo) => {
      const todos = this.state
        .getState()
        .todos.map((todo) => (todo.id === updatedTodo.id ? updatedTodo : todo));
      this.state.setState(
        { todos },
        { type: "UPDATE_TODO", payload: updatedTodo }
      );
    });

    this.service.eventEmitter.on("todoDeleted", (deletedTodo) => {
      const todos = this.state
        .getState()
        .todos.filter((todo) => todo.id !== deletedTodo.id);
      this.state.setState(
        { todos },
        { type: "DELETE_TODO", payload: deletedTodo }
      );
    });
  }

  // 设置中间件
  setupMiddleware() {
    // 日志中间件
    this.state.use((action, prevState, nextState) => {
      console.log(`状态变化: ${action.type || "setState"}`, {
        action,
        prevState: { todosCount: prevState.todos?.length },
        nextState: { todosCount: nextState.todos?.length },
      });
    });

    // 性能监控中间件
    this.state.use((action, prevState, nextState) => {
      if (nextState.todos.length > 1000) {
        console.warn("Todo数量过多，可能影响性能");
      }
    });
  }

  // 添加Todo
  async addTodo(text, options = {}) {
    try {
      this.state.setState({ loading: true });
      await this.service.addTodo(text, options);
      this.state.setState({ loading: false, error: null });
    } catch (error) {
      this.state.setState({
        loading: false,
        error: error.message,
      });
      throw error;
    }
  }

  // 更新Todo
  async updateTodo(id, updates) {
    try {
      await this.service.updateTodo(id, updates);
      this.state.setState({ error: null });
    } catch (error) {
      this.state.setState({ error: error.message });
      throw error;
    }
  }

  // 删除Todo
  async deleteTodo(id) {
    try {
      await this.service.deleteTodo(id);
      this.state.setState({ error: null });
    } catch (error) {
      this.state.setState({ error: error.message });
      throw error;
    }
  }

  // 切换完成状态
  async toggleComplete(id) {
    try {
      await this.service.toggleComplete(id);
    } catch (error) {
      this.state.setState({ error: error.message });
      throw error;
    }
  }

  // 批量操作
  async batchToggleComplete(ids) {
    try {
      const results = await this.service.batchUpdate(ids, { completed: true });
      const failedUpdates = results.filter((r) => !r.success);

      if (failedUpdates.length > 0) {
        console.warn("部分更新失败:", failedUpdates);
      }
    } catch (error) {
      this.state.setState({ error: error.message });
      throw error;
    }
  }

  // 设置过滤器
  setFilter(filter) {
    this.state.setState({ filter }, { type: "SET_FILTER", payload: filter });
  }

  // 设置搜索查询
  setSearchQuery(query) {
    this.state.setState(
      { searchQuery: query },
      { type: "SET_SEARCH", payload: query }
    );
  }

  // 设置排序
  setSorting(sortBy, sortOrder = "desc") {
    this.state.setState(
      {
        sortBy,
        sortOrder,
      },
      {
        type: "SET_SORTING",
        payload: { sortBy, sortOrder },
      }
    );
  }

  // 获取过滤后的Todos
  getFilteredTodos() {
    const { todos, filter, searchQuery, sortBy, sortOrder } =
      this.state.getState();

    let filtered = todos;

    // 状态过滤
    if (filter === "active") {
      filtered = filtered.filter((todo) => !todo.completed);
    } else if (filter === "completed") {
      filtered = filtered.filter((todo) => todo.completed);
    }

    // 搜索过滤
    if (searchQuery) {
      filtered = filtered.filter(
        (todo) =>
          todo.text.toLowerCase().includes(searchQuery.toLowerCase()) ||
          todo.tags.some((tag) =>
            tag.toLowerCase().includes(searchQuery.toLowerCase())
          )
      );
    }

    // 排序
    filtered.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      if (sortBy === "createdAt" || sortBy === "updatedAt") {
        aValue = new Date(aValue);
        bValue = new Date(bValue);
      }

      if (aValue < bValue) return sortOrder === "asc" ? -1 : 1;
      if (aValue > bValue) return sortOrder === "asc" ? 1 : -1;
      return 0;
    });

    return filtered;
  }

  // 获取统计信息
  async getStatistics() {
    return await this.service.getStatistics();
  }

  // 导出数据
  exportData() {
    return this.service.storage.export();
  }

  // 导入数据
  async importData(data) {
    try {
      const success = this.service.storage.import(data);
      if (success) {
        await this.init(); // 重新加载
      }
      return success;
    } catch (error) {
      this.state.setState({ error: error.message });
      return false;
    }
  }

  // 清除所有数据
  async clearAllData() {
    try {
      this.service.storage.clear();
      this.state.setState(
        {
          todos: [],
          error: null,
        },
        { type: "CLEAR_ALL" }
      );
    } catch (error) {
      this.state.setState({ error: error.message });
      throw error;
    }
  }
}

// =============================================
// 6. 应用测试和演示
// =============================================

console.log("启动Todo应用演示...\n");

// 创建应用实例
const todoApp = new TodoApp();

// 等待初始化完成后进行演示
setTimeout(async () => {
  try {
    console.log("=== Todo应用功能演示 ===\n");

    // 1. 添加一些测试数据
    console.log("1. 添加Todo项:");
    await todoApp.addTodo("学习JavaScript高级特性", {
      priority: "high",
      category: "learning",
      tags: ["javascript", "programming"],
    });

    await todoApp.addTodo("完成项目文档", {
      priority: "medium",
      category: "work",
      tags: ["documentation"],
    });

    await todoApp.addTodo("锻炼身体", {
      priority: "low",
      category: "health",
      tags: ["fitness", "health"],
    });

    // 2. 显示所有Todos
    console.log("\n2. 当前所有Todo项:");
    const allTodos = todoApp.getFilteredTodos();
    allTodos.forEach((todo) => {
      console.log(
        `  [${todo.completed ? "✓" : " "}] ${todo.text} (${todo.priority})`
      );
    });

    // 3. 完成一个Todo
    console.log("\n3. 完成第一个Todo:");
    if (allTodos.length > 0) {
      await todoApp.toggleComplete(allTodos[0].id);
      console.log(`已完成: ${allTodos[0].text}`);
    }

    // 4. 搜索功能
    console.log("\n4. 搜索功能测试:");
    todoApp.setSearchQuery("javascript");
    const searchResults = todoApp.getFilteredTodos();
    console.log(`搜索"javascript"的结果: ${searchResults.length}个`);

    // 5. 过滤功能
    console.log("\n5. 过滤功能测试:");
    todoApp.setSearchQuery(""); // 清除搜索
    todoApp.setFilter("active");
    const activeResults = todoApp.getFilteredTodos();
    console.log(`未完成的Todo: ${activeResults.length}个`);

    // 6. 统计信息
    console.log("\n6. 统计信息:");
    const stats = await todoApp.getStatistics();
    console.log("统计:", {
      总数: stats.total,
      已完成: stats.completed,
      待完成: stats.pending,
      按优先级: stats.byPriority,
    });

    // 7. 导出数据
    console.log("\n7. 数据导出:");
    const exportData = todoApp.exportData();
    console.log("导出数据长度:", JSON.stringify(exportData).length + "字符");

    // 8. 状态历史
    console.log("\n8. 操作历史:");
    const history = todoApp.state.history.slice(-5);
    history.forEach((entry) => {
      console.log(
        `  ${entry.action.type || "setState"} - ${new Date(
          entry.timestamp
        ).toLocaleTimeString()}`
      );
    });

    console.log("\n=== Todo应用演示完成 ===");
  } catch (error) {
    console.error("演示过程中发生错误:", error);
  }
}, 100);

// =============================================
// 7. 性能优化和最佳实践
// =============================================

console.log(`
Todo应用最佳实践总结:

1. 架构设计:
   - 分层架构：Model-Service-Controller
   - 状态管理：集中式状态管理器
   - 事件驱动：松耦合的组件通信
   - 中间件模式：可扩展的功能

2. 数据管理:
   - 数据验证：严格的输入验证
   - 持久化：本地存储和导入导出
   - 缓存策略：智能的数据缓存
   - 事务处理：批量操作支持

3. 性能优化:
   - 懒加载：按需加载数据
   - 虚拟化：大列表性能优化
   - 防抖节流：用户输入优化
   - 内存管理：避免内存泄漏

4. 用户体验:
   - 错误处理：友好的错误提示
   - 加载状态：明确的加载指示
   - 操作反馈：即时的用户反馈
   - 数据备份：防止数据丢失

5. 代码质量:
   - 类型安全：严格的类型检查
   - 错误边界：优雅的错误处理
   - 测试覆盖：全面的单元测试
   - 代码复用：可重用的组件

技术栈特点:
- 原生JavaScript实现
- 现代ES6+语法
- 函数式编程思想
- 响应式数据流
- 模块化设计
`);

// 导出供其他模块使用
module.exports = {
  StateManager,
  EventEmitter,
  TodoModel,
  StorageManager,
  TodoService,
  TodoApp,
};

console.log("Todo应用模块加载完成\n");
