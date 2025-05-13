/**
 * 创业分析平台 - 后端服务集成接口
 */

// NocoBase API 集成
const NocoBaseService = {
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
};

// Spider-Flow API 集成
const SpiderFlowService = {
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
};

// Superset API 集成
const SupersetService = {
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
};

// AI模型 API 集成
const AIModelService = {
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
};

// 导出服务集合
const Services = {
  nocobase: NocoBaseService,
  spiderFlow: SpiderFlowService,
  superset: SupersetService,
  aiModel: AIModelService
};
