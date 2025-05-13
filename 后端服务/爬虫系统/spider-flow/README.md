# Spider-Flow 爬虫系统

## 简介
Spider-Flow是一个高度可定制的爬虫平台，本项目中用于爬取创业公司的公开信息，如公司介绍、新闻、财务状况等。

## 功能
- 可视化配置爬虫流程
- 定时执行爬虫任务
- 数据自动处理和格式化
- 通过API接口将数据发送至NocoBase

## 如何启动
```bash
cd 爬虫系统/spider-flow
docker-compose up -d
```

启动后，可以通过 http://localhost:8889 访问Spider-Flow管理界面。

## 爬虫配置说明
1. 登录Spider-Flow后，创建新的爬虫任务
2. 配置爬取目标（创业信息相关网站）
3. 设置数据提取规则
4. 配置数据处理流程
5. 设置回调接口，将数据发送至NocoBase

## 与NocoBase集成
在Spider-Flow中，配置以下HTTP请求节点，将爬取的数据发送到NocoBase:

```
POST http://app:80/api/public_info
Content-Type: application/json

{
  "company_name": "${company_name}",
  "source": "${source}",
  "content": "${content}",
  "crawl_time": "${now()}"
}
```

## 自动触发机制
当小程序端录入新的创业信息后，NocoBase将通过API调用触发对应的爬虫任务：

```
GET http://spider-flow:8080/api/trigger?name=company_info&param_company=${company_name}
```