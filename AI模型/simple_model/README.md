# 创业分析AI模型

## 简介
该模块提供基于机器学习的创业项目分析功能，能够评估创业项目的成功可能性，并提供针对性的洞察和建议。

## 功能
- 基于创业公司信息预测成功概率
- 生成SWOT分析（优势、劣势、机会、威胁）
- 提供针对性的创业建议
- 结合公开信息和数据分析结果，生成更全面的洞察

## API接口
模型提供以下REST API接口:

### 1. 健康检查
```
GET /health
```

### 2. 训练模型
```
POST /train
```

### 3. 预测公司成功概率
```
GET /predict/<company_id>
```

### 4. 获取公司AI洞察
```
GET /insights/<company_id>
```

## 部署方式
使用Docker容器部署:
```bash
cd AI模型/simple_model
docker build -t startup-ai-model .
docker run -d -p 5000:5000 \
  -e DB_HOST=db \
  -e DB_PORT=5432 \
  -e DB_NAME=nocobase \
  -e DB_USER=nocobase \
  -e DB_PASSWORD=nocobase \
  --name ai-model startup-ai-model
```

## 与其他模块集成
- 从NocoBase获取创业信息和公开数据
- 从Superset获取数据分析结果
- 将AI洞察结果写回NocoBase
- 小程序通过NocoBase的API间接获取AI洞察