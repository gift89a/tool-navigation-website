#!/usr/bin/env node

/**
 * 数据库设置脚本
 * 用于在配置数据库后初始化数据
 */

const { execSync } = require('child_process');
const path = require('path');

console.log('🚀 开始设置数据库...\n');

try {
  // 1. 生成 Prisma 客户端
  console.log('📦 生成 Prisma 客户端...');
  execSync('npx prisma generate', { stdio: 'inherit', cwd: process.cwd() });
  
  // 2. 运行数据库迁移
  console.log('\n🔄 运行数据库迁移...');
  execSync('npx prisma migrate deploy', { stdio: 'inherit', cwd: process.cwd() });
  
  // 3. 填充种子数据
  console.log('\n🌱 填充种子数据...');
  execSync('npx prisma db seed', { stdio: 'inherit', cwd: process.cwd() });
  
  console.log('\n✅ 数据库设置完成！');
  console.log('\n📋 接下来的步骤：');
  console.log('1. 更新 API 路由以使用真实数据库');
  console.log('2. 重新部署应用');
  console.log('3. 测试所有功能');
  
} catch (error) {
  console.error('\n❌ 数据库设置失败：', error.message);
  console.log('\n🔍 请检查：');
  console.log('1. DATABASE_URL 环境变量是否正确设置');
  console.log('2. 数据库服务是否正常运行');
  console.log('3. 网络连接是否正常');
  process.exit(1);
}