#!/usr/bin/env node

/**
 * JavaScript高级程序设计 - 完整案例集合
 * 主入口文件
 */

console.log(`
╔══════════════════════════════════════════════════════════════╗
║                JavaScript高级程序设计                        ║
║                    完整案例集合                              ║
╚══════════════════════════════════════════════════════════════╝
`);

const examples = {
  1: {
    title: "基础概念",
    description: "变量、数据类型、作用域和操作符",
    files: [
      "src/01-基础概念/variables.js",
      "src/01-基础概念/scope.js",
      "src/01-基础概念/operators.js",
    ],
  },
  2: {
    title: "函数和闭包",
    description: "函数基础、闭包、箭头函数",
    files: [
      "src/02-函数和闭包/functions.js",
      "src/02-函数和闭包/closures.js",
      "src/02-函数和闭包/arrow-functions.js",
    ],
  },
  3: {
    title: "对象和原型",
    description: "对象创建、原型链、继承",
    files: [
      "src/03-对象和原型/objects.js",
      "src/03-对象和原型/prototypes.js",
      "src/03-对象和原型/inheritance.js",
    ],
  },
  4: {
    title: "异步编程",
    description: "Promise、async/await、事件循环",
    files: [
      "src/04-异步编程/callbacks.js",
      "src/04-异步编程/promises.js",
      "src/04-异步编程/async-await.js",
      "src/04-异步编程/event-loop.js",
    ],
  },
  5: {
    title: "DOM操作",
    description: "DOM操作、事件处理、遍历",
    files: [
      "src/05-DOM操作/dom-manipulation.js",
      "src/05-DOM操作/event-handling.js",
      "src/05-DOM操作/dom-traversal.js",
    ],
  },
  6: {
    title: "ES6+特性",
    description: "模块、类、解构、Symbol",
    files: [
      "src/06-ES6+特性/modules.js",
      "src/06-ES6+特性/classes.js",
      "src/06-ES6+特性/destructuring.js",
      "src/06-ES6+特性/symbols.js",
    ],
  },
  7: {
    title: "错误处理",
    description: "异常处理、调试技巧",
    files: [
      "src/07-错误处理/error-handling.js",
      "src/07-错误处理/debugging.js",
    ],
  },
  8: {
    title: "性能优化",
    description: "代码优化、内存管理",
    files: [
      "src/08-性能优化/performance.js",
      "src/08-性能优化/memory-management.js",
    ],
  },
  9: {
    title: "实战项目",
    description: "综合应用项目",
    files: [
      "src/09-实战项目/todo-app/",
      "src/09-实战项目/weather-app/",
      "src/09-实战项目/chat-app/",
    ],
  },
};

function showMenu() {
  console.log("\n📚 请选择要查看的章节：\n");

  Object.entries(examples).forEach(([key, example]) => {
    console.log(`${key}. ${example.title}`);
    console.log(`   ${example.description}\n`);
  });

  console.log("使用方法：");
  console.log("- 运行特定示例：node <文件路径>");
  console.log("- 查看Web示例：npm run serve");
  console.log("- 运行测试：npm test");
  console.log("- 开发模式：npm run dev\n");
}

function runExample(chapterNumber) {
  const example = examples[chapterNumber];
  if (!example) {
    console.log("❌ 无效的章节号");
    return;
  }

  console.log(`\n🚀 ${example.title} - ${example.description}\n`);
  console.log("相关文件：");
  example.files.forEach((file) => {
    console.log(`   📄 ${file}`);
  });

  console.log(`\n💡 运行示例：node ${example.files[0]}`);
}

// 命令行参数处理
const args = process.argv.slice(2);
if (args.length > 0) {
  const chapterNumber = args[0];
  runExample(chapterNumber);
} else {
  showMenu();
}

// 导出供其他模块使用
module.exports = { examples, showMenu, runExample };
