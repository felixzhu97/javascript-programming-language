/**
 * JavaScript高级程序设计 - 第6章：解构赋值
 *
 * 本文件演示ES6解构赋值的各种模式和应用场景
 */

console.log("=== JavaScript 解构赋值 ===\n");

// =============================================
// 1. 数组解构基础
// =============================================

console.log("1. 数组解构基础");

// 基础数组解构
const numbers = [1, 2, 3, 4, 5];
const [first, second, third] = numbers;

console.log("基础解构:");
console.log(`第一个: ${first}, 第二个: ${second}, 第三个: ${third}`);

// 跳过元素
const [a, , c, , e] = numbers;
console.log("跳过元素:", { a, c, e });

// 剩余参数
const [head, ...tail] = numbers;
console.log("剩余参数:", { head, tail });

// 默认值
const [x = 0, y = 0, z = 0, w = 10] = [1, 2];
console.log("默认值:", { x, y, z, w });

// 嵌套数组解构
const nested = [
  [1, 2],
  [3, 4],
  [5, 6],
];
const [[first1, second1], [first2, second2]] = nested;
console.log("嵌套解构:", { first1, second1, first2, second2 });

console.log();

// =============================================
// 2. 对象解构基础
// =============================================

console.log("2. 对象解构基础");

const person = {
  name: "张三",
  age: 30,
  address: {
    city: "北京",
    district: "朝阳区",
    street: "建国路",
  },
  hobbies: ["读书", "旅游", "摄影"],
};

// 基础对象解构
const { name, age } = person;
console.log("基础解构:", { name, age });

// 重命名变量
const { name: personName, age: personAge } = person;
console.log("重命名:", { personName, personAge });

// 默认值
const { name: n, height = 170, weight = 65 } = person;
console.log("默认值:", { n, height, weight });

// 嵌套对象解构
const {
  address: { city, district },
} = person;
console.log("嵌套解构:", { city, district });

// 复杂嵌套解构
const {
  address: { city: userCity, ...restAddress },
  hobbies: [firstHobby, ...otherHobbies],
} = person;
console.log("复杂解构:", { userCity, restAddress, firstHobby, otherHobbies });

console.log();

// =============================================
// 3. 函数参数解构
// =============================================

console.log("3. 函数参数解构");

// 数组参数解构
function processCoordinates([x, y, z = 0]) {
  console.log(`坐标: x=${x}, y=${y}, z=${z}`);
  return { x, y, z };
}

// 对象参数解构
function createUser({ name, age, email, role = "user" }) {
  console.log(`创建用户: ${name}, ${age}岁, ${email}, 角色: ${role}`);
  return { name, age, email, role, id: Date.now() };
}

// 复杂参数解构
function processData({
  data: { items, total },
  options: { limit = 10, offset = 0 } = {},
  callback = () => {},
}) {
  console.log(
    `处理数据: ${items.length}/${total} 项, 限制: ${limit}, 偏移: ${offset}`
  );
  callback({ processed: items.length, total });
}

// 测试函数参数解构
console.log("函数参数解构:");

processCoordinates([10, 20]);
processCoordinates([10, 20, 30]);

const user = createUser({
  name: "李四",
  age: 25,
  email: "lisi@example.com",
});
console.log("创建的用户:", user);

processData({
  data: {
    items: [1, 2, 3, 4, 5],
    total: 100,
  },
  options: {
    limit: 5,
  },
  callback: (result) => console.log("回调结果:", result),
});

console.log();

// =============================================
// 4. 解构赋值高级用法
// =============================================

console.log("4. 解构赋值高级用法");

// 变量交换
let var1 = "hello";
let var2 = "world";
[var1, var2] = [var2, var1];
console.log("变量交换:", { var1, var2 });

// 函数返回多值
function getStats(arr) {
  return {
    length: arr.length,
    sum: arr.reduce((a, b) => a + b, 0),
    average: arr.reduce((a, b) => a + b, 0) / arr.length,
    min: Math.min(...arr),
    max: Math.max(...arr),
  };
}

const data = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
const { length, sum, average, min, max } = getStats(data);
console.log("统计结果:", { length, sum, average, min, max });

// 从数组中提取值
function extractValues(source, indices) {
  return indices.map((index) => source[index]);
}

const sourceArray = ["a", "b", "c", "d", "e", "f"];
const [val1, val2, val3] = extractValues(sourceArray, [0, 2, 4]);
console.log("提取的值:", { val1, val2, val3 });

// 对象属性重命名和提取
function transformObject(obj, mapping) {
  const result = {};
  Object.entries(mapping).forEach(([newKey, oldKey]) => {
    if (oldKey in obj) {
      result[newKey] = obj[oldKey];
    }
  });
  return result;
}

const originalData = {
  user_name: "王五",
  user_age: 28,
  user_email: "wangwu@example.com",
  user_phone: "123-456-7890",
};

const transformed = transformObject(originalData, {
  name: "user_name",
  age: "user_age",
  email: "user_email",
});

const { name: userName, age: userAge, email: userEmail } = transformed;
console.log("转换后的数据:", { userName, userAge, userEmail });

console.log();

// =============================================
// 5. 解构与迭代器
// =============================================

console.log("5. 解构与迭代器");

// Map解构
const userMap = new Map([
  ["name", "赵六"],
  ["age", 32],
  ["city", "上海"],
]);

for (const [key, value] of userMap) {
  console.log(`Map解构: ${key} = ${value}`);
}

// Set解构
const coordinates = new Set([
  [0, 0],
  [1, 1],
  [2, 4],
]);
for (const [x, y] of coordinates) {
  console.log(`Set解构: (${x}, ${y})`);
}

// 对象entries解构
const config = {
  host: "localhost",
  port: 3000,
  protocol: "http",
  timeout: 5000,
};

console.log("对象entries解构:");
for (const [key, value] of Object.entries(config)) {
  console.log(`  ${key}: ${value}`);
}

// 数组方法链式解构
const processNumbers = (numbers) => {
  return numbers
    .map((n) => [n, n * 2])
    .filter(([original, doubled]) => doubled > 10)
    .map(([original, doubled]) => ({ original, doubled }));
};

const processedNumbers = processNumbers([1, 2, 3, 4, 5, 6, 7]);
console.log("处理后的数字:", processedNumbers);

console.log();

// =============================================
// 6. 解构在异步编程中的应用
// =============================================

console.log("6. 解构在异步编程中的应用");

// 模拟API响应
const mockApiResponse = {
  status: 200,
  data: {
    users: [
      { id: 1, name: "用户1", active: true },
      { id: 2, name: "用户2", active: false },
      { id: 3, name: "用户3", active: true },
    ],
    pagination: {
      page: 1,
      limit: 10,
      total: 25,
    },
  },
  meta: {
    timestamp: Date.now(),
    requestId: "req-123",
  },
};

// Promise解构
function fetchUserData() {
  return Promise.resolve(mockApiResponse);
}

async function handleApiResponse() {
  try {
    const {
      status,
      data: {
        users,
        pagination: { page, total },
      },
      meta: { timestamp },
    } = await fetchUserData();

    console.log("API响应解构:");
    console.log(`状态: ${status}`);
    console.log(`用户数: ${users.length}`);
    console.log(`页码: ${page}/${Math.ceil(total / 10)}`);
    console.log(`时间戳: ${new Date(timestamp).toLocaleString()}`);

    // 进一步解构用户数据
    const [
      { id: firstId, name: firstName },
      ,
      { id: thirdId, name: thirdName },
    ] = users;
    console.log(`第一个用户: ${firstName} (ID: ${firstId})`);
    console.log(`第三个用户: ${thirdName} (ID: ${thirdId})`);
  } catch (error) {
    console.error("API请求失败:", error);
  }
}

// 并行请求解构
async function fetchMultipleData() {
  const promises = [
    Promise.resolve({ type: "users", data: [1, 2, 3] }),
    Promise.resolve({ type: "posts", data: [4, 5, 6] }),
    Promise.resolve({ type: "comments", data: [7, 8, 9] }),
  ];

  try {
    const [{ data: userData }, { data: postData }, { data: commentData }] =
      await Promise.all(promises);

    console.log("并行请求结果:");
    console.log("用户数据:", userData);
    console.log("文章数据:", postData);
    console.log("评论数据:", commentData);
  } catch (error) {
    console.error("并行请求失败:", error);
  }
}

handleApiResponse();
fetchMultipleData();

console.log();

// =============================================
// 7. 条件解构和动态解构
// =============================================

console.log("7. 条件解构和动态解构");

// 条件解构
function processUserData(userData) {
  const isAdmin = userData.role === "admin";

  if (isAdmin) {
    const { name, email, permissions, lastLogin, adminLevel = 1 } = userData;

    console.log("管理员数据:", {
      name,
      email,
      permissions,
      lastLogin,
      adminLevel,
    });
  } else {
    const { name, email, profile: { avatar, bio } = {} } = userData;

    console.log("普通用户数据:", { name, email, avatar, bio });
  }
}

// 动态解构
function dynamicDestructure(obj, keys) {
  const result = {};
  keys.forEach((key) => {
    if (key.includes(".")) {
      // 处理嵌套属性
      const path = key.split(".");
      let value = obj;
      for (const prop of path) {
        value = value?.[prop];
      }
      result[key.replace(/\./g, "_")] = value;
    } else {
      result[key] = obj[key];
    }
  });
  return result;
}

// 测试条件解构
const adminUser = {
  name: "管理员",
  email: "admin@example.com",
  role: "admin",
  permissions: ["read", "write", "delete"],
  lastLogin: new Date().toISOString(),
  adminLevel: 3,
};

const regularUser = {
  name: "普通用户",
  email: "user@example.com",
  role: "user",
  profile: {
    avatar: "avatar.jpg",
    bio: "这是用户简介",
  },
};

processUserData(adminUser);
processUserData(regularUser);

// 测试动态解构
const complexObject = {
  user: {
    personal: {
      name: "测试用户",
      age: 25,
    },
    contact: {
      email: "test@example.com",
      phone: "123-456-7890",
    },
  },
  settings: {
    theme: "dark",
    language: "zh-CN",
  },
};

const extracted = dynamicDestructure(complexObject, [
  "user.personal.name",
  "user.contact.email",
  "settings.theme",
]);

console.log("动态解构结果:", extracted);

console.log();

// =============================================
// 8. 解构的性能考虑
// =============================================

console.log("8. 解构的性能考虑");

// 性能基准测试
function performanceBenchmark() {
  const testData = {
    a: 1,
    b: 2,
    c: 3,
    d: 4,
    e: 5,
    nested: { x: 10, y: 20, z: 30 },
  };

  const iterations = 100000;

  // 测试传统属性访问
  console.time("传统属性访问");
  for (let i = 0; i < iterations; i++) {
    const a = testData.a;
    const b = testData.b;
    const c = testData.c;
    const x = testData.nested.x;
    const y = testData.nested.y;
  }
  console.timeEnd("传统属性访问");

  // 测试解构赋值
  console.time("解构赋值");
  for (let i = 0; i < iterations; i++) {
    const {
      a,
      b,
      c,
      nested: { x, y },
    } = testData;
  }
  console.timeEnd("解构赋值");

  // 测试部分解构
  console.time("部分解构");
  for (let i = 0; i < iterations; i++) {
    const {
      a,
      nested: { x },
    } = testData;
  }
  console.timeEnd("部分解构");
}

performanceBenchmark();

// 内存使用优化
function optimizedDestructuring() {
  const largeObject = {
    data: new Array(1000)
      .fill(0)
      .map((_, i) => ({ id: i, value: Math.random() })),
    metadata: { count: 1000, type: "test" },
    config: { version: "1.0", env: "production" },
  };

  // 避免解构大数组，只取需要的部分
  const {
    metadata: { count },
    config: { version },
  } = largeObject;
  console.log("优化的解构:", { count, version });

  // 对于大数组，使用索引访问而非解构
  const firstItem = largeObject.data[0];
  const lastItem = largeObject.data[largeObject.data.length - 1];
  console.log("数组访问:", { firstItem: firstItem.id, lastItem: lastItem.id });
}

optimizedDestructuring();

console.log();

// =============================================
// 9. 解构在模式匹配中的应用
// =============================================

console.log("9. 解构在模式匹配中的应用");

// 模式匹配函数
function matchPattern(data) {
  switch (true) {
    case Array.isArray(data):
      const [first, ...rest] = data;
      console.log(`数组模式: 首元素=${first}, 剩余${rest.length}个元素`);
      break;

    case data && typeof data === "object" && "type" in data:
      const { type, ...payload } = data;
      console.log(`类型化对象: ${type}`, payload);
      break;

    case typeof data === "string":
      const [firstChar, ...restChars] = data;
      console.log(`字符串模式: 首字符=${firstChar}, 长度=${data.length}`);
      break;

    default:
      console.log("未知模式:", typeof data);
  }
}

// 状态机模式
class StateMachine {
  constructor(initialState) {
    this.state = initialState;
  }

  transition(action) {
    const { type, payload = {} } = action;

    switch (this.state.name) {
      case "idle":
        if (type === "START") {
          const { mode = "normal" } = payload;
          this.state = { name: "running", mode };
          console.log(`从空闲状态启动，模式: ${mode}`);
        }
        break;

      case "running":
        if (type === "PAUSE") {
          const { reason = "user request" } = payload;
          this.state = {
            name: "paused",
            reason,
            previousMode: this.state.mode,
          };
          console.log(`暂停运行，原因: ${reason}`);
        } else if (type === "STOP") {
          this.state = { name: "idle" };
          console.log("停止运行");
        }
        break;

      case "paused":
        if (type === "RESUME") {
          const { previousMode } = this.state;
          this.state = { name: "running", mode: previousMode };
          console.log(`恢复运行，模式: ${previousMode}`);
        }
        break;
    }
  }

  getState() {
    return { ...this.state };
  }
}

// 测试模式匹配
console.log("模式匹配测试:");
matchPattern([1, 2, 3, 4, 5]);
matchPattern({ type: "user", name: "张三", age: 30 });
matchPattern("Hello World");
matchPattern(42);

// 测试状态机
console.log("\n状态机测试:");
const machine = new StateMachine({ name: "idle" });
console.log("初始状态:", machine.getState());

machine.transition({ type: "START", payload: { mode: "debug" } });
console.log("当前状态:", machine.getState());

machine.transition({ type: "PAUSE", payload: { reason: "系统维护" } });
console.log("当前状态:", machine.getState());

machine.transition({ type: "RESUME" });
console.log("当前状态:", machine.getState());

console.log();

// =============================================
// 10. 最佳实践总结
// =============================================

console.log("10. 最佳实践总结");

console.log(`
解构赋值最佳实践:

1. 可读性优化:
   - 使用有意义的变量名
   - 避免过深的嵌套解构
   - 合理使用默认值
   - 保持解构模式简洁

2. 性能考虑:
   - 避免解构大型对象
   - 只解构需要的属性
   - 在循环中谨慎使用解构
   - 考虑使用传统访问方式

3. 错误处理:
   - 为可能不存在的属性提供默认值
   - 使用可选链操作符(?.)
   - 在解构前检查数据类型
   - 合理处理null/undefined

4. 函数设计:
   - 参数解构提高API清晰度
   - 使用对象参数替代多个参数
   - 提供合理的默认值
   - 文档化解构参数结构

5. 代码组织:
   - 将复杂解构提取为函数
   - 使用解构简化数据转换
   - 在模块导入中使用解构
   - 保持一致的解构风格

常见陷阱:
- 解构undefined导致错误
- 过度嵌套导致可读性下降
- 忘记设置默认值
- 性能敏感场景的误用
- 变量名冲突问题

使用场景:
- 函数参数简化
- API响应数据处理
- 数组/对象数据提取
- 状态管理中的数据更新
- 模块导入导出
`);

// 导出供测试使用
module.exports = {
  processCoordinates,
  createUser,
  processData,
  getStats,
  extractValues,
  transformObject,
  processNumbers,
  fetchUserData,
  handleApiResponse,
  fetchMultipleData,
  processUserData,
  dynamicDestructure,
  performanceBenchmark,
  optimizedDestructuring,
  matchPattern,
  StateMachine,
};

console.log("解构赋值演示完成\n");
