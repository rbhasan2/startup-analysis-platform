// ai-insights.js
const app = getApp()

Page({
  data: {
    companyList: [],
    currentCompanyIndex: 0,
    currentCompanyId: null,
    insightData: {
      success_probability: 0.5,
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
      recommendations: []
    },
    isLoading: false,
    isRefreshing: false
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 如果从其他页面传入公司ID
    if (options && options.company_id) {
      this.setData({
        currentCompanyId: options.company_id
      });
    }
    
    this.fetchCompanyList();
  },

  /**
   * 页面显示时触发
   */
  onShow: function () {
    if (this.data.currentCompanyId) {
      this.fetchInsightData(this.data.currentCompanyId);
    }
  },

  /**
   * 下拉刷新
   */
  onPullDownRefresh: function () {
    if (this.data.currentCompanyId) {
      this.fetchInsightData(this.data.currentCompanyId, true).then(() => {
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
            const companyList = res.data;
            
            // 设置公司列表
            this.setData({
              companyList: companyList
            });
            
            // 如果没有指定公司ID，则默认选择第一个
            if (!this.data.currentCompanyId) {
              this.setData({
                currentCompanyIndex: 0,
                currentCompanyId: companyList[0].id
              });
            } else {
              // 如果有指定公司ID，则找到对应的索引
              const index = companyList.findIndex(item => item.id === this.data.currentCompanyId);
              if (index !== -1) {
                this.setData({
                  currentCompanyIndex: index
                });
              }
            }

            // 获取选中公司的洞察数据
            this.fetchInsightData(this.data.currentCompanyId);
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
   * 获取AI洞察数据
   */
  fetchInsightData: function (companyId, forceRefresh = false) {
    if (!companyId) return Promise.resolve();

    this.setData({
      isLoading: true
    });

    return new Promise((resolve) => {
      // 构建URL，如果需要强制刷新则添加参数
      let url = app.globalData.apiBaseUrl + '/api/ai_insights?company_id=' + companyId;
      if (forceRefresh) {
        url += '&refresh=true';
      }

      wx.request({
        url: url,
        method: 'GET',
        header: {
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data) {
            // 处理洞察数据
            let insightData = this.processInsightData(res.data);
            
            this.setData({
              insightData: insightData
            });
          } else {
            // 没有洞察数据或获取失败，设置默认数据
            this.setData({
              insightData: this.getDefaultInsightData()
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
   * 处理洞察数据，转换为前端需要的格式
   */
  processInsightData: function (data) {
    // 如果返回的是数组，取第一个元素
    const insightData = Array.isArray(data) ? data[0] : data;
    
    let result = {
      success_probability: 0.5,
      strengths: [],
      weaknesses: [],
      opportunities: [],
      threats: [],
      recommendations: []
    };

    // 如果有洞察数据
    if (insightData && insightData.insights) {
      const insights = typeof insightData.insights === 'string' 
        ? JSON.parse(insightData.insights) 
        : insightData.insights;
      
      // 复制属性
      if (insights.success_probability !== undefined) {
        result.success_probability = insights.success_probability;
      }
      
      if (Array.isArray(insights.strengths)) {
        result.strengths = insights.strengths;
      }
      
      if (Array.isArray(insights.weaknesses)) {
        result.weaknesses = insights.weaknesses;
      }
      
      if (Array.isArray(insights.opportunities)) {
        result.opportunities = insights.opportunities;
      }
      
      if (Array.isArray(insights.threats)) {
        result.threats = insights.threats;
      }
      
      if (Array.isArray(insights.recommendations)) {
        result.recommendations = insights.recommendations;
      }
    } else {
      // 没有洞察数据，使用默认数据
      result = this.getDefaultInsightData();
    }

    return result;
  },

  /**
   * 获取默认的洞察数据
   */
  getDefaultInsightData: function () {
    return {
      success_probability: 0.65,
      strengths: [
        "团队具有相关行业经验",
        "产品/服务有明确的目标客户"
      ],
      weaknesses: [
        "团队规模较小，执行力可能受限",
        "尚未获得外部资金支持"
      ],
      opportunities: [
        "目标市场规模持续增长",
        "用户对创新解决方案需求增加"
      ],
      threats: [
        "市场竞争日益激烈",
        "行业政策存在不确定性"
      ],
      recommendations: [
        "专注产品差异化，建立独特卖点",
        "重点开发高利润潜力的客户群体",
        "提高运营效率，减少不必要的成本支出",
        "加强技术研发，提升核心竞争力"
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

    // 获取选中公司的洞察数据
    this.fetchInsightData(companyId);
  },

  /**
   * 刷新洞察数据
   */
  refreshInsights: function () {
    if (!this.data.currentCompanyId) return;
    
    this.setData({
      isRefreshing: true
    });
    
    // 调用AI模型接口获取最新洞察
    wx.request({
      url: app.globalData.apiBaseUrl + '/api/refresh_insights',
      method: 'POST',
      data: {
        company_id: this.data.currentCompanyId
      },
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: (res) => {
        if (res.statusCode === 200 || res.statusCode === 201) {
          // 请求成功，重新获取洞察数据
          this.fetchInsightData(this.data.currentCompanyId, true);
          
          wx.showToast({
            title: '洞察已更新',
            icon: 'success'
          });
        } else {
          wx.showToast({
            title: '更新失败，请稍后再试',
            icon: 'none'
          });
        }
      },
      fail: () => {
        wx.showToast({
          title: '网络错误，请稍后再试',
          icon: 'none'
        });
      },
      complete: () => {
        this.setData({
          isRefreshing: false
        });
      }
    });
  },

  /**
   * 获取概率等级样式类
   */
  getProbabilityClass: function (probability) {
    if (probability >= 0.7) return 'prob-high';
    if (probability >= 0.4) return 'prob-medium';
    return 'prob-low';
  },

  /**
   * 获取概率描述文本
   */
  getProbabilityDesc: function (probability) {
    if (probability >= 0.7) {
      return "根据当前数据分析，您的创业项目具有较高的成功可能性。建议继续保持当前战略，同时进一步拓展业务规模。";
    } else if (probability >= 0.4) {
      return "根据当前数据分析，您的创业项目有一定的成功潜力，但仍存在一些挑战和风险。建议关注下方SWOT分析中的弱点和威胁，针对性地制定改进策略。";
    } else {
      return "根据当前数据分析，您的创业项目面临较大挑战。建议重新评估商业模式和市场定位，或考虑寻求更多专业支持和资源。";
    }
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