/**
 * 创业分析平台 - 登录页面脚本
 */

const app = new Vue({
  el: '#app',
  data() {
    // 确认密码的验证函数
    const validatePass2 = (rule, value, callback) => {
      if (value === '') {
        callback(new Error('请再次输入密码'));
      } else if (value !== this.registerForm.password) {
        callback(new Error('两次输入密码不一致!'));
      } else {
        callback();
      }
    };
    
    return {
      // 当前激活的标签页：登录/注册
      activeTab: 'login',
      
      // 是否记住用户登录状态
      rememberMe: false,
      
      // 登录表单数据
      loginForm: {
        username: '',
        password: ''
      },
      
      // 登录表单验证规则
      loginRules: {
        username: [
          { required: true, message: '请输入用户名或邮箱', trigger: 'blur' },
          { min: 3, message: '用户名或邮箱长度不能小于3个字符', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' }
        ]
      },
      
      // 注册表单数据
      registerForm: {
        username: '',
        email: '',
        password: '',
        confirmPassword: '',
        agreement: false
      },
      
      // 注册表单验证规则
      registerRules: {
        username: [
          { required: true, message: '请设置用户名', trigger: 'blur' },
          { min: 3, message: '用户名长度不能小于3个字符', trigger: 'blur' }
        ],
        email: [
          { required: true, message: '请输入邮箱地址', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱地址', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请设置密码', trigger: 'blur' },
          { min: 6, message: '密码长度不能小于6个字符', trigger: 'blur' }
        ],
        confirmPassword: [
          { required: true, message: '请确认密码', trigger: 'blur' },
          { validator: validatePass2, trigger: 'blur' }
        ],
        agreement: [
          { 
            validator: (rule, value, callback) => {
              if (!value) {
                return callback(new Error('请阅读并同意服务条款和隐私政策'));
              }
              callback();
            }, 
            trigger: 'change' 
          }
        ]
      },
      
      // 表单提交加载状态
      loading: {
        login: false,
        register: false
      }
    };
  },
  
  // 检查用户是否已登录
  created() {
    // 如果用户已登录，直接跳转到首页
    if (Auth.isLoggedIn()) {
      window.location.href = '../../index.html';
    }
  },
  
  methods: {
    // 处理登录表单提交
    handleLogin() {
      this.$refs.loginForm.validate(async valid => {
        if (valid) {
          this.loading.login = true;
          
          try {
            // 准备登录数据
            const loginData = {
              username: this.loginForm.username,
              password: this.loginForm.password
            };
            
            // 判断是使用实际API还是模拟API（开发环境）
            let response;
            if (CONFIG.apiBaseUrl === 'http://localhost:8000') {
              // 开发环境使用模拟API
              response = await API.mockAPI(CONFIG.api.login, loginData);
            } else {
              // 生产环境使用真实API
              response = await API.post(CONFIG.api.login, loginData);
            }
            
            // 检查登录结果
            if (response && response.token) {
              // 保存登录状态
              Auth.saveLoginInfo(response.token, response.user);
              
              // 提示成功
              this.$message({
                message: '登录成功',
                type: 'success'
              });
              
              // 跳转到首页
              setTimeout(() => {
                window.location.href = '../../index.html';
              }, 1000);
            } else {
              this.$message.error(response.message || '登录失败，请检查用户名和密码');
            }
          } catch (error) {
            // 错误处理已在API模块中完成
            console.error('登录失败:', error);
          } finally {
            this.loading.login = false;
          }
        } else {
          return false;
        }
      });
    },
    
    // 处理注册表单提交
    handleRegister() {
      this.$refs.registerForm.validate(async valid => {
        if (valid) {
          this.loading.register = true;
          
          try {
            // 准备注册数据
            const registerData = {
              username: this.registerForm.username,
              email: this.registerForm.email,
              password: this.registerForm.password
            };
            
            // 判断是使用实际API还是模拟API（开发环境）
            let response;
            if (CONFIG.apiBaseUrl === 'http://localhost:8000') {
              // 开发环境使用模拟API
              response = await API.mockAPI(CONFIG.api.register, registerData);
            } else {
              // 生产环境使用真实API
              response = await API.post(CONFIG.api.register, registerData);
            }
            
            // 检查注册结果
            if (response && response.success) {
              // 提示成功
              this.$message({
                message: '注册成功，请登录',
                type: 'success'
              });
              
              // 清空表单并切换到登录标签页
              this.$refs.registerForm.resetFields();
              this.activeTab = 'login';
              
              // 将注册的用户名填充到登录表单
              this.loginForm.username = this.registerForm.username;
            } else {
              this.$message.error(response.message || '注册失败，请重试');
            }
          } catch (error) {
            // 错误处理已在API模块中完成
            console.error('注册失败:', error);
          } finally {
            this.loading.register = false;
          }
        } else {
          return false;
        }
      });
    },
    
    // 处理第三方登录点击
    handleSocialLogin(type) {
      // 实际项目中应实现对应的第三方登录逻辑
      this.$message({
        message: `${type}登录功能开发中...`,
        type: 'info'
      });
    }
  }
});

// 为社交登录按钮添加事件监听
document.addEventListener('DOMContentLoaded', function() {
  // 微信登录按钮
  const wechatBtn = document.querySelector('.social-btn.wechat');
  if (wechatBtn) {
    wechatBtn.addEventListener('click', function() {
      const appInstance = document.querySelector('#app').__vue__;
      appInstance.handleSocialLogin('微信');
    });
  }
  
  // 钉钉登录按钮
  const dingtalkBtn = document.querySelector('.social-btn.dingtalk');
  if (dingtalkBtn) {
    dingtalkBtn.addEventListener('click', function() {
      const appInstance = document.querySelector('#app').__vue__;
      appInstance.handleSocialLogin('钉钉');
    });
  }
});