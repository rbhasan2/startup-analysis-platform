// app.js
App({
  onLaunch: function () {
    // 展示本地存储能力
    const logs = wx.getStorageSync('logs') || []
    logs.unshift(Date.now())
    wx.setStorageSync('logs', logs)

    // 登录
    wx.login({
      success: res => {
        // 发送 res.code 到后台换取 openId, sessionKey, unionId
        if (res.code) {
          wx.request({
            url: this.globalData.apiBaseUrl + '/api/wx/login',
            method: 'POST',
            data: {
              code: res.code
            },
            success: (result) => {
              if (result.data && result.data.token) {
                wx.setStorageSync('token', result.data.token);
                wx.setStorageSync('userId', result.data.userId);
                
                // 获取用户信息
                this.getUserInfo();
              }
            }
          });
        } else {
          console.error('登录失败：' + res.errMsg);
        }
      }
    });
  },

  /**
   * 获取用户信息
   */
  getUserInfo: function() {
    const token = wx.getStorageSync('token');
    if (token) {
      wx.request({
        url: this.globalData.apiBaseUrl + '/api/user/profile',
        method: 'GET',
        header: {
          'Authorization': 'Bearer ' + token
        },
        success: (res) => {
          if (res.statusCode === 200 && res.data) {
            this.globalData.userInfo = res.data;
          }
        }
      });
    }
  },

  /**
   * 全局数据
   */
  globalData: {
    userInfo: null,
    apiBaseUrl: 'http://localhost:8000', // NocoBase API地址
    isLogin: false
  }
})