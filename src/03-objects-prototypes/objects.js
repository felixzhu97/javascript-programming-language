/**
 * JavaScript高级程序设计 - 第3章：对象创建和操作
 *
 * 本文件演示JavaScript中的对象创建方式、属性操作和对象方法
 */

console.log("=== JavaScript 对象创建和操作 ===\n");

// 1. 对象创建方式
console.log("1. 对象创建方式：");

// 对象字面量
const literalObject = {
  name: "Alice",
  age: 25,
  city: "New York",
};

// 构造函数
function Person(name, age) {
  this.name = name;
  this.age = age;
}

const constructorObject = new Person("Bob", 30);

// Object.create()
const prototypeObject = Object.create(Person.prototype);
prototypeObject.name = "Charlie";
prototypeObject.age = 35;

// 工厂函数
function createPerson(name, age) {
  return {
    name: name,
    age: age,
    introduce: function () {
      return `Hi, I'm ${this.name}, ${this.age} years old.`;
    },
  };
}

const factoryObject = createPerson("David", 28);

console.log("字面量对象：", literalObject);
console.log("构造函数对象：", constructorObject);
console.log("原型对象：", prototypeObject);
console.log("工厂对象：", factoryObject.introduce());

// 2. 属性操作
console.log("\n2. 属性操作：");

const obj = {};

// 添加属性
obj.name = "Test";
obj["age"] = 25;
obj[Symbol("id")] = 123;

// 动态属性名
const propName = "dynamicProp";
obj[propName] = "dynamic value";

console.log("对象属性：", obj);

// 属性检查
console.log("hasOwnProperty:", obj.hasOwnProperty("name"));
console.log("in操作符:", "name" in obj);
console.log("属性描述符：", Object.getOwnPropertyDescriptor(obj, "name"));

// 删除属性
delete obj.age;
console.log("删除后：", obj);

// 3. 属性描述符
console.log("\n3. 属性描述符：");

const descriptorObj = {};

// 定义属性
Object.defineProperty(descriptorObj, "name", {
  value: "John",
  writable: true,
  enumerable: true,
  configurable: true,
});

Object.defineProperty(descriptorObj, "age", {
  value: 30,
  writable: false,
  enumerable: true,
  configurable: true,
});

Object.defineProperty(descriptorObj, "secret", {
  value: "hidden",
  writable: true,
  enumerable: false,
  configurable: true,
});

console.log("描述符对象：", descriptorObj);
console.log("可枚举属性：", Object.keys(descriptorObj));
console.log("所有属性：", Object.getOwnPropertyNames(descriptorObj));

// 尝试修改不可写属性
try {
  descriptorObj.age = 31;
  console.log("修改后年龄：", descriptorObj.age); // 仍然是30
} catch (e) {
  console.log("修改失败：", e.message);
}

// 4. 访问器属性
console.log("\n4. 访问器属性：");

const accessorObj = {
  _name: "Jane",

  get name() {
    console.log("获取name属性");
    return this._name;
  },

  set name(value) {
    console.log("设置name属性:", value);
    this._name = value;
  },
};

console.log("访问器获取：", accessorObj.name);
accessorObj.name = "Janet";
console.log("访问器设置后：", accessorObj.name);

// 使用Object.defineProperty定义访问器
Object.defineProperty(accessorObj, "age", {
  get: function () {
    return this._age || 0;
  },
  set: function (value) {
    if (value >= 0 && value <= 150) {
      this._age = value;
    }
  },
  enumerable: true,
  configurable: true,
});

accessorObj.age = 25;
console.log("访问器年龄：", accessorObj.age);

// 5. 对象方法
console.log("\n5. 对象方法：");

const methodObj = {
  name: "Method Object",

  // 传统方法
  traditionalMethod: function () {
    return `传统方法: ${this.name}`;
  },

  // 简写方法
  shorthandMethod() {
    return `简写方法: ${this.name}`;
  },

  // 箭头函数（注意this绑定）
  arrowMethod: () => {
    return `箭头函数: ${this.name || "undefined"}`;
  },
};

console.log(methodObj.traditionalMethod());
console.log(methodObj.shorthandMethod());
console.log(methodObj.arrowMethod());

// 6. 对象遍历
console.log("\n6. 对象遍历：");

const traverseObj = {
  a: 1,
  b: 2,
  c: 3,
};

// 添加不可枚举属性
Object.defineProperty(traverseObj, "hidden", {
  value: "secret",
  enumerable: false,
});

// 添加Symbol属性
const sym = Symbol("symbol");
traverseObj[sym] = "symbol value";

console.log("for...in循环：");
for (const key in traverseObj) {
  console.log(`${key}: ${traverseObj[key]}`);
}

console.log("Object.keys()：", Object.keys(traverseObj));
console.log("Object.values()：", Object.values(traverseObj));
console.log("Object.entries()：", Object.entries(traverseObj));
console.log(
  "Object.getOwnPropertyNames()：",
  Object.getOwnPropertyNames(traverseObj)
);
console.log(
  "Object.getOwnPropertySymbols()：",
  Object.getOwnPropertySymbols(traverseObj)
);

// 7. 对象复制
console.log("\n7. 对象复制：");

const originalObj = {
  name: "Original",
  nested: {
    value: 42,
  },
  method: function () {
    return this.name;
  },
};

// 浅复制
const shallowCopy = Object.assign({}, originalObj);
const spreadCopy = { ...originalObj };

// 深复制（简单版本）
function deepClone(obj) {
  if (obj === null || typeof obj !== "object") {
    return obj;
  }

  if (obj instanceof Date) {
    return new Date(obj.getTime());
  }

  if (obj instanceof Array) {
    return obj.map((item) => deepClone(item));
  }

  if (typeof obj === "object") {
    const cloned = {};
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        cloned[key] = deepClone(obj[key]);
      }
    }
    return cloned;
  }
}

const deepCopy = deepClone(originalObj);

// 测试复制
originalObj.nested.value = 100;
console.log("原对象嵌套值：", originalObj.nested.value);
console.log("浅复制嵌套值：", shallowCopy.nested.value);
console.log("深复制嵌套值：", deepCopy.nested.value);

// 8. 对象合并
console.log("\n8. 对象合并：");

const obj1 = { a: 1, b: 2 };
const obj2 = { b: 3, c: 4 };
const obj3 = { c: 5, d: 6 };

// Object.assign()
const merged1 = Object.assign({}, obj1, obj2, obj3);
console.log("Object.assign()：", merged1);

// 展开运算符
const merged2 = { ...obj1, ...obj2, ...obj3 };
console.log("展开运算符：", merged2);

// 自定义合并函数
function mergeObjects(...objects) {
  return objects.reduce((result, obj) => {
    for (const key in obj) {
      if (obj.hasOwnProperty(key)) {
        result[key] = obj[key];
      }
    }
    return result;
  }, {});
}

const merged3 = mergeObjects(obj1, obj2, obj3);
console.log("自定义合并：", merged3);

// 9. 对象冻结和密封
console.log("\n9. 对象冻结和密封：");

const freezeObj = { name: "Freeze", value: 100 };
const sealObj = { name: "Seal", value: 200 };
const preventObj = { name: "Prevent", value: 300 };

// 冻结对象
Object.freeze(freezeObj);
console.log("冻结前：", freezeObj);
freezeObj.name = "Changed"; // 不会改变
freezeObj.newProp = "new"; // 不会添加
console.log("冻结后：", freezeObj);
console.log("是否冻结：", Object.isFrozen(freezeObj));

// 密封对象
Object.seal(sealObj);
console.log("密封前：", sealObj);
sealObj.name = "Changed"; // 可以改变
sealObj.newProp = "new"; // 不会添加
console.log("密封后：", sealObj);
console.log("是否密封：", Object.isSealed(sealObj));

// 防止扩展
Object.preventExtensions(preventObj);
console.log("防扩展前：", preventObj);
preventObj.name = "Changed"; // 可以改变
preventObj.newProp = "new"; // 不会添加
console.log("防扩展后：", preventObj);
console.log("是否可扩展：", Object.isExtensible(preventObj));

// 10. 对象比较
console.log("\n10. 对象比较：");

const compareObj1 = { a: 1, b: 2 };
const compareObj2 = { a: 1, b: 2 };
const compareObj3 = compareObj1;

console.log("引用比较：", compareObj1 === compareObj2); // false
console.log("引用比较：", compareObj1 === compareObj3); // true

// 浅比较
function shallowEqual(obj1, obj2) {
  const keys1 = Object.keys(obj1);
  const keys2 = Object.keys(obj2);

  if (keys1.length !== keys2.length) {
    return false;
  }

  for (const key of keys1) {
    if (obj1[key] !== obj2[key]) {
      return false;
    }
  }

  return true;
}

console.log("浅比较：", shallowEqual(compareObj1, compareObj2));

// 11. 对象解构
console.log("\n11. 对象解构：");

const destructureObj = {
  name: "John",
  age: 30,
  city: "New York",
  country: "USA",
};

// 基本解构
const { name, age } = destructureObj;
console.log("基本解构：", name, age);

// 重命名
const { name: userName, age: userAge } = destructureObj;
console.log("重命名：", userName, userAge);

// 默认值
const { name: n, height = 180 } = destructureObj;
console.log("默认值：", n, height);

// 剩余属性
const { name: fullName, ...rest } = destructureObj;
console.log("剩余属性：", fullName, rest);

// 12. 计算属性名
console.log("\n12. 计算属性名：");

const prefix = "user";
const computedObj = {
  [prefix + "Name"]: "Alice",
  [prefix + "Age"]: 25,
  [`${prefix}City`]: "Boston",
};

console.log("计算属性名：", computedObj);

// 13. 对象的Symbol属性
console.log("\n13. 对象的Symbol属性：");

const id = Symbol("id");
const symbolName = Symbol("name");

const symbolObj = {
  [id]: 123,
  [symbolName]: "Symbol Object",
  regularProp: "regular",
};

console.log("Symbol属性：", symbolObj[id], symbolObj[symbolName]);
console.log("常规属性：", symbolObj.regularProp);
console.log("Symbol属性不可枚举：", Object.keys(symbolObj));
console.log("获取Symbol属性：", Object.getOwnPropertySymbols(symbolObj));

// 14. 实用工具函数
console.log("\n14. 实用工具函数：");

// 对象路径获取
function getPath(obj, path) {
  return path.split(".").reduce((current, key) => {
    return current && current[key] !== undefined ? current[key] : undefined;
  }, obj);
}

// 对象路径设置
function setPath(obj, path, value) {
  const keys = path.split(".");
  const lastKey = keys.pop();
  const target = keys.reduce((current, key) => {
    if (current[key] === undefined) {
      current[key] = {};
    }
    return current[key];
  }, obj);
  target[lastKey] = value;
}

// 对象扁平化
function flattenObject(obj, prefix = "") {
  const flattened = {};

  for (const key in obj) {
    if (obj.hasOwnProperty(key)) {
      const newKey = prefix ? `${prefix}.${key}` : key;

      if (
        typeof obj[key] === "object" &&
        obj[key] !== null &&
        !Array.isArray(obj[key])
      ) {
        Object.assign(flattened, flattenObject(obj[key], newKey));
      } else {
        flattened[newKey] = obj[key];
      }
    }
  }

  return flattened;
}

// 测试工具函数
const testObj = {
  user: {
    profile: {
      name: "Alice",
      age: 25,
    },
    settings: {
      theme: "dark",
    },
  },
};

console.log("路径获取：", getPath(testObj, "user.profile.name"));
setPath(testObj, "user.profile.email", "alice@example.com");
console.log("路径设置后：", getPath(testObj, "user.profile.email"));
console.log("对象扁平化：", flattenObject(testObj));

console.log("\n=== 对象创建和操作示例完成 ===");

// 导出供测试使用
module.exports = {
  Person,
  createPerson,
  deepClone,
  mergeObjects,
  shallowEqual,
  getPath,
  setPath,
  flattenObject,
};
