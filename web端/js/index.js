/**
 * 创业分析平台 - 首页脚本
 */

// 添加Auth对象
window.Auth = {
  isLoggedIn: function() {
    return localStorage.getItem('isLoggedIn') === 'true';
  },
  getUserInfo: function() {
    const userStr = localStorage.getItem('userInfo');
    return userStr ? JSON.parse(userStr) : null;
  },
  login: function(username, password) {
    this.setUserInfo({
      name: username,
      avatar: 'images/avatar-default.png'
    });
    localStorage.setItem('isLoggedIn', true);
    return true;
  },
  logout: function() {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userInfo');
  },
  setUserInfo: function(userInfo) {
    localStorage.setItem('userInfo', JSON.stringify(userInfo));
  }
};

// 添加isLogin全局函数
window.isLogin = function() {
  return Auth.isLoggedIn();
};

// 首页Vue实例
const app = new Vue({
  el: '#app',
  data() {
    // 确保有默认用户数据用于演示
    if (!Auth.isLoggedIn()) {
      // 为了开发环境演示，设置一个默认用户
      const demoUser = {
        name: '测试用户',
        username: 'tester',
        avatar: 'images/avatar-default.jpg'
      };
      Auth.setUserInfo(demoUser);
      localStorage.setItem('isLoggedIn', 'true');
    }
    
    return {
      // 用户信息
      isLogin: true, // 开发环境中，总是显示为已登录
      userInfo: Auth.getUserInfo() || {
        name: '测试用户',
        username: 'tester',
        avatar: 'images/avatar-default.jpg'
      },
      
      // 平台统计数据
      stats: {
        companyCount: '--',
        insightsCount: '--',
        dataPoints: '--'
      },
      
      // 最新动态列表
      newsList: [],
      
      // 热门分析列表
      insightsList: [],
      
      // 页面加载状态
      loading: {
        stats: false,
        news: false,
        insights: false
      }
    };
  },
  
  // 生命周期钩子 - 创建后
  created() {
    this.fetchStats();
    this.fetchNews();
    this.fetchInsights();
  },
  
  methods: {
    // 加载平台统计数据
    async fetchStats() {
      this.loading.stats = true;
      
      try {
        // 如果没有AI服务，使用模拟数据
        // 模拟数据
        const statsData = {
          companyCount: '12',
          insightsCount: '106',
          dataPoints: '1.1'
        };
        
        // 安全地设置数据，确保this.stats已经存在
        if (!this.stats) {
          this.stats = {};
        }
        
        // 分配数据
        Object.assign(this.stats, statsData);
        this.loading.stats = false;
      } catch (error) {
        console.error('Failed to fetch stats:', error);
        // 默认错误状态
        this.stats = this.stats || {};
        this.stats.error = '数据加载失败';
        this.loading.stats = false;
      }
    },
    
    // 加载最新动态
    async fetchNews() {
      this.loading.news = true;
      
      try {
        // 模拟数据
        const newsData = [
          {
            id: 1,
            title: '2025年创业趋势报告：AI和绿色科技领跑',
            summary: '最新报告显示，人工智能应用和绿色科技将成为未来五年创业投资的热点领域，预计将吸引超过60%的风险投资。',
            publishTime: '2025-05-05',
            coverUrl: './images/logo.png'
          },
          {
            id: 2,
            title: '平台新功能上线：多维数据分析助力精准决策',
            summary: '创业分析平台推出多维数据分析功能，整合行业、地域、资金等多个维度，为创业者提供更精准的决策支持。',
            publishTime: '2025-05-01',
            coverUrl: './images/logo.png'
          },
          {
            id: 3,
            title: '成功案例：三个月内融资2000万的创业秘诀',
            summary: '通过创业分析平台优化商业计划，某科技初创公司仅用三个月时间就成功获得2000万元融资，本文分享其成功经验。',
            publishTime: '2025-04-28',
            coverUrl: './images/logo.png'
          }
        ];
        
        // 安全地设置数据
        this.newsList = newsData;
        this.loading.news = false;
      } catch (error) {
        console.error('Failed to fetch news:', error);
        // 默认错误状态
        this.newsList = [{
          id: 0,
          title: '数据加载失败',
          summary: '请稍后再试',
          publishTime: new Date().toISOString().split('T')[0]
        }];
        this.loading.news = false;
      }
    },
    
    // 加载热门分析
    async fetchInsights() {
      this.loading.insights = true;
      
      try {
        // 实际环境中替换为真实API调用
        // const data = await API.get(CONFIG.api.getInsightsList, { featured: true, limit: 3 });
        
        // 模拟数据
        const insightsData = [
          {
            id: 101,
            category: '行业分析',
            title: '医疗健康科技创业机会与挑战',
            summary: '随着人口老龄化加速，医疗健康科技领域蕴含巨大机遇，但同时面临监管和市场教育的双重挑战。',
            publishTime: '2025-05-06'
          },
          {
            id: 102,
            category: '融资策略',
            title: '如何在天使轮获得更好的估值',
            summary: '天使轮融资是创业初期的关键一步，本分析从投资人角度出发，分享提高估值的有效策略和常见陷阱。',
            publishTime: '2025-05-03'
          },
          {
            id: 103,
            category: '商业模式',
            title: 'SaaS创业的盈利模式转变',
            summary: '从订阅制到价值定价，SaaS企业的盈利模式正在发生根本性转变，如何适应这一趋势成为创业者必须面对的问题。',
            publishTime: '2025-04-30'
          }
        ];
        
        // 安全地设置数据
        this.insightsList = insightsData;
        this.loading.insights = false;
      } catch (error) {
        console.error('Failed to fetch insights:', error);
        this.insightsList = [{
          id: 0,
          category: '错误',
          title: '数据加载失败',
          summary: '请稍后再试',
          publishTime: new Date().toISOString().split('T')[0]
        }];
        this.loading.insights = false;
      }
    },
    
    // 用户下拉菜单操作处理
    handleUserAction(command) {
      switch (command) {
        case 'profile':
          window.location.href = 'pages/my/profile.html';
          break;
        case 'settings':
          window.location.href = 'pages/my/settings.html';
          break;
        case 'logout':
          Auth.logout();
          this.isLogin = false;
          this.userInfo = {};
          window.location.reload();
          break;
      }
    },
    
    // 跳转到新闻详情
    goToNewsDetail(id) {
      window.location.href = `pages/news/detail.html?id=${id}`;
    },
    
    // 跳转到洞察详情
    goToInsightDetail(id) {
      window.location.href = `pages/insights/detail.html?id=${id}`;
    }
  }
});