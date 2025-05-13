/**
 * 创业分析平台 - 配置文件
 */
const CONFIG = {
  // API基础路径
  apiBaseUrl: 'http://localhost:8000',
  
  // 后端服务配置
  services: {
    // NocoBase服务配置
    nocobase: {
      baseUrl: 'http://localhost:13000/api',
      apiKey: 'YOUR_API_KEY'
    },
    
    // Spider-Flow爬虫配置
    spiderFlow: {
      baseUrl: 'http://localhost:8082/api',
      username: 'admin',
      password: '123456'
    },
    
    // Superset数据分析配置
    superset: {
      baseUrl: 'http://localhost:8088/api/v1',
      username: 'admin',
      password: 'admin'
    },
    
    // AI模型服务配置
    aiModel: {
      baseUrl: 'http://localhost:5000/api',
      apiKey: 'YOUR_API_KEY'
    }
  },
  
  // API路径
  api: {
    // 用户相关
    login: '/api/login',
    register: '/api/register',
    getUserInfo: '/api/user',
    updateUserInfo: '/api/user',
    changePassword: '/api/user/change_password',
    updateAvatar: '/api/user/avatar',
    sendVerifyCode: '/api/send_verify_code',
    verifyResetCode: '/api/verify_reset_code',
    resetPassword: '/api/reset_password',
    
    // 创业信息相关
    getStartupList: '/api/startup_info',
    getStartupDetail: '/api/startup_info',  // + /{id}
    createStartup: '/api/startup_info',
    updateStartup: '/api/startup_info',  // + /{id}
    deleteStartup: '/api/startup_info',  // + /{id}
    
    // 分析结果相关
    getAnalysisResults: '/api/analysis_results',  // ?company_id={id}
    
    // AI洞察相关
    getAiInsights: '/api/ai_insights',  // ?company_id={id}
    refreshInsights: '/api/refresh_insights',
    
    // 新闻和动态
    getNews: '/api/news',
    getInsightsList: '/api/insights_list',
    
    // 用户通知
    getNotifications: '/api/notifications',
    markNotificationRead: '/api/notifications/read', // 标记为已读
    markAllNotificationsRead: '/api/notifications/read_all', // 全部标记为已读
    deleteNotification: '/api/notifications', // + /{id}
  },
  
  // 本地存储键名
  storage: {
    token: 'startup_platform_token',
    userInfo: 'startup_platform_user'
  }
};