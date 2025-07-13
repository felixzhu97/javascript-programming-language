/**
 * JavaScript高级程序设计 - 第6章：ES6类
 *
 * 本文件演示ES6类的定义、继承和高级特性
 */

console.log("=== JavaScript ES6类 ===\n");

// =============================================
// 1. 基础类定义
// =============================================

console.log("1. 基础类定义");

class Person {
  constructor(name, age) {
    this.name = name;
    this.age = age;
    this._id = Math.random().toString(36).substr(2, 9);
  }

  // 实例方法
  introduce() {
    return `我是${this.name}，今年${this.age}岁`;
  }

  celebrateBirthday() {
    this.age++;
    console.log(`${this.name}过生日了！现在${this.age}岁`);
  }

  // Getter
  get id() {
    return this._id;
  }

  get info() {
    return {
      name: this.name,
      age: this.age,
      id: this._id,
    };
  }

  // Setter
  set name(newName) {
    if (typeof newName === "string" && newName.length > 0) {
      this._name = newName;
    } else {
      throw new Error("姓名必须是非空字符串");
    }
  }

  get name() {
    return this._name;
  }

  // 静态方法
  static createChild(name) {
    return new Person(name, 0);
  }

  static compareAge(person1, person2) {
    return person1.age - person2.age;
  }

  // 静态属性
  static species = "Homo sapiens";
  static population = 0;
}

// 测试基础类
const person1 = new Person("张三", 25);
const person2 = new Person("李四", 30);

console.log("基础类测试:");
console.log(person1.introduce());
console.log(person2.introduce());
console.log("年龄比较:", Person.compareAge(person1, person2));
console.log("物种:", Person.species);

const child = Person.createChild("小明");
console.log(child.introduce());

console.log();

// =============================================
// 2. 类继承
// =============================================

console.log("2. 类继承");

class Student extends Person {
  constructor(name, age, school, grade) {
    super(name, age); // 调用父类构造函数
    this.school = school;
    this.grade = grade;
    this.courses = [];
    this.scores = new Map();
  }

  // 重写父类方法
  introduce() {
    const baseIntro = super.introduce();
    return `${baseIntro}，在${this.school}读${this.grade}年级`;
  }

  // 新增方法
  addCourse(course) {
    if (!this.courses.includes(course)) {
      this.courses.push(course);
      console.log(`${this.name}添加了课程: ${course}`);
    }
  }

  setScore(course, score) {
    if (this.courses.includes(course)) {
      this.scores.set(course, score);
      console.log(`${this.name}的${course}成绩: ${score}`);
    } else {
      console.log(`${this.name}没有选择${course}课程`);
    }
  }

  getAverageScore() {
    if (this.scores.size === 0) return 0;

    const total = Array.from(this.scores.values()).reduce(
      (sum, score) => sum + score,
      0
    );
    return total / this.scores.size;
  }

  getAcademicInfo() {
    return {
      ...this.info,
      school: this.school,
      grade: this.grade,
      courses: [...this.courses],
      averageScore: this.getAverageScore(),
    };
  }

  // 静态方法
  static createHonorStudent(name, age, school) {
    const student = new Student(name, age, school, "优等生");
    student.addCourse("数学");
    student.addCourse("英语");
    student.addCourse("物理");
    return student;
  }
}

// 测试继承
const student1 = new Student("王五", 18, "清华大学", "大一");
console.log("继承测试:");
console.log(student1.introduce());

student1.addCourse("计算机科学");
student1.addCourse("数学");
student1.setScore("计算机科学", 95);
student1.setScore("数学", 88);

console.log("学术信息:", student1.getAcademicInfo());

const honorStudent = Student.createHonorStudent("赵六", 19, "北京大学");
console.log("优等生:", honorStudent.introduce());

console.log();

// =============================================
// 3. 抽象类和接口模拟
// =============================================

console.log("3. 抽象类和接口模拟");

// 抽象类模拟
class AbstractShape {
  constructor(color) {
    if (new.target === AbstractShape) {
      throw new Error("AbstractShape是抽象类，不能直接实例化");
    }
    this.color = color;
  }

  // 抽象方法
  getArea() {
    throw new Error("getArea方法必须在子类中实现");
  }

  getPerimeter() {
    throw new Error("getPerimeter方法必须在子类中实现");
  }

  // 具体方法
  paint(newColor) {
    this.color = newColor;
    console.log(`形状被涂成${newColor}色`);
  }

  describe() {
    return `一个${this.color}色的${
      this.constructor.name
    }，面积为${this.getArea()}`;
  }
}

// 接口模拟
class Drawable {
  draw() {
    throw new Error("draw方法必须被实现");
  }
}

class Movable {
  move(x, y) {
    throw new Error("move方法必须被实现");
  }
}

// 多重继承模拟
function mixins(Base, ...Mixins) {
  Mixins.forEach((Mixin) => {
    Object.getOwnPropertyNames(Mixin.prototype).forEach((name) => {
      if (name !== "constructor") {
        Base.prototype[name] = Mixin.prototype[name];
      }
    });
  });
  return Base;
}

// 具体实现类
class Rectangle extends mixins(AbstractShape, Drawable, Movable) {
  constructor(color, width, height) {
    super(color);
    this.width = width;
    this.height = height;
    this.x = 0;
    this.y = 0;
  }

  getArea() {
    return this.width * this.height;
  }

  getPerimeter() {
    return 2 * (this.width + this.height);
  }

  draw() {
    console.log(
      `绘制矩形: ${this.width}x${this.height} at (${this.x}, ${this.y})`
    );
  }

  move(x, y) {
    this.x = x;
    this.y = y;
    console.log(`矩形移动到 (${x}, ${y})`);
  }
}

class Circle extends mixins(AbstractShape, Drawable, Movable) {
  constructor(color, radius) {
    super(color);
    this.radius = radius;
    this.x = 0;
    this.y = 0;
  }

  getArea() {
    return Math.PI * this.radius * this.radius;
  }

  getPerimeter() {
    return 2 * Math.PI * this.radius;
  }

  draw() {
    console.log(`绘制圆形: 半径${this.radius} at (${this.x}, ${this.y})`);
  }

  move(x, y) {
    this.x = x;
    this.y = y;
    console.log(`圆形移动到 (${x}, ${y})`);
  }
}

// 测试抽象类和接口
console.log("抽象类和接口测试:");

const rect = new Rectangle("红", 10, 20);
console.log(rect.describe());
rect.draw();
rect.move(50, 100);

const circle = new Circle("蓝", 15);
console.log(circle.describe());
circle.draw();

console.log();

// =============================================
// 4. 私有字段和方法
// =============================================

console.log("4. 私有字段和方法");

class BankAccount {
  // 私有字段（使用约定，真正的私有字段需要最新JS版本）
  #balance = 0;
  #accountNumber;
  #pin;

  constructor(initialBalance, pin) {
    this.#balance = initialBalance;
    this.#accountNumber = this.#generateAccountNumber();
    this.#pin = pin;
  }

  // 私有方法
  #generateAccountNumber() {
    return "ACC" + Math.random().toString(36).substr(2, 9).toUpperCase();
  }

  #validatePin(pin) {
    return pin === this.#pin;
  }

  #log(operation, amount) {
    console.log(
      `[${new Date().toLocaleTimeString()}] ${operation}: ¥${amount}, 余额: ¥${
        this.#balance
      }`
    );
  }

  // 公共方法
  deposit(amount, pin) {
    if (!this.#validatePin(pin)) {
      throw new Error("PIN码错误");
    }

    if (amount <= 0) {
      throw new Error("存款金额必须大于0");
    }

    this.#balance += amount;
    this.#log("存款", amount);
    return this.#balance;
  }

  withdraw(amount, pin) {
    if (!this.#validatePin(pin)) {
      throw new Error("PIN码错误");
    }

    if (amount <= 0) {
      throw new Error("取款金额必须大于0");
    }

    if (amount > this.#balance) {
      throw new Error("余额不足");
    }

    this.#balance -= amount;
    this.#log("取款", amount);
    return this.#balance;
  }

  getBalance(pin) {
    if (!this.#validatePin(pin)) {
      throw new Error("PIN码错误");
    }
    return this.#balance;
  }

  getAccountInfo(pin) {
    if (!this.#validatePin(pin)) {
      throw new Error("PIN码错误");
    }

    return {
      accountNumber: this.#accountNumber,
      balance: this.#balance,
      timestamp: new Date().toISOString(),
    };
  }
}

// 测试私有字段
console.log("私有字段测试:");

const account = new BankAccount(1000, "1234");
console.log("账户信息:", account.getAccountInfo("1234"));

account.deposit(500, "1234");
account.withdraw(200, "1234");

try {
  account.withdraw(100, "0000"); // 错误PIN
} catch (error) {
  console.log("错误:", error.message);
}

console.log();

// =============================================
// 5. 装饰器模拟
// =============================================

console.log("5. 装饰器模拟");

// 方法装饰器
function methodDecorator(target, propertyKey, descriptor) {
  const originalMethod = descriptor.value;

  descriptor.value = function (...args) {
    console.log(`调用方法 ${propertyKey}，参数:`, args);
    const start = Date.now();

    const result = originalMethod.apply(this, args);

    const end = Date.now();
    console.log(`方法 ${propertyKey} 执行时间: ${end - start}ms`);

    return result;
  };

  return descriptor;
}

// 类装饰器
function classDecorator(constructor) {
  return class extends constructor {
    constructor(...args) {
      super(...args);
      console.log(`创建 ${constructor.name} 实例`);
    }
  };
}

// 属性装饰器模拟
function propertyDecorator(target, propertyKey) {
  let value = target[propertyKey];

  Object.defineProperty(target, propertyKey, {
    get() {
      console.log(`访问属性 ${propertyKey}: ${value}`);
      return value;
    },
    set(newValue) {
      console.log(`设置属性 ${propertyKey}: ${value} -> ${newValue}`);
      value = newValue;
    },
    enumerable: true,
    configurable: true,
  });
}

// 手动应用装饰器的类
class Calculator {
  constructor() {
    this.result = 0;
    // 手动应用属性装饰器
    propertyDecorator(this, "result");
  }

  add(x, y) {
    this.result = x + y;
    return this.result;
  }

  multiply(x, y) {
    // 模拟耗时操作
    let result = 0;
    for (let i = 0; i < y; i++) {
      result += x;
    }
    this.result = result;
    return this.result;
  }
}

// 手动应用方法装饰器
methodDecorator(
  Calculator.prototype,
  "add",
  Object.getOwnPropertyDescriptor(Calculator.prototype, "add")
);
methodDecorator(
  Calculator.prototype,
  "multiply",
  Object.getOwnPropertyDescriptor(Calculator.prototype, "multiply")
);

// 测试装饰器
console.log("装饰器测试:");

const calc = new Calculator();
calc.add(5, 3);
calc.multiply(4, 6);
calc.result = 100;

console.log();

// =============================================
// 6. 类的高级特性
// =============================================

console.log("6. 类的高级特性");

// 工厂模式类
class AnimalFactory {
  static create(type, name, ...args) {
    const animals = {
      dog: Dog,
      cat: Cat,
      bird: Bird,
    };

    const AnimalClass = animals[type.toLowerCase()];
    if (!AnimalClass) {
      throw new Error(`未知动物类型: ${type}`);
    }

    return new AnimalClass(name, ...args);
  }

  static getSupportedTypes() {
    return ["dog", "cat", "bird"];
  }
}

// 基础动物类
class Animal {
  constructor(name, species) {
    this.name = name;
    this.species = species;
    this.energy = 100;
  }

  eat() {
    this.energy = Math.min(100, this.energy + 20);
    console.log(`${this.name}吃东西，能量: ${this.energy}`);
  }

  sleep() {
    this.energy = 100;
    console.log(`${this.name}睡觉，能量恢复到: ${this.energy}`);
  }

  makeSound() {
    throw new Error("makeSound方法必须在子类中实现");
  }
}

class Dog extends Animal {
  constructor(name, breed) {
    super(name, "Canine");
    this.breed = breed;
  }

  makeSound() {
    console.log(`${this.name}汪汪叫`);
  }

  fetch() {
    if (this.energy >= 20) {
      this.energy -= 20;
      console.log(`${this.name}捡球，能量: ${this.energy}`);
    } else {
      console.log(`${this.name}太累了，需要休息`);
    }
  }
}

class Cat extends Animal {
  constructor(name, color) {
    super(name, "Feline");
    this.color = color;
  }

  makeSound() {
    console.log(`${this.name}喵喵叫`);
  }

  climb() {
    if (this.energy >= 15) {
      this.energy -= 15;
      console.log(`${this.name}爬树，能量: ${this.energy}`);
    } else {
      console.log(`${this.name}太累了，需要休息`);
    }
  }
}

class Bird extends Animal {
  constructor(name, wingspan) {
    super(name, "Avian");
    this.wingspan = wingspan;
  }

  makeSound() {
    console.log(`${this.name}啾啾叫`);
  }

  fly() {
    if (this.energy >= 30) {
      this.energy -= 30;
      console.log(`${this.name}飞行，能量: ${this.energy}`);
    } else {
      console.log(`${this.name}太累了，需要休息`);
    }
  }
}

// 测试工厂模式
console.log("工厂模式测试:");

const dog = AnimalFactory.create("dog", "旺财", "拉布拉多");
const cat = AnimalFactory.create("cat", "咪咪", "橘色");
const bird = AnimalFactory.create("bird", "小鸟", 30);

dog.makeSound();
dog.fetch();

cat.makeSound();
cat.climb();

bird.makeSound();
bird.fly();

console.log("支持的动物类型:", AnimalFactory.getSupportedTypes());

console.log();

// =============================================
// 7. 类的组合和mixins
// =============================================

console.log("7. 类的组合和mixins");

// Mixin功能模块
const Flyable = {
  fly() {
    console.log(`${this.name || "Unknown"} 正在飞行`);
  },

  land() {
    console.log(`${this.name || "Unknown"} 正在降落`);
  },
};

const Swimmable = {
  swim() {
    console.log(`${this.name || "Unknown"} 正在游泳`);
  },

  dive() {
    console.log(`${this.name || "Unknown"} 正在潜水`);
  },
};

const Walkable = {
  walk() {
    console.log(`${this.name || "Unknown"} 正在走路`);
  },

  run() {
    console.log(`${this.name || "Unknown"} 正在跑步`);
  },
};

// Mixin应用函数
function applyMixins(derivedCtor, ...baseMixins) {
  baseMixins.forEach((baseMixin) => {
    Object.getOwnPropertyNames(baseMixin).forEach((name) => {
      if (name !== "constructor") {
        derivedCtor.prototype[name] = baseMixin[name];
      }
    });
  });
}

// 使用mixin的类
class Duck extends Animal {
  constructor(name) {
    super(name, "Duck");
  }

  makeSound() {
    console.log(`${this.name}嘎嘎叫`);
  }
}

class Penguin extends Animal {
  constructor(name) {
    super(name, "Penguin");
  }

  makeSound() {
    console.log(`${this.name}企鹅叫`);
  }
}

// 应用mixins
applyMixins(Duck, Flyable, Swimmable, Walkable);
applyMixins(Penguin, Swimmable, Walkable);

// 测试mixins
console.log("Mixins测试:");

const duck = new Duck("唐老鸭");
duck.makeSound();
duck.fly();
duck.swim();
duck.walk();

const penguin = new Penguin("企鹅先生");
penguin.makeSound();
penguin.swim();
penguin.walk();
// penguin.fly(); // 企鹅不能飞

console.log();

// =============================================
// 8. 类的元编程
// =============================================

console.log("8. 类的元编程");

class MetaClass {
  static [Symbol.hasInstance](instance) {
    console.log("检查实例类型");
    return instance && typeof instance.metaMethod === "function";
  }

  static get [Symbol.species]() {
    return Array;
  }

  constructor(data) {
    this.data = data;
    return new Proxy(this, {
      get(target, property) {
        if (property in target) {
          return target[property];
        }

        if (property.startsWith("get")) {
          const prop = property.slice(3).toLowerCase();
          return () => target.data[prop];
        }

        if (property.startsWith("set")) {
          const prop = property.slice(3).toLowerCase();
          return (value) => {
            target.data[prop] = value;
            console.log(`设置 ${prop} = ${value}`);
          };
        }

        return undefined;
      },

      set(target, property, value) {
        console.log(`拦截设置: ${property} = ${value}`);
        target[property] = value;
        return true;
      },
    });
  }

  metaMethod() {
    return "This is a meta method";
  }
}

// 测试元编程
console.log("元编程测试:");

const metaObj = new MetaClass({ name: "Test", value: 42 });

// 动态方法调用
console.log(metaObj.getName()); // 'Test'
metaObj.setValue(100); // 设置 value = 100
console.log(metaObj.getValue()); // 100

// instanceof检查
console.log("metaObj instanceof MetaClass:", metaObj instanceof MetaClass);

console.log();

// =============================================
// 9. 性能和内存管理
// =============================================

console.log("9. 性能和内存管理");

class PerformanceTest {
  static objectPool = [];
  static maxPoolSize = 100;

  constructor(data) {
    this.data = data;
    this.createdAt = Date.now();
  }

  // 对象池模式
  static acquire(data) {
    if (this.objectPool.length > 0) {
      const obj = this.objectPool.pop();
      obj.reset(data);
      console.log("从对象池获取实例");
      return obj;
    }

    console.log("创建新实例");
    return new PerformanceTest(data);
  }

  static release(obj) {
    if (this.objectPool.length < this.maxPoolSize) {
      obj.cleanup();
      this.objectPool.push(obj);
      console.log("实例返回对象池");
    } else {
      console.log("对象池已满，实例被销毁");
    }
  }

  reset(data) {
    this.data = data;
    this.createdAt = Date.now();
  }

  cleanup() {
    this.data = null;
    // 清理其他资源
  }

  // 内存使用监控
  static getMemoryUsage() {
    return {
      poolSize: this.objectPool.length,
      maxPoolSize: this.maxPoolSize,
      poolUtilization:
        ((this.objectPool.length / this.maxPoolSize) * 100).toFixed(1) + "%",
    };
  }

  // 性能测试
  static performanceBenchmark(iterations = 1000) {
    console.log(`性能测试: ${iterations} 次迭代`);

    // 测试普通实例化
    const start1 = Date.now();
    for (let i = 0; i < iterations; i++) {
      const obj = new PerformanceTest(`data-${i}`);
    }
    const end1 = Date.now();

    // 测试对象池
    const start2 = Date.now();
    for (let i = 0; i < iterations; i++) {
      const obj = PerformanceTest.acquire(`data-${i}`);
      PerformanceTest.release(obj);
    }
    const end2 = Date.now();

    console.log(`普通实例化: ${end1 - start1}ms`);
    console.log(`对象池模式: ${end2 - start2}ms`);
    console.log("内存使用:", this.getMemoryUsage());
  }
}

// 测试性能
console.log("性能测试:");
PerformanceTest.performanceBenchmark(100);

console.log();

// =============================================
// 10. 最佳实践总结
// =============================================

console.log("10. 最佳实践总结");

console.log(`
ES6类最佳实践:

1. 类设计原则:
   - 单一职责原则
   - 开闭原则
   - 里氏替换原则
   - 接口隔离原则
   - 依赖倒置原则

2. 继承策略:
   - 优先组合而非继承
   - 避免深层继承链
   - 使用抽象类定义契约
   - 合理使用mixins

3. 封装和访问控制:
   - 使用私有字段保护内部状态
   - 提供清晰的公共接口
   - 验证输入参数
   - 避免暴露实现细节

4. 性能优化:
   - 使用对象池减少GC压力
   - 避免在构造函数中执行重操作
   - 合理使用静态方法和属性
   - 监控内存使用情况

5. 代码质量:
   - 编写全面的单元测试
   - 使用TypeScript增强类型安全
   - 文档化公共API
   - 遵循命名约定

常见陷阱:
- this绑定问题
- 原型链污染
- 内存泄漏
- 过度设计
- 滥用继承

工具推荐:
- ESLint类相关规则
- TypeScript类型检查
- Jest测试框架
- 性能分析工具
`);

// 导出供测试使用
module.exports = {
  Person,
  Student,
  AbstractShape,
  Rectangle,
  Circle,
  BankAccount,
  Calculator,
  AnimalFactory,
  Animal,
  Dog,
  Cat,
  Bird,
  Duck,
  Penguin,
  MetaClass,
  PerformanceTest,
  mixins,
  applyMixins,
  Flyable,
  Swimmable,
  Walkable,
};

console.log("ES6类演示完成\n");
