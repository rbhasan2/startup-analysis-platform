import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestClassifier
from sklearn.model_selection import train_test_split
import joblib
import os

class StartupAnalysisModel:
    """简单的创业分析模型，基于随机森林算法"""
    
    def __init__(self):
        self.model = RandomForestClassifier(n_estimators=100, random_state=42)
        self.features = [
            'industry_encoded', 'funding_stage_encoded', 'team_size', 
            'revenue_range_encoded', 'company_age'
        ]
        self.industry_mapping = {}
        self.funding_mapping = {}
        self.revenue_mapping = {}
        self.trained = False
        
    def preprocess_data(self, data):
        """预处理数据，将文本特征转换为数值"""
        df = data.copy()
        
        # 编码行业
        if not self.industry_mapping:
            industries = df['industry'].unique()
            self.industry_mapping = {ind: i for i, ind in enumerate(industries)}
        df['industry_encoded'] = df['industry'].map(self.industry_mapping)
        
        # 编码融资阶段
        if not self.funding_mapping:
            funding_stages = df['funding_stage'].unique()
            # 按照融资轮次排序
            stage_order = {
                '未融资': 0, 
                '天使轮': 1, 
                'Pre-A轮': 2, 
                'A轮': 3, 
                'B轮': 4, 
                'C轮及以上': 5, 
                '已上市': 6
            }
            self.funding_mapping = {stage: stage_order.get(stage, i) for i, stage in enumerate(funding_stages)}
        df['funding_stage_encoded'] = df['funding_stage'].map(self.funding_mapping)
        
        # 解析团队规模
        df['team_size'] = df['team_size'].apply(self._extract_team_size)
        
        # 编码月营收
        if not self.revenue_mapping:
            revenue_ranges = df['revenue_range'].unique()
            # 按照收入范围排序
            range_order = {
                '尚未盈利': 0,
                '0-10万': 1,
                '10-50万': 2,
                '50-100万': 3,
                '100-500万': 4,
                '500-1000万': 5,
                '1000万以上': 6
            }
            self.revenue_mapping = {rng: range_order.get(rng, i) for i, rng in enumerate(revenue_ranges)}
        df['revenue_range_encoded'] = df['revenue_range'].map(self.revenue_mapping)
        
        # 计算公司年龄
        df['company_age'] = pd.to_datetime('now').year - pd.to_datetime(df['founding_date']).dt.year
        
        return df
    
    def _extract_team_size(self, size_text):
        """从团队规模文本中提取数值"""
        if pd.isna(size_text):
            return 0
            
        if '-' in size_text:
            # 形如 "6-15人" 的格式
            parts = size_text.replace('人', '').split('-')
            return (int(parts[0]) + int(parts[1])) / 2
        elif '以上' in size_text:
            # 形如 "500人以上" 的格式
            return float(size_text.replace('人以上', ''))
        else:
            return 0
    
    def train(self, data, target='success'):
        """训练模型"""
        df = self.preprocess_data(data)
        
        X = df[self.features]
        y = df[target]
        
        X_train, X_test, y_train, y_test = train_test_split(X, y, test_size=0.2, random_state=42)
        
        self.model.fit(X_train, y_train)
        
        # 评估模型
        train_score = self.model.score(X_train, y_train)
        test_score = self.model.score(X_test, y_test)
        
        self.trained = True
        
        return {
            'train_score': train_score,
            'test_score': test_score
        }
    
    def predict(self, startup_data):
        """预测创业公司的成功可能性"""
        if not self.trained:
            raise ValueError("模型尚未训练")
        
        df = self.preprocess_data(pd.DataFrame([startup_data]))
        X = df[self.features]
        
        # 预测成功概率
        success_prob = self.model.predict_proba(X)[0][1]
        
        return success_prob
    
    def generate_insights(self, startup_data, public_data=None, analysis_data=None):
        """生成创业洞察建议"""
        industry = startup_data.get('industry', '')
        funding_stage = startup_data.get('funding_stage', '')
        team_size_text = startup_data.get('team_size', '')
        revenue_range = startup_data.get('revenue_range', '')
        business_desc = startup_data.get('business_desc', '')
        
        # 基础洞察
        insights = {
            'success_probability': 0.0,  # 默认值，后续会更新
            'strengths': [],
            'weaknesses': [],
            'opportunities': [],
            'threats': [],
            'recommendations': []
        }
        
        # 如果模型已训练，添加预测
        try:
            if self.trained:
                success_prob = self.predict(startup_data)
                insights['success_probability'] = float(success_prob)
                
                # 基于预测结果添加更具体的建议
                if success_prob > 0.7:
                    insights['strengths'].append("模型预测您的创业项目具有较高的成功可能性")
                    insights['recommendations'].append("建议加大投资和团队扩张")
                elif success_prob > 0.4:
                    insights['opportunities'].append("项目有一定潜力，但仍需改进")
                    insights['recommendations'].append("建议聚焦核心业务，优化产品或服务")
                else:
                    insights['weaknesses'].append("当前模式下项目成功可能性较低")
                    insights['recommendations'].append("建议重新评估商业模式或目标市场")
        except:
            pass
        
        # 基于融资阶段添加建议
        if "未融资" in funding_stage:
            insights['weaknesses'].append("尚未获得外部资金支持")
            insights['recommendations'].append("建立完善的商业计划，准备天使轮融资")
        elif "天使轮" in funding_stage:
            insights['recommendations'].append("专注产品市场匹配，为A轮融资做准备")
        elif "A轮" in funding_stage or "Pre-A轮" in funding_stage:
            insights['recommendations'].append("关注用户增长和收入模式验证")
        
        # 基于团队规模添加建议
        if "1-5人" in team_size_text:
            insights['weaknesses'].append("团队规模较小，执行力可能受限")
            insights['recommendations'].append("招募关键岗位人才，建立核心团队")
        
        # 基于行业添加机会和威胁
        industry_opportunities = {
            "人工智能": "AI技术应用场景持续拓展，市场需求增长迅速",
            "医疗健康": "老龄化社会背景下，医疗健康服务需求增加",
            "教育科技": "在线教育和个性化学习需求持续增长",
            "金融科技": "金融服务数字化转型加速，创新支付和理财需求增加",
            "新能源": "碳中和政策推动，新能源技术和应用迎来发展机遇"
        }
        
        if industry in industry_opportunities:
            insights['opportunities'].append(industry_opportunities[industry])
        
        # 如果有公开数据和分析数据，添加更多洞察
        if public_data:
            # 处理公开数据中的信息，如竞争对手、市场规模等
            pass
        
        if analysis_data:
            # 根据数据分析结果添加更多洞察
            pass
        
        return insights
    
    def save_model(self, path="model.joblib"):
        """保存模型到文件"""
        model_data = {
            'model': self.model,
            'features': self.features,
            'industry_mapping': self.industry_mapping,
            'funding_mapping': self.funding_mapping,
            'revenue_mapping': self.revenue_mapping,
            'trained': self.trained
        }
        joblib.dump(model_data, path)
    
    def load_model(self, path="model.joblib"):
        """从文件加载模型"""
        if os.path.exists(path):
            model_data = joblib.load(path)
            self.model = model_data['model']
            self.features = model_data['features']
            self.industry_mapping = model_data['industry_mapping']
            self.funding_mapping = model_data['funding_mapping'] 
            self.revenue_mapping = model_data['revenue_mapping']
            self.trained = model_data['trained']
            return True
        return False