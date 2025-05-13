# NocoBase 后端服务

## 简介
NocoBase 作为本项目的核心后端，负责数据存储、API提供和业务流程管理。

## 功能
- 存储创业信息数据
- 存储爬虫爬取的公开信息
- 提供API接口给小程序前端
- 与数据分析模块集成
- 为AI模型提供训练和应用数据

## 如何启动
```bash
cd 后端服务/nocobase
docker-compose up -d
```

启动后，可以通过 http://localhost:8000 访问NocoBase管理界面，初始管理员账号密码为：
- 用户名：admin@nocobase.com
- 密码：admin123

## 配置说明
在首次启动并登录管理界面后，需要配置以下数据模型：

1. 创业信息表 - startup_info
2. 公开信息表 - public_info
3. 数据分析结果表 - analysis_results
4. AI模型输出表 - ai_insights

## 自定义插件
在 `my-plugin` 文件夹中可以开发自定义插件，以扩展NocoBase的功能，如：
- 创业信息匹配插件
- 爬虫触发接口
- 数据分析集成
- AI模型集成