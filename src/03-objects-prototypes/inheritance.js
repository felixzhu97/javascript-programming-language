/**
 * JavaScript高级程序设计 - 第3章：继承模式
 *
 * 本文件演示JavaScript中的各种继承实现方式
 */

console.log("=== JavaScript 继承模式 ===\n");

// =============================================
// 1. 原型链继承
// =============================================

console.log("1. 原型链继承");

function Animal(name) {
  this.name = name;
  this.colors = ["red", "blue", "green"];
}

Animal.prototype.getName = function () {
  return this.name;
};

Animal.prototype.speak = function () {
  return `${this.name} makes a sound`;
};

function Dog(name, breed) {
  this.breed = breed;
}

// 原型链继承
Dog.prototype = new Animal();
Dog.prototype.constructor = Dog;

Dog.prototype.bark = function () {
  return `${this.name} barks!`;
};

const dog1 = new Dog("Buddy", "Golden Retriever");
const dog2 = new Dog("Max", "Bulldog");

console.log("原型链继承示例:");
console.log("dog1.getName():", dog1.getName()); // undefined (name在构造函数中未设置)
console.log("dog1.speak():", dog1.speak());
console.log("dog1.colors:", dog1.colors);

// 原型链继承的问题：引用类型属性被共享
dog1.colors.push("yellow");
console.log("修改dog1.colors后:");
console.log("dog1.colors:", dog1.colors);
console.log("dog2.colors:", dog2.colors); // 也被修改了！

console.log();

// =============================================
// 2. 借用构造函数继承
// =============================================

console.log("2. 借用构造函数继承");

function Cat(name, breed) {
  // 借用父类构造函数
  Animal.call(this, name);
  this.breed = breed;
}

Cat.prototype.meow = function () {
  return `${this.name} meows!`;
};

const cat1 = new Cat("Whiskers", "Persian");
const cat2 = new Cat("Mittens", "Siamese");

console.log("借用构造函数继承示例:");
console.log("cat1.name:", cat1.name);
console.log("cat1.colors:", cat1.colors);

// 解决了引用类型共享问题
cat1.colors.push("purple");
console.log("修改cat1.colors后:");
console.log("cat1.colors:", cat1.colors);
console.log("cat2.colors:", cat2.colors); // 未被修改

// 但无法继承原型方法
console.log("cat1.speak:", typeof cat1.speak); // undefined

console.log();

// =============================================
// 3. 组合继承（原型链 + 借用构造函数）
// =============================================

console.log("3. 组合继承");

function Bird(name, canFly = true) {
  // 借用构造函数
  Animal.call(this, name);
  this.canFly = canFly;
}

// 原型链继承
Bird.prototype = new Animal();
Bird.prototype.constructor = Bird;

Bird.prototype.fly = function () {
  return this.canFly ? `${this.name} flies!` : `${this.name} cannot fly`;
};

const bird1 = new Bird("Eagle");
const bird2 = new Bird("Penguin", false);

console.log("组合继承示例:");
console.log("bird1.name:", bird1.name);
console.log("bird1.speak():", bird1.speak());
console.log("bird1.fly():", bird1.fly());
console.log("bird2.fly():", bird2.fly());

console.log();

// =============================================
// 4. 原型式继承
// =============================================

console.log("4. 原型式继承");

// 模拟Object.create
function objectCreate(o) {
  function F() {}
  F.prototype = o;
  return new F();
}

const person = {
  name: "John",
  friends: ["Mike", "Sarah"],
  greet: function () {
    return `Hello, I'm ${this.name}`;
  },
};

const person1 = Object.create(person);
person1.name = "Alice";

const person2 = Object.create(person);
person2.name = "Bob";

console.log("原型式继承示例:");
console.log("person1.greet():", person1.greet());
console.log("person2.greet():", person2.greet());

// 仍然存在引用类型共享问题
person1.friends.push("Tom");
console.log("person1.friends:", person1.friends);
console.log("person2.friends:", person2.friends);

console.log();

// =============================================
// 5. 寄生式继承
// =============================================

console.log("5. 寄生式继承");

function createAnother(original) {
  const clone = Object.create(original);

  // 增强对象
  clone.sayHi = function () {
    return "Hi there!";
  };

  clone.introduce = function () {
    return `${this.greet()} ${this.sayHi()}`;
  };

  return clone;
}

const anotherPerson = createAnother(person);
anotherPerson.name = "Charlie";

console.log("寄生式继承示例:");
console.log("anotherPerson.introduce():", anotherPerson.introduce());

console.log();

// =============================================
// 6. 寄生组合式继承（最理想的继承方式）
// =============================================

console.log("6. 寄生组合式继承");

function inheritPrototype(subType, superType) {
  // 创建父类原型的副本
  const prototype = Object.create(superType.prototype);
  // 设置constructor属性
  prototype.constructor = subType;
  // 指定子类的原型
  subType.prototype = prototype;
}

function Vehicle(type) {
  this.type = type;
  this.wheels = [];
}

Vehicle.prototype.getType = function () {
  return this.type;
};

Vehicle.prototype.addWheel = function (wheel) {
  this.wheels.push(wheel);
};

function Car(type, brand) {
  // 借用构造函数
  Vehicle.call(this, type);
  this.brand = brand;
}

// 寄生组合式继承
inheritPrototype(Car, Vehicle);

Car.prototype.getBrand = function () {
  return this.brand;
};

Car.prototype.getInfo = function () {
  return `${this.brand} ${this.getType()}`;
};

const car1 = new Car("sedan", "Toyota");
const car2 = new Car("SUV", "Honda");

console.log("寄生组合式继承示例:");
console.log("car1.getInfo():", car1.getInfo());
console.log("car2.getInfo():", car2.getInfo());

car1.addWheel("front-left");
car1.addWheel("front-right");
console.log("car1.wheels:", car1.wheels);
console.log("car2.wheels:", car2.wheels); // 独立的wheels数组

console.log();

// =============================================
// 7. ES6 类继承
// =============================================

console.log("7. ES6 类继承");

class Shape {
  constructor(color) {
    this.color = color;
  }

  getColor() {
    return this.color;
  }

  getArea() {
    throw new Error("getArea method must be implemented");
  }

  describe() {
    return `A ${this.color} shape with area ${this.getArea()}`;
  }
}

class Rectangle extends Shape {
  constructor(color, width, height) {
    super(color); // 调用父类构造函数
    this.width = width;
    this.height = height;
  }

  getArea() {
    return this.width * this.height;
  }

  getPerimeter() {
    return 2 * (this.width + this.height);
  }
}

class Circle extends Shape {
  constructor(color, radius) {
    super(color);
    this.radius = radius;
  }

  getArea() {
    return Math.PI * this.radius * this.radius;
  }

  getCircumference() {
    return 2 * Math.PI * this.radius;
  }
}

const rectangle = new Rectangle("red", 5, 3);
const circle = new Circle("blue", 4);

console.log("ES6类继承示例:");
console.log("rectangle.describe():", rectangle.describe());
console.log("rectangle.getPerimeter():", rectangle.getPerimeter());
console.log("circle.describe():", circle.describe());
console.log("circle.getCircumference():", circle.getCircumference().toFixed(2));

console.log();

// =============================================
// 8. Mixin 模式
// =============================================

console.log("8. Mixin 模式");

// 飞行能力 Mixin
const FlyingMixin = {
  fly() {
    return `${this.name} is flying at ${this.altitude} meters`;
  },

  setAltitude(altitude) {
    this.altitude = altitude;
  },
};

// 游泳能力 Mixin
const SwimmingMixin = {
  swim() {
    return `${this.name} is swimming at ${this.depth} meters deep`;
  },

  dive(depth) {
    this.depth = depth;
    return this.swim();
  },
};

// 通用 mixin 函数
function mixin(target, ...sources) {
  Object.assign(target.prototype, ...sources);
}

class Duck {
  constructor(name) {
    this.name = name;
    this.altitude = 0;
    this.depth = 0;
  }

  quack() {
    return `${this.name} says quack!`;
  }
}

// 应用 mixins
mixin(Duck, FlyingMixin, SwimmingMixin);

const duck = new Duck("Donald");

console.log("Mixin模式示例:");
console.log("duck.quack():", duck.quack());
duck.setAltitude(100);
console.log("duck.fly():", duck.fly());
console.log("duck.dive(5):", duck.dive(5));

console.log();

// =============================================
// 9. 工厂模式继承
// =============================================

console.log("9. 工厂模式继承");

class AnimalFactory {
  static createAnimal(type, name, ...args) {
    switch (type.toLowerCase()) {
      case "dog":
        return new DogClass(name, ...args);
      case "cat":
        return new CatClass(name, ...args);
      case "bird":
        return new BirdClass(name, ...args);
      default:
        throw new Error(`Unknown animal type: ${type}`);
    }
  }
}

class AnimalBase {
  constructor(name) {
    this.name = name;
  }

  getName() {
    return this.name;
  }

  makeSound() {
    return "Some sound";
  }
}

class DogClass extends AnimalBase {
  constructor(name, breed) {
    super(name);
    this.breed = breed;
  }

  makeSound() {
    return "Woof!";
  }

  getBreed() {
    return this.breed;
  }
}

class CatClass extends AnimalBase {
  constructor(name, color) {
    super(name);
    this.color = color;
  }

  makeSound() {
    return "Meow!";
  }

  getColor() {
    return this.color;
  }
}

class BirdClass extends AnimalBase {
  constructor(name, canFly) {
    super(name);
    this.canFly = canFly;
  }

  makeSound() {
    return "Tweet!";
  }

  fly() {
    return this.canFly ? "Flying!" : "Cannot fly";
  }
}

const animals = [
  AnimalFactory.createAnimal("dog", "Buddy", "Golden Retriever"),
  AnimalFactory.createAnimal("cat", "Whiskers", "orange"),
  AnimalFactory.createAnimal("bird", "Tweety", true),
];

console.log("工厂模式继承示例:");
animals.forEach((animal) => {
  console.log(`${animal.getName()}: ${animal.makeSound()}`);
});

console.log();

// =============================================
// 10. 继承最佳实践示例
// =============================================

console.log("10. 继承最佳实践");

// 抽象基类
class Component {
  constructor(name) {
    if (new.target === Component) {
      throw new Error("Component is abstract and cannot be instantiated");
    }
    this.name = name;
    this.children = [];
    this.parent = null;
  }

  // 抽象方法
  render() {
    throw new Error("render method must be implemented");
  }

  // 通用方法
  addChild(child) {
    this.children.push(child);
    child.parent = this;
  }

  removeChild(child) {
    const index = this.children.indexOf(child);
    if (index > -1) {
      this.children.splice(index, 1);
      child.parent = null;
    }
  }

  getName() {
    return this.name;
  }
}

class Button extends Component {
  constructor(name, text) {
    super(name);
    this.text = text;
    this.clicked = false;
  }

  render() {
    return `<button>${this.text}</button>`;
  }

  click() {
    this.clicked = true;
    return `Button ${this.name} clicked!`;
  }
}

class Panel extends Component {
  constructor(name, title) {
    super(name);
    this.title = title;
  }

  render() {
    const childrenHtml = this.children
      .map((child) => child.render())
      .join("\n");

    return `<div class="panel">
            <h3>${this.title}</h3>
            ${childrenHtml}
        </div>`;
  }
}

const panel = new Panel("mainPanel", "Control Panel");
const button1 = new Button("btn1", "Click Me");
const button2 = new Button("btn2", "Submit");

panel.addChild(button1);
panel.addChild(button2);

console.log("继承最佳实践示例:");
console.log("panel.render():");
console.log(panel.render());
console.log("button1.click():", button1.click());

// 性能和内存测试
console.log("\n=== 继承性能对比 ===");

function performanceTest() {
  const iterations = 100000;

  // 测试组合继承
  console.time("组合继承创建对象");
  for (let i = 0; i < iterations; i++) {
    new Car("sedan", "Toyota");
  }
  console.timeEnd("组合继承创建对象");

  // 测试ES6类继承
  console.time("ES6类继承创建对象");
  for (let i = 0; i < iterations; i++) {
    new Rectangle("red", 5, 3);
  }
  console.timeEnd("ES6类继承创建对象");
}

performanceTest();

// 导出供测试使用
module.exports = {
  Animal,
  Dog,
  Car,
  Rectangle,
  Circle,
  Duck,
  AnimalFactory,
  Component,
  Button,
  Panel,
  inheritPrototype,
  mixin,
};
