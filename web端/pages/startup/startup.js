/**
 * 创业分析平台 - 创业表单页面脚本
 */

new Vue({
  el: '#app',
  data() {
    return {
      // 当前表单步骤
      activeStep: 0,
      
      // 用户信息
      userInfo: {},
      
      // 创业表单数据
      startupForm: {
        // 基本信息
        name: '',
        industry: '',
        stage: '',
        foundedDate: '',
        location: [],
        companyType: '',
        registeredCapital: 0,
        employeeCount: '',
        website: '',
        email: '',
        tagline: '',
        description: '',
        problem: '',
        
        // 创始团队
        founderName: '',
        founderTitle: '',
        founderEducation: '',
        founderExperience: 0,
        industryExperience: false,
        previousStartups: 0,
        coreTeam: [
          {
            name: '',
            title: '',
            background: ''
          }
        ],
        teamStrength: '',
        hiringPlan: [],
        
        // 产品和市场
        productStage: '',
        coreTech: [],
        productDescription: '',
        productAdvantage: '',
        intellectualProperty: [],
        targetMarket: '',
        marketSize: 0,
        marketSizeUnit: 'million',
        businessModel: '',
        competitors: '',
        competitiveAdvantage: '',
        
        // 财务状况
        currentRevenue: 0,
        revenueTimeframe: 'monthly',
        profitStatus: '',
        mainCosts: [],
        breakEvenPeriod: '',
        fundingStage: '',
        fundingAmount: 0,
        valuation: 0,
        investors: '',
        plannedFunding: 0,
        fundingPurpose: '',
        userCount: 0,
        monthlyGrowthRate: 0,
        nextMilestone: ''
      },
      
      // 行业选项
      industryOptions: [
        { value: 'tech', label: '科技/互联网' },
        { value: 'finance', label: '金融科技' },
        { value: 'healthcare', label: '医疗健康' },
        { value: 'education', label: '教育' },
        { value: 'ecommerce', label: '电子商务' },
        { value: 'enterprise', label: '企业服务' },
        { value: 'hardware', label: '硬件/制造' },
        { value: 'consumer', label: '消费品' },
        { value: 'entertainment', label: '文化娱乐' },
        { value: 'automotive', label: '汽车交通' },
        { value: 'energy', label: '能源环保' },
        { value: 'logistics', label: '物流供应链' },
        { value: 'realestate', label: '房地产' },
        { value: 'other', label: '其他' }
      ],
      
      // 创业阶段选项
      stageOptions: [
        { value: 'idea', label: '创意阶段' },
        { value: 'prototype', label: '原型阶段' },
        { value: 'mvp', label: '最小可行产品' },
        { value: 'seed', label: '种子期' },
        { value: 'early', label: '早期成长' },
        { value: 'growth', label: '快速增长' },
        { value: 'mature', label: '成熟期' }
      ],
      
      // 地区选项 (简化版)
      locationOptions: [
        {
          value: 'north',
          label: '华北',
          children: [
            { value: 'beijing', label: '北京' },
            { value: 'tianjin', label: '天津' },
            { value: 'hebei', label: '河北' }
          ]
        },
        {
          value: 'east',
          label: '华东',
          children: [
            { value: 'shanghai', label: '上海' },
            { value: 'jiangsu', label: '江苏' },
            { value: 'zhejiang', label: '浙江' }
          ]
        },
        {
          value: 'south',
          label: '华南',
          children: [
            { value: 'guangdong', label: '广东' },
            { value: 'shenzhen', label: '深圳' },
            { value: 'fujian', label: '福建' }
          ]
        }
      ],
      
      // 表单验证规则
      rules: {
        name: [
          { required: true, message: '请输入项目名称', trigger: 'blur' }
        ],
        industry: [
          { required: true, message: '请选择所属行业', trigger: 'change' }
        ],
        stage: [
          { required: true, message: '请选择创业阶段', trigger: 'change' }
        ],
        email: [
          { required: true, message: '请输入联系邮箱', trigger: 'blur' },
          { type: 'email', message: '请输入正确的邮箱格式', trigger: 'blur' }
        ],
        description: [
          { required: true, message: '请输入项目详情', trigger: 'blur' }
        ],
        founderName: [
          { required: true, message: '请输入创始人姓名', trigger: 'blur' }
        ],
        memberName: [
          { required: true, message: '请输入团队成员姓名', trigger: 'blur' }
        ],
        memberTitle: [
          { required: true, message: '请输入团队成员职位', trigger: 'blur' }
        ],
        productDescription: [
          { required: true, message: '请描述您的产品/服务', trigger: 'blur' }
        ],
        targetMarket: [
          { required: true, message: '请描述目标市场', trigger: 'blur' }
        ],
        fundingStage: [
          { required: true, message: '请选择融资阶段', trigger: 'change' }
        ]
      }
    };
  },
  
  created() {
    // 检查用户是否已登录
    if (!Auth.isLoggedIn()) {
      // 未登录，跳转到登录页
      this.$confirm('需要登录后才能使用创业表单功能，是否立即登录?', '提示', {
        confirmButtonText: '去登录',
        cancelButtonText: '取消',
        type: 'warning'
      }).then(() => {
        window.location.href = '../login/index.html';
      }).catch(() => {
        window.location.href = '../../index.html';
      });
      return;
    }
    
    // 获取用户信息
    this.getUserInfo();
    
    // 检查是否有草稿
    this.checkDraft();
    
    // 检查URL参数是否有编辑ID
    const urlParams = new URLSearchParams(window.location.search);
    const editId = urlParams.get('id');
    if (editId) {
      this.loadStartupById(editId);
    }
  },
  
  methods: {
    // 获取用户信息
    getUserInfo() {
      const userInfo = Auth.getUserInfo();
      if (userInfo) {
        this.userInfo = userInfo;
        
        // 预填表单邮箱
        if (userInfo.email) {
          this.startupForm.email = userInfo.email;
        }
      }
    },
    
    // 检查是否有草稿
    checkDraft() {
      const draftData = localStorage.getItem('startup_form_draft');
      if (draftData) {
        try {
          const draft = JSON.parse(draftData);
          this.$confirm('发现上次未提交的表单草稿，是否恢复?', '提示', {
            confirmButtonText: '恢复',
            cancelButtonText: '不恢复',
            type: 'info'
          }).then(() => {
            this.startupForm = draft;
          }).catch(() => {
            // 删除草稿
            localStorage.removeItem('startup_form_draft');
          });
        } catch (e) {
          console.error('解析草稿数据失败:', e);
          localStorage.removeItem('startup_form_draft');
        }
      }
    },
    
    // 根据ID加载创业项目数据
    loadStartupById(id) {
      // 模拟API调用
      setTimeout(() => {
        // 实际项目中应调用后端API
        this.$message.info(`正在加载ID为${id}的创业项目数据...`);
        
        // 模拟成功加载
        this.startupForm.name = "示例项目";
        this.startupForm.industry = "tech";
        this.startupForm.stage = "early";
      }, 500);
    },
    
    // 上一步
    prevStep() {
      if (this.activeStep > 0) {
        this.activeStep -= 1;
        window.scrollTo(0, 0);
      }
    },
    
    // 下一步
    nextStep() {
      // 表单验证
      const formSections = [
        ['name', 'industry', 'stage', 'email', 'description'],
        ['founderName'],
        ['productDescription', 'targetMarket'],
        ['fundingStage']
      ];
      
      const currentFields = formSections[this.activeStep];
      
      // 创建一个临时表单引用对象进行部分验证
      const tempForm = {};
      currentFields.forEach(field => {
        tempForm[field] = this.startupForm[field];
      });
      
      // 验证当前部分的字段
      let isValid = true;
      currentFields.forEach(field => {
        const rule = this.rules[field];
        if (rule) {
          const value = this.startupForm[field];
          for (let i = 0; i < rule.length; i++) {
            const validator = rule[i];
            if (validator.required && (!value || (Array.isArray(value) && value.length === 0))) {
              this.$message.error(validator.message);
              isValid = false;
              break;
            }
          }
        }
      });
      
      if (!isValid) {
        return;
      }
      
      // 保存草稿
      this.saveDraft();
      
      // 进入下一步
      if (this.activeStep < 3) {
        this.activeStep += 1;
        window.scrollTo(0, 0);
      }
    },
    
    // 添加团队成员
    addTeamMember() {
      this.startupForm.coreTeam.push({
        name: '',
        title: '',
        background: ''
      });
    },
    
    // 删除团队成员
    removeTeamMember(index) {
      this.startupForm.coreTeam.splice(index, 1);
    },
    
    // 保存草稿
    saveDraft() {
      // 存储到LocalStorage
      try {
        localStorage.setItem('startup_form_draft', JSON.stringify(this.startupForm));
      } catch (e) {
        console.error('保存草稿失败:', e);
        this.$message.warning('草稿保存失败，可能是数据过大');
      }
    },
    
    // 提交表单
    submitForm() {
      this.$refs.startupForm.validate(valid => {
        if (!valid) {
          this.$message.error('表单填写有误，请检查');
          return false;
        }
        
        // 显示确认对话框
        this.$confirm('确认提交创业项目信息?', '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          // 用户点击确认，提交表单
          this.submitStartupData();
        }).catch(() => {
          // 用户取消提交
        });
      });
    },
    
    // 提交创业项目数据到后端
    submitStartupData() {
      // 显示加载状态
      const loading = this.$loading({
        lock: true,
        text: '正在提交...',
        spinner: 'el-icon-loading',
        background: 'rgba(255, 255, 255, 0.7)'
      });
      
      // 实际项目中应调用后端API
      setTimeout(() => {
        // 模拟提交成功
        loading.close();
        this.$message.success('创业信息提交成功');
        
        // 清除草稿
        localStorage.removeItem('startup_form_draft');
        
        // 跳转到分析结果页面
        setTimeout(() => {
          window.location.href = '../analysis/index.html';
        }, 1500);
      }, 2000);
    },
    
    // 处理下拉菜单命令
    handleCommand(command) {
      switch (command) {
        case 'profile':
          window.location.href = '../user/index.html';
          break;
        case 'settings':
          window.location.href = '../user/index.html?active=settings';
          break;
        case 'logout':
          this.$confirm('确定要退出登录吗?', '提示', {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning'
          }).then(() => {
            Auth.logout();
            window.location.href = '../../index.html';
          }).catch(() => {});
          break;
      }
    }
  }
});
