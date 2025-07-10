/**
 * JavaScript高级程序设计 - 第7章：调试技巧
 *
 * 本文件演示JavaScript调试的各种技术和工具
 */

console.log("=== JavaScript 调试技巧 ===\n");

// =============================================
// 1. 控制台调试基础
// =============================================

console.log("1. 控制台调试基础");

class ConsoleDebugger {
    static basicLogging() {
        console.log("基本日志输出");
        
        // 不同级别的日志
        console.log("普通信息");
        console.info("信息提示");
        console.warn("警告信息");
        console.error("错误信息");
        
        // 格式化输出
        const user = { name: "张三", age: 30, city: "北京" };
        console.log("用户信息: %o", user);
        console.log("用户姓名: %s, 年龄: %d", user.name, user.age);
        
        // 分组输出
        console.group("用户详情");
        console.log("姓名:", user.name);
        console.log("年龄:", user.age);
        console.log("城市:", user.city);
        console.groupEnd();
        
        // 表格输出
        const users = [
            { name: "张三", age: 30, city: "北京" },
            { name: "李四", age: 25, city: "上海" },
            { name: "王五", age: 35, city: "广州" }
        ];
        console.table(users);
    }
    
    static performanceLogging() {
        console.log("\n性能调试:");
        
        // 时间测量
        console.time("数组处理");
        const arr = Array.from({ length: 100000 }, (_, i) => i);
        const sum = arr.reduce((acc, num) => acc + num, 0);
        console.timeEnd("数组处理");
        
        // 计数器
        for (let i = 0; i < 5; i++) {
            console.count("循环计数");
        }
        console.countReset("循环计数");
        
        // 堆栈跟踪
        function levelOne() {
            levelTwo();
        }
        
        function levelTwo() {
            levelThree();
        }
        
        function levelThree() {
            console.trace("调用堆栈跟踪");
        }
        
        levelOne();
    }
    
    static assertionDebugging() {
        console.log("\n断言调试:");
        
        const value = 42;
        console.assert(value === 42, "值应该等于42");
        console.assert(value === 100, "这个断言会失败: 值不等于100");
        
        const obj = { prop: "test" };
        console.assert(obj.prop === "test", "对象属性检查");
        console.assert(obj.nonExistent, "这个断言会失败: 属性不存在");
    }
}

ConsoleDebugger.basicLogging();
ConsoleDebugger.performanceLogging();
ConsoleDebugger.assertionDebugging();

console.log();

// =============================================
// 2. 自定义调试器
// =============================================

console.log("2. 自定义调试器");

class CustomDebugger {
    constructor(namespace = 'DEBUG') {
        this.namespace = namespace;
        this.enabled = true;
        this.logLevel = 'info'; // error, warn, info, debug
        this.logHistory = [];
        this.maxHistorySize = 100;
    }
    
    setLogLevel(level) {
        this.logLevel = level;
        this.log('debug', `日志级别设置为: ${level}`);
    }
    
    enable() {
        this.enabled = true;
        console.log(`[${this.namespace}] 调试已启用`);
    }
    
    disable() {
        this.enabled = false;
        console.log(`[${this.namespace}] 调试已禁用`);
    }
    
    log(level, message, ...args) {
        if (!this.enabled) return;
        
        const levels = { error: 0, warn: 1, info: 2, debug: 3 };
        const currentLevel = levels[this.logLevel] || 2;
        const messageLevel = levels[level] || 2;
        
        if (messageLevel <= currentLevel) {
            const timestamp = new Date().toISOString();
            const logEntry = {
                timestamp,
                level,
                namespace: this.namespace,
                message,
                args
            };
            
            this.logHistory.push(logEntry);
            if (this.logHistory.length > this.maxHistorySize) {
                this.logHistory.shift();
            }
            
            const prefix = `[${timestamp}] [${this.namespace}] [${level.toUpperCase()}]`;
            
            switch (level) {
                case 'error':
                    console.error(prefix, message, ...args);
                    break;
                case 'warn':
                    console.warn(prefix, message, ...args);
                    break;
                case 'info':
                    console.info(prefix, message, ...args);
                    break;
                case 'debug':
                    console.log(prefix, message, ...args);
                    break;
                default:
                    console.log(prefix, message, ...args);
            }
        }
    }
    
    error(message, ...args) {
        this.log('error', message, ...args);
    }
    
    warn(message, ...args) {
        this.log('warn', message, ...args);
    }
    
    info(message, ...args) {
        this.log('info', message, ...args);
    }
    
    debug(message, ...args) {
        this.log('debug', message, ...args);
    }
    
    group(title) {
        if (this.enabled) {
            console.group(`[${this.namespace}] ${title}`);
        }
    }
    
    groupEnd() {
        if (this.enabled) {
            console.groupEnd();
        }
    }
    
    time(label) {
        if (this.enabled) {
            console.time(`[${this.namespace}] ${label}`);
        }
    }
    
    timeEnd(label) {
        if (this.enabled) {
            console.timeEnd(`[${this.namespace}] ${label}`);
        }
    }
    
    getHistory() {
        return [...this.logHistory];
    }
    
    clearHistory() {
        this.logHistory = [];
        this.info('日志历史已清除');
    }
    
    exportLogs() {
        const logs = this.logHistory.map(entry => 
            `${entry.timestamp} [${entry.level.toUpperCase()}] ${entry.message}`
        ).join('\n');
        
        return logs;
    }
}

// 测试自定义调试器
const debugger = new CustomDebugger('APP');

debugger.info('应用启动');
debugger.debug('这是调试信息');
debugger.warn('这是警告信息');
debugger.error('这是错误信息');

debugger.group('用户操作');
debugger.info('用户登录');
debugger.debug('获取用户信息');
debugger.groupEnd();

debugger.time('数据处理');
// 模拟一些处理
for (let i = 0; i < 10000; i++) {
    // 处理数据
}
debugger.timeEnd('数据处理');

debugger.setLogLevel('warn');
debugger.debug('这条调试信息不会显示');
debugger.warn('这条警告会显示');

console.log();

// =============================================
// 3. 函数调试装饰器
// =============================================

console.log("3. 函数调试装饰器");

class DebugDecorator {
    static trace(target, propertyKey, descriptor) {
        const originalMethod = descriptor.value;
        
        descriptor.value = function(...args) {
            console.log(`🔍 调用函数: ${propertyKey}`);
            console.log(`📥 输入参数:`, args);
            
            const start = performance.now();
            
            try {
                const result = originalMethod.apply(this, args);
                
                const end = performance.now();
                console.log(`📤 返回结果:`, result);
                console.log(`⏱️ 执行时间: ${(end - start).toFixed(2)}ms`);
                
                return result;
            } catch (error) {
                const end = performance.now();
                console.log(`❌ 执行错误:`, error);
                console.log(`⏱️ 执行时间: ${(end - start).toFixed(2)}ms`);
                throw error;
            }
        };
        
        return descriptor;
    }
    
    static createTraceWrapper(fn, name = fn.name) {
        return function(...args) {
            console.log(`🔍 调用函数: ${name}`);
            console.log(`📥 输入参数:`, args);
            
            const start = performance.now();
            
            try {
                const result = fn.apply(this, args);
                
                if (result && typeof result.then === 'function') {
                    // 处理Promise
                    return result
                        .then(asyncResult => {
                            const end = performance.now();
                            console.log(`📤 异步结果:`, asyncResult);
                            console.log(`⏱️ 执行时间: ${(end - start).toFixed(2)}ms`);
                            return asyncResult;
                        })
                        .catch(error => {
                            const end = performance.now();
                            console.log(`❌ 异步错误:`, error);
                            console.log(`⏱️ 执行时间: ${(end - start).toFixed(2)}ms`);
                            throw error;
                        });
                }
                
                const end = performance.now();
                console.log(`📤 返回结果:`, result);
                console.log(`⏱️ 执行时间: ${(end - start).toFixed(2)}ms`);
                
                return result;
            } catch (error) {
                const end = performance.now();
                console.log(`❌ 执行错误:`, error);
                console.log(`⏱️ 执行时间: ${(end - start).toFixed(2)}ms`);
                throw error;
            }
        };
    }
}

// 测试函数装饰器
class MathCalculator {
    add(a, b) {
        return a + b;
    }
    
    divide(a, b) {
        if (b === 0) {
            throw new Error('除数不能为零');
        }
        return a / b;
    }
    
    async asyncCalculate(a, b) {
        await new Promise(resolve => setTimeout(resolve, 100));
        return a * b;
    }
}

// 手动应用装饰器
DebugDecorator.trace(MathCalculator.prototype, 'add', 
    Object.getOwnPropertyDescriptor(MathCalculator.prototype, 'add'));

const calculator = new MathCalculator();

console.log("函数调试装饰器测试:");
calculator.add(5, 3);

try {
    calculator.divide(10, 0);
} catch (error) {
    // 错误已被装饰器处理
}

// 包装异步函数
const asyncCalc = DebugDecorator.createTraceWrapper(
    calculator.asyncCalculate.bind(calculator), 
    'asyncCalculate'
);

asyncCalc(4, 5).then(() => {
    console.log("异步计算完成");
});

console.log();

// =============================================
// 4. 状态调试
// =============================================

console.log("4. 状态调试");

class StateDebugger {
    constructor(initialState = {}) {
        this.state = { ...initialState };
        this.stateHistory = [{ ...initialState }];
        this.maxHistorySize = 50;
        this.watchers = new Map();
        this.enabled = true;
    }
    
    setState(newState, description = '状态更新') {
        if (!this.enabled) {
            Object.assign(this.state, newState);
            return;
        }
        
        const oldState = { ...this.state };
        Object.assign(this.state, newState);
        
        const stateChange = {
            timestamp: Date.now(),
            description,
            oldState,
            newState: { ...this.state },
            changes: this.getChanges(oldState, this.state)
        };
        
        this.stateHistory.push(stateChange);
        if (this.stateHistory.length > this.maxHistorySize) {
            this.stateHistory.shift();
        }
        
        console.group(`🔄 ${description}`);
        console.log('变化:', stateChange.changes);
        console.log('新状态:', this.state);
        console.groupEnd();
        
        // 触发监听器
        this.notifyWatchers(stateChange);
    }
    
    getChanges(oldState, newState) {
        const changes = {};
        
        for (const key in newState) {
            if (oldState[key] !== newState[key]) {
                changes[key] = {
                    from: oldState[key],
                    to: newState[key]
                };
            }
        }
        
        return changes;
    }
    
    watch(property, callback) {
        if (!this.watchers.has(property)) {
            this.watchers.set(property, []);
        }
        this.watchers.get(property).push(callback);
        
        console.log(`👁️ 开始监听属性: ${property}`);
    }
    
    unwatch(property, callback) {
        const callbacks = this.watchers.get(property);
        if (callbacks) {
            const index = callbacks.indexOf(callback);
            if (index > -1) {
                callbacks.splice(index, 1);
                console.log(`👁️ 停止监听属性: ${property}`);
            }
        }
    }
    
    notifyWatchers(stateChange) {
        for (const property in stateChange.changes) {
            const callbacks = this.watchers.get(property);
            if (callbacks) {
                callbacks.forEach(callback => {
                    try {
                        callback(stateChange.changes[property], property, this.state);
                    } catch (error) {
                        console.error(`监听器错误 (${property}):`, error);
                    }
                });
            }
        }
    }
    
    getStateHistory() {
        return [...this.stateHistory];
    }
    
    revertToState(index) {
        if (index >= 0 && index < this.stateHistory.length) {
            const targetState = this.stateHistory[index];
            this.state = { ...targetState.newState || targetState };
            console.log(`⏪ 回滚到状态 ${index}:`, this.state);
        }
    }
    
    debugState() {
        console.group('🔍 状态调试信息');
        console.log('当前状态:', this.state);
        console.log('状态历史数量:', this.stateHistory.length);
        console.log('监听的属性:', Array.from(this.watchers.keys()));
        console.groupEnd();
    }
}

// 测试状态调试
const stateDebugger = new StateDebugger({
    user: null,
    isLoading: false,
    error: null
});

// 设置监听器
stateDebugger.watch('user', (change, property, state) => {
    console.log(`👤 用户状态变化: ${change.from} -> ${change.to}`);
});

stateDebugger.watch('isLoading', (change, property, state) => {
    console.log(`⏳ 加载状态变化: ${change.from} -> ${change.to}`);
});

// 模拟状态变化
stateDebugger.setState({ isLoading: true }, '开始加载用户数据');

setTimeout(() => {
    stateDebugger.setState({
        isLoading: false,
        user: { id: 1, name: '张三' }
    }, '用户数据加载完成');
}, 500);

setTimeout(() => {
    stateDebugger.setState({
        error: '网络错误'
    }, '发生错误');
    
    stateDebugger.debugState();
}, 1000);

console.log();

// =============================================
// 5. 性能调试
// =============================================

console.log("5. 性能调试");

class PerformanceDebugger {
    constructor() {
        this.marks = new Map();
        this.measures = [];
        this.memorySnapshots = [];
    }
    
    mark(name) {
        const timestamp = performance.now();
        this.marks.set(name, timestamp);
        
        if (typeof performance.mark === 'function') {
            performance.mark(name);
        }
        
        console.log(`📍 标记: ${name} at ${timestamp.toFixed(2)}ms`);
    }
    
    measure(name, startMark, endMark = null) {
        const endTime = endMark ? this.marks.get(endMark) : performance.now();
        const startTime = this.marks.get(startMark);
        
        if (startTime === undefined) {
            console.error(`开始标记不存在: ${startMark}`);
            return;
        }
        
        const duration = endTime - startTime;
        
        const measurement = {
            name,
            startMark,
            endMark,
            duration,
            timestamp: Date.now()
        };
        
        this.measures.push(measurement);
        
        if (typeof performance.measure === 'function') {
            try {
                performance.measure(name, startMark, endMark);
            } catch (error) {
                // 忽略性能API错误
            }
        }
        
        console.log(`📏 测量: ${name} = ${duration.toFixed(2)}ms`);
        return duration;
    }
    
    profile(fn, name = 'function') {
        const startMark = `${name}-start`;
        const endMark = `${name}-end`;
        
        this.mark(startMark);
        
        const start = performance.now();
        const result = fn();
        const end = performance.now();
        
        this.mark(endMark);
        this.measure(name, startMark, endMark);
        
        return {
            result,
            duration: end - start,
            name
        };
    }
    
    async profileAsync(asyncFn, name = 'async-function') {
        const startMark = `${name}-start`;
        const endMark = `${name}-end`;
        
        this.mark(startMark);
        
        const start = performance.now();
        const result = await asyncFn();
        const end = performance.now();
        
        this.mark(endMark);
        this.measure(name, startMark, endMark);
        
        return {
            result,
            duration: end - start,
            name
        };
    }
    
    takeMemorySnapshot(label = '') {
        // 模拟内存快照（在真实环境中需要使用浏览器API）
        const snapshot = {
            label,
            timestamp: Date.now(),
            // 这些值在真实环境中来自 performance.memory
            usedJSHeapSize: Math.random() * 50000000,
            totalJSHeapSize: Math.random() * 100000000,
            jsHeapSizeLimit: 2000000000
        };
        
        this.memorySnapshots.push(snapshot);
        
        console.log(`💾 内存快照: ${label}`, {
            used: `${(snapshot.usedJSHeapSize / 1024 / 1024).toFixed(2)} MB`,
            total: `${(snapshot.totalJSHeapSize / 1024 / 1024).toFixed(2)} MB`
        });
        
        return snapshot;
    }
    
    analyzeMemoryTrend() {
        if (this.memorySnapshots.length < 2) {
            console.log('内存快照数量不足，无法分析趋势');
            return;
        }
        
        const first = this.memorySnapshots[0];
        const last = this.memorySnapshots[this.memorySnapshots.length - 1];
        
        const memoryDiff = last.usedJSHeapSize - first.usedJSHeapSize;
        const timeDiff = last.timestamp - first.timestamp;
        
        console.log('📊 内存使用趋势分析:');
        console.log(`  时间跨度: ${timeDiff}ms`);
        console.log(`  内存变化: ${(memoryDiff / 1024 / 1024).toFixed(2)} MB`);
        console.log(`  变化率: ${memoryDiff > 0 ? '增长' : '减少'}`);
    }
    
    getPerformanceReport() {
        return {
            marks: Object.fromEntries(this.marks),
            measures: [...this.measures],
            memorySnapshots: [...this.memorySnapshots],
            summary: {
                totalMeasures: this.measures.length,
                avgDuration: this.measures.length > 0 
                    ? this.measures.reduce((sum, m) => sum + m.duration, 0) / this.measures.length 
                    : 0,
                longestDuration: this.measures.length > 0 
                    ? Math.max(...this.measures.map(m => m.duration)) 
                    : 0
            }
        };
    }
}

// 测试性能调试
const perfDebugger = new PerformanceDebugger();

// 测试同步性能分析
function heavyComputation() {
    let result = 0;
    for (let i = 0; i < 1000000; i++) {
        result += Math.sqrt(i);
    }
    return result;
}

const syncResult = perfDebugger.profile(heavyComputation, '重计算任务');
console.log('同步任务结果:', syncResult.duration.toFixed(2) + 'ms');

// 测试异步性能分析
async function asyncTask() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return '异步任务完成';
}

perfDebugger.profileAsync(asyncTask, '异步任务').then(result => {
    console.log('异步任务结果:', result.duration.toFixed(2) + 'ms');
});

// 内存监控
perfDebugger.takeMemorySnapshot('应用启动');

setTimeout(() => {
    perfDebugger.takeMemorySnapshot('中期检查');
    perfDebugger.analyzeMemoryTrend();
}, 300);

setTimeout(() => {
    console.log('性能报告:', perfDebugger.getPerformanceReport());
}, 600);

console.log();

// =============================================
// 6. 最佳实践总结
// =============================================

console.log("6. 最佳实践总结");

console.log(`
调试最佳实践:

1. 日志策略:
   - 使用不同级别的日志(error, warn, info, debug)
   - 提供足够的上下文信息
   - 避免在生产环境输出调试日志
   - 实现日志的分类和过滤

2. 断点调试:
   - 合理设置断点位置
   - 使用条件断点提高效率
   - 利用监视表达式观察变量
   - 掌握调试器的步进操作

3. 性能调试:
   - 识别性能瓶颈
   - 使用性能分析工具
   - 监控内存使用情况
   - 分析网络请求性能

4. 错误调试:
   - 保留完整的错误堆栈
   - 记录错误发生的上下文
   - 使用错误边界捕获错误
   - 实现错误的自动上报

5. 调试工具:
   - 熟练使用浏览器开发者工具
   - 集成Source Map支持
   - 使用调试代理和拦截器
   - 善用网络面板和性能面板

6. 代码调试:
   - 编写可调试的代码
   - 避免复杂的嵌套结构
   - 使用有意义的变量名
   - 添加适当的注释和文档

常见调试场景:
- 异步代码的执行顺序
- 事件处理和状态管理
- 内存泄漏和性能问题
- 网络请求和API错误
- 跨浏览器兼容性问题

调试工具推荐:
- Chrome DevTools
- Firefox Developer Tools
- VS Code Debugger
- Node.js Inspector
- React DevTools
- Vue DevTools
`);

// 导出供测试使用
module.exports = {
    ConsoleDebugger,
    CustomDebugger,
    DebugDecorator,
    StateDebugger,
    PerformanceDebugger
};

console.log("调试技巧演示完成\n"); 