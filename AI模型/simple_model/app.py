from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import numpy as np
import os
import json
import psycopg2
from model import StartupAnalysisModel
import logging

# 配置日志
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)
logger = logging.getLogger(__name__)

app = Flask(__name__)
# 添加CORS支持
CORS(app)

# 创建模型实例
model = StartupAnalysisModel()

# 尝试加载已有模型
if not model.load_model():
    logger.info("没有找到预训练模型，将在首次请求时训练")

# 数据库配置
DB_CONFIG = {
    'host': os.environ.get('DB_HOST', 'db'),
    'port': os.environ.get('DB_PORT', '5432'),
    'database': os.environ.get('DB_NAME', 'nocobase'),
    'user': os.environ.get('DB_USER', 'nocobase'),
    'password': os.environ.get('DB_PASSWORD', 'nocobase')
}

def get_db_connection():
    """创建数据库连接"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        logger.error(f"数据库连接失败: {str(e)}")
        return None

def fetch_startup_data(company_id=None):
    """从数据库获取创业信息数据"""
    conn = get_db_connection()
    if not conn:
        return pd.DataFrame()
        
    try:
        query = "SELECT * FROM startup_info"
        if company_id:
            query += f" WHERE id = {company_id}"
        
        # 读取数据
        df = pd.read_sql(query, conn)
        return df
    except Exception as e:
        logger.error(f"获取创业数据失败: {str(e)}")
        return pd.DataFrame()
    finally:
        conn.close()

def fetch_public_data(company_name=None):
    """从数据库获取公开信息数据"""
    conn = get_db_connection()
    if not conn:
        return pd.DataFrame()
        
    try:
        query = "SELECT * FROM public_info"
        if company_name:
            query += f" WHERE company_name = '{company_name}'"
        
        # 读取数据
        df = pd.read_sql(query, conn)
        return df
    except Exception as e:
        logger.error(f"获取公开数据失败: {str(e)}")
        return pd.DataFrame()
    finally:
        conn.close()

def fetch_analysis_data(company_id=None):
    """从数据库获取分析结果数据"""
    conn = get_db_connection()
    if not conn:
        return pd.DataFrame()
        
    try:
        query = "SELECT * FROM analysis_results"
        if company_id:
            query += f" WHERE company_id = {company_id}"
        
        # 读取数据
        df = pd.read_sql(query, conn)
        return df
    except Exception as e:
        logger.error(f"获取分析数据失败: {str(e)}")
        return pd.DataFrame()
    finally:
        conn.close()

def save_insights(company_id, insights):
    """保存AI洞察结果到数据库"""
    conn = get_db_connection()
    if not conn:
        return False
        
    try:
        cursor = conn.cursor()
        
        # 检查是否已存在该公司的洞察
        cursor.execute("SELECT id FROM ai_insights WHERE company_id = %s", (company_id,))
        result = cursor.fetchone()
        
        if result:
            # 更新现有记录
            cursor.execute(
                "UPDATE ai_insights SET insights = %s, updated_at = CURRENT_TIMESTAMP WHERE company_id = %s",
                (json.dumps(insights), company_id)
            )
        else:
            # 创建新记录
            cursor.execute(
                "INSERT INTO ai_insights (company_id, insights, created_at) VALUES (%s, %s, CURRENT_TIMESTAMP)",
                (company_id, json.dumps(insights))
            )
            
        conn.commit()
        return True
    except Exception as e:
        logger.error(f"保存洞察失败: {str(e)}")
        return False
    finally:
        conn.close()

@app.route('/health', methods=['GET'])
def health_check():
    """健康检查接口"""
    return jsonify({'status': 'ok'}), 200

@app.route('/train', methods=['POST'])
def train_model():
    """训练模型接口"""
    try:
        # 从数据库获取训练数据
        df = fetch_startup_data()
        
        if df.empty:
            return jsonify({
                'success': False,
                'message': '没有可用的训练数据'
            }), 400
            
        # 添加目标变量（这里简单地使用一些规则来定义"成功"）
        df['success'] = np.where(
            (df['revenue_range'].isin(['500-1000万', '1000万以上'])) | 
            (df['funding_stage'].isin(['C轮及以上', '已上市'])),
            1, 0
        )
        
        # 训练模型
        result = model.train(df)
        
        # 保存模型
        model.save_model()
        
        return jsonify({
            'success': True,
            'message': '模型训练成功',
            'result': result
        })
    except Exception as e:
        logger.error(f"训练模型失败: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'训练失败: {str(e)}'
        }), 500

@app.route('/predict/<int:company_id>', methods=['GET'])
def predict_company(company_id):
    """预测单个公司的成功概率"""
    try:
        # 获取公司数据
        df = fetch_startup_data(company_id)
        
        if df.empty:
            return jsonify({
                'success': False,
                'message': f'未找到ID为{company_id}的公司数据'
            }), 404
        
        # 如果模型未训练，先训练模型
        if not model.trained:
            # 获取所有公司数据进行训练
            train_df = fetch_startup_data()
            
            # 添加目标变量
            train_df['success'] = np.where(
                (train_df['revenue_range'].isin(['500-1000万', '1000万以上'])) | 
                (train_df['funding_stage'].isin(['C轮及以上', '已上市'])),
                1, 0
            )
            
            # 训练模型
            model.train(train_df)
            model.save_model()
            
        # 预测成功概率
        startup_data = df.iloc[0].to_dict()
        success_prob = model.predict(startup_data)
        
        return jsonify({
            'success': True,
            'company_id': company_id,
            'success_probability': float(success_prob)
        })
    except Exception as e:
        logger.error(f"预测失败: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'预测失败: {str(e)}'
        }), 500

@app.route('/insights/<int:company_id>', methods=['GET'])
def get_insights(company_id):
    """生成公司的AI洞察"""
    try:
        # 获取公司数据
        startup_df = fetch_startup_data(company_id)
        
        if startup_df.empty:
            return jsonify({
                'success': False,
                'message': f'未找到ID为{company_id}的公司数据'
            }), 404
        
        startup_data = startup_df.iloc[0].to_dict()
        company_name = startup_data.get('company_name', '')
        
        # 获取相关的公开数据
        public_data = None
        if company_name:
            public_df = fetch_public_data(company_name)
            if not public_df.empty:
                public_data = public_df.to_dict('records')
        
        # 获取分析结果数据
        analysis_data = None
        analysis_df = fetch_analysis_data(company_id)
        if not analysis_df.empty:
            analysis_data = analysis_df.to_dict('records')
        
        # 如果模型未训练，先训练模型
        if not model.trained:
            # 尝试训练模型
            try:
                train_df = fetch_startup_data()
                train_df['success'] = np.where(
                    (train_df['revenue_range'].isin(['500-1000万', '1000万以上'])) | 
                    (train_df['funding_stage'].isin(['C轮及以上', '已上市'])),
                    1, 0
                )
                model.train(train_df)
                model.save_model()
            except:
                # 训练失败仍继续，因为可以生成基础洞察
                pass
        
        # 生成洞察
        insights = model.generate_insights(startup_data, public_data, analysis_data)
        
        # 保存洞察到数据库
        save_insights(company_id, insights)
        
        return jsonify({
            'success': True,
            'company_id': company_id,
            'company_name': company_name,
            'insights': insights
        })
    except Exception as e:
        logger.error(f"生成洞察失败: {str(e)}")
        return jsonify({
            'success': False,
            'message': f'生成洞察失败: {str(e)}'
        }), 500

if __name__ == '__main__':
    app.run(host='0.0.0.0', port=5000, debug=True)