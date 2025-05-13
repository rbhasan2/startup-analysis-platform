// 创业信息录入页面逻辑
const app = getApp();

Page({
  /**
   * 页面的初始数据
   */
  data: {
    submitting: false,
    
    // 表单数据
    formData: {
      companyName: '',
      foundingDate: '',
      region: ['北京市', '北京市', '朝阳区'],
      businessDesc: '',
      mainProduct: '',
      contactPerson: '',
      contactPhone: '',
      contactEmail: ''
    },
    
    // 所属行业选项
    industries: ['互联网/软件', '人工智能', '电子商务', '金融科技', '教育科技', '医疗健康', '文化娱乐', '新能源', '智能硬件', '其他'],
    industryIndex: 0,
    
    // 融资阶段选项
    fundingStages: ['未融资', '天使轮', 'Pre-A轮', 'A轮', 'B轮', 'C轮及以上', '已上市'],
    fundingIndex: 0,
    
    // 团队规模选项
    teamSizes: ['1-5人', '6-15人', '16-50人', '51-100人', '101-500人', '500人以上'],
    teamSizeIndex: 0,
    
    // 月营收范围选项
    revenueRanges: ['尚未盈利', '0-10万', '10-50万', '50-100万', '100-500万', '500-1000万', '1000万以上'],
    revenueIndex: 0
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function (options) {
    // 如果有编辑数据，加载已有数据
    if (options.id) {
      wx.showLoading({
        title: '加载数据中',
      });
      
      // 请求接口获取已有创业信息
      wx.request({
        url: app.globalData.apiBaseUrl + '/api/startup_info/' + options.id,
        method: 'GET',
        header: {
          'Authorization': 'Bearer ' + wx.getStorageSync('token')
        },
        success: (res) => {
          if (res.data && res.data.data) {
            this.setFormData(res.data.data);
          }
        },
        complete: () => {
          wx.hideLoading();
        }
      });
    }
  },
  
  /**
   * 设置表单数据
   */
  setFormData: function(data) {
    // 处理行业索引
    let industryIndex = this.data.industries.findIndex(item => item === data.industry);
    if (industryIndex === -1) industryIndex = 0;
    
    // 处理融资阶段索引
    let fundingIndex = this.data.fundingStages.findIndex(item => item === data.fundingStage);
    if (fundingIndex === -1) fundingIndex = 0;
    
    // 处理团队规模索引
    let teamSizeIndex = this.data.teamSizes.findIndex(item => item === data.teamSize);
    if (teamSizeIndex === -1) teamSizeIndex = 0;
    
    // 处理月营收索引
    let revenueIndex = this.data.revenueRanges.findIndex(item => item === data.revenueRange);
    if (revenueIndex === -1) revenueIndex = 0;
    
    this.setData({
      formData: {
        companyName: data.companyName || '',
        foundingDate: data.foundingDate || '',
        region: data.region || ['北京市', '北京市', '朝阳区'],
        businessDesc: data.businessDesc || '',
        mainProduct: data.mainProduct || '',
        contactPerson: data.contactPerson || '',
        contactPhone: data.contactPhone || '',
        contactEmail: data.contactEmail || ''
      },
      industryIndex,
      fundingIndex,
      teamSizeIndex,
      revenueIndex
    });
  },

  /**
   * 日期选择器变化事件
   */
  bindDateChange: function(e) {
    this.setData({
      'formData.foundingDate': e.detail.value
    });
  },

  /**
   * 地区选择器变化事件
   */
  bindRegionChange: function(e) {
    this.setData({
      'formData.region': e.detail.value
    });
  },

  /**
   * 行业选择器变化事件
   */
  bindIndustryChange: function(e) {
    this.setData({
      industryIndex: e.detail.value
    });
  },

  /**
   * 融资阶段选择器变化事件
   */
  bindFundingChange: function(e) {
    this.setData({
      fundingIndex: e.detail.value
    });
  },

  /**
   * 团队规模选择器变化事件
   */
  bindTeamSizeChange: function(e) {
    this.setData({
      teamSizeIndex: e.detail.value
    });
  },

  /**
   * 月营收范围选择器变化事件
   */
  bindRevenueChange: function(e) {
    this.setData({
      revenueIndex: e.detail.value
    });
  },

  /**
   * 表单提交事件
   */
  submitForm: function(e) {
    // 获取表单数据
    const formData = e.detail.value;
    
    // 表单验证
    if (!formData.companyName) {
      wx.showToast({
        title: '请输入公司名称',
        icon: 'none'
      });
      return;
    }
    
    if (!this.data.formData.foundingDate) {
      wx.showToast({
        title: '请选择成立时间',
        icon: 'none'
      });
      return;
    }
    
    // 构建提交数据
    const submitData = {
      companyName: formData.companyName,
      foundingDate: this.data.formData.foundingDate,
      region: this.data.formData.region,
      industry: this.data.industries[this.data.industryIndex],
      businessDesc: formData.businessDesc,
      mainProduct: formData.mainProduct,
      fundingStage: this.data.fundingStages[this.data.fundingIndex],
      teamSize: this.data.teamSizes[this.data.teamSizeIndex],
      revenueRange: this.data.revenueRanges[this.data.revenueIndex],
      contactPerson: formData.contactPerson,
      contactPhone: formData.contactPhone,
      contactEmail: formData.contactEmail,
      submissionTime: new Date().toISOString(),
      userId: wx.getStorageSync('userId') || ''
    };
    
    // 显示加载提示
    this.setData({
      submitting: true
    });
    
    // 发送数据到服务器
    wx.request({
      url: app.globalData.apiBaseUrl + '/api/startup_info',
      method: 'POST',
      data: submitData,
      header: {
        'content-type': 'application/json',
        'Authorization': 'Bearer ' + wx.getStorageSync('token')
      },
      success: (res) => {
        if (res.statusCode === 201 || res.statusCode === 200) {
          wx.showToast({
            title: '提交成功',
            icon: 'success',
            duration: 2000
          });
          
          // 提交成功后，等待2秒跳转到分析页面
          setTimeout(() => {
            wx.switchTab({
              url: '/pages/analysis/analysis',
            });
          }, 2000);
        } else {
          wx.showToast({
            title: '提交失败：' + (res.data.message || '未知错误'),
            icon: 'none'
          });
        }
      },
      fail: (err) => {
        console.error('提交失败', err);
        wx.showToast({
          title: '网络错误，请重试',
          icon: 'none'
        });
      },
      complete: () => {
        this.setData({
          submitting: false
        });
      }
    });
  }
});