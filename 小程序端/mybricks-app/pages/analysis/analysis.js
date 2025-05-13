// analysis.js
const app = getApp()

Page({
  data: {
    companyList: [],
    currentCompanyIndex: 0,
    currentCompanyId: null,
    analysisData: {
      updateTime: '',
      scorePercentage: 0,
      metrics: [],
      chartUrl: '',
      competitors: [],
      suggestions: []
    },
    isLoading: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    this.fetchCompanyList();
  },

  /**
   * 页面显示时触发
   */
  onShow: function () {
    if (this.data.currentCompanyId) {
      this.fetchAnalysisData(this.data.currentCompanyId);
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    if (this.data.currentCompanyId) {
      this.fetchAnalysisData(this.data.currentCompanyId).then(() => {
        wx.stopPullDownRefresh();
      });
    } else {
      this.fetchCompanyList().then(() => {
        wx.stopPullDownRefresh();
      });
    }
  },

  /**
   * 获取用户的公司列表
   */
  fetchCompanyList: function () {
    this.setData({
      isLoading: true
    });

    return new Promise((resolve) => {
      wx.request({
        url: app.globalData.apiBaseUrl + '/api/startup_info',
        method: 'GET',
        header: {
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data && res.data.length > 0) {
            this.setData({
              companyList: res.data,
              currentCompanyIndex: 0,
              currentCompanyId: res.data[0].id
            });

            // 获取选中公司的分析数据
            this.fetchAnalysisData(res.data[0].id);
          }
        },
        complete: () => {
          this.setData({
            isLoading: false
          });
          resolve();
        }
      });
    });
  },

  /**
   * 获取分析数据
   */
  fetchAnalysisData: function (companyId) {
    if (!companyId) return Promise.resolve();

    this.setData({
      isLoading: true
    });

    return new Promise((resolve) => {
      wx.request({
        url: app.globalData.apiBaseUrl + '/api/analysis_results?company_id=' + companyId,
        method: 'GET',
        header: {
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data) {
            // 处理分析数据
            const analysisData = this.processAnalysisData(res.data);
            
            this.setData({
              analysisData: analysisData
            });
          } else {
            // 没有分析数据或获取失败，设置默认数据
            this.setData({
              analysisData: this.getDefaultAnalysisData()
            });
          }
        },
        complete: () => {
          this.setData({
            isLoading: false
          });
          resolve();
        }
      });
    });
  },

  /**
   * 处理分析数据，转换为前端需要的格式
   */
  processAnalysisData: function (data) {
    let result = {
      updateTime: this.formatDate(new Date(data.created_at || new Date())),
      scorePercentage: 0,
      metrics: [],
      chartUrl: '',
      competitors: [],
      suggestions: []
    };

    // 如果有结果数据
    if (data.result_data) {
      const resultData = typeof data.result_data === 'string' ? JSON.parse(data.result_data) : data.result_data;
      
      // 设置评分
      if (resultData.score) {
        result.scorePercentage = Math.floor(resultData.score * 100);
      }
      
      // 设置指标
      if (resultData.metrics && Array.isArray(resultData.metrics)) {
        result.metrics = resultData.metrics;
      } else {
        // 默认指标
        result.metrics = [
          { name: '市场规模', value: '增长', trend: 'up' },
          { name: '竞争程度', value: '中等', trend: '' },
          { name: '盈利能力', value: '良好', trend: 'up' },
          { name: '增长速度', value: '快速', trend: 'up' },
          { name: '风险等级', value: '中等', trend: '' },
          { name: '融资难度', value: '较高', trend: 'down' }
        ];
      }
      
      // 设置图表URL
      if (resultData.chartUrl) {
        result.chartUrl = resultData.chartUrl;
      }
      
      // 设置竞争对手
      if (resultData.competitors && Array.isArray(resultData.competitors)) {
        result.competitors = resultData.competitors;
      }
      
      // 设置建议
      if (resultData.suggestions && Array.isArray(resultData.suggestions)) {
        result.suggestions = resultData.suggestions;
      }
    } else {
      // 没有结果数据，使用默认数据
      result = this.getDefaultAnalysisData();
    }

    return result;
  },

  /**
   * 获取默认的分析数据
   */
  getDefaultAnalysisData: function () {
    return {
      updateTime: this.formatDate(new Date()),
      scorePercentage: 65,
      metrics: [
        { name: '市场规模', value: '增长', trend: 'up' },
        { name: '竞争程度', value: '中等', trend: '' },
        { name: '盈利能力', value: '良好', trend: 'up' },
        { name: '增长速度', value: '快速', trend: 'up' },
        { name: '风险等级', value: '中等', trend: '' },
        { name: '融资难度', value: '较高', trend: 'down' }
      ],
      chartUrl: '',
      competitors: [
        { name: '竞争对手A', description: '市场份额领先者', score: 85 },
        { name: '竞争对手B', description: '技术创新领导者', score: 75 },
        { name: '竞争对手C', description: '成本效益领导者', score: 60 }
      ],
      suggestions: [
        '专注产品差异化，建立独特卖点',
        '重点开发高利润潜力的客户群体',
        '提高运营效率，减少不必要的成本支出',
        '加强技术研发，提升核心竞争力'
      ]
    };
  },

  /**
   * 处理公司选择变化
   */
  handleCompanyChange: function (e) {
    const index = e.detail.value;
    const companyId = this.data.companyList[index].id;
    
    this.setData({
      currentCompanyIndex: index,
      currentCompanyId: companyId
    });

    // 获取选中公司的分析数据
    this.fetchAnalysisData(companyId);
  },

  /**
   * 获取评分等级样式类
   */
  getScoreClass: function (score) {
    if (score >= 70) return 'score-high';
    if (score >= 40) return 'score-medium';
    return 'score-low';
  },

  /**
   * 获取评分等级描述
   */
  getScoreStatus: function (score) {
    if (score >= 70) return '发展前景良好';
    if (score >= 40) return '发展前景中等';
    return '发展前景待提升';
  },

  /**
   * 获取竞争对手评分样式类
   */
  getCompetitorScoreClass: function (score) {
    if (score >= 70) return 'score-high';
    if (score >= 40) return 'score-medium';
    return 'score-low';
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
   * 跳转到创业信息录入页面
   */
  goToStartupForm: function () {
    wx.switchTab({
      url: '/pages/startup-form/startup-form'
    });
  }
});