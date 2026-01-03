import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '关于我们 - 工具导航',
  description: '了解我们的使命和团队，为您提供最优质的工具导航服务',
};

export default function AboutPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">关于我们</h1>
      
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">我们的使命</h2>
          <p className="text-lg text-muted-foreground mb-4">
            我们致力于为用户提供最全面、最实用的在线工具导航服务。通过精心筛选和分类，
            帮助用户快速找到所需的工具，提高工作效率。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">我们的特色</h2>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>精心分类的工具库，涵盖各个领域</li>
            <li>智能搜索功能，快速定位所需工具</li>
            <li>用户评价系统，帮助选择最佳工具</li>
            <li>收藏功能，个性化工具管理</li>
            <li>多语言支持，服务全球用户</li>
            <li>响应式设计，支持各种设备</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">联系我们</h2>
          <p className="text-muted-foreground">
            如果您有任何建议或问题，欢迎通过 
            <a href="/contact" className="text-primary hover:underline ml-1">
              联系页面
            </a> 
            与我们取得联系。
          </p>
        </section>
      </div>
    </div>
  );
}