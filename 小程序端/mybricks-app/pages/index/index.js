// index.js
const app = getApp()

Page({
  data: {
    // 统计数据
    stats: {
      companyCount: 0,
      insightsCount: 0,
      dataPoints: 0
    },
    
    // 最新动态列表
    newsList: [],
    
    // 热门分析列表
    insightsList: []
  },
  
  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchStatistics();
    this.fetchLatestNews();
    this.fetchPopularInsights();
  },
  
  /**
   * 页面显示时触发
   */
  onShow: function () {
    // 如果用户登录状态发生变化，重新获取数据
    if (this.data.userInfoChanged) {
      this.fetchStatistics();
      this.data.userInfoChanged = false;
    }
  },
  
  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    Promise.all([
      this.fetchStatistics(),
      this.fetchLatestNews(),
      this.fetchPopularInsights()
    ]).then(() => {
      wx.stopPullDownRefresh();
    });
  },
  
  /**
   * 获取统计数据
   */
  fetchStatistics: function () {
    return new Promise((resolve) => {
      wx.request({
        url: app.globalData.apiBaseUrl + '/api/statistics',
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200 && res.data) {
            this.setData({
              stats: res.data
            });
          }
        },
        complete: () => {
          resolve();
        }
      });
    });
  },
  
  /**
   * 获取最新动态
   */
  fetchLatestNews: function () {
    return new Promise((resolve) => {
      wx.request({
        url: app.globalData.apiBaseUrl + '/api/news?limit=5',
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200 && res.data) {
            // 格式化日期
            const newsList = res.data.map(item => {
              return {
                ...item,
                publishTime: this.formatDate(new Date(item.publishTime))
              };
            });
            
            this.setData({
              newsList: newsList
            });
          }
        },
        complete: () => {
          resolve();
        }
      });
    });
  },
  
  /**
   * 获取热门分析
   */
  fetchPopularInsights: function () {
    return new Promise((resolve) => {
      wx.request({
        url: app.globalData.apiBaseUrl + '/api/ai_insights?sort=popular&limit=3',
        method: 'GET',
        success: (res) => {
          if (res.statusCode === 200 && res.data) {
            // 格式化日期
            const insightsList = res.data.map(item => {
              return {
                ...item,
                publishTime: this.formatDate(new Date(item.publishTime))
              };
            });
            
            this.setData({
              insightsList: insightsList
            });
          }
        },
        complete: () => {
          resolve();
        }
      });
    });
  },
  
  /**
   * 格式化日期
   */
  formatDate: function (date) {
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}-${month < 10 ? '0' + month : month}-${day < 10 ? '0' + day : day}`;
  },
  
  /**
   * 跳转到新闻详情
   */
  goToNewsDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/news/news-detail?id=' + id
    });
  },
  
  /**
   * 跳转到洞察详情
   */
  goToInsightDetail: function (e) {
    const id = e.currentTarget.dataset.id;
    wx.navigateTo({
      url: '/pages/insights/insight-detail?id=' + id
    });
  }
});