/**
 * 创业分析平台 - 数据分析页面脚本
 */

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
        location: [],
        employeeCount: '',
        fundingStage: '',
        fundingAmount: 0,
        valuation: 0
      },
      
      // 评分数据
      overallScore: 85,
      productScore: 88,
      teamScore: 90,
      marketScore: 78,
      financeScore: 82,
      
      // 图表配置
      marketChartPeriod: 'year',
      forecastType: 'revenue',
      
      // 竞争对手数据
      competitors: [
        {
          name: '竞争对手A',
          founded: '2018-05',
          funding: 'A轮 5000万',
          marketShare: '35%',
          advantage: '技术积累深厚，市场认知度高'
        },
        {
          name: '竞争对手B',
          founded: '2020-07',
          funding: '天使轮 800万',
          marketShare: '15%',
          advantage: '产品创新性强，用户体验好'
        },
        {
          name: '竞争对手C',
          founded: '2019-10',
          funding: '种子轮 500万',
          marketShare: '10%',
          advantage: '销售渠道成熟，客户资源丰富'
        }
      ],
      
      // 风险评估
      risks: [
        {
          category: '市场风险',
          level: '中等',
          description: '市场竞争激烈，头部企业市场份额集中',
          suggestion: '明确差异化定位，找准细分市场'
        },
        {
          category: '技术风险',
          level: '低',
          description: '核心技术较为成熟，无重大技术障碍',
          suggestion: '持续技术创新，保持技术优势'
        },
        {
          category: '团队风险',
          level: '低',
          description: '创始团队经验丰富，人员结构合理',
          suggestion: '完善激励机制，吸引更多人才'
        },
        {
          category: '财务风险',
          level: '高',
          description: '现金流紧张，盈利周期较长',
          suggestion: '优化成本结构，加快回款周期'
        },
        {
          category: '政策风险',
          level: '中等',
          description: '行业处于监管变化期，政策存在不确定性',
          suggestion: '密切关注政策动向，提前做好应对准备'
        }
      ],
      
      // 分析说明
      marketAnalysisNote: '该行业市场规模持续稳定增长，预计未来3年年均复合增长率维持在15%左右。由于国内政策支持和技术进步，市场整体呈现积极向上的趋势。但随着行业发展成熟，增速可能逐步放缓，建议提前布局新兴细分领域。',
      
      competitorAnalysisNote: '行业竞争格局呈现头部集中、腰部分散的特点。头部企业依靠先发优势和资本支持占据主要市场份额，但在部分细分市场和新兴应用场景仍存在较大机会。建议通过差异化产品策略和精准的市场定位，在细分领域建立竞争优势。',
      
      financeAnalysisNote: '基于当前发展阶段和行业平均水平，预计项目在第二年实现收支平衡，第三年开始盈利。需要注意的是，初期研发和市场投入较大，现金流管理至关重要，建议保持18个月以上的现金储备。',
      
      // SWOT分析
      swotAnalysis: {
        strengths: [
          '创始团队拥有丰富的行业经验和技术背景',
          '产品技术壁垒较高，具有自主知识产权',
          '已建立初步的用户基础，产品反馈良好',
          '商业模式清晰，收入来源多元化'
        ],
        weaknesses: [
          '品牌知名度不足，市场推广资源有限',
          '产品功能仍需完善，用户体验有待提升',
          '团队规模较小，人员结构有待优化',
          '销售渠道建设不足，获客成本较高'
        ],
        opportunities: [
          '行业政策利好，国家大力支持相关领域发展',
          '目标市场规模大，增长潜力充足',
          '用户需求日益增长，市场渗透率仍较低',
          '新技术发展为产品创新提供更多可能'
        ],
        threats: [
          '大型企业可能进入市场，带来竞争压力',
          '行业标准变化可能导致产品需要调整',
          '替代技术或解决方案的出现',
          '获客成本上升，用户忠诚度培养难度增加'
        ]
      },
      
      // 总结内容
      summaryContent: '该创业项目总体表现较好，综合评分85分，处于行业中上水平。\n\n项目优势主要体现在团队背景和产品技术方面，核心团队拥有丰富的行业经验和专业背景，产品技术含量较高且已形成一定的技术壁垒。\n\n项目当前面临的主要挑战是市场推广和品牌建设，以及财务压力。建议在下一阶段重点关注:\n\n1. 加强品牌建设和市场推广，提高市场认知度\n2. 优化产品功能，持续提升用户体验\n3. 扩展销售渠道，降低获客成本\n4. 控制成本支出，延长现金储备周期\n\n从长期发展看，项目所在行业前景广阔，政策环境利好，但竞争也将日益激烈。建议加快产品迭代和市场扩张速度，尽早建立竞争壁垒和品牌优势。'
    };
  },
  
  created() {
    // 检查用户是否已登录
    if (!Auth.isLoggedIn()) {
      // 未登录，跳转到登录页
      this.$confirm('需要登录后才能访问分析页面，是否立即登录?', '提示', {
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
    // 模拟数据加载延迟
    setTimeout(() => {
      this.loading = false;
      
      // 当数据加载完成后初始化图表
      if (this.startup.id) {
        this.$nextTick(() => {
          this.initCharts();
        });
      }
    }, 1500);
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
    fetchStartupData(id) {
      // 模拟API调用
      console.log('Fetching startup data for id:', id);
      
      // 示例数据
      this.startup = {
        id: id || '1001',
        name: '智能商业分析平台',
        industry: 'tech',
        stage: 'early',
        foundedDate: '2023-06-15',
        location: ['north', 'beijing'],
        employeeCount: '6-15人',
        fundingStage: 'seed',
        fundingAmount: 300,
        valuation: 2000
      };
    },
    
    // 获取用户最新的创业项目
    fetchLatestStartup() {
      // 模拟API调用
      console.log('Fetching latest startup data');
      
      // 示例数据
      this.startup = {
        id: '1001',
        name: '智能商业分析平台',
        industry: 'tech',
        stage: 'early',
        foundedDate: '2023-06-15',
        location: ['north', 'beijing'],
        employeeCount: '6-15人',
        fundingStage: 'seed',
        fundingAmount: 300,
        valuation: 2000
      };
    },
    
    // 刷新分析数据
    refreshAnalysis() {
      this.refreshing = true;
      
      // 模拟API调用
      setTimeout(() => {
        this.refreshing = false;
        this.$message.success('分析数据已刷新');
        
        // 更新图表
        this.initCharts();
      }, 2000);
    },
    
    // 初始化所有图表
    initCharts() {
      this.initMarketSizeChart();
      this.initCompetitorChart();
      this.initRiskChart();
      this.initFinanceForecastChart();
    },
    
    // 初始化市场规模图表
    initMarketSizeChart() {
      const marketChart = echarts.init(document.getElementById('marketSizeChart'));
      
      // 根据选择的时间周期显示不同数据
      let xAxisData, seriesData, growthData;
      
      if (this.marketChartPeriod === 'year') {
        xAxisData = ['2020', '2021', '2022', '2023', '2024', '2025', '2026'];
        seriesData = [1200, 1500, 1800, 2200, 2700, 3300, 4000];
        growthData = [null, 25, 20, 22, 23, 22, 21];
      } else {
        xAxisData = ['2023Q1', '2023Q2', '2023Q3', '2023Q4', '2024Q1', '2024Q2', '2024Q3', '2024Q4'];
        seriesData = [2000, 2080, 2150, 2200, 2300, 2450, 2580, 2700];
        growthData = [null, 4, 3.4, 2.3, 4.5, 6.5, 5.3, 4.7];
      }
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['市场规模(亿元)', '增长率(%)']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: xAxisData
        },
        yAxis: [
          {
            type: 'value',
            name: '市场规模(亿元)',
            min: 0
          },
          {
            type: 'value',
            name: '增长率(%)',
            min: 0,
            max: 30,
            axisLabel: {
              formatter: '{value}%'
            }
          }
        ],
        series: [
          {
            name: '市场规模(亿元)',
            type: 'bar',
            data: seriesData,
            barWidth: '40%',
            itemStyle: {
              color: '#5470c6'
            }
          },
          {
            name: '增长率(%)',
            type: 'line',
            yAxisIndex: 1,
            data: growthData,
            symbol: 'circle',
            symbolSize: 8,
            lineStyle: {
              width: 3,
              color: '#91cc75'
            },
            itemStyle: {
              color: '#91cc75'
            }
          }
        ]
      };
      
      marketChart.setOption(option);
      
      // 监听窗口大小改变，重绘图表
      window.addEventListener('resize', function() {
        marketChart.resize();
      });
    },
    
    // 初始化竞争对手图表
    initCompetitorChart() {
      const competitorChart = echarts.init(document.getElementById('competitorChart'));
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['产品完善度', '用户体验', '技术先进性', '市场占有率', '融资规模']
        },
        radar: {
          indicator: [
            { name: '产品完善度', max: 100 },
            { name: '用户体验', max: 100 },
            { name: '技术先进性', max: 100 },
            { name: '市场占有率', max: 100 },
            { name: '融资规模', max: 100 }
          ],
          radius: '65%'
        },
        series: [
          {
            name: '竞争对手对比',
            type: 'radar',
            data: [
              {
                value: [85, 90, 80, 60, 70],
                name: '我方项目',
                symbolSize: 8,
                lineStyle: {
                  width: 3
                },
                areaStyle: {
                  opacity: 0.3
                }
              },
              {
                value: [70, 75, 80, 85, 95],
                name: '竞争对手A',
                symbolSize: 6,
                lineStyle: {
                  width: 2
                },
                areaStyle: {
                  opacity: 0.2
                }
              },
              {
                value: [90, 85, 60, 70, 60],
                name: '竞争对手B',
                symbolSize: 6,
                lineStyle: {
                  width: 2
                },
                areaStyle: {
                  opacity: 0.2
                }
              }
            ]
          }
        ]
      };
      
      competitorChart.setOption(option);
      
      // 监听窗口大小改变，重绘图表
      window.addEventListener('resize', function() {
        competitorChart.resize();
      });
    },
    
    // 初始化风险雷达图表
    initRiskChart() {
      const riskChart = echarts.init(document.getElementById('riskChart'));
      
      const option = {
        tooltip: {},
        legend: {
          data: ['风险评估']
        },
        radar: {
          shape: 'circle',
          indicator: [
            { name: '市场风险', max: 100 },
            { name: '技术风险', max: 100 },
            { name: '团队风险', max: 100 },
            { name: '财务风险', max: 100 },
            { name: '政策风险', max: 100 }
          ]
        },
        series: [{
          name: '风险评估',
          type: 'radar',
          data: [
            {
              value: [65, 30, 25, 85, 60],
              name: '风险指数',
              areaStyle: {
                color: 'rgba(255, 73, 73, 0.6)'
              },
              lineStyle: {
                color: '#FF4949'
              },
              itemStyle: {
                color: '#FF4949'
              }
            }
          ]
        }]
      };
      
      riskChart.setOption(option);
      
      // 监听窗口大小改变，重绘图表
      window.addEventListener('resize', function() {
        riskChart.resize();
      });
    },
    
    // 初始化财务预测图表
    initFinanceForecastChart() {
      const financeChart = echarts.init(document.getElementById('financeForecastChart'));
      
      // 根据选择的类型显示不同数据
      let seriesData;
      
      // 收入、成本、利润的预测数据
      const revenueData = [
        [0, 0, 150, 600, 1500, 3000, 4200, 5500, 7200, 9200, 11000, 12500],
        [0, 0, 200, 800, 2000, 4000, 5500, 7200, 9500, 12000, 14000, 16000],
        [0, 0, 100, 400, 1000, 2000, 3000, 4000, 5000, 6200, 7500, 9000]
      ];
      
      const costData = [
        [300, 500, 650, 900, 1200, 1800, 2200, 2800, 3800, 4800, 5800, 6600],
        [400, 700, 900, 1200, 1600, 2400, 3000, 3800, 5000, 6200, 7500, 8500],
        [200, 300, 400, 600, 800, 1200, 1500, 1900, 2500, 3200, 3800, 4400]
      ];
      
      const profitData = [
        [-300, -500, -500, -300, 300, 1200, 2000, 2700, 3400, 4400, 5200, 5900],
        [-400, -700, -700, -400, 400, 1600, 2500, 3400, 4500, 5800, 6500, 7500],
        [-200, -300, -300, -200, 200, 800, 1500, 2100, 2500, 3000, 3700, 4600]
      ];
      
      // 根据选择切换数据
      if (this.forecastType === 'revenue') {
        seriesData = revenueData;
      } else if (this.forecastType === 'cost') {
        seriesData = costData;
      } else {
        seriesData = profitData;
      }
      
      const option = {
        tooltip: {
          trigger: 'axis',
          axisPointer: {
            type: 'shadow'
          }
        },
        legend: {
          data: ['悲观预测', '基准预测', '乐观预测']
        },
        grid: {
          left: '3%',
          right: '4%',
          bottom: '3%',
          containLabel: true
        },
        xAxis: {
          type: 'category',
          data: ['1月', '3月', '6月', '9月', '12月', '15月', '18月', '21月', '24月', '27月', '30月', '36月']
        },
        yAxis: {
          type: 'value',
          name: '金额 (万元)'
        },
        series: [
          {
            name: '基准预测',
            type: 'line',
            data: seriesData[0],
            lineStyle: {
              width: 3,
              color: '#409EFF'
            },
            itemStyle: {
              color: '#409EFF'
            }
          },
          {
            name: '乐观预测',
            type: 'line',
            data: seriesData[1],
            lineStyle: {
              width: 2,
              color: '#67C23A'
            },
            itemStyle: {
              color: '#67C23A'
            }
          },
          {
            name: '悲观预测',
            type: 'line',
            data: seriesData[2],
            lineStyle: {
              width: 2,
              color: '#E6A23C'
            },
            itemStyle: {
              color: '#E6A23C'
            }
          }
        ]
      };
      
      financeChart.setOption(option);
      
      // 监听窗口大小改变，重绘图表
      window.addEventListener('resize', function() {
        financeChart.resize();
      });
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
    
    // 获取融资阶段标签
    getFundingStageLabel(value) {
      const fundingMap = {
        'none': '尚未融资',
        'angel': '天使轮',
        'seed': '种子轮',
        'preA': 'Pre-A轮',
        'A': 'A轮',
        'B+': 'B轮及以上'
      };
      
      return fundingMap[value] || value;
    },
    
    // 格式化地区显示
    formatLocation(location) {
      if (!location || location.length === 0) {
        return '未设置';
      }
      
      // 简单映射表
      const locationMap = {
        'north': '华北',
        'beijing': '北京',
        'tianjin': '天津',
        'hebei': '河北',
        'east': '华东',
        'shanghai': '上海',
        'jiangsu': '江苏',
        'zhejiang': '浙江',
        'south': '华南',
        'guangdong': '广东',
        'shenzhen': '深圳',
        'fujian': '福建'
      };
      
      // 将地区代码转换为地区名称
      return location.map(code => locationMap[code] || code).join(' - ');
    },
    
    // 获取评分样式类
    getScoreClass(score) {
      if (score >= 80) {
        return 'score-high';
      } else if (score >= 60) {
        return 'score-medium';
      } else {
        return 'score-low';
      }
    },
    
    // 获取风险等级样式
    getRiskLevelType(level) {
      switch (level) {
        case '高':
          return 'danger';
        case '中等':
          return 'warning';
        case '低':
          return 'success';
        default:
          return 'info';
      }
    },
    
    // 前往创业表单页面
    goToStartupForm() {
      window.location.href = '../startup/index.html';
    },
    
    // 前往AI洞察页面
    goToAIInsights() {
      window.location.href = '../ai-insights/index.html' + (this.startup.id ? `?id=${this.startup.id}` : '');
    },
    
    // 编辑创业信息
    editStartup() {
      window.location.href = `../startup/index.html?id=${this.startup.id}`;
    },
    
    // 下载分析报告
    downloadReport() {
      this.$message({
        message: '报告生成中，请稍候...',
        type: 'info'
      });
      
      // 模拟下载延迟
      setTimeout(() => {
        this.$message({
          message: '分析报告已生成，正在下载',
          type: 'success'
        });
        
        // 实际项目中应调用后端API生成报告并触发下载
        // 模拟下载行为
        const link = document.createElement('a');
        link.href = '#';
        link.setAttribute('download', `创业分析报告_${this.startup.name}_${new Date().toLocaleDateString()}.pdf`);
        link.click();
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
  },
  
  // 侦听器
  watch: {
    // 当时间周期切换时，重新绘制市场图表
    marketChartPeriod() {
      this.$nextTick(() => {
        this.initMarketSizeChart();
      });
    },
    
    // 当财务预测类型切换时，重新绘制财务图表
    forecastType() {
      this.$nextTick(() => {
        this.initFinanceForecastChart();
      });
    }
  }
});
