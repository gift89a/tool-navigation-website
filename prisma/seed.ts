import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('开始种子数据...');

  // 创建分类
  const categories = await Promise.all([
    prisma.category.upsert({
      where: { slug: 'text-processing' },
      update: {},
      create: {
        name: '文本处理',
        description: '文本编辑、格式化、转换等工具',
        icon: '📝',
        color: '#3B82F6',
        slug: 'text-processing',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'image-processing' },
      update: {},
      create: {
        name: '图片处理',
        description: '图片编辑、压缩、格式转换等工具',
        icon: '🖼️',
        color: '#10B981',
        slug: 'image-processing',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'development-tools' },
      update: {},
      create: {
        name: '开发工具',
        description: '代码格式化、API测试、调试等开发工具',
        icon: '⚙️',
        color: '#8B5CF6',
        slug: 'development-tools',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'conversion-tools' },
      update: {},
      create: {
        name: '转换工具',
        description: '文件格式转换、单位换算等工具',
        icon: '🔄',
        color: '#F59E0B',
        slug: 'conversion-tools',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'generation-tools' },
      update: {},
      create: {
        name: '生成工具',
        description: 'QR码生成、密码生成、UUID生成等工具',
        icon: '✨',
        color: '#EF4444',
        slug: 'generation-tools',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'calculation-tools' },
      update: {},
      create: {
        name: '计算工具',
        description: '数学计算、统计分析、财务计算等工具',
        icon: '🧮',
        color: '#06B6D4',
        slug: 'calculation-tools',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'network-tools' },
      update: {},
      create: {
        name: '网络工具',
        description: 'IP查询、域名检测、网络测试等工具',
        icon: '🌐',
        color: '#84CC16',
        slug: 'network-tools',
      },
    }),
    prisma.category.upsert({
      where: { slug: 'design-tools' },
      update: {},
      create: {
        name: '设计工具',
        description: '颜色选择、字体预览、UI设计等工具',
        icon: '🎨',
        color: '#EC4899',
        slug: 'design-tools',
      },
    }),
  ]);

  console.log(`创建了 ${categories.length} 个分类`);

  // 创建标签
  const tags = await Promise.all([
    prisma.tag.upsert({
      where: { name: 'JSON' },
      update: {},
      create: { name: 'JSON' },
    }),
    prisma.tag.upsert({
      where: { name: 'Base64' },
      update: {},
      create: { name: 'Base64' },
    }),
    prisma.tag.upsert({
      where: { name: 'URL编码' },
      update: {},
      create: { name: 'URL编码' },
    }),
    prisma.tag.upsert({
      where: { name: 'MD5' },
      update: {},
      create: { name: 'MD5' },
    }),
    prisma.tag.upsert({
      where: { name: 'SHA' },
      update: {},
      create: { name: 'SHA' },
    }),
    prisma.tag.upsert({
      where: { name: '正则表达式' },
      update: {},
      create: { name: '正则表达式' },
    }),
    prisma.tag.upsert({
      where: { name: '颜色' },
      update: {},
      create: { name: '颜色' },
    }),
    prisma.tag.upsert({
      where: { name: 'QR码' },
      update: {},
      create: { name: 'QR码' },
    }),
    prisma.tag.upsert({
      where: { name: 'UUID' },
      update: {},
      create: { name: 'UUID' },
    }),
    prisma.tag.upsert({
      where: { name: '密码' },
      update: {},
      create: { name: '密码' },
    }),
  ]);

  console.log(`创建了 ${tags.length} 个标签`);

  // 创建工具
  const tools = [
    {
      name: 'JSON 格式化',
      description: '美化和验证JSON数据，支持压缩和展开',
      icon: '📋',
      url: '/tools/json-formatter',
      categoryId: categories[0].id, // 文本处理
      tags: ['JSON'],
      rating: 4.8,
      usageCount: 1250,
    },
    {
      name: 'Base64 编解码',
      description: '对文本进行Base64编码和解码',
      icon: '🔐',
      url: '/tools/base64',
      categoryId: categories[0].id, // 文本处理
      tags: ['Base64'],
      rating: 4.6,
      usageCount: 980,
    },
    {
      name: 'URL 编解码',
      description: 'URL编码和解码工具',
      icon: '🔗',
      url: '/tools/url-encode',
      categoryId: categories[0].id, // 文本处理
      tags: ['URL编码'],
      rating: 4.5,
      usageCount: 750,
    },
    {
      name: 'MD5 加密',
      description: '生成文本的MD5哈希值',
      icon: '🔒',
      url: '/tools/md5',
      categoryId: categories[0].id, // 文本处理
      tags: ['MD5'],
      rating: 4.7,
      usageCount: 1100,
    },
    {
      name: '图片压缩',
      description: '在线压缩图片，支持JPG、PNG、WebP格式',
      icon: '🗜️',
      url: '/tools/image-compress',
      categoryId: categories[1].id, // 图片处理
      tags: [],
      rating: 4.9,
      usageCount: 2100,
    },
    {
      name: '图片格式转换',
      description: '转换图片格式，支持多种常见格式',
      icon: '🔄',
      url: '/tools/image-convert',
      categoryId: categories[1].id, // 图片处理
      tags: [],
      rating: 4.6,
      usageCount: 890,
    },
    {
      name: 'API 测试工具',
      description: '测试REST API接口，支持各种HTTP方法',
      icon: '🔧',
      url: '/tools/api-tester',
      categoryId: categories[2].id, // 开发工具
      tags: [],
      rating: 4.8,
      usageCount: 1500,
    },
    {
      name: '正则表达式测试',
      description: '测试和验证正则表达式',
      icon: '🎯',
      url: '/tools/regex-tester',
      categoryId: categories[2].id, // 开发工具
      tags: ['正则表达式'],
      rating: 4.7,
      usageCount: 1200,
    },
    {
      name: 'PDF 转 Word',
      description: '将PDF文件转换为Word文档',
      icon: '📄',
      url: '/tools/pdf-to-word',
      categoryId: categories[3].id, // 转换工具
      tags: [],
      rating: 4.5,
      usageCount: 1800,
    },
    {
      name: '单位换算',
      description: '长度、重量、温度等单位换算',
      icon: '📏',
      url: '/tools/unit-converter',
      categoryId: categories[3].id, // 转换工具
      tags: [],
      rating: 4.4,
      usageCount: 650,
    },
    {
      name: 'QR码生成器',
      description: '生成各种类型的QR码',
      icon: '📱',
      url: '/tools/qr-generator',
      categoryId: categories[4].id, // 生成工具
      tags: ['QR码'],
      rating: 4.8,
      usageCount: 2200,
    },
    {
      name: 'UUID 生成器',
      description: '生成UUID/GUID标识符',
      icon: '🆔',
      url: '/tools/uuid-generator',
      categoryId: categories[4].id, // 生成工具
      tags: ['UUID'],
      rating: 4.6,
      usageCount: 800,
    },
    {
      name: '密码生成器',
      description: '生成安全的随机密码',
      icon: '🔑',
      url: '/tools/password-generator',
      categoryId: categories[4].id, // 生成工具
      tags: ['密码'],
      rating: 4.9,
      usageCount: 3200,
    },
    {
      name: '科学计算器',
      description: '高级数学计算器',
      icon: '🧮',
      url: '/tools/calculator',
      categoryId: categories[5].id, // 计算工具
      tags: [],
      rating: 4.5,
      usageCount: 1100,
    },
    {
      name: 'IP 地址查询',
      description: '查询IP地址的地理位置信息',
      icon: '🌍',
      url: '/tools/ip-lookup',
      categoryId: categories[6].id, // 网络工具
      tags: [],
      rating: 4.6,
      usageCount: 950,
    },
    {
      name: '域名 Whois 查询',
      description: '查询域名的注册信息',
      icon: '🔍',
      url: '/tools/whois',
      categoryId: categories[6].id, // 网络工具
      tags: [],
      rating: 4.4,
      usageCount: 720,
    },
    {
      name: '颜色选择器',
      description: '选择和转换颜色格式',
      icon: '🎨',
      url: '/tools/color-picker',
      categoryId: categories[7].id, // 设计工具
      tags: ['颜色'],
      rating: 4.7,
      usageCount: 1400,
    },
    {
      name: '渐变生成器',
      description: '生成CSS渐变代码',
      icon: '🌈',
      url: '/tools/gradient-generator',
      categoryId: categories[7].id, // 设计工具
      tags: ['颜色'],
      rating: 4.8,
      usageCount: 1600,
    },
  ];

  for (const toolData of tools) {
    const { tags: tagNames, ...toolInfo } = toolData;
    
    const tool = await prisma.tool.upsert({
      where: { name: toolData.name },
      update: {},
      create: {
        ...toolInfo,
        tags: {
          connect: tagNames.map(tagName => ({ name: tagName })),
        },
      },
    });

    console.log(`创建工具: ${tool.name}`);
  }

  // 创建广告位
  await prisma.adSlot.upsert({
    where: { name: 'header-banner' },
    update: {},
    create: {
      name: 'header-banner',
      position: 'header',
      content: '<div class="bg-blue-100 p-4 text-center">顶部横幅广告位</div>',
      isActive: false,
    },
  });

  await prisma.adSlot.upsert({
    where: { name: 'sidebar-ad' },
    update: {},
    create: {
      name: 'sidebar-ad',
      position: 'sidebar',
      content: '<div class="bg-green-100 p-4 text-center">侧边栏广告位</div>',
      isActive: false,
    },
  });

  console.log('种子数据创建完成！');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });