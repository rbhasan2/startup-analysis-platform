# Apache Superset 数据分析平台

## 简介
Apache Superset是一个现代化的数据探索和可视化平台，本项目中用于分析创业信息和公开信息的关联性，发现有价值的洞察。

## 功能
- 连接NocoBase数据库进行数据分析
- 创建交互式仪表盘展示创业分析结果
- 提供数据可视化和BI能力
- 支持自定义SQL查询以发现复杂关系
- 将分析结果写回NocoBase以供AI模型使用

## 如何启动
```bash
cd 数据分析/superset
docker-compose up -d
```

启动后，可以通过 http://localhost:8088 访问Superset管理界面，初始登录凭据：
- 用户名：admin
- 密码：admin

## 配置数据源
首次登录后，需要添加NocoBase的PostgreSQL数据库作为数据源：

1. 在Superset中选择"数据 > 数据库"
2. 点击"+ 数据库"按钮
3. 选择PostgreSQL连接类型
4. 配置以下连接信息：
   ```
   主机：db (使用docker网络中的服务名)
   端口：5432
   数据库名：nocobase
   用户名：nocobase
   密码：nocobase
   ```

## 创建数据分析流程
1. 创建数据集，关联创业信息和公开信息
2. 设计可视化图表展示数据关联性
3. 创建仪表盘整合多个可视化图表
4. 设置定期执行的SQL查询，将分析结果写回NocoBase

## 与NocoBase和AI模型集成
Superset的分析结果需要通过PostgreSQL写回NocoBase数据库中的`analysis_results`表：

```sql
INSERT INTO analysis_results (company_id, analysis_type, result_data, created_at)
SELECT 
  s.id, 
  'market_position', 
  json_build_object('market_share', market_share, 'competitors', competitors, 'growth_potential', growth_potential),
  current_timestamp
FROM startup_info s
JOIN public_info p ON s.company_name = p.company_name
WHERE [your analysis criteria]
```