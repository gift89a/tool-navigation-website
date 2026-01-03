# 部署指南

## Vercel 部署步骤

### 1. 准备工作

确保你的项目已经提交到 Git 仓库：

```bash
git status  # 检查状态
git add .   # 添加所有文件
git commit -m "Ready for deployment"  # 提交更改
```

### 2. 推送到 GitHub

如果还没有 GitHub 仓库，请先创建一个：

1. 访问 [GitHub](https://github.com) 并创建新仓库
2. 添加远程仓库并推送代码：

```bash
git remote add origin https://github.com/your-username/your-repo-name.git
git branch -M main
git push -u origin main
```

### 3. 部署到 Vercel

#### 方法一：通过 Vercel Dashboard（推荐）

1. 访问 [Vercel Dashboard](https://vercel.com/dashboard)
2. 点击 "New Project"
3. 选择你的 GitHub 仓库
4. 配置项目设置：
   - **Framework Preset**: Next.js
   - **Build Command**: `npm run build`
   - **Output Directory**: `.next`
   - **Install Command**: `npm install`

5. 配置环境变量（见下方）
6. 点击 "Deploy"

#### 方法二：通过 Vercel CLI

```bash
# 安装 Vercel CLI
npm i -g vercel

# 登录 Vercel
vercel login

# 部署项目
vercel

# 部署到生产环境
vercel --prod
```

### 4. 环境变量配置

在 Vercel Dashboard 的项目设置中添加以下环境变量：

#### 必需的环境变量

```
NODE_ENV=production
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-random-secret-key-here
```

#### 数据库配置（如果使用真实数据库）

```
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
```

#### 可选的环境变量

```
GOOGLE_ANALYTICS_ID=GA-XXXXXXXXX
VERCEL_ANALYTICS_ID=your-vercel-analytics-id
```

### 💡 Vercel 计划说明

**免费计划限制**：
- ✅ 支持 Next.js 部署
- ✅ 自动 HTTPS 和 CDN
- ✅ 无限带宽
- ❌ 不支持多区域部署
- ❌ 函数执行时间限制为 10 秒

**Pro 计划优势**：
- ✅ 多区域部署
- ✅ 更长的函数执行时间
- ✅ 更多并发连接
- ✅ 高级分析功能

对于大多数项目，免费计划已经足够使用。

### 5. 数据库设置

#### 使用 Vercel Postgres（推荐）

1. 在 Vercel Dashboard 中，进入你的项目
2. 点击 "Storage" 标签
3. 创建 Postgres 数据库
4. 复制 `DATABASE_URL` 到环境变量

#### 使用 Supabase

1. 访问 [Supabase](https://supabase.com)
2. 创建新项目
3. 获取数据库连接字符串
4. 添加到环境变量

#### 运行数据库迁移

```bash
# 生成 Prisma 客户端
npx prisma generate

# 运行迁移
npx prisma migrate deploy

# 填充种子数据
npx prisma db seed
```

### 6. 域名配置

1. 在 Vercel Dashboard 中进入项目设置
2. 点击 "Domains" 标签
3. 添加自定义域名（可选）
4. 配置 DNS 记录

### 7. 性能优化

项目已包含以下优化配置：

- ✅ 自动代码分割
- ✅ 图片优化和懒加载
- ✅ 静态资源缓存
- ✅ Service Worker 离线支持
- ✅ 压缩和最小化
- ✅ CDN 分发

### 8. 监控和分析

- **Vercel Analytics**: 自动启用
- **Performance Monitoring**: 内置性能监控
- **Error Tracking**: 查看 Vercel Dashboard 的 Functions 日志

## 故障排除

### 构建失败

1. 检查 TypeScript 错误：
```bash
npm run build
```

2. 检查 ESLint 错误：
```bash
npm run lint
```

3. 运行测试：
```bash
npm test
```

### 多区域部署错误

如果看到 "Deploying Serverless Functions to multiple regions is restricted to the Pro and Enterprise plans" 错误：

1. 这是正常的，免费计划不支持多区域部署
2. 项目会自动部署到默认区域（通常是美国）
3. 如需多区域支持，可升级到 Pro 计划

### 运行时错误

1. 检查环境变量是否正确配置
2. 查看 Vercel Dashboard 的 Functions 日志
3. 确保数据库连接正常

### 数据库连接问题

1. 验证 `DATABASE_URL` 格式正确
2. 确保数据库服务器允许外部连接
3. 检查 SSL 配置

## 部署后检查清单

- [ ] 网站可以正常访问
- [ ] 所有页面加载正常
- [ ] 搜索功能工作正常
- [ ] 主题切换功能正常
- [ ] 多语言切换正常
- [ ] 收藏功能正常
- [ ] 管理后台可访问
- [ ] SEO 元数据正确
- [ ] 移动端响应式正常
- [ ] 性能指标良好

## 持续部署

每次推送到 `main` 分支时，Vercel 会自动重新部署：

```bash
git add .
git commit -m "Update features"
git push origin main
```

## 支持

如果遇到问题，可以：

1. 查看 [Vercel 文档](https://vercel.com/docs)
2. 检查 [Next.js 部署指南](https://nextjs.org/docs/deployment)
3. 查看项目的 GitHub Issues

## 最新修复记录

### 2024年1月3日 - 生产环境问题修复

✅ **已修复的问题：**

1. **API URL 配置问题**
   - 修复了 API 客户端硬编码 localhost 的问题
   - 现在会自动使用正确的生产环境 URL
   - 添加了 `NEXT_PUBLIC_APP_URL` 环境变量支持

2. **缺失页面 404 错误**
   - 添加了 `/about` - 关于我们页面
   - 添加了 `/contact` - 联系我们页面  
   - 添加了 `/privacy` - 隐私政策页面
   - 添加了 `/terms` - 服务条款页面

3. **JavaScript 运行时错误**
   - 修复了评论组件中 `Cannot read properties of undefined (reading 'avatar')` 错误
   - 改进了数据结构的容错处理

4. **CORS 跨域问题**
   - 为所有 API 路由添加了 CORS 头
   - 确保生产环境下 API 调用正常工作

**部署后验证步骤：**

1. 访问 https://tool-navigation-website.vercel.app/
2. 测试主要功能：
   - ✅ 首页加载
   - ✅ 分类浏览
   - ✅ 搜索功能
   - ✅ 工具详情页
   - ✅ 新增页面（关于我们、联系我们等）
3. 检查浏览器控制台无错误
4. 验证移动端响应式设计

**环境变量更新：**

确保在 Vercel 项目设置中添加：
```
NEXT_PUBLIC_APP_URL=https://your-domain.vercel.app
```

这个修复确保了网站在生产环境下完全正常工作，无需依赖本地开发服务器。