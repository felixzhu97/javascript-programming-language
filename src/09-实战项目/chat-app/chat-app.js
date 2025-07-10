/**
 * JavaScript高级程序设计 - 第9章：实战项目 - 聊天应用
 *
 * 一个功能完整的实时聊天应用，演示WebSocket通信、消息管理、用户状态同步
 * 包含：实时通信、消息持久化、用户管理、表情支持等
 */

console.log("=== 聊天应用实战项目 ===\n");

// =============================================
// 1. WebSocket连接管理器
// =============================================

class WebSocketManager {
  constructor(url, options = {}) {
    this.url = url;
    this.options = {
      reconnectInterval: 5000,
      maxReconnectAttempts: 10,
      heartbeatInterval: 30000,
      ...options,
    };

    this.ws = null;
    this.reconnectAttempts = 0;
    this.isConnecting = false;
    this.heartbeatTimer = null;
    this.messageQueue = [];
    this.eventHandlers = new Map();

    this.setupEventHandlers();
  }

  // 设置事件处理器
  setupEventHandlers() {
    this.eventHandlers.set("open", []);
    this.eventHandlers.set("close", []);
    this.eventHandlers.set("error", []);
    this.eventHandlers.set("message", []);
    this.eventHandlers.set("reconnect", []);
  }

  // 连接WebSocket
  connect() {
    if (
      this.isConnecting ||
      (this.ws && this.ws.readyState === WebSocket.OPEN)
    ) {
      return Promise.resolve();
    }

    this.isConnecting = true;

    return new Promise((resolve, reject) => {
      try {
        // 模拟WebSocket连接
        this.ws = this.createMockWebSocket();

        this.ws.onopen = (event) => {
          console.log("WebSocket连接已建立");
          this.isConnecting = false;
          this.reconnectAttempts = 0;

          this.startHeartbeat();
          this.flushMessageQueue();

          this.emit("open", event);
          resolve();
        };

        this.ws.onclose = (event) => {
          console.log("WebSocket连接已关闭");
          this.stopHeartbeat();
          this.emit("close", event);

          if (!event.wasClean) {
            this.attemptReconnect();
          }
        };

        this.ws.onerror = (error) => {
          console.error("WebSocket错误:", error);
          this.isConnecting = false;
          this.emit("error", error);
          reject(error);
        };

        this.ws.onmessage = (event) => {
          this.handleMessage(event);
        };
      } catch (error) {
        this.isConnecting = false;
        reject(error);
      }
    });
  }

  // 创建模拟WebSocket
  createMockWebSocket() {
    const mockWS = {
      readyState: 0, // CONNECTING
      onopen: null,
      onclose: null,
      onerror: null,
      onmessage: null,

      send(data) {
        if (this.readyState !== 1) {
          throw new Error("WebSocket未连接");
        }

        // 模拟服务器响应
        setTimeout(() => {
          if (this.onmessage) {
            const response = this.generateMockResponse(data);
            this.onmessage({ data: JSON.stringify(response) });
          }
        }, 100);
      },

      close() {
        this.readyState = 3; // CLOSED
        if (this.onclose) {
          this.onclose({ wasClean: true });
        }
      },

      generateMockResponse(data) {
        try {
          const message = JSON.parse(data);

          switch (message.type) {
            case "join":
              return {
                type: "userJoined",
                user: message.user,
                timestamp: Date.now(),
              };

            case "message":
              return {
                type: "messageReceived",
                id: Math.random().toString(36).substr(2, 9),
                user: message.user,
                content: message.content,
                timestamp: Date.now(),
              };

            case "ping":
              return {
                type: "pong",
                timestamp: Date.now(),
              };

            default:
              return {
                type: "ack",
                originalType: message.type,
                timestamp: Date.now(),
              };
          }
        } catch (error) {
          return {
            type: "error",
            message: "无效的消息格式",
            timestamp: Date.now(),
          };
        }
      },
    };

    // 模拟连接建立
    setTimeout(() => {
      mockWS.readyState = 1; // OPEN
      if (mockWS.onopen) {
        mockWS.onopen({});
      }
    }, 500);

    return mockWS;
  }

  // 断线重连
  attemptReconnect() {
    if (this.reconnectAttempts >= this.options.maxReconnectAttempts) {
      console.error("达到最大重连次数，停止重连");
      return;
    }

    this.reconnectAttempts++;
    console.log(
      `尝试重连 (${this.reconnectAttempts}/${this.options.maxReconnectAttempts})`
    );

    setTimeout(() => {
      this.connect()
        .then(() => {
          this.emit("reconnect", { attempts: this.reconnectAttempts });
        })
        .catch((error) => {
          console.error("重连失败:", error);
        });
    }, this.options.reconnectInterval);
  }

  // 发送消息
  send(data) {
    const message = typeof data === "string" ? data : JSON.stringify(data);

    if (this.ws && this.ws.readyState === 1) {
      // OPEN
      this.ws.send(message);
    } else {
      // 连接未建立，加入队列
      this.messageQueue.push(message);
      console.log("消息已加入发送队列");
    }
  }

  // 刷新消息队列
  flushMessageQueue() {
    while (this.messageQueue.length > 0) {
      const message = this.messageQueue.shift();
      this.send(message);
    }
  }

  // 处理收到的消息
  handleMessage(event) {
    try {
      const data = JSON.parse(event.data);
      this.emit("message", data);
    } catch (error) {
      console.error("解析消息失败:", error);
      this.emit("error", error);
    }
  }

  // 心跳检测
  startHeartbeat() {
    this.heartbeatTimer = setInterval(() => {
      this.send({ type: "ping", timestamp: Date.now() });
    }, this.options.heartbeatInterval);
  }

  stopHeartbeat() {
    if (this.heartbeatTimer) {
      clearInterval(this.heartbeatTimer);
      this.heartbeatTimer = null;
    }
  }

  // 事件监听
  on(event, handler) {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event).push(handler);
  }

  // 移除事件监听
  off(event, handler) {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      const index = handlers.indexOf(handler);
      if (index > -1) {
        handlers.splice(index, 1);
      }
    }
  }

  // 触发事件
  emit(event, data) {
    const handlers = this.eventHandlers.get(event) || [];
    handlers.forEach((handler) => {
      try {
        handler(data);
      } catch (error) {
        console.error(`事件处理器错误 (${event}):`, error);
      }
    });
  }

  // 关闭连接
  close() {
    this.stopHeartbeat();
    if (this.ws) {
      this.ws.close();
    }
  }

  // 获取连接状态
  getState() {
    if (!this.ws) return "disconnected";

    switch (this.ws.readyState) {
      case 0:
        return "connecting";
      case 1:
        return "connected";
      case 2:
        return "closing";
      case 3:
        return "disconnected";
      default:
        return "unknown";
    }
  }
}

// =============================================
// 2. 消息管理器
// =============================================

class MessageManager {
  constructor() {
    this.messages = new Map(); // roomId -> messages[]
    this.messageIndex = new Map(); // messageId -> message
    this.filters = new Set();
    this.maxMessagesPerRoom = 1000;
  }

  // 添加消息
  addMessage(roomId, message) {
    if (!this.messages.has(roomId)) {
      this.messages.set(roomId, []);
    }

    const messages = this.messages.get(roomId);

    // 生成消息ID
    if (!message.id) {
      message.id = this.generateMessageId();
    }

    // 添加时间戳
    if (!message.timestamp) {
      message.timestamp = Date.now();
    }

    // 消息验证
    const validation = this.validateMessage(message);
    if (!validation.isValid) {
      throw new Error(`消息验证失败: ${validation.errors.join(", ")}`);
    }

    // 内容过滤
    message.content = this.filterContent(message.content);

    messages.push(message);
    this.messageIndex.set(message.id, message);

    // 限制消息数量
    if (messages.length > this.maxMessagesPerRoom) {
      const removedMessage = messages.shift();
      this.messageIndex.delete(removedMessage.id);
    }

    console.log(`消息已添加到房间 ${roomId}:`, message.content);
    return message;
  }

  // 获取房间消息
  getMessages(roomId, options = {}) {
    const messages = this.messages.get(roomId) || [];
    const {
      limit = 50,
      offset = 0,
      userId = null,
      messageType = null,
      since = null,
    } = options;

    let filtered = messages;

    // 用户过滤
    if (userId) {
      filtered = filtered.filter((msg) => msg.user.id === userId);
    }

    // 类型过滤
    if (messageType) {
      filtered = filtered.filter((msg) => msg.type === messageType);
    }

    // 时间过滤
    if (since) {
      filtered = filtered.filter((msg) => msg.timestamp >= since);
    }

    // 分页
    return filtered.slice(offset, offset + limit);
  }

  // 搜索消息
  searchMessages(roomId, query, options = {}) {
    const messages = this.messages.get(roomId) || [];
    const { caseSensitive = false } = options;

    const searchTerm = caseSensitive ? query : query.toLowerCase();

    return messages.filter((message) => {
      const content = caseSensitive
        ? message.content
        : message.content.toLowerCase();
      return content.includes(searchTerm);
    });
  }

  // 更新消息
  updateMessage(messageId, updates) {
    const message = this.messageIndex.get(messageId);
    if (!message) {
      throw new Error(`消息不存在: ${messageId}`);
    }

    // 只允许更新特定字段
    const allowedFields = ["content", "edited", "editedAt"];
    const filteredUpdates = {};

    for (const [key, value] of Object.entries(updates)) {
      if (allowedFields.includes(key)) {
        filteredUpdates[key] = value;
      }
    }

    Object.assign(message, filteredUpdates, {
      editedAt: Date.now(),
    });

    console.log(`消息已更新: ${messageId}`);
    return message;
  }

  // 删除消息
  deleteMessage(messageId) {
    const message = this.messageIndex.get(messageId);
    if (!message) {
      throw new Error(`消息不存在: ${messageId}`);
    }

    // 标记为删除而不是真正删除
    message.deleted = true;
    message.deletedAt = Date.now();
    message.content = "[消息已删除]";

    console.log(`消息已删除: ${messageId}`);
    return message;
  }

  // 生成消息ID
  generateMessageId() {
    return `msg_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 验证消息
  validateMessage(message) {
    const errors = [];

    if (!message.content || message.content.trim().length === 0) {
      errors.push("消息内容不能为空");
    }

    if (message.content && message.content.length > 1000) {
      errors.push("消息内容不能超过1000个字符");
    }

    if (!message.user || !message.user.id) {
      errors.push("消息必须包含有效的用户信息");
    }

    if (
      message.type &&
      !["text", "image", "file", "system"].includes(message.type)
    ) {
      errors.push("无效的消息类型");
    }

    return {
      isValid: errors.length === 0,
      errors,
    };
  }

  // 内容过滤
  filterContent(content) {
    // 敏感词过滤
    const badWords = ["垃圾", "广告", "恶意"];
    let filtered = content;

    badWords.forEach((word) => {
      const regex = new RegExp(word, "gi");
      filtered = filtered.replace(regex, "*".repeat(word.length));
    });

    return filtered;
  }

  // 添加内容过滤器
  addFilter(filterFn) {
    this.filters.add(filterFn);
  }

  // 移除内容过滤器
  removeFilter(filterFn) {
    this.filters.delete(filterFn);
  }

  // 获取消息统计
  getStatistics(roomId) {
    const messages = this.messages.get(roomId) || [];
    const users = new Set();
    const messageTypes = {};

    messages.forEach((message) => {
      users.add(message.user.id);

      const type = message.type || "text";
      messageTypes[type] = (messageTypes[type] || 0) + 1;
    });

    return {
      totalMessages: messages.length,
      activeUsers: users.size,
      messageTypes,
      firstMessage: messages[0]?.timestamp,
      lastMessage: messages[messages.length - 1]?.timestamp,
    };
  }

  // 清理房间消息
  clearRoom(roomId) {
    const messages = this.messages.get(roomId) || [];
    messages.forEach((message) => {
      this.messageIndex.delete(message.id);
    });
    this.messages.delete(roomId);

    console.log(`房间消息已清理: ${roomId}`);
  }
}

// =============================================
// 3. 用户管理器
// =============================================

class UserManager {
  constructor() {
    this.users = new Map(); // userId -> user
    this.userSessions = new Map(); // userId -> sessionInfo
    this.userRooms = new Map(); // userId -> Set<roomId>
    this.typingUsers = new Map(); // roomId -> Set<userId>
  }

  // 添加用户
  addUser(userInfo) {
    const user = {
      id: userInfo.id || this.generateUserId(),
      nickname: userInfo.nickname || `用户${Date.now()}`,
      avatar: userInfo.avatar || "👤",
      status: "online",
      joinedAt: Date.now(),
      lastActiveAt: Date.now(),
      ...userInfo,
    };

    this.users.set(user.id, user);
    this.userRooms.set(user.id, new Set());

    console.log(`用户已添加: ${user.nickname} (${user.id})`);
    return user;
  }

  // 获取用户信息
  getUser(userId) {
    return this.users.get(userId);
  }

  // 更新用户信息
  updateUser(userId, updates) {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error(`用户不存在: ${userId}`);
    }

    Object.assign(user, updates, {
      lastActiveAt: Date.now(),
    });

    console.log(`用户信息已更新: ${user.nickname}`);
    return user;
  }

  // 设置用户状态
  setUserStatus(userId, status) {
    const validStatuses = ["online", "away", "busy", "offline"];
    if (!validStatuses.includes(status)) {
      throw new Error(`无效的用户状态: ${status}`);
    }

    return this.updateUser(userId, { status });
  }

  // 用户加入房间
  joinRoom(userId, roomId) {
    const user = this.users.get(userId);
    if (!user) {
      throw new Error(`用户不存在: ${userId}`);
    }

    const userRooms = this.userRooms.get(userId);
    userRooms.add(roomId);

    this.updateUser(userId, { lastActiveAt: Date.now() });

    console.log(`用户 ${user.nickname} 加入房间 ${roomId}`);
    return true;
  }

  // 用户离开房间
  leaveRoom(userId, roomId) {
    const userRooms = this.userRooms.get(userId);
    if (userRooms) {
      userRooms.delete(roomId);
    }

    // 停止输入状态
    this.setTyping(userId, roomId, false);

    const user = this.users.get(userId);
    console.log(`用户 ${user?.nickname || userId} 离开房间 ${roomId}`);
    return true;
  }

  // 获取房间用户列表
  getRoomUsers(roomId) {
    const roomUsers = [];

    for (const [userId, userRooms] of this.userRooms) {
      if (userRooms.has(roomId)) {
        const user = this.users.get(userId);
        if (user) {
          roomUsers.push(user);
        }
      }
    }

    return roomUsers;
  }

  // 设置用户输入状态
  setTyping(userId, roomId, isTyping) {
    if (!this.typingUsers.has(roomId)) {
      this.typingUsers.set(roomId, new Set());
    }

    const typingSet = this.typingUsers.get(roomId);

    if (isTyping) {
      typingSet.add(userId);

      // 自动清除输入状态
      setTimeout(() => {
        typingSet.delete(userId);
      }, 5000);
    } else {
      typingSet.delete(userId);
    }

    return Array.from(typingSet);
  }

  // 获取房间输入状态用户
  getTypingUsers(roomId) {
    const typingSet = this.typingUsers.get(roomId) || new Set();
    return Array.from(typingSet)
      .map((userId) => this.users.get(userId))
      .filter(Boolean);
  }

  // 用户离线
  setUserOffline(userId) {
    const user = this.users.get(userId);
    if (user) {
      user.status = "offline";
      user.lastSeenAt = Date.now();

      // 从所有房间移除
      const userRooms = this.userRooms.get(userId) || new Set();
      for (const roomId of userRooms) {
        this.leaveRoom(userId, roomId);
      }
    }
  }

  // 生成用户ID
  generateUserId() {
    return `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 获取在线用户统计
  getOnlineStats() {
    const statuses = {};
    let totalUsers = 0;

    for (const user of this.users.values()) {
      totalUsers++;
      statuses[user.status] = (statuses[user.status] || 0) + 1;
    }

    return {
      totalUsers,
      onlineUsers: statuses.online || 0,
      statuses,
    };
  }

  // 清理离线用户
  cleanupOfflineUsers(maxOfflineTime = 24 * 60 * 60 * 1000) {
    // 24小时
    const now = Date.now();
    const usersToRemove = [];

    for (const [userId, user] of this.users) {
      if (
        user.status === "offline" &&
        user.lastSeenAt &&
        now - user.lastSeenAt > maxOfflineTime
      ) {
        usersToRemove.push(userId);
      }
    }

    usersToRemove.forEach((userId) => {
      this.users.delete(userId);
      this.userRooms.delete(userId);
      console.log(`已清理离线用户: ${userId}`);
    });

    return usersToRemove.length;
  }
}

// =============================================
// 4. 房间管理器
// =============================================

class RoomManager {
  constructor() {
    this.rooms = new Map(); // roomId -> room
    this.roomTypes = new Set(["public", "private", "group"]);
  }

  // 创建房间
  createRoom(roomInfo) {
    const room = {
      id: roomInfo.id || this.generateRoomId(),
      name: roomInfo.name || "新建房间",
      description: roomInfo.description || "",
      type: roomInfo.type || "public",
      maxUsers: roomInfo.maxUsers || 100,
      createdBy: roomInfo.createdBy,
      createdAt: Date.now(),
      settings: {
        allowFileUpload: true,
        allowImageUpload: true,
        messageHistory: true,
        ...roomInfo.settings,
      },
      ...roomInfo,
    };

    if (!this.roomTypes.has(room.type)) {
      throw new Error(`无效的房间类型: ${room.type}`);
    }

    this.rooms.set(room.id, room);

    console.log(`房间已创建: ${room.name} (${room.id})`);
    return room;
  }

  // 获取房间信息
  getRoom(roomId) {
    return this.rooms.get(roomId);
  }

  // 更新房间信息
  updateRoom(roomId, updates) {
    const room = this.rooms.get(roomId);
    if (!room) {
      throw new Error(`房间不存在: ${roomId}`);
    }

    // 合并设置
    if (updates.settings) {
      updates.settings = { ...room.settings, ...updates.settings };
    }

    Object.assign(room, updates, {
      updatedAt: Date.now(),
    });

    console.log(`房间信息已更新: ${room.name}`);
    return room;
  }

  // 删除房间
  deleteRoom(roomId) {
    const room = this.rooms.get(roomId);
    if (room) {
      this.rooms.delete(roomId);
      console.log(`房间已删除: ${room.name}`);
      return room;
    }
    return null;
  }

  // 获取所有房间
  getAllRooms(type = null) {
    const rooms = Array.from(this.rooms.values());

    if (type) {
      return rooms.filter((room) => room.type === type);
    }

    return rooms;
  }

  // 搜索房间
  searchRooms(query) {
    const rooms = Array.from(this.rooms.values());
    const searchTerm = query.toLowerCase();

    return rooms.filter(
      (room) =>
        room.name.toLowerCase().includes(searchTerm) ||
        room.description.toLowerCase().includes(searchTerm)
    );
  }

  // 生成房间ID
  generateRoomId() {
    return `room_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
  }

  // 获取房间统计
  getRoomStats(roomId) {
    const room = this.rooms.get(roomId);
    if (!room) {
      return null;
    }

    return {
      id: room.id,
      name: room.name,
      type: room.type,
      createdAt: room.createdAt,
      maxUsers: room.maxUsers,
    };
  }
}

// =============================================
// 5. 聊天应用主类
// =============================================

class ChatApp {
  constructor() {
    this.wsManager = new WebSocketManager("wss://chat.example.com");
    this.messageManager = new MessageManager();
    this.userManager = new UserManager();
    this.roomManager = new RoomManager();

    this.currentUser = null;
    this.currentRoom = null;
    this.isConnected = false;

    this.setupEventHandlers();
    this.setupDefaultRooms();
  }

  // 设置事件处理器
  setupEventHandlers() {
    // WebSocket事件
    this.wsManager.on("open", () => {
      this.isConnected = true;
      console.log("聊天应用已连接");

      if (this.currentUser) {
        this.wsManager.send({
          type: "join",
          user: this.currentUser,
        });
      }
    });

    this.wsManager.on("close", () => {
      this.isConnected = false;
      console.log("聊天应用连接已断开");
    });

    this.wsManager.on("message", (data) => {
      this.handleServerMessage(data);
    });

    this.wsManager.on("error", (error) => {
      console.error("聊天应用连接错误:", error);
    });

    this.wsManager.on("reconnect", (info) => {
      console.log(`聊天应用已重连 (尝试次数: ${info.attempts})`);
    });
  }

  // 设置默认房间
  setupDefaultRooms() {
    this.roomManager.createRoom({
      id: "general",
      name: "大厅",
      description: "欢迎来到聊天大厅",
      type: "public",
    });

    this.roomManager.createRoom({
      id: "tech",
      name: "技术讨论",
      description: "技术相关话题讨论",
      type: "public",
    });
  }

  // 初始化应用
  async init() {
    try {
      await this.wsManager.connect();
      console.log("聊天应用初始化完成");
    } catch (error) {
      console.error("聊天应用初始化失败:", error);
      throw error;
    }
  }

  // 用户登录
  login(userInfo) {
    this.currentUser = this.userManager.addUser(userInfo);

    if (this.isConnected) {
      this.wsManager.send({
        type: "join",
        user: this.currentUser,
      });
    }

    console.log(`用户登录: ${this.currentUser.nickname}`);
    return this.currentUser;
  }

  // 用户退出
  logout() {
    if (this.currentUser) {
      this.userManager.setUserOffline(this.currentUser.id);

      if (this.isConnected) {
        this.wsManager.send({
          type: "leave",
          user: this.currentUser,
        });
      }

      console.log(`用户退出: ${this.currentUser.nickname}`);
      this.currentUser = null;
    }
  }

  // 加入房间
  joinRoom(roomId) {
    const room = this.roomManager.getRoom(roomId);
    if (!room) {
      throw new Error(`房间不存在: ${roomId}`);
    }

    if (!this.currentUser) {
      throw new Error("请先登录");
    }

    // 离开当前房间
    if (this.currentRoom) {
      this.leaveRoom();
    }

    this.currentRoom = room;
    this.userManager.joinRoom(this.currentUser.id, roomId);

    if (this.isConnected) {
      this.wsManager.send({
        type: "joinRoom",
        roomId,
        user: this.currentUser,
      });
    }

    console.log(`已加入房间: ${room.name}`);
    return room;
  }

  // 离开房间
  leaveRoom() {
    if (this.currentRoom && this.currentUser) {
      this.userManager.leaveRoom(this.currentUser.id, this.currentRoom.id);

      if (this.isConnected) {
        this.wsManager.send({
          type: "leaveRoom",
          roomId: this.currentRoom.id,
          user: this.currentUser,
        });
      }

      console.log(`已离开房间: ${this.currentRoom.name}`);
      this.currentRoom = null;
    }
  }

  // 发送消息
  sendMessage(content, type = "text") {
    if (!this.currentUser) {
      throw new Error("请先登录");
    }

    if (!this.currentRoom) {
      throw new Error("请先加入房间");
    }

    const message = {
      type,
      content,
      user: this.currentUser,
      roomId: this.currentRoom.id,
    };

    // 本地添加消息
    const addedMessage = this.messageManager.addMessage(
      this.currentRoom.id,
      message
    );

    // 发送到服务器
    if (this.isConnected) {
      this.wsManager.send({
        type: "message",
        ...addedMessage,
      });
    }

    return addedMessage;
  }

  // 处理服务器消息
  handleServerMessage(data) {
    switch (data.type) {
      case "messageReceived":
        if (data.roomId === this.currentRoom?.id) {
          this.messageManager.addMessage(data.roomId, {
            id: data.id,
            content: data.content,
            user: data.user,
            timestamp: data.timestamp,
            type: data.messageType || "text",
          });
        }
        break;

      case "userJoined":
        console.log(`用户加入: ${data.user.nickname}`);
        break;

      case "userLeft":
        console.log(`用户离开: ${data.user.nickname}`);
        break;

      case "userTyping":
        if (data.roomId === this.currentRoom?.id) {
          this.userManager.setTyping(data.user.id, data.roomId, true);
        }
        break;

      case "error":
        console.error("服务器错误:", data.message);
        break;

      default:
        console.log("未处理的消息类型:", data.type);
    }
  }

  // 设置输入状态
  setTyping(isTyping) {
    if (!this.currentUser || !this.currentRoom) return;

    this.userManager.setTyping(
      this.currentUser.id,
      this.currentRoom.id,
      isTyping
    );

    if (this.isConnected) {
      this.wsManager.send({
        type: "typing",
        roomId: this.currentRoom.id,
        user: this.currentUser,
        isTyping,
      });
    }
  }

  // 获取房间消息
  getRoomMessages(limit = 50, offset = 0) {
    if (!this.currentRoom) return [];

    return this.messageManager.getMessages(this.currentRoom.id, {
      limit,
      offset,
    });
  }

  // 搜索消息
  searchMessages(query) {
    if (!this.currentRoom) return [];

    return this.messageManager.searchMessages(this.currentRoom.id, query);
  }

  // 获取房间用户列表
  getRoomUsers() {
    if (!this.currentRoom) return [];

    return this.userManager.getRoomUsers(this.currentRoom.id);
  }

  // 获取输入状态用户
  getTypingUsers() {
    if (!this.currentRoom) return [];

    return this.userManager
      .getTypingUsers(this.currentRoom.id)
      .filter((user) => user.id !== this.currentUser?.id);
  }

  // 创建私人房间
  createPrivateRoom(userIds, roomName) {
    const room = this.roomManager.createRoom({
      name: roomName || "私人聊天",
      type: "private",
      createdBy: this.currentUser.id,
      members: userIds,
    });

    // 将用户添加到房间
    userIds.forEach((userId) => {
      this.userManager.joinRoom(userId, room.id);
    });

    return room;
  }

  // 获取应用统计
  getStats() {
    return {
      users: this.userManager.getOnlineStats(),
      rooms: {
        total: this.roomManager.getAllRooms().length,
        public: this.roomManager.getAllRooms("public").length,
        private: this.roomManager.getAllRooms("private").length,
      },
      messages: this.currentRoom
        ? this.messageManager.getStatistics(this.currentRoom.id)
        : null,
      connection: {
        status: this.wsManager.getState(),
        reconnectAttempts: this.wsManager.reconnectAttempts,
      },
    };
  }

  // 清理资源
  destroy() {
    this.logout();
    this.wsManager.close();
    console.log("聊天应用已清理");
  }
}

// =============================================
// 6. 应用演示
// =============================================

console.log("启动聊天应用演示...\n");

// 创建应用实例
const chatApp = new ChatApp();

// 演示应用功能
setTimeout(async () => {
  try {
    console.log("=== 聊天应用功能演示 ===\n");

    // 1. 初始化应用
    console.log("1. 初始化聊天应用:");
    await chatApp.init();

    // 2. 用户登录
    console.log("\n2. 用户登录:");
    const user = chatApp.login({
      nickname: "张三",
      avatar: "👨‍💻",
    });
    console.log(`登录成功: ${user.nickname}`);

    // 3. 加入房间
    console.log("\n3. 加入聊天房间:");
    const room = chatApp.joinRoom("general");
    console.log(`已加入房间: ${room.name}`);

    // 4. 发送消息
    console.log("\n4. 发送消息:");
    chatApp.sendMessage("大家好！我是新来的。");
    chatApp.sendMessage("很高兴认识大家！");

    // 5. 显示房间消息
    console.log("\n5. 房间消息历史:");
    const messages = chatApp.getRoomMessages();
    messages.forEach((msg) => {
      const time = new Date(msg.timestamp).toLocaleTimeString();
      console.log(`[${time}] ${msg.user.nickname}: ${msg.content}`);
    });

    // 6. 模拟其他用户
    console.log("\n6. 模拟其他用户加入:");
    const user2 = chatApp.userManager.addUser({
      nickname: "李四",
      avatar: "👩‍💼",
    });
    chatApp.userManager.joinRoom(user2.id, room.id);

    // 模拟接收消息
    chatApp.messageManager.addMessage(room.id, {
      content: "欢迎新朋友！",
      user: user2,
      type: "text",
    });

    // 7. 显示房间用户
    console.log("\n7. 房间用户列表:");
    const roomUsers = chatApp.getRoomUsers();
    roomUsers.forEach((user) => {
      console.log(`  ${user.avatar} ${user.nickname} (${user.status})`);
    });

    // 8. 搜索消息
    console.log("\n8. 消息搜索:");
    const searchResults = chatApp.searchMessages("欢迎");
    console.log(`搜索"欢迎"的结果: ${searchResults.length}条消息`);

    // 9. 输入状态演示
    console.log("\n9. 输入状态演示:");
    chatApp.setTyping(true);
    console.log("开始输入...");

    setTimeout(() => {
      chatApp.setTyping(false);
      const typingUsers = chatApp.getTypingUsers();
      console.log(`当前输入用户: ${typingUsers.length}人`);
    }, 2000);

    // 10. 应用统计
    console.log("\n10. 应用统计:");
    const stats = chatApp.getStats();
    console.log("统计信息:", {
      在线用户: stats.users.onlineUsers,
      房间总数: stats.rooms.total,
      消息总数: stats.messages?.totalMessages || 0,
      连接状态: stats.connection.status,
    });

    console.log("\n=== 聊天应用演示完成 ===");
  } catch (error) {
    console.error("演示过程中发生错误:", error);
  }
}, 100);

// 清理演示（10秒后）
setTimeout(() => {
  chatApp.destroy();
}, 10000);

// =============================================
// 7. 最佳实践总结
// =============================================

console.log(`
聊天应用最佳实践总结:

1. 实时通信:
   - WebSocket连接管理
   - 自动重连机制
   - 心跳检测
   - 消息队列处理

2. 消息管理:
   - 消息验证和过滤
   - 内容审核机制
   - 消息历史存储
   - 分页和搜索

3. 用户管理:
   - 在线状态同步
   - 输入状态显示
   - 用户权限控制
   - 会话管理

4. 房间管理:
   - 多房间支持
   - 房间权限控制
   - 私人聊天
   - 群组管理

5. 性能优化:
   - 消息分页加载
   - 虚拟滚动
   - 连接池管理
   - 数据缓存

6. 用户体验:
   - 实时消息推送
   - 离线消息同步
   - 表情符号支持
   - 文件分享功能

技术特点:
- 事件驱动架构
- 模块化设计
- 错误处理机制
- 扩展性支持
- 实时数据同步
`);

// 导出模块
module.exports = {
  WebSocketManager,
  MessageManager,
  UserManager,
  RoomManager,
  ChatApp,
};

console.log("聊天应用模块加载完成\n");
