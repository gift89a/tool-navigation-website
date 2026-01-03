# 数据库配置指南

## 🎯 快速开始

### 选择数据库提供商

#### 方案一：Vercel Postgres（推荐）
```bash
# 1. 在 Vercel Dashboard 中创建 Postgres 数据库
# 2. 复制 DATABASE_URL
# 3. 在环境变量中设置
```

#### 方案二：Supabase（免费）
```bash
# 1. 访问 https://supabase.com
# 2. 创建新项目
# 3. 获取数据库连接字符串
```

#### 方案三：Railway（简单）
```bash
# 1. 访问 https://railway.app
# 2. 创建 PostgreSQL 数据库
# 3. 获取连接字符串
```

## 🔧 配置步骤

### 1. 设置环境变量

在 Vercel Dashboard 中添加环境变量：

```env
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
```

### 2. 运行数据库设置

```bash
# 本地开发
npm run db:setup

# 或者分步执行
npx prisma generate
npx prisma migrate deploy
npx prisma db seed
```

### 3. 更新 API 路由

项目已经配置了自动切换逻辑：
- 有数据库连接时：使用真实数据库
- 无数据库连接时：使用 mock 数据

### 4. 验证配置

```bash
# 检查数据库连接
npx prisma db pull

# 查看数据库内容
npx prisma studio
```

## 📊 数据库结构

### 主要表格

- **categories** - 工具分类
- **tools** - 工具信息
- **tags** - 标签
- **users** - 用户（可选）
- **user_favorites** - 用户收藏
- **tool_analytics** - 使用统计
- **ad_slots** - 广告位
- **reviews** - 评论评分

### 种子数据

运行 `npm run db:seed` 会创建：
- 6 个工具分类
- 18 个示例工具
- 相关标签和统计数据

## 🚀 部署后配置

### Vercel 部署

1. **添加环境变量**
   ```
   DATABASE_URL=your_database_url_here
   ```

2. **运行迁移**
   ```bash
   # 在 Vercel 项目设置中添加构建命令
   npm run build:with-prisma
   ```

3. **初始化数据**
   ```bash
   # 部署后在 Vercel Functions 中运行
   npx prisma migrate deploy
   npx prisma db seed
   ```

## 🔍 故障排除

### 常见问题

1. **连接超时**
   - 检查数据库服务是否运行
   - 验证连接字符串格式
   - 确认网络访问权限

2. **迁移失败**
   ```bash
   # 重置数据库（谨慎使用）
   npx prisma migrate reset
   
   # 强制推送 schema
   npx prisma db push
   ```

3. **种子数据失败**
   ```bash
   # 清空数据后重新种子
   npx prisma migrate reset --force
   npm run db:seed
   ```

### 调试命令

```bash
# 查看数据库状态
npx prisma migrate status

# 查看生成的 SQL
npx prisma migrate diff

# 重新生成客户端
npx prisma generate
```

## 📈 性能优化

### 索引建议

```sql
-- 为常用查询添加索引
CREATE INDEX idx_tools_category ON tools(category_id);
CREATE INDEX idx_tools_active ON tools(is_active);
CREATE INDEX idx_tools_usage ON tools(usage_count DESC);
CREATE INDEX idx_tools_rating ON tools(rating DESC);
```

### 连接池配置

```env
# 生产环境建议
DATABASE_URL="postgresql://user:pass@host:port/db?connection_limit=10&pool_timeout=20"
```

## 🔐 安全建议

1. **使用环境变量**
   - 永远不要在代码中硬编码数据库凭据
   - 使用不同环境的不同数据库

2. **连接安全**
   - 启用 SSL 连接 (`sslmode=require`)
   - 使用强密码
   - 限制数据库访问 IP

3. **权限控制**
   - 为应用创建专用数据库用户
   - 只授予必要的权限
   - 定期轮换密码

## 📞 获取帮助

如果遇到问题：

1. 检查 [Prisma 文档](https://www.prisma.io/docs)
2. 查看 [Next.js 数据库指南](https://nextjs.org/docs/app/building-your-application/data-fetching)
3. 参考各数据库提供商的文档
4. 在项目 Issues 中提问