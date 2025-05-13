/**
 * 创业分析平台 - AI洞察页面脚本
 * 
 * 功能：
 * 1. 展示AI对创业项目的分析洞察
 * 2. 提供与AI助手的交互问答功能
 * 3. 实时获取行业趋势和竞争分析
 */

// 确保Services和CONFIG已正确加载
if (typeof Services === 'undefined') {
  console.error('Services对象未加载，请确保已引入services.js文件');
}

if (typeof CONFIG === 'undefined') {
  console.error('CONFIG对象未加载，请确保已引入config.js文件');
}

new Vue({
  el: '#app',
  data() {
    return {
      // 页面加载状态
      loading: true,
      refreshing: false,
      
      // 用户信息
      userInfo: {},
      
      // 创业项目信息
      startup: {
        id: '',
        name: '',
        industry: '',
        stage: '',
        foundedDate: '',
        location: []
      },
      
      // AI诊断概览
      overview: `基于您提供的创业项目信息和我们的市场数据分析，<span class="highlight">智能商业分析平台</span>处于早期成长阶段，项目整体表现良好。<br><br>
      
      项目的主要优势在于创始团队的技术背景和行业经验，以及产品的技术壁垒。项目已经形成了初步的用户基础，验证了基本的商业模式可行性。<br><br>
      
      目前面临的主要挑战是市场推广资源有限，品牌知名度不足，以及在快速扩张期的现金流管理。<br><br>
      
      从行业环境来看，企业服务SaaS市场正处于高速增长期，政策环境整体利好，但竞争也日趋激烈，头部企业已开始占据主要市场份额。`,
      
      // 战略建议
      strategySuggestions: {
        shortTerm: [
          "完善核心产品功能，聚焦提升用户体验和稳定性，确保现有客户满意度",
          "建立有效的客户反馈机制，快速迭代产品以满足市场需求",
          "通过内容营销和垂直媒体合作提升品牌曝光，建立行业专业形象",
          "优化销售流程，缩短转化周期，提高获客效率",
          "控制非核心成本支出，确保18个月以上现金流安全"
        ],
        midTerm: [
          "扩大团队规模，尤其是加强产品和技术团队的深度",
          "开发更多面向不同细分市场的功能模块，丰富产品矩阵",
          "建立系统化的销售团队和渠道体系，扩大市场覆盖",
          "寻找战略合作伙伴，共建生态系统，增强产品协同价值",
          "准备下一轮融资，制定清晰的融资策略和路线图"
        ],
        longTerm: [
          "探索国际市场扩张可能性，寻找适合的海外市场切入点",
          "通过收购或自研方式扩展产品线，形成完整解决方案",
          "建立行业标准和壁垒，巩固市场领导地位",
          "研究新兴技术趋势，提前布局下一代产品方向",
          "考虑多元化发展策略，降低单一市场风险"
        ]
      },
      
      // 竞争分析
      competitiveAnalysis: `您的创业项目在企业服务SaaS赛道中处于挑战者位置，与头部企业相比仍有差距，但在特定细分市场表现出独特优势。<br><br>
      
      市场上主要竞争对手多为成立3-5年的成熟企业，已完成B轮及以上融资，产品功能较为完善，市场占有率高。不过这些竞争对手产品普遍存在定制灵活性不足、对中小企业需求理解不深等问题。`,
      
      // 核心差异点
      competitiveAdvantages: [
        "技术架构更新，采用前沿AI技术，数据处理效率比竞品高30%以上",
        "产品更注重用户体验，界面简洁直观，降低了使用门槛",
        "灵活的定价策略，针对中小企业提供更具性价比的方案",
        "快速迭代响应能力，产品更新周期比行业平均水平短40%",
        "创始团队行业经验丰富，对客户痛点理解更深入"
      ],
      
      // 强化建议
      advantageStrengthening: `为了进一步强化竞争优势，建议重点关注以下方面：<br><br>
      
      1. <span class="highlight">技术领先性</span>：持续投入研发，保持技术迭代，将AI和数据分析能力作为核心差异化点<br>
      2. <span class="highlight">垂直深耕</span>：聚焦1-2个细分行业场景，深度满足这些场景的特殊需求<br>
      3. <span class="highlight">生态构建</span>：开放API接口，鼓励第三方开发，形成产品生态<br>
      4. <span class="highlight">口碑营销</span>：利用现有客户案例，构建有说服力的成功故事，形成良性传播<br>
      5. <span class="highlight">社区建设</span>：围绕产品建立用户社区，增强黏性并获取持续反馈`,
      
      // 风险预警
      risks: [
        {
          title: "现金流风险",
          level: "warning",
          description: "按目前的营收增长和成本结构，预计现金储备将在14个月后面临压力",
          suggestion: "控制人员扩张速度，优化市场投放ROI，加快回款速度，提前6个月启动新一轮融资准备"
        },
        {
          title: "市场竞争加剧",
          level: "warning",
          description: "近6个月内行业新增竞争对手5家，部分大型企业也开始进入该赛道",
          suggestion: "加快产品迭代速度，巩固现有客户关系，提高切换成本，强化差异化定位"
        },
        {
          title: "团队规模瓶颈",
          level: "info",
          description: "当前团队结构面临扩张瓶颈，尤其是中层管理和专业技术人才缺口明显",
          suggestion: "完善人才培养和晋升机制，建立有竞争力的薪酬体系，适当引入外部成熟人才"
        },
        {
          title: "技术迭代风险",
          level: "info",
          description: "核心技术架构已使用12个月，面临升级需求，迭代过程可能影响服务稳定性",
          suggestion: "制定详细的技术迭代路线图，分阶段实施，做好灰度发布和回滚机制"
        },
        {
          title: "政策合规风险",
          level: "error",
          description: "行业数据安全法规趋严，现有产品在数据处理和存储方面存在合规隐患",
          suggestion: "立即开展合规自查，必要时聘请专业法律顾问，优先解决敏感数据处理流程"
        }
      ],
      
      // 行业趋势洞察
      industryTrends: `企业服务SaaS行业正处于快速发展阶段，国内市场年增长率保持在25%以上。随着企业数字化转型的深入，市场需求持续释放。<br><br>
      
      技术层面，AI赋能、低代码平台、数据智能正成为行业主要趋势。商业模式上，从单一产品提供商向整体解决方案提供商转变的趋势明显。<br><br>
      
      资本市场对该领域的关注度维持高位，但投资逻辑更趋理性，强调业务健康度和可持续增长。`,
      
      // 新兴机会
      opportunities: [
        "中小企业数字化转型需求增长，对轻量级、低成本SaaS工具的需求旺盛",
        "垂直行业深耕，针对特定行业的深度定制化解决方案存在蓝海",
        "AI智能化应用场景拓展，将传统功能与AI能力结合创造新价值",
        "企业生态闭环建设，从单点工具向平台化方向升级",
        "海外市场拓展，尤其是东南亚等新兴市场存在增长机会"
      ],
      
      // 参考资料
      references: [
        { title: "2025年中国SaaS行业发展趋势报告 - 艾瑞咨询", url: "#" },
        { title: "企业服务行业投融资分析 - 36氪研究院", url: "#" },
        { title: "中小企业数字化转型白皮书 - 中国信通院", url: "#" },
        { title: "2024年AI赋能SaaS行业研究 - CBInsights", url: "#" }
      ],
      
      // AI助手问答
      questionInput: '',
      aiThinking: false,
      chatMessages: [
        {
          sender: 'ai',
          content: '您好！我是您的AI创业助手。基于您提供的创业项目信息，我可以回答关于战略规划、产品发展、市场分析等方面的问题。请问有什么可以帮您分析的？',
          time: new Date()
        }
      ],
      
      // 示例问题
      exampleQuestions: [
        "我应该如何改进我的营销策略？",
        "我们的产品有哪些方面需要优化？",
        "如何提高我们的用户留存率？"
      ]
    };
  },
  
  created() {
    // 检查用户是否已登录
    if (!Auth.isLoggedIn()) {
      // 未登录，跳转到登录页
      this.$confirm('需要登录后才能访问AI洞察页面，是否立即登录?', '提示', {
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
    
    // 获取URL参数中的项目ID
    const urlParams = new URLSearchParams(window.location.search);
    const startupId = urlParams.get('id');
    
    // 如果有ID则加载特定项目，否则加载用户最新的项目
    if (startupId) {
      this.fetchStartupData(startupId);
    } else {
      this.fetchLatestStartup();
    }
  },
  
  mounted() {
    // 开始加载数据 - 从后端获取真实数据
    this.loading = true;
    this.loadAIInsights();
  },
  
  methods: {
    // 获取用户信息
    getUserInfo() {
      const userInfo = Auth.getUserInfo();
      if (userInfo) {
        this.userInfo = userInfo;
      }
    },
    
    // 获取创业项目数据
    async fetchStartupData(id) {
      try {
        console.log('Fetching startup data for id:', id);
        const response = await Services.nocobase.getStartupProjectDetail(id);
        
        if (response && response.data) {
          this.startup = {
            id: response.data.id,
            name: response.data.name,
            industry: response.data.industry,
            stage: response.data.stage,
            foundedDate: response.data.founded_date,
            location: [response.data.region, response.data.city]
          };
          
          // 获取项目相关的AI洞察数据
          this.loadAIInsights();
        } else {
          this.$message.error('无法获取创业项目数据');
        }
      } catch (error) {
        console.error('获取创业项目数据失败:', error);
        this.$message.error('获取创业项目数据失败');
      }
    },
    
    // 获取用户最新的创业项目
    async fetchLatestStartup() {
      try {
        console.log('Fetching latest startup data');
        const userId = this.userInfo.id;
        const response = await Services.nocobase.getStartupProjects(userId);
        
        if (response && response.data && response.data.length > 0) {
          // 获取最新的项目（假设按创建时间排序，最新的在第一位）
          const latestProject = response.data[0];
          
          this.startup = {
            id: latestProject.id,
            name: latestProject.name,
            industry: latestProject.industry,
            stage: latestProject.stage,
            foundedDate: latestProject.founded_date,
            location: [latestProject.region, latestProject.city]
          };
          
          // 获取项目相关的AI洞察数据
          this.loadAIInsights();
        } else {
          this.$message.warning('未找到创业项目数据，请先创建项目');
          // 跳转到创业项目创建页面
          setTimeout(() => {
            this.goToStartupForm();
          }, 2000);
        }
      } catch (error) {
        console.error('获取最新创业项目数据失败:', error);
        this.$message.error('获取创业项目数据失败');
      }
    },
    
    // 加载AI洞察数据
    async loadAIInsights() {
      try {
        if (!this.startup || !this.startup.id) {
          this.loading = false;
          return;
        }
        
        // 获取AI分析数据
        const analysisData = await Services.aiModel.analyzeStartup({
          startup_id: this.startup.id,
          name: this.startup.name,
          industry: this.startup.industry,
          stage: this.startup.stage,
          founded_date: this.startup.foundedDate,
          region: this.startup.location[0],
          city: this.startup.location[1]
        });
        
        // 更新页面数据
        if (analysisData) {
          // 更新概览
          if (analysisData.overview) {
            this.overview = analysisData.overview;
          }
          
          // 更新战略建议
          if (analysisData.strategy_suggestions) {
            this.strategySuggestions = analysisData.strategy_suggestions;
          }
          
          // 更新竞争分析
          if (analysisData.competitive_analysis) {
            this.competitiveAnalysis = analysisData.competitive_analysis;
            this.competitiveAdvantages = analysisData.competitive_advantages || this.competitiveAdvantages;
            this.advantageStrengthening = analysisData.advantage_strengthening || this.advantageStrengthening;
          }
          
          // 更新风险预警
          if (analysisData.risks) {
            this.risks = analysisData.risks;
          }
          
          // 更新行业趋势
          if (analysisData.industry_trends) {
            this.industryTrends = analysisData.industry_trends;
            this.opportunities = analysisData.opportunities || this.opportunities;
          }
          
          // 更新参考资料
          if (analysisData.references) {
            this.references = analysisData.references;
          }
        }
      } catch (error) {
        console.error('加载AI洞察数据失败:', error);
        this.$message.error('加载AI洞察数据失败');
      } finally {
        // 完成数据加载
        this.loading = false;
      }
    },
    
    // 刷新AI洞察
    async refreshInsights() {
      try {
        this.refreshing = true;
        
        if (!this.startup || !this.startup.id) {
          this.$message.warning('未找到创业项目信息');
          this.refreshing = false;
          return;
        }
        
        // 请求更新AI洞察
        await Services.aiModel.analyzeStartup({
          startup_id: this.startup.id,
          name: this.startup.name,
          industry: this.startup.industry,
          stage: this.startup.stage,
          founded_date: this.startup.foundedDate,
          region: this.startup.location[0],
          city: this.startup.location[1],
          force_refresh: true // 强制重新分析
        });
        
        // 重新加载AI洞察数据
        await this.loadAIInsights();
        
        this.$message.success('AI洞察已更新');
      } catch (error) {
        console.error('刷新AI洞察失败:', error);
        this.$message.error('刷新AI洞察失败');
      } finally {
        this.refreshing = false;
      }
    },
    
    // 提问AI助手
    async askQuestion() {
      // 验证输入
      if (!this.questionInput.trim()) {
        this.$message.warning('请输入您的问题');
        return;
      }
      
      // 验证项目ID
      if (!this.startup || !this.startup.id) {
        this.$message.warning('未找到项目信息，无法提问');
        return;
      }
      
      // 添加用户问题到聊天记录
      this.chatMessages.push({
        sender: 'user',
        content: this.questionInput,
        time: new Date()
      });
      
      // 保存问题并清空输入框
      const question = this.questionInput;
      this.questionInput = '';
      
      // 显示AI思考中状态
      this.aiThinking = true;
      
      // 滚动到底部
      this.$nextTick(() => {
        const container = document.querySelector('.chat-messages');
        container.scrollTop = container.scrollHeight;
      });
      
      try {
        // 调用AI模型服务获取回答
        const response = await Services.aiModel.askQuestion(this.startup.id, question);
        
        let answer = '';
        if (response && response.answer) {
          answer = response.answer;
        } else {
          answer = '抱歉，我无法回答这个问题。请尝试其他问题，或者提供更多项目相关信息。';
        }
        
        // 添加AI回答到聊天记录
        this.chatMessages.push({
          sender: 'ai',
          content: answer,
          time: new Date()
        });
      } catch (error) {
        console.error('AI助手回答失败:', error);
        
        // 添加错误信息到聊天记录
        this.chatMessages.push({
          sender: 'ai',
          content: '抱歉，发生了技术错误，无法回答您的问题。请稍后再试。',
          time: new Date()
        });
      } finally {
        // 关闭思考状态
        this.aiThinking = false;
        
        // 滚动到底部
        this.$nextTick(() => {
          const container = document.querySelector('.chat-messages');
          container.scrollTop = container.scrollHeight;
        });
      }
    },
    
    // 生成AI回答的备用方法（当API调用失败时使用）
    fallbackGenerateAnswer(question) {
      // 关键词匹配的简单回答示例
      const keywords = {
        '营销': '基于您的项目情况，建议营销策略可以从以下几个方面改进：<br><br>1. <span class="highlight">内容营销</span>：创建高质量的行业洞察、案例研究和白皮书，提升品牌专业形象<br>2. <span class="highlight">社区建设</span>：构建产品用户社区，促进用户交流和经验分享<br>3. <span class="highlight">精准投放</span>：利用LinkedIn、专业论坛等渠道进行定向广告投放<br>4. <span class="highlight">客户案例</span>：重点包装2-3个成功客户案例，强化解决方案价值<br>5. <span class="highlight">线下活动</span>：参与或举办行业研讨会，增强品牌曝光和专业背书',
        '产品': '您的产品目前处于成长期，根据行业反馈和用户数据，优化方向可以集中在：<br><br>1. <span class="highlight">用户界面简化</span>：降低学习成本，提升直观性<br>2. <span class="highlight">核心功能深化</span>：聚焦主要价值点，避免功能过度发散<br>3. <span class="highlight">数据分析增强</span>：提供更多actionable insights，而非仅展示数据<br>4. <span class="highlight">集成能力提升</span>：与主流企业工具实现更便捷的对接<br>5. <span class="highlight">个性化定制</span>：增加灵活配置选项，适应不同企业需求',
        '融资': '对于您目前处于早期成长阶段的创业项目，融资策略建议如下：<br><br>1. 考虑时机：基于当前增长数据，建议在未来6-9个月内启动新一轮融资<br>2. 融资规模：根据行业标准和增长预期，Pre-A轮可考虑融资1500-2000万元<br>3. 投资方向：重点关注专注于企业服务、SaaS赛道的早期VC<br>4. 准备材料：完善商业计划书，重点突出产品差异化、客户获取效率和增长潜力<br>5. 估值预期：参考同行业可比公司，合理设定估值区间，避免过高预期导致后续融资困难',
        '团队': '创业团队建设对项目成功至关重要，建议从以下方面优化团队结构：<br><br>1. <span class="highlight">核心岗位补强</span>：当前阶段应优先招募产品和销售核心人才<br>2. <span class="highlight">企业文化</span>：明确定义公司价值观和文化，吸引认同企业理念的人才<br>3. <span class="highlight">激励机制</span>：建立清晰的期权池和晋升通道，绑定核心团队利益<br>4. <span class="highlight">组织结构</span>：保持扁平化管理，提高决策效率<br>5. <span class="highlight">人才梯队</span>：开始培养中层管理人才，为公司成长做准备',
        '竞争': '面对日益激烈的市场竞争，差异化战略将是制胜关键：<br><br>1. <span class="highlight">聚焦细分市场</span>：选择1-2个垂直领域深耕，避免与巨头正面竞争<br>2. <span class="highlight">服务深度</span>：提供比通用产品更专业、更深入的行业解决方案<br>3. <span class="highlight">响应速度</span>：利用小团队优势，保持快速迭代和客户响应<br>4. <span class="highlight">价格策略</span>：考虑采用更灵活的定价模式，降低客户试用门槛<br>5. <span class="highlight">生态合作</span>：与现有大厂形成互补而非竞争的关系',
        '用户': '提高用户留存率的关键策略包括：<br><br>1. <span class="highlight">完善新用户引导</span>：提供交互式引导流程，帮助用户快速上手<br>2. <span class="highlight">价值实现加速</span>：确保用户在最短时间内体验到核心价值<br>3. <span class="highlight">持续激活机制</span>：通过邮件、消息提醒用户使用产品新功能<br>4. <span class="highlight">社区参与</span>：鼓励用户加入社区，增加使用黏性<br>5. <span class="highlight">数据驱动优化</span>：分析用户流失节点，有针对性地改进体验<br>6. <span class="highlight">客户成功</span>：为重要客户配备专属客户成功经理，确保使用效果'
      };
      
      // 简单的关键词匹配逻辑
      for (const [key, response] of Object.entries(keywords)) {
        if (question.includes(key)) {
          return response;
        }
      }
      
      // 默认回答
      return '感谢您的问题。基于您的创业项目信息和行业分析，我认为：<br><br>您的问题涉及到创业发展的重要方面。考虑到您处于早期成长阶段，建议优先关注产品的核心价值提升和初期用户的留存与转化。<br><br>市场策略上，应聚焦垂直细分领域，避免与大厂正面竞争。同时，建立清晰的数据跟踪体系，确保每一步决策都有数据支持。<br><br>团队建设方面，现阶段应控制人员扩张速度，聚焦关键岗位招募，特别是能带来直接业务增长的角色。<br><br>如需更具体的建议，欢迎提供更多项目细节。';
    },
    
    // 填充示例问题
    fillExampleQuestion(index) {
      this.questionInput = this.exampleQuestions[index];
    },
    
    // 格式化时间
    formatTime(time) {
      const date = new Date(time);
      return `${date.getHours()}:${String(date.getMinutes()).padStart(2, '0')}`;
    },
    
    // 获取行业标签
    getIndustryLabel(value) {
      const industryMap = {
        'tech': '科技/互联网',
        'finance': '金融科技',
        'healthcare': '医疗健康',
        'education': '教育',
        'ecommerce': '电子商务',
        'enterprise': '企业服务',
        'hardware': '硬件/制造',
        'consumer': '消费品',
        'entertainment': '文化娱乐',
        'automotive': '汽车交通',
        'energy': '能源环保',
        'logistics': '物流供应链',
        'realestate': '房地产',
        'other': '其他'
      };
      
      return industryMap[value] || value;
    },
    
    // 获取阶段标签
    getStageLabel(value) {
      const stageMap = {
        'idea': '创意阶段',
        'prototype': '原型阶段',
        'mvp': '最小可行产品',
        'seed': '种子期',
        'early': '早期成长',
        'growth': '快速增长',
        'mature': '成熟期'
      };
      
      return stageMap[value] || value;
    },
    
    // 前往创业表单页面
    goToStartupForm() {
      window.location.href = '../startup/index.html';
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
