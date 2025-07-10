/**
 * JavaScript高级程序设计 - 第9章：实战项目 - 天气应用
 *
 * 一个功能完整的天气应用，演示API调用、数据处理、缓存和错误处理
 * 包含：API管理、数据缓存、位置服务、错误恢复等
 */

console.log("=== 天气应用实战项目 ===\n");

// =============================================
// 1. API客户端基础设施
// =============================================

class HttpClient {
  constructor(baseURL = "", options = {}) {
    this.baseURL = baseURL;
    this.defaultOptions = {
      timeout: 10000,
      retries: 3,
      retryDelay: 1000,
      ...options,
    };
    this.interceptors = {
      request: [],
      response: [],
    };
  }

  // 添加请求拦截器
  addRequestInterceptor(interceptor) {
    this.interceptors.request.push(interceptor);
  }

  // 添加响应拦截器
  addResponseInterceptor(interceptor) {
    this.interceptors.response.push(interceptor);
  }

  // 发送请求
  async request(url, options = {}) {
    const config = {
      ...this.defaultOptions,
      ...options,
      url: this.baseURL + url,
    };

    // 应用请求拦截器
    for (const interceptor of this.interceptors.request) {
      config = await interceptor(config);
    }

    let lastError;

    for (let attempt = 1; attempt <= config.retries; attempt++) {
      try {
        const response = await this.executeRequest(config);

        // 应用响应拦截器
        let processedResponse = response;
        for (const interceptor of this.interceptors.response) {
          processedResponse = await interceptor(processedResponse, config);
        }

        return processedResponse;
      } catch (error) {
        lastError = error;
        console.warn(
          `请求失败 (尝试 ${attempt}/${config.retries}):`,
          error.message
        );

        if (attempt < config.retries) {
          await this.delay(config.retryDelay * attempt);
        }
      }
    }

    throw lastError;
  }

  // 执行实际请求
  async executeRequest(config) {
    // 模拟HTTP请求（在真实环境中使用fetch）
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        reject(new Error("请求超时"));
      }, config.timeout);

      // 模拟网络延迟
      setTimeout(() => {
        clearTimeout(timer);

        // 模拟API响应
        if (config.url.includes("/weather")) {
          resolve(this.mockWeatherResponse(config));
        } else if (config.url.includes("/forecast")) {
          resolve(this.mockForecastResponse(config));
        } else if (config.url.includes("/geocoding")) {
          resolve(this.mockGeocodingResponse(config));
        } else {
          reject(new Error("未知的API端点"));
        }
      }, 200 + Math.random() * 300);
    });
  }

  // 模拟天气API响应
  mockWeatherResponse(config) {
    const weatherConditions = ["sunny", "cloudy", "rainy", "snowy", "stormy"];
    const condition =
      weatherConditions[Math.floor(Math.random() * weatherConditions.length)];

    return {
      ok: true,
      status: 200,
      json: async () => ({
        location: {
          name: config.params?.city || "北京",
          country: "中国",
          lat: 39.9042,
          lon: 116.4074,
        },
        current: {
          temperature: Math.round(Math.random() * 30 + 5),
          condition,
          humidity: Math.round(Math.random() * 50 + 30),
          windSpeed: Math.round(Math.random() * 20 + 5),
          pressure: Math.round(Math.random() * 50 + 1000),
          visibility: Math.round(Math.random() * 10 + 5),
          uvIndex: Math.round(Math.random() * 10),
          timestamp: Date.now(),
        },
      }),
    };
  }

  // 模拟预报API响应
  mockForecastResponse(config) {
    const days = 5;
    const forecast = [];

    for (let i = 0; i < days; i++) {
      const date = new Date();
      date.setDate(date.getDate() + i);

      forecast.push({
        date: date.toISOString().split("T")[0],
        high: Math.round(Math.random() * 10 + 20),
        low: Math.round(Math.random() * 10 + 10),
        condition: ["sunny", "cloudy", "rainy"][Math.floor(Math.random() * 3)],
        precipitation: Math.round(Math.random() * 30),
        humidity: Math.round(Math.random() * 30 + 40),
      });
    }

    return {
      ok: true,
      status: 200,
      json: async () => ({
        location: config.params?.city || "北京",
        forecast,
      }),
    };
  }

  // 模拟地理编码API响应
  mockGeocodingResponse(config) {
    const cities = [
      { name: "北京", lat: 39.9042, lon: 116.4074 },
      { name: "上海", lat: 31.2304, lon: 121.4737 },
      { name: "广州", lat: 23.1291, lon: 113.2644 },
      { name: "深圳", lat: 22.3193, lon: 114.1694 },
    ];

    const query = config.params?.q || "";
    const results = cities.filter(
      (city) => city.name.includes(query) || query.includes(city.name)
    );

    return {
      ok: true,
      status: 200,
      json: async () => ({ results }),
    };
  }

  delay(ms) {
    return new Promise((resolve) => setTimeout(resolve, ms));
  }

  // GET请求
  get(url, params = {}) {
    return this.request(url, { method: "GET", params });
  }

  // POST请求
  post(url, data = {}) {
    return this.request(url, { method: "POST", data });
  }
}

// =============================================
// 2. 缓存管理器
// =============================================

class CacheManager {
  constructor() {
    this.cache = new Map();
    this.ttlMap = new Map();
    this.maxSize = 100;
    this.defaultTTL = 5 * 60 * 1000; // 5分钟
  }

  // 生成缓存键
  generateKey(prefix, params) {
    const sortedParams = Object.keys(params)
      .sort()
      .map((key) => `${key}=${params[key]}`)
      .join("&");
    return `${prefix}:${sortedParams}`;
  }

  // 设置缓存
  set(key, value, ttl = this.defaultTTL) {
    // 如果缓存已满，删除最旧的条目
    if (this.cache.size >= this.maxSize) {
      const oldestKey = this.cache.keys().next().value;
      this.delete(oldestKey);
    }

    this.cache.set(key, {
      value,
      timestamp: Date.now(),
      ttl,
    });

    // 设置过期清理
    const timeoutId = setTimeout(() => {
      this.delete(key);
    }, ttl);

    this.ttlMap.set(key, timeoutId);

    console.log(`缓存设置: ${key} (TTL: ${ttl}ms)`);
  }

  // 获取缓存
  get(key) {
    const cached = this.cache.get(key);

    if (!cached) {
      return null;
    }

    // 检查是否过期
    if (Date.now() - cached.timestamp > cached.ttl) {
      this.delete(key);
      return null;
    }

    console.log(`缓存命中: ${key}`);
    return cached.value;
  }

  // 删除缓存
  delete(key) {
    this.cache.delete(key);

    const timeoutId = this.ttlMap.get(key);
    if (timeoutId) {
      clearTimeout(timeoutId);
      this.ttlMap.delete(key);
    }

    console.log(`缓存删除: ${key}`);
  }

  // 清空缓存
  clear() {
    for (const timeoutId of this.ttlMap.values()) {
      clearTimeout(timeoutId);
    }

    this.cache.clear();
    this.ttlMap.clear();
    console.log("缓存已清空");
  }

  // 获取缓存统计
  getStats() {
    return {
      size: this.cache.size,
      maxSize: this.maxSize,
      keys: Array.from(this.cache.keys()),
    };
  }

  // 缓存装饰器
  cached(ttl = this.defaultTTL) {
    return (target, propertyKey, descriptor) => {
      const originalMethod = descriptor.value;

      descriptor.value = async function (...args) {
        const key = `${propertyKey}:${JSON.stringify(args)}`;

        // 尝试从缓存获取
        const cached = this.cache?.get(key);
        if (cached) {
          return cached;
        }

        // 执行原方法
        const result = await originalMethod.apply(this, args);

        // 缓存结果
        if (this.cache) {
          this.cache.set(key, result, ttl);
        }

        return result;
      };

      return descriptor;
    };
  }
}

// =============================================
// 3. 位置服务
// =============================================

class LocationService {
  constructor() {
    this.currentLocation = null;
    this.watchId = null;
    this.cache = new CacheManager();
  }

  // 获取当前位置
  async getCurrentPosition(options = {}) {
    const defaultOptions = {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 5 * 60 * 1000, // 5分钟
      ...options,
    };

    // 模拟地理定位API
    return new Promise((resolve, reject) => {
      setTimeout(() => {
        // 模拟成功获取位置
        if (Math.random() > 0.1) {
          // 90%成功率
          const position = {
            coords: {
              latitude: 39.9042 + (Math.random() - 0.5) * 0.1,
              longitude: 116.4074 + (Math.random() - 0.5) * 0.1,
              accuracy: Math.random() * 100 + 10,
            },
            timestamp: Date.now(),
          };

          this.currentLocation = position;
          resolve(position);
        } else {
          reject(new Error("无法获取位置信息"));
        }
      }, 1000);
    });
  }

  // 监听位置变化
  watchPosition(callback, errorCallback, options = {}) {
    console.log("开始监听位置变化");

    // 模拟位置监听
    this.watchId = setInterval(async () => {
      try {
        const position = await this.getCurrentPosition(options);
        callback(position);
      } catch (error) {
        if (errorCallback) {
          errorCallback(error);
        }
      }
    }, 30000); // 每30秒更新一次

    return this.watchId;
  }

  // 停止监听位置
  clearWatch() {
    if (this.watchId) {
      clearInterval(this.watchId);
      this.watchId = null;
      console.log("停止监听位置变化");
    }
  }

  // 地理编码（地址转坐标）
  async geocode(address) {
    const cacheKey = this.cache.generateKey("geocode", { address });
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    // 模拟地理编码
    const mockResults = [
      {
        address: "北京市",
        lat: 39.9042,
        lon: 116.4074,
        formattedAddress: "北京市, 中国",
      },
      {
        address: "上海市",
        lat: 31.2304,
        lon: 121.4737,
        formattedAddress: "上海市, 中国",
      },
    ];

    const result =
      mockResults.find(
        (r) => address.includes(r.address) || r.address.includes(address)
      ) || mockResults[0];

    this.cache.set(cacheKey, result, 60 * 60 * 1000); // 1小时缓存
    return result;
  }

  // 反向地理编码（坐标转地址）
  async reverseGeocode(lat, lon) {
    const cacheKey = this.cache.generateKey("reverse-geocode", { lat, lon });
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    // 模拟反向地理编码
    const result = {
      lat,
      lon,
      address: "模拟地址",
      city: "北京市",
      country: "中国",
      formattedAddress: `模拟地址, 北京市, 中国`,
    };

    this.cache.set(cacheKey, result, 60 * 60 * 1000); // 1小时缓存
    return result;
  }

  // 计算两点距离
  calculateDistance(lat1, lon1, lat2, lon2) {
    const R = 6371; // 地球半径（公里）
    const dLat = this.toRadians(lat2 - lat1);
    const dLon = this.toRadians(lon2 - lon1);

    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos(this.toRadians(lat1)) *
        Math.cos(this.toRadians(lat2)) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2);

    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    return R * c;
  }

  toRadians(degrees) {
    return degrees * (Math.PI / 180);
  }
}

// =============================================
// 4. 天气API服务
// =============================================

class WeatherAPIService {
  constructor() {
    this.httpClient = new HttpClient("https://api.weather.com");
    this.cache = new CacheManager();
    this.rateLimiter = new RateLimiter(100, 60000); // 每分钟100次请求

    this.setupInterceptors();
  }

  setupInterceptors() {
    // 请求拦截器：添加API密钥和限流
    this.httpClient.addRequestInterceptor(async (config) => {
      await this.rateLimiter.acquire();

      config.params = {
        ...config.params,
        apiKey: "mock-api-key",
        units: "metric",
      };

      console.log(`API请求: ${config.url}`, config.params);
      return config;
    });

    // 响应拦截器：错误处理和数据转换
    this.httpClient.addResponseInterceptor(async (response, config) => {
      if (!response.ok) {
        throw new Error(`API错误: ${response.status}`);
      }

      const data = await response.json();
      return data;
    });
  }

  // 获取当前天气
  async getCurrentWeather(location) {
    const cacheKey = this.cache.generateKey("current-weather", location);
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const data = await this.httpClient.get("/weather", location);

      // 数据标准化
      const standardized = this.standardizeCurrentWeather(data);

      // 缓存5分钟
      this.cache.set(cacheKey, standardized, 5 * 60 * 1000);

      return standardized;
    } catch (error) {
      console.error("获取当前天气失败:", error);
      throw new Error(`无法获取天气信息: ${error.message}`);
    }
  }

  // 获取天气预报
  async getForecast(location, days = 5) {
    const cacheKey = this.cache.generateKey("forecast", { ...location, days });
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const data = await this.httpClient.get("/forecast", {
        ...location,
        days,
      });

      // 数据标准化
      const standardized = this.standardizeForecast(data);

      // 缓存30分钟
      this.cache.set(cacheKey, standardized, 30 * 60 * 1000);

      return standardized;
    } catch (error) {
      console.error("获取天气预报失败:", error);
      throw new Error(`无法获取天气预报: ${error.message}`);
    }
  }

  // 搜索城市
  async searchLocations(query) {
    const cacheKey = this.cache.generateKey("search", { query });
    const cached = this.cache.get(cacheKey);

    if (cached) {
      return cached;
    }

    try {
      const data = await this.httpClient.get("/geocoding", { q: query });

      // 缓存1小时
      this.cache.set(cacheKey, data.results, 60 * 60 * 1000);

      return data.results;
    } catch (error) {
      console.error("搜索城市失败:", error);
      throw new Error(`无法搜索城市: ${error.message}`);
    }
  }

  // 标准化当前天气数据
  standardizeCurrentWeather(data) {
    return {
      location: {
        name: data.location.name,
        country: data.location.country,
        coordinates: {
          lat: data.location.lat,
          lon: data.location.lon,
        },
      },
      current: {
        temperature: data.current.temperature,
        condition: data.current.condition,
        humidity: data.current.humidity,
        windSpeed: data.current.windSpeed,
        pressure: data.current.pressure,
        visibility: data.current.visibility,
        uvIndex: data.current.uvIndex,
        timestamp: data.current.timestamp,
      },
      meta: {
        updatedAt: new Date().toISOString(),
        source: "api",
      },
    };
  }

  // 标准化预报数据
  standardizeForecast(data) {
    return {
      location: data.location,
      forecast: data.forecast.map((day) => ({
        date: day.date,
        temperature: {
          high: day.high,
          low: day.low,
        },
        condition: day.condition,
        precipitation: day.precipitation,
        humidity: day.humidity,
      })),
      meta: {
        updatedAt: new Date().toISOString(),
        source: "api",
      },
    };
  }
}

// 限流器
class RateLimiter {
  constructor(maxRequests, timeWindow) {
    this.maxRequests = maxRequests;
    this.timeWindow = timeWindow;
    this.requests = [];
  }

  async acquire() {
    const now = Date.now();

    // 清理过期请求
    this.requests = this.requests.filter(
      (timestamp) => now - timestamp < this.timeWindow
    );

    if (this.requests.length >= this.maxRequests) {
      const oldestRequest = this.requests[0];
      const waitTime = this.timeWindow - (now - oldestRequest);

      console.log(`限流等待: ${waitTime}ms`);
      await new Promise((resolve) => setTimeout(resolve, waitTime));

      return this.acquire();
    }

    this.requests.push(now);
  }
}

// =============================================
// 5. 天气应用主类
// =============================================

class WeatherApp {
  constructor() {
    this.weatherAPI = new WeatherAPIService();
    this.locationService = new LocationService();
    this.favorites = new Set();
    this.currentWeather = null;
    this.forecast = null;
    this.isLoading = false;
    this.error = null;

    this.loadFavorites();
    this.setupAutoRefresh();
  }

  // 初始化应用
  async init() {
    try {
      console.log("初始化天气应用...");

      // 尝试获取当前位置
      const position = await this.locationService.getCurrentPosition();
      const location = await this.locationService.reverseGeocode(
        position.coords.latitude,
        position.coords.longitude
      );

      // 加载天气数据
      await this.loadWeatherData(location);

      console.log("天气应用初始化完成");
    } catch (error) {
      console.warn("自动定位失败，使用默认位置:", error.message);

      // 使用默认位置
      await this.loadWeatherData({ city: "北京" });
    }
  }

  // 加载天气数据
  async loadWeatherData(location) {
    this.isLoading = true;
    this.error = null;

    try {
      console.log("加载天气数据:", location);

      // 并行加载当前天气和预报
      const [currentWeather, forecast] = await Promise.all([
        this.weatherAPI.getCurrentWeather(location),
        this.weatherAPI.getForecast(location),
      ]);

      this.currentWeather = currentWeather;
      this.forecast = forecast;

      console.log("天气数据加载完成");
    } catch (error) {
      this.error = error.message;
      console.error("加载天气数据失败:", error);
      throw error;
    } finally {
      this.isLoading = false;
    }
  }

  // 搜索城市
  async searchCity(query) {
    try {
      const results = await this.weatherAPI.searchLocations(query);
      return results;
    } catch (error) {
      console.error("搜索城市失败:", error);
      return [];
    }
  }

  // 切换到指定城市
  async switchToCity(city) {
    await this.loadWeatherData({ city });
  }

  // 添加到收藏
  addToFavorites(location) {
    const locationKey =
      typeof location === "string" ? location : location.city || location.name;

    this.favorites.add(locationKey);
    this.saveFavorites();

    console.log(`已添加到收藏: ${locationKey}`);
  }

  // 从收藏移除
  removeFromFavorites(location) {
    const locationKey =
      typeof location === "string" ? location : location.city || location.name;

    this.favorites.delete(locationKey);
    this.saveFavorites();

    console.log(`已从收藏移除: ${locationKey}`);
  }

  // 获取收藏列表
  getFavorites() {
    return Array.from(this.favorites);
  }

  // 保存收藏到本地存储
  saveFavorites() {
    if (typeof localStorage !== "undefined") {
      localStorage.setItem(
        "weatherApp.favorites",
        JSON.stringify(Array.from(this.favorites))
      );
    }
  }

  // 从本地存储加载收藏
  loadFavorites() {
    if (typeof localStorage !== "undefined") {
      try {
        const stored = localStorage.getItem("weatherApp.favorites");
        if (stored) {
          const favorites = JSON.parse(stored);
          this.favorites = new Set(favorites);
        }
      } catch (error) {
        console.error("加载收藏失败:", error);
      }
    }
  }

  // 设置自动刷新
  setupAutoRefresh(interval = 10 * 60 * 1000) {
    // 10分钟
    this.refreshInterval = setInterval(async () => {
      if (this.currentWeather) {
        try {
          const location = {
            city: this.currentWeather.location.name,
          };
          await this.loadWeatherData(location);
          console.log("天气数据自动刷新完成");
        } catch (error) {
          console.warn("自动刷新失败:", error);
        }
      }
    }, interval);
  }

  // 停止自动刷新
  stopAutoRefresh() {
    if (this.refreshInterval) {
      clearInterval(this.refreshInterval);
      this.refreshInterval = null;
    }
  }

  // 获取天气建议
  getWeatherAdvice() {
    if (!this.currentWeather) return [];

    const advice = [];
    const weather = this.currentWeather.current;

    if (weather.temperature < 0) {
      advice.push("气温较低，请注意保暖");
    } else if (weather.temperature > 30) {
      advice.push("气温较高，请注意防暑");
    }

    if (weather.humidity > 80) {
      advice.push("湿度较高，体感可能较为闷热");
    }

    if (weather.uvIndex > 7) {
      advice.push("紫外线强烈，请注意防晒");
    }

    if (weather.windSpeed > 15) {
      advice.push("风力较大，外出请注意安全");
    }

    if (weather.condition === "rainy") {
      advice.push("有降雨，出门请携带雨具");
    }

    return advice;
  }

  // 获取空气质量指数（模拟）
  getAirQuality() {
    const aqi = Math.floor(Math.random() * 200);
    let level, color, description;

    if (aqi <= 50) {
      level = "优";
      color = "green";
      description = "空气质量令人满意";
    } else if (aqi <= 100) {
      level = "良";
      color = "yellow";
      description = "空气质量可以接受";
    } else if (aqi <= 150) {
      level = "轻度污染";
      color = "orange";
      description = "敏感人群请减少户外活动";
    } else {
      level = "重度污染";
      color = "red";
      description = "建议减少外出";
    }

    return { aqi, level, color, description };
  }

  // 格式化温度显示
  formatTemperature(temp, unit = "C") {
    return `${Math.round(temp)}°${unit}`;
  }

  // 格式化时间
  formatTime(timestamp) {
    return new Date(timestamp).toLocaleString("zh-CN");
  }

  // 获取天气图标
  getWeatherIcon(condition) {
    const icons = {
      sunny: "☀️",
      cloudy: "☁️",
      rainy: "🌧️",
      snowy: "❄️",
      stormy: "⛈️",
    };

    return icons[condition] || "🌤️";
  }

  // 清理资源
  destroy() {
    this.stopAutoRefresh();
    this.locationService.clearWatch();
    this.weatherAPI.cache.clear();
    console.log("天气应用已清理");
  }
}

// =============================================
// 6. 应用演示
// =============================================

console.log("启动天气应用演示...\n");

// 创建应用实例
const weatherApp = new WeatherApp();

// 演示应用功能
setTimeout(async () => {
  try {
    console.log("=== 天气应用功能演示 ===\n");

    // 1. 初始化应用
    console.log("1. 初始化应用:");
    await weatherApp.init();

    // 2. 显示当前天气
    console.log("\n2. 当前天气信息:");
    if (weatherApp.currentWeather) {
      const weather = weatherApp.currentWeather;
      console.log(
        `位置: ${weather.location.name}, ${weather.location.country}`
      );
      console.log(
        `温度: ${weatherApp.formatTemperature(weather.current.temperature)}`
      );
      console.log(
        `天气: ${weatherApp.getWeatherIcon(weather.current.condition)} ${
          weather.current.condition
        }`
      );
      console.log(`湿度: ${weather.current.humidity}%`);
      console.log(`风速: ${weatherApp.current.windSpeed} km/h`);
    }

    // 3. 显示天气预报
    console.log("\n3. 天气预报:");
    if (weatherApp.forecast) {
      weatherApp.forecast.forecast.slice(0, 3).forEach((day) => {
        console.log(
          `${day.date}: ${weatherApp.formatTemperature(
            day.temperature.high
          )}/${weatherApp.formatTemperature(day.temperature.low)} ${
            day.condition
          }`
        );
      });
    }

    // 4. 天气建议
    console.log("\n4. 天气建议:");
    const advice = weatherApp.getWeatherAdvice();
    advice.forEach((tip) => console.log(`💡 ${tip}`));

    // 5. 空气质量
    console.log("\n5. 空气质量:");
    const airQuality = weatherApp.getAirQuality();
    console.log(
      `AQI: ${airQuality.aqi} (${airQuality.level}) - ${airQuality.description}`
    );

    // 6. 搜索城市
    console.log("\n6. 搜索城市功能:");
    const searchResults = await weatherApp.searchCity("上海");
    console.log("搜索结果:", searchResults.map((r) => r.name).join(", "));

    // 7. 收藏功能
    console.log("\n7. 收藏功能:");
    weatherApp.addToFavorites("上海");
    weatherApp.addToFavorites("广州");
    console.log("收藏的城市:", weatherApp.getFavorites().join(", "));

    // 8. 切换城市
    console.log("\n8. 切换到上海:");
    await weatherApp.switchToCity("上海");
    if (weatherApp.currentWeather) {
      console.log(`当前城市: ${weatherApp.currentWeather.location.name}`);
      console.log(
        `温度: ${weatherApp.formatTemperature(
          weatherApp.currentWeather.current.temperature
        )}`
      );
    }

    // 9. 缓存统计
    console.log("\n9. 缓存统计:");
    console.log("API缓存:", weatherApp.weatherAPI.cache.getStats());

    console.log("\n=== 天气应用演示完成 ===");
  } catch (error) {
    console.error("演示过程中发生错误:", error);
  }
}, 100);

// 清理演示（5秒后）
setTimeout(() => {
  weatherApp.destroy();
}, 5000);

// =============================================
// 7. 最佳实践总结
// =============================================

console.log(`
天气应用最佳实践总结:

1. API管理:
   - HTTP客户端封装
   - 请求/响应拦截器
   - 自动重试机制
   - 速率限制

2. 数据缓存:
   - 多级缓存策略
   - TTL过期管理
   - 缓存键生成
   - 缓存统计监控

3. 位置服务:
   - 地理定位API
   - 地理编码服务
   - 位置缓存
   - 错误降级

4. 错误处理:
   - 网络错误恢复
   - API错误处理
   - 用户友好提示
   - 离线模式支持

5. 性能优化:
   - 请求去重
   - 数据预加载
   - 并行请求
   - 懒加载策略

6. 用户体验:
   - 加载状态提示
   - 自动刷新机制
   - 收藏功能
   - 个性化建议

技术特点:
- 模块化架构
- 异步编程
- 错误边界处理
- 数据标准化
- 可扩展设计
`);

// 导出模块
module.exports = {
  HttpClient,
  CacheManager,
  LocationService,
  WeatherAPIService,
  RateLimiter,
  WeatherApp,
};

console.log("天气应用模块加载完成\n");
