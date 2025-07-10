/**
 * JavaScript高级程序设计 - 第3章：原型链
 *
 * 本文件演示JavaScript中的原型链机制、原型属性和方法
 */

console.log("=== JavaScript 原型链 ===\n");

// 1. 原型基础
console.log("1. 原型基础：");

function Animal(name) {
  this.name = name;
}

// 在原型上添加方法
Animal.prototype.speak = function () {
  return `${this.name} makes a sound`;
};

Animal.prototype.type = "Unknown";

const dog = new Animal("Dog");
console.log("实例方法调用：", dog.speak());
console.log("实例属性：", dog.name);
console.log("原型属性：", dog.type);

// 检查原型关系
console.log("hasOwnProperty:", dog.hasOwnProperty("name")); // true
console.log("hasOwnProperty:", dog.hasOwnProperty("speak")); // false
console.log("in操作符:", "speak" in dog); // true

// 2. 原型链查找
console.log("\n2. 原型链查找：");

function Dog(name, breed) {
  Animal.call(this, name);
  this.breed = breed;
}

// 设置原型链
Dog.prototype = Object.create(Animal.prototype);
Dog.prototype.constructor = Dog;

// 添加Dog特有的方法
Dog.prototype.bark = function () {
  return `${this.name} barks: Woof!`;
};

// 重写父类方法
Dog.prototype.speak = function () {
  return `${this.name} barks loudly`;
};

const myDog = new Dog("Buddy", "Golden Retriever");
console.log("实例属性：", myDog.name, myDog.breed);
console.log("子类方法：", myDog.bark());
console.log("重写方法：", myDog.speak());

// 原型链查找顺序
console.log("\n原型链查找顺序：");
console.log("myDog.constructor:", myDog.constructor.name);
console.log("myDog.__proto__:", myDog.__proto__.constructor.name);
console.log(
  "myDog.__proto__.__proto__:",
  myDog.__proto__.__proto__.constructor.name
);

// 3. 原型属性和方法
console.log("\n3. 原型属性和方法：");

// 检查原型
console.log(
  "Object.getPrototypeOf(myDog):",
  Object.getPrototypeOf(myDog) === Dog.prototype
);
console.log("myDog instanceof Dog:", myDog instanceof Dog);
console.log("myDog instanceof Animal:", myDog instanceof Animal);
console.log("myDog instanceof Object:", myDog instanceof Object);

// 设置原型
const newObj = {};
Object.setPrototypeOf(newObj, Dog.prototype);
console.log("设置原型后：", newObj instanceof Dog);

// 4. 原型污染和保护
console.log("\n4. 原型污染和保护：");

// 原型污染示例
const originalToString = Object.prototype.toString;
Object.prototype.toString = function () {
  return "Polluted!";
};

console.log("原型污染：", {}.toString()); // Polluted!

// 恢复原型
Object.prototype.toString = originalToString;
console.log("恢复后：", {}.toString()); // [object Object]

// 防止原型污染
const safeObj = Object.create(null);
safeObj.name = "Safe Object";
console.log("安全对象：", safeObj.name);
console.log("没有原型：", Object.getPrototypeOf(safeObj)); // null

// 5. 原型链继承模式
console.log("\n5. 原型链继承模式：");

// 组合继承
function Vehicle(type) {
  this.type = type;
  this.speed = 0;
}

Vehicle.prototype.accelerate = function (amount) {
  this.speed += amount;
  return `${this.type} accelerates to ${this.speed} mph`;
};

function Car(brand, model) {
  Vehicle.call(this, "Car"); // 调用父类构造函数
  this.brand = brand;
  this.model = model;
}

// 设置原型链
Car.prototype = Object.create(Vehicle.prototype);
Car.prototype.constructor = Car;

// 添加子类方法
Car.prototype.honk = function () {
  return `${this.brand} ${this.model} honks: Beep beep!`;
};

const myCar = new Car("Toyota", "Camry");
console.log("组合继承：", myCar.accelerate(30));
console.log("子类方法：", myCar.honk());

// 6. 原型链的问题
console.log("\n6. 原型链的问题：");

function Parent() {
  this.colors = ["red", "blue", "green"];
}

function Child() {}

Child.prototype = new Parent();

const child1 = new Child();
const child2 = new Child();

child1.colors.push("yellow");
console.log("child1.colors:", child1.colors);
console.log("child2.colors:", child2.colors); // 也包含yellow，共享引用

// 7. 现代原型操作
console.log("\n7. 现代原型操作：");

// 使用Object.create()
const animalPrototype = {
  speak: function () {
    return `${this.name} makes a sound`;
  },

  init: function (name) {
    this.name = name;
    return this;
  },
};

const cat = Object.create(animalPrototype).init("Whiskers");
console.log("Object.create()：", cat.speak());

// 使用Object.setPrototypeOf()
const bird = { name: "Robin" };
Object.setPrototypeOf(bird, animalPrototype);
console.log("setPrototypeOf()：", bird.speak());

// 8. 原型链性能考虑
console.log("\n8. 原型链性能考虑：");

// 深层原型链
function Level1() {}
Level1.prototype.method1 = function () {
  return "Level1";
};

function Level2() {}
Level2.prototype = Object.create(Level1.prototype);
Level2.prototype.method2 = function () {
  return "Level2";
};

function Level3() {}
Level3.prototype = Object.create(Level2.prototype);
Level3.prototype.method3 = function () {
  return "Level3";
};

const deepObj = new Level3();

// 测试性能
console.time("深层原型链查找");
for (let i = 0; i < 10000; i++) {
  deepObj.method1(); // 需要向上查找两层
}
console.timeEnd("深层原型链查找");

// 9. 原型链与闭包
console.log("\n9. 原型链与闭包：");

function Counter(initialValue = 0) {
  let count = initialValue;

  this.getCount = function () {
    return count;
  };
}

Counter.prototype.increment = function () {
  // 无法直接访问闭包中的count
  console.log("原型方法无法访问闭包变量");
};

Counter.prototype.reset = function () {
  // 通过实例方法访问
  console.log("当前计数：", this.getCount());
};

const counter = new Counter(5);
counter.increment();
counter.reset();

// 10. 原型链调试
console.log("\n10. 原型链调试：");

function debugPrototypeChain(obj) {
  const chain = [];
  let current = obj;

  while (current) {
    const proto = Object.getPrototypeOf(current);
    if (proto) {
      chain.push(proto.constructor.name || "Anonymous");
    }
    current = proto;
  }

  return chain;
}

console.log("myDog原型链：", debugPrototypeChain(myDog));
console.log("myCar原型链：", debugPrototypeChain(myCar));

// 11. 原型链与属性枚举
console.log("\n11. 原型链与属性枚举：");

function Base() {
  this.ownProp = "own";
}

Base.prototype.protoProp = "proto";

const instance = new Base();
instance.instanceProp = "instance";

console.log("for...in循环：");
for (const key in instance) {
  console.log(
    `${key}: ${instance[key]} (own: ${instance.hasOwnProperty(key)})`
  );
}

console.log("Object.keys():", Object.keys(instance));
console.log(
  "Object.getOwnPropertyNames():",
  Object.getOwnPropertyNames(instance)
);

// 12. 原型链与JSON
console.log("\n12. 原型链与JSON：");

function JsonTest() {
  this.data = "instance data";
}

JsonTest.prototype.protoData = "prototype data";

const jsonObj = new JsonTest();
jsonObj.method = function () {
  return "method";
};

console.log("JSON.stringify():", JSON.stringify(jsonObj));
console.log("原型属性不被序列化");

// 13. 原型链最佳实践
console.log("\n13. 原型链最佳实践：");

// 使用Object.create()建立继承
function Shape(color) {
  this.color = color;
}

Shape.prototype.getColor = function () {
  return this.color;
};

function Rectangle(width, height, color) {
  Shape.call(this, color);
  this.width = width;
  this.height = height;
}

// 正确设置原型链
Rectangle.prototype = Object.create(Shape.prototype);
Rectangle.prototype.constructor = Rectangle;

Rectangle.prototype.getArea = function () {
  return this.width * this.height;
};

const rect = new Rectangle(10, 5, "red");
console.log("最佳实践：", rect.getColor(), rect.getArea());

// 14. 实用工具函数
console.log("\n14. 实用工具函数：");

// 检查是否为某个构造函数的实例
function isInstanceOf(obj, constructor) {
  let prototype = Object.getPrototypeOf(obj);

  while (prototype !== null) {
    if (prototype === constructor.prototype) {
      return true;
    }
    prototype = Object.getPrototypeOf(prototype);
  }

  return false;
}

// 获取原型链
function getPrototypeChain(obj) {
  const chain = [];
  let current = obj;

  while (current) {
    chain.push(current);
    current = Object.getPrototypeOf(current);
  }

  return chain;
}

// 安全的原型方法调用
function safeCall(obj, method, ...args) {
  if (obj && typeof obj[method] === "function") {
    return obj[method].apply(obj, args);
  }
  return undefined;
}

// 创建纯净对象
function createPureObject(properties = {}) {
  const obj = Object.create(null);
  return Object.assign(obj, properties);
}

// 测试工具函数
console.log("isInstanceOf测试：", isInstanceOf(rect, Shape));
console.log("原型链长度：", getPrototypeChain(rect).length);
console.log("安全调用：", safeCall(rect, "getArea"));

const pureObj = createPureObject({ name: "Pure", value: 42 });
console.log("纯净对象：", pureObj);
console.log("无toString：", pureObj.toString === undefined);

console.log("\n=== 原型链示例完成 ===");

// 导出供测试使用
module.exports = {
  Animal,
  Dog,
  Vehicle,
  Car,
  debugPrototypeChain,
  isInstanceOf,
  getPrototypeChain,
  safeCall,
  createPureObject,
};
