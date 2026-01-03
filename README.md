# 工具导航网站

一个现代化的在线工具导航平台，提供各类实用工具的分类导航和在线使用功能。

## 技术栈

- **前端框架**: Next.js 14 (App Router)
- **编程语言**: TypeScript
- **样式框架**: Tailwind CSS
- **UI组件**: Headless UI + 自定义组件
- **状态管理**: Zustand
- **数据库**: PostgreSQL
- **ORM**: Prisma
- **部署**: Vercel

## 开发环境设置

1. 克隆项目
```bash
git clone <repository-url>
cd tool-navigation-website
```

2. 安装依赖
```bash
npm install
```

3. 配置环境变量
```bash
cp .env.example .env.local
# 编辑 .env.local 文件，填入正确的配置
```

4. 启动开发服务器
```bash
npm run dev
```

访问 [http://localhost:3000](http://localhost:3000) 查看应用。

## 部署到 Vercel

### 方法一：通过 Vercel CLI

1. 安装 Vercel CLI
```bash
npm i -g vercel
```

2. 登录 Vercel
```bash
vercel login
```

3. 部署项目
```bash
vercel
```

### 方法二：通过 GitHub 集成

1. 将代码推送到 GitHub
```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. 在 [Vercel Dashboard](https://vercel.com/dashboard) 中：
   - 点击 "New Project"
   - 选择你的 GitHub 仓库
   - 配置环境变量
   - 点击 "Deploy"

### 环境变量配置

在 Vercel Dashboard 中配置以下环境变量：

```
DATABASE_URL=postgresql://username:password@host:port/database?sslmode=require
NEXTAUTH_URL=https://your-domain.vercel.app
NEXTAUTH_SECRET=your-nextauth-secret-key
```

### 数据库设置

1. 创建 PostgreSQL 数据库（推荐使用 Vercel Postgres 或 Supabase）
2. 运行数据库迁移：
```bash
npx prisma migrate deploy
```
3. 填充种子数据：
```bash
npx prisma db seed
```

## 可用脚本

- `npm run dev` - 启动开发服务器
- `npm run build` - 构建生产版本
- `npm run start` - 启动生产服务器
- `npm run lint` - 运行ESLint检查
- `npm run lint:fix` - 自动修复ESLint错误
- `npm run format` - 格式化代码
- `npm run test` - 运行测试
- `npm run test:watch` - 监听模式运行测试
- `npm run test:coverage` - 运行测试并生成覆盖率报告

## 项目结构

```
src/
├── app/                 # Next.js App Router
├── components/          # 可复用组件
├── lib/                # 工具函数和配置
├── hooks/              # 自定义React Hooks
├── store/              # 状态管理
├── types/              # TypeScript类型定义
└── utils/              # 工具函数
```

## 功能特性

- 🎨 现代化UI设计
- 📱 响应式布局
- 🌙 深色/浅色主题切换
- 🌍 多语言支持
- 🔍 智能搜索功能
- ⭐ 工具收藏功能
- 📊 使用统计分析
- 🚀 SEO优化
- 📱 PWA支持

## 贡献指南

1. Fork 项目
2. 创建功能分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 打开 Pull Request

## 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情。