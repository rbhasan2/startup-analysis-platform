/**
 * 创业分析平台 - 公共脚本
 */

// 统一前后端API请求方法
const API = {
  // 获取完整URL
  getUrl(path) {
    return CONFIG.apiBaseUrl + path;//拼接完整API请求url
  },

  // GET请求
  async get(url, params = {}) {//发起一个异步的HTTP GET请求
    // 从localStorage中获取token
    // token用于身份验证
    // 这里假设token存储在localStorage中
    // 你可以根据实际情况修改存储位置
    // 例如：sessionStorage、cookie等
    // 也可以使用Vuex等状态管理工具
    // 这里使用localStorage作为示例

    // 构建查询字符串
    const queryParams = Object.keys(params).map(key => {
      return `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`;
    }).join('&');
    
    const fullUrl = this.getUrl(url) + (queryParams ? `?${queryParams}` : '');
    
    try {
      const response = await axios.get(fullUrl, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  },

  // POST请求
  async post(url, data = {}) {
    const token = localStorage.getItem(CONFIG.storage.token);
    
    try {
      const response = await axios.post(this.getUrl(url), data, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  },

  // PUT请求
  async put(url, data = {}) {
    const token = localStorage.getItem(CONFIG.storage.token);
    
    try {
      const response = await axios.put(this.getUrl(url), data, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  },

  // DELETE请求
  async delete(url) {
    const token = localStorage.getItem(CONFIG.storage.token);
    
    try {
      const response = await axios.delete(this.getUrl(url), {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      return response.data;
    } catch (error) {
      this.handleError(error);
      throw error;
    }
  },

  // 错误处理
  handleError(error) {
    if (error.response) {
      // 服务器响应错误
      const status = error.response.status;
      
      // 如果是未授权，则清除登录信息并跳转到登录页
      if (status === 401) {
        Auth.logout();
        window.location.href = '/pages/login/index.html';
      }
      
      // 显示错误信息
      Vue.prototype.$message.error(
        error.response.data?.message || `请求错误 (${status})`
      );
    } else if (error.request) {
      // 请求发送但没有收到响应
      Vue.prototype.$message.error('服务器无响应，请检查网络连接');
    } else {
      // 请求设置时发生错误
      Vue.prototype.$message.error('请求错误: ' + error.message);
    }
  },
  
  // NocoBase API 集成
  nocobase: {
    // 获取Token
    async getToken() {
      try {
        const response = await axios.post(`${CONFIG.services.nocobase.baseUrl}/auth/signin`, {
          email: CONFIG.services.nocobase.username,
          password: CONFIG.services.nocobase.password
        });
        return response.data.data.token;
      } catch (error) {
        console.error('NocoBase认证失败:', error);
        throw error;
      }
    },
    
    // 发送请求到NocoBase
    async request(method, endpoint, data = null) {
      try {
        // 获取认证令牌
        const token = await this.getToken();
        
        const config = {
          method,
          url: `${CONFIG.services.nocobase.baseUrl}/${endpoint}`,
          headers: { Authorization: `Bearer ${token}` }
        };
        
        if (data && (method.toLowerCase() === 'post' || method.toLowerCase() === 'put')) {
          config.data = data;
        } else if (data && method.toLowerCase() === 'get') {
          config.params = data;
        }
        
        const response = await axios(config);
        return response.data;
      } catch (error) {
        console.error('NocoBase请求失败:', error);
        throw error;
      }
    },
    
    // 获取创业项目数据
    async getStartupProjects(userId) {
      return this.request('get', 'startup_projects', { filter: { user_id: userId } });
    },
    
    // 获取单个创业项目详情
    async getStartupProjectDetail(projectId) {
      return this.request('get', `startup_projects/${projectId}`);
    },
    
    // 创建创业项目
    async createStartupProject(data) {
      return this.request('post', 'startup_projects', data);
    },
    
    // 更新创业项目
    async updateStartupProject(projectId, data) {
      return this.request('put', `startup_projects/${projectId}`, data);
    }
  },
  
  // Spider-Flow API 集成
  spiderFlow: {
    // 获取Token
    async getToken() {
      try {
        const response = await axios.post(`${CONFIG.services.spiderFlow.baseUrl}/login`, {
          username: CONFIG.services.spiderFlow.username,
          password: CONFIG.services.spiderFlow.password
        });
        return response.data.token;
      } catch (error) {
        console.error('Spider-Flow认证失败:', error);
        throw error;
      }
    },
    
    // 发送请求到Spider-Flow
    async request(method, endpoint, data = null) {
      try {
        // 获取认证令牌
        const token = await this.getToken();
        
        const config = {
          method,
          url: `${CONFIG.services.spiderFlow.baseUrl}/${endpoint}`,
          headers: { Authorization: `Bearer ${token}` }
        };
        
        if (data && (method.toLowerCase() === 'post' || method.toLowerCase() === 'put')) {
          config.data = data;
        } else if (data && method.toLowerCase() === 'get') {
          config.params = data;
        }
        
        const response = await axios(config);
        return response.data;
      } catch (error) {
        console.error('Spider-Flow请求失败:', error);
        throw error;
      }
    },
    
    // 获取爬虫任务列表
    async getCrawlers() {
      return this.request('get', 'spiders');
    },
    
    // 运行爬虫任务
    async runCrawler(spiderId) {
      return this.request('post', `spider/run/${spiderId}`);
    },
    
    // 获取爬虫任务结果
    async getCrawlerResults(spiderId) {
      return this.request('get', `spider/results/${spiderId}`);
    },
    
    // 获取公司相关新闻
    async getCompanyNews(companyName) {
      return this.request('post', 'custom/company_news', { company_name: companyName });
    }
  },
  
  // Superset API 集成
  superset: {
    // 获取Token
    async getToken() {
      try {
        const response = await axios.post(`${CONFIG.services.superset.baseUrl}/security/login`, {
          username: CONFIG.services.superset.username,
          password: CONFIG.services.superset.password,
          provider: 'db'
        });
        return response.data.access_token;
      } catch (error) {
        console.error('Superset认证失败:', error);
        throw error;
      }
    },
    
    // 发送请求到Superset
    async request(method, endpoint, data = null) {
      try {
        // 获取认证令牌
        const token = await this.getToken();
        
        const config = {
          method,
          url: `${CONFIG.services.superset.baseUrl}/${endpoint}`,
          headers: { Authorization: `Bearer ${token}` }
        };
        
        if (data && (method.toLowerCase() === 'post' || method.toLowerCase() === 'put')) {
          config.data = data;
        } else if (data && method.toLowerCase() === 'get') {
          config.params = data;
        }
        
        const response = await axios(config);
        return response.data;
      } catch (error) {
        console.error('Superset请求失败:', error);
        throw error;
      }
    },
    
    // 获取仪表盘列表
    async getDashboards() {
      return this.request('get', 'dashboard');
    },
    
    // 获取特定仪表盘
    async getDashboard(dashboardId) {
      return this.request('get', `dashboard/${dashboardId}`);
    },
    
    // 获取市场分析图表数据
    async getMarketAnalysisData(chartId) {
      return this.request('get', `chart/${chartId}/data`);
    },
    
    // 获取竞争分析图表数据
    async getCompetitorAnalysisData(chartId) {
      return this.request('get', `chart/${chartId}/data`);
    }
  },
  
  // AI模型 API 集成
  aiModel: {
    // 发送请求到AI模型服务
    async request(endpoint, data) {
      try {
        const response = await axios.post(`${CONFIG.services.aiModel.baseUrl}/${endpoint}`, data, {
          headers: { 'X-API-Key': CONFIG.services.aiModel.apiKey }
        });
        return response.data;
      } catch (error) {
        console.error('AI模型请求失败:', error);
        throw error;
      }
    },
    
    // 获取创业项目AI分析
    async analyzeStartup(startupData) {
      return this.request('analyze', startupData);
    },
    
    // 获取风险评估
    async assessRisks(startupData) {
      return this.request('assess_risks', startupData);
    },
    
    // 获取AI建议
    async getSuggestions(startupData) {
      return this.request('suggestions', startupData);
    },
    
    // 提问AI助手
    async askQuestion(startupId, question) {
      return this.request('ask', { startup_id: startupId, question });
    }
  },
  
  // 处理API错误
  handleError(error) {
    console.error('API Error:', error);
  },
  
  // 模拟API (用于开发阶段，实际项目中应替换为真实API调用)
  async mockAPI(url, data) {
    console.log('模拟API调用:', url, data);
    
    // 这里模拟一个后端数据存储
    const mockDb = {
      // 获取用户信息
      getUserData() {
        const userStr = localStorage.getItem(CONFIG.storage.userInfo);
        return userStr ? JSON.parse(userStr) : null;
      },
      
      // 保存用户信息
      saveUserData(userData) {
        localStorage.setItem(CONFIG.storage.userInfo, JSON.stringify(userData));
      },
      
      // 模拟通知数据
      getNotifications() {
        const notificationsStr = localStorage.getItem('mock_notifications');
        if (notificationsStr) {
          return JSON.parse(notificationsStr);
        }
        
        // 默认通知数据
        const defaultNotifications = [
          {
            id: 1,
            title: '系统通知',
            message: '欢迎使用创业分析平台',
            time: '2025-05-12 14:30',
            read: true,
            type: 'system'
          },
          {
            id: 2,
            title: '分析报告',
            message: '您的创业项目"智能教育平台"的数据分析报告已生成',
            time: '2025-05-11 09:45',
            read: false,
            type: 'success'
          },
          {
            id: 3,
            title: 'AI洞察更新',
            message: '您的项目有新的AI洞察建议，点击查看',
            time: '2025-05-10 18:20',
            read: false,
            type: 'warning'
          }
        ];
        
        localStorage.setItem('mock_notifications', JSON.stringify(defaultNotifications));
        return defaultNotifications;
      },
      
      // 保存通知数据
      saveNotifications(notifications) {
        localStorage.setItem('mock_notifications', JSON.stringify(notifications));
      }
    };
    
    return new Promise((resolve) => {
      setTimeout(() => {
        // 根据URL返回不同的模拟数据
        switch(url) {
          case CONFIG.api.login:
            if (data.username && data.password) {
              resolve({
                success: true,
                token: 'mock_token_' + Date.now(),
                user: {
                  id: 1001,
                  username: data.username,
                  nickname: '用户' + data.username,
                  avatar: '../../images/avatar-default.png',
                  email: data.username + '@example.com',
                  phone: '',
                  company: '',
                  position: '',
                  bio: ''
                }
              });
            } else {
              resolve({ success: false, message: '用户名或密码错误' });
            }
            break;
            
          case CONFIG.api.register:
            if (data.username && data.email && data.password) {
              resolve({ success: true });
            } else {
              resolve({ success: false, message: '注册信息不完整' });
            }
            break;
            
          case CONFIG.api.getUserInfo:
            const userData = mockDb.getUserData();
            if (userData) {
              resolve({ success: true, data: userData });
            } else {
              resolve({ success: false, message: '获取用户信息失败' });
            }
            break;
            
          case CONFIG.api.updateUserInfo:
            if (data) {
              const currentUser = mockDb.getUserData();
              const updatedUser = { ...currentUser, ...data };
              mockDb.saveUserData(updatedUser);
              resolve({ success: true, data: updatedUser });
            } else {
              resolve({ success: false, message: '更新用户信息失败' });
            }
            break;
            
          case CONFIG.api.changePassword:
            if (data.oldPassword && data.newPassword) {
              resolve({ success: true });
            } else {
              resolve({ success: false, message: '密码修改失败' });
            }
            break;
            
          case CONFIG.api.updateAvatar:
            if (data && data.avatar) {
              const user = mockDb.getUserData();
              user.avatar = data.avatar;
              mockDb.saveUserData(user);
              resolve({ success: true, data: { avatar: data.avatar } });
            } else {
              resolve({ success: false, message: '头像上传失败' });
            }
            break;
            
          case CONFIG.api.getNotifications:
            const notifications = mockDb.getNotifications();
            resolve({ success: true, data: notifications });
            break;
            
          case CONFIG.api.markNotificationRead:
            if (data && data.id) {
              const notifications = mockDb.getNotifications();
              const notification = notifications.find(n => n.id === data.id);
              if (notification) {
                notification.read = true;
                mockDb.saveNotifications(notifications);
                resolve({ success: true });
              } else {
                resolve({ success: false, message: '通知不存在' });
              }
            } else {
              resolve({ success: false, message: '标记已读失败' });
            }
            break;
            
          case CONFIG.api.markAllNotificationsRead:
            const allNotifications = mockDb.getNotifications();
            allNotifications.forEach(n => n.read = true);
            mockDb.saveNotifications(allNotifications);
            resolve({ success: true });
            break;
            
          case CONFIG.api.sendVerifyCode:
            resolve({ success: true });
            break;
            
          case CONFIG.api.verifyResetCode:
            if (data.code === '123456' || data.code.length === 6) {
              resolve({ 
                success: true,
                token: 'reset_token_' + Date.now()
              });
            } else {
              resolve({ success: false, message: '验证码错误' });
            }
            break;
            
          case CONFIG.api.resetPassword:
            if (data.password && data.token) {
              resolve({ success: true });
            } else {
              resolve({ success: false, message: '密码重置失败' });
            }
            break;
            
          default:
            if (url.includes(CONFIG.api.deleteNotification)) {
              // 删除通知
              const notificationId = parseInt(url.split('/').pop());
              if (notificationId) {
                const notifications = mockDb.getNotifications();
                const updatedNotifications = notifications.filter(n => n.id !== notificationId);
                mockDb.saveNotifications(updatedNotifications);
                resolve({ success: true });
              } else {
                resolve({ success: false, message: '通知删除失败' });
              }
            } else {
              resolve({ success: false, message: '未知API' });
            }
        }
      }, 800); // 模拟网络延迟
    });
  }
};

// 用户认证相关
const Auth = {
  // 获取当前用户信息
  getUserInfo() {
    const userStr = localStorage.getItem(CONFIG.storage.userInfo);
    return userStr ? JSON.parse(userStr) : null;
  },

  // 检查用户是否已登录
  isLoggedIn() {
    return !!localStorage.getItem(CONFIG.storage.token);
  },

  // 保存登录信息
  saveLoginInfo(token, user) {
    localStorage.setItem(CONFIG.storage.token, token);
    localStorage.setItem(CONFIG.storage.userInfo, JSON.stringify(user));
  },

  // 更新用户信息
  updateUserInfo(user) {
    localStorage.setItem(CONFIG.storage.userInfo, JSON.stringify(user));
  },

  // 退出登录
  logout() {
    localStorage.removeItem(CONFIG.storage.token);
    localStorage.removeItem(CONFIG.storage.userInfo);
  }
};

// 通用工具函数
const Utils = {
  // 格式化日期
  formatDate(date, format = 'YYYY-MM-DD') {
    if (!date) return '';
    
    const d = new Date(date);
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const day = String(d.getDate()).padStart(2, '0');
    const hours = String(d.getHours()).padStart(2, '0');
    const minutes = String(d.getMinutes()).padStart(2, '0');
    const seconds = String(d.getSeconds()).padStart(2, '0');
    
    return format
      .replace('YYYY', year)
      .replace('MM', month)
      .replace('DD', day)
      .replace('HH', hours)
      .replace('mm', minutes)
      .replace('ss', seconds);
  },

  // 截取字符串
  truncate(str, length = 50, suffix = '...') {
    if (!str) return '';
    return str.length > length ? str.substring(0, length) + suffix : str;
  }
};

// 初始化页面公共部分
function initCommonElements() {
  // 检查用户登录状态并更新导航栏
  const userInfo = Auth.getUserInfo();
  const isLogin = Auth.isLoggedIn();
  
  if (isLogin && userInfo) {
    document.querySelectorAll('.user-info').forEach(el => {
      el.style.display = 'flex';
    });
    document.querySelectorAll('.login-btns').forEach(el => {
      el.style.display = 'none';
    });
  } else {
    document.querySelectorAll('.user-info').forEach(el => {
      el.style.display = 'none';
    });
    document.querySelectorAll('.login-btns').forEach(el => {
      el.style.display = 'flex';
    });
  }

  // 高亮当前页面对应的导航项
  const currentPath = window.location.pathname;
  document.querySelectorAll('.nav-item').forEach(el => {
    const href = el.getAttribute('href');
    if (currentPath.endsWith(href)) {
      el.classList.add('active');
    } else {
      el.classList.remove('active');
    }
  });
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  initCommonElements();
});