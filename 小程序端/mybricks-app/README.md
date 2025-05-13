# MyBricks 小程序端

## 简介
MyBricks小程序作为创业分析平台的前端入口，提供用户友好的界面，让创业者能够方便地录入创业信息、查看分析结果和AI洞察。

## 功能
- 用户注册与登录
- 创业信息录入表单
- 数据分析结果展示
- AI洞察与建议展示
- 用户个人中心

## 开发说明
本小程序使用MyBricks低代码平台开发，主要页面包括：

1. 首页 - 展示平台概览和最新分析洞察
2. 创业信息 - 创业信息录入表单
3. 分析 - 展示数据分析结果
4. AI洞察 - 展示AI模型生成的创业建议
5. 我的 - 用户中心和个人设置

## 与NocoBase后端集成
小程序通过RESTful API与NocoBase后端通信，主要接口包括：

- 创业信息提交: `POST /api/startup_info`
- 获取分析结果: `GET /api/analysis_results?company_id={id}`
- 获取AI洞察: `GET /api/ai_insights?company_id={id}`

## 信息录入与爬虫触发
当用户在小程序中提交创业信息后，系统会自动触发以下流程：

1. 将创业信息保存到NocoBase
2. NocoBase通过API触发Spider-Flow爬虫任务
3. 爬虫收集相关公开信息并保存到NocoBase
4. Superset分析数据并生成分析结果
5. AI模型基于分析结果生成洞察
6. 小程序展示最终的分析结果和洞察

## 开发环境设置
1. 安装微信开发者工具
2. 导入项目目录
3. 在project.config.json中配置appid
4. 开发调试