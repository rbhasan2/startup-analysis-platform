/**
 * 创业分析平台 - 用户中心页面脚本
 */

new Vue({
  el: '#app',
  data() {
    // 验证确认密码
    const validateConfirmPassword = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.passwordForm.newPassword) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    
    return {
      // 当前活动的菜单项
      activeMenu: 'profile',
      
      // 用户信息
      userInfo: {},
      
      // 是否正在编辑个人资料
      isEditing: false,
      
      // 对话框可见性
      dialogVisible: false,
      
      // 新头像URL
      avatarUrl: '',
      
      // 头像文件
      avatarFile: null,
      
      // 加载状态
      loading: {
        profile: false,
        password: false,
        privacy: false,
        avatar: false
      },
      
      // 个人资料表单
      profileForm: {
        username: '',
        nickname: '',
        email: '',
        phone: '',
        company: '',
        position: '',
        bio: ''
      },
      
      // 修改密码表单
      passwordForm: {
        oldPassword: '',
        newPassword: '',
        confirmPassword: ''
      },
      
      // 密码表单验证规则
      passwordRules: {
        oldPassword: [
          { required: true, message: '请输入原密码', trigger: 'blur' }
        ],
        newPassword: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请再次输入新密码', trigger: 'blur' },
          { validator: validateConfirmPassword, trigger: 'blur' }
        ]
      },
      
      // 隐私设置表单
      privacyForm: {
        allowNotifications: true,
        shareData: false
      },
      
      // 创业项目列表
      startups: [],
      
      // 通知列表
      notifications: [],
      
      // 未读通知数量
      unreadNotifications: 0
    };
  },
  
  created() {
    // 检查用户登录状态
    if (!Auth.isLoggedIn()) {
      // 未登录，跳转到登录页
      window.location.href = '../login/index.html';
      return;
    }
    
    // 获取用户信息
    this.getUserInfo();
    
    // 获取创业项目列表
    this.getStartups();
    
    // 获取通知列表
    this.getNotifications();
  },
  
  methods: {
    // 获取用户信息
    getUserInfo() {
      // 优先从本地存储获取
      const storedUserInfo = Auth.getUserInfo();
      if (storedUserInfo) {
        this.userInfo = storedUserInfo;
        this.initProfileForm(storedUserInfo);
      }
      
      // 从服务器获取最新信息
      // 开发环境下使用模拟API
      // TODO: 生产环境替换为真实API调用
      API.mockAPI(CONFIG.api.getUserInfo)
        .then(response => {
          if (response && response.success) {
            this.userInfo = response.data;
            this.initProfileForm(response.data);
            // 更新本地存储的用户信息
            Auth.updateUserInfo(response.data);
          }
        })
        .catch(error => {
          console.error('获取用户信息失败:', error);
        });
    },
    
    // 初始化个人资料表单
    initProfileForm(userData) {
      this.profileForm = {
        username: userData.username || '',
        nickname: userData.nickname || '',
        email: userData.email || '',
        phone: userData.phone || '',
        company: userData.company || '',
        position: userData.position || '',
        bio: userData.bio || ''
      };
    },
    
    // 获取创业项目列表
    getStartups() {
      // 模拟请求
      setTimeout(() => {
        // 这里是模拟数据，实际项目中应调用API获取
        this.startups = [
          {
            id: 1,
            name: '智能教育平台',
            industry: '教育科技',
            stage: '种子期',
            createTime: '2025-04-12'
          },
          {
            id: 2,
            name: '区块链供应链管理',
            industry: '区块链',
            stage: 'A轮',
            createTime: '2025-03-25'
          }
        ];
      }, 500);
    },
    
    // 获取通知列表
    getNotifications() {
      // 模拟请求
      setTimeout(() => {
        // 这里是模拟数据，实际项目中应调用API获取
        this.notifications = [
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
        
        // 计算未读通知数量
        this.unreadNotifications = this.notifications.filter(item => !item.read).length;
      }, 500);
    },
    
    // 处理下拉菜单命令
    handleCommand(command) {
      switch (command) {
        case 'profile':
          // 跳转到个人中心
          this.activeMenu = 'profile';
          break;
        case 'settings':
          // 跳转到账户设置
          this.activeMenu = 'settings';
          break;
        case 'logout':
          // 退出登录
          this.logout();
          break;
      }
    },
    
    // 退出登录
    logout() {
      this.$confirm('确定要退出登录吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // 清除登录状态
        Auth.logout();
        // 跳转到首页
        window.location.href = '../../index.html';
      }).catch(() => {
        // 取消退出
      });
    },
    
    // 显示上传头像对话框
    showUploadDialog() {
      this.dialogVisible = true;
      this.avatarUrl = this.userInfo.avatar || '';
    },
    
    // 头像上传前的验证
    beforeAvatarUpload(file) {
      const isJPGOrPNG = file.type === 'image/jpeg' || file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;
      
      if (!isJPGOrPNG) {
        this.$message.error('上传头像图片只能是JPG或PNG格式!');
        return false;
      }
      
      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过2MB!');
        return false;
      }
      
      return true;
    },
    
    // 自定义头像上传处理
    uploadAvatar(options) {
      const file = options.file;
      // 显示本地预览
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        this.avatarUrl = reader.result;
      };
      
      // 保存文件对象以便后续上传
      this.avatarFile = file;
    },
    
    // 保存头像
    saveAvatar() {
      if (!this.avatarFile) {
        this.dialogVisible = false;
        return;
      }
      
      this.loading.avatar = true;
      
      // 实际项目中应使用FormData上传文件
      // 这里使用模拟上传
      setTimeout(() => {
        // 模拟上传成功
        const avatarUrl = 'https://via.placeholder.com/100x100?text=Avatar';
        
        // 更新用户头像
        this.userInfo.avatar = avatarUrl;
        
        // 更新本地存储
        const userInfo = Auth.getUserInfo();
        userInfo.avatar = avatarUrl;
        Auth.updateUserInfo(userInfo);
        
        this.$message.success('头像上传成功');
        this.loading.avatar = false;
        this.dialogVisible = false;
      }, 1000);
    },
    
    // 编辑个人资料
    editProfile() {
      this.isEditing = true;
    },
    
    // 取消编辑
    cancelEdit() {
      this.isEditing = false;
      // 重置表单
      this.initProfileForm(this.userInfo);
    },
    
    // 保存个人资料
    saveProfile() {
      this.loading.profile = true;
      
      // API请求更新个人资料
      API.mockAPI(CONFIG.api.updateUserInfo, this.profileForm)
        .then(response => {
          if (response.success) {
            // 更新用户信息
            this.userInfo = response.data;
            
            // 显示成功消息
            this.$message.success('个人资料保存成功');
            
            // 退出编辑模式
            this.isEditing = false;
          } else {
            this.$message.error(response.message || '保存失败');
          }
        })
        .catch(error => {
          console.error('保存个人资料失败:', error);
          this.$message.error('保存失败，请重试');
        })
        .finally(() => {
          this.loading.profile = false;
        });
    },
    
    // 修改密码
    changePassword() {
      this.$refs.passwordForm.validate(valid => {
        if (valid) {
          this.loading.password = true;
          
          // API请求修改密码
          API.mockAPI(CONFIG.api.changePassword, {
            oldPassword: this.passwordForm.oldPassword,
            newPassword: this.passwordForm.newPassword
          })
            .then(response => {
              if (response.success) {
                this.$message.success('密码修改成功');
                // 重置表单
                this.$refs.passwordForm.resetFields();
              } else {
                this.$message.error(response.message || '密码修改失败');
              }
            })
            .catch(error => {
              console.error('修改密码失败:', error);
              this.$message.error('修改失败，请重试');
            })
            .finally(() => {
              this.loading.password = false;
            });
        }
      });
    },
    
    // 保存隐私设置
    savePrivacySettings() {
      this.loading.privacy = true;
      
      // API请求保存隐私设置
      setTimeout(() => {
        // 模拟保存成功
        this.$message.success('隐私设置保存成功');
        this.loading.privacy = false;
      }, 800);
    },
    
    // 创建新的创业项目
    createStartup() {
      // 跳转到创业项目创建页面
      window.location.href = '../startup/create.html';
    },
    
    // 查看创业项目
    viewStartup(startup) {
      // 跳转到创业项目详情页面
      window.location.href = `../startup/detail.html?id=${startup.id}`;
    },
    
    // 编辑创业项目
    editStartup(startup) {
      // 跳转到创业项目编辑页面
      window.location.href = `../startup/edit.html?id=${startup.id}`;
    },
    
    // 删除创业项目
    deleteStartup(startup) {
      this.$confirm(`确定要删除项目"${startup.name}"吗?`, '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // API请求删除项目
        this.$message.success('删除成功');
        // 重新获取项目列表
        this.getStartups();
      }).catch(() => {
        // 取消删除
      });
    },
    
    // 标记通知为已读
    markAsRead(notification) {
      // API请求标记通知为已读
      notification.read = true;
      this.unreadNotifications = this.notifications.filter(item => !item.read).length;
      this.$message.success('已标记为已读');
    },
    
    // 全部标记为已读
    markAllRead() {
      // API请求标记所有通知为已读
      this.notifications.forEach(item => {
        item.read = true;
      });
      this.unreadNotifications = 0;
      this.$message.success('已全部标记为已读');
    },
    
    // 删除通知
    deleteNotification(notification) {
      // API请求删除通知
      const index = this.notifications.findIndex(item => item.id === notification.id);
      if (index !== -1) {
        this.notifications.splice(index, 1);
        if (!notification.read) {
          this.unreadNotifications--;
        }
        this.$message.success('删除成功');
      }
    },
    
    // 清空所有通知
    clearAllNotifications() {
      this.$confirm('确定要清空所有通知吗?', '提示', {
        confirmButtonText: '确定',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        // API请求清空通知
        this.notifications = [];
        this.unreadNotifications = 0;
        this.$message.success('通知已清空');
      }).catch(() => {
        // 取消清空
      });
    },
    
    // 获取通知图标
    getNotificationIcon(type) {
      const iconMap = {
        system: 'el-icon-message',
        success: 'el-icon-success',
        warning: 'el-icon-warning',
        error: 'el-icon-error'
      };
      return iconMap[type] || 'el-icon-bell';
    }
  }
});

// 为Auth添加更新用户信息的方法
if (typeof Auth !== 'undefined' && !Auth.hasOwnProperty('updateUserInfo')) {
  Auth.updateUserInfo = function(userInfo) {
    localStorage.setItem(CONFIG.storage.userInfo, JSON.stringify(userInfo));
  };
}
