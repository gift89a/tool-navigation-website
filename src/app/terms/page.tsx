import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '服务条款 - 工具导航',
  description: '使用我们服务前请仔细阅读服务条款',
};

export default function TermsPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">服务条款</h1>
      
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-sm text-muted-foreground mb-8">
          最后更新时间：2024年1月
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">接受条款</h2>
          <p className="text-muted-foreground mb-4">
            通过访问和使用本网站，您同意遵守本服务条款。
            如果您不同意这些条款，请不要使用我们的服务。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">服务描述</h2>
          <p className="text-muted-foreground mb-4">
            我们提供在线工具导航服务，包括但不限于：
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>工具分类和展示</li>
            <li>搜索和筛选功能</li>
            <li>用户评价和收藏</li>
            <li>相关推荐服务</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">用户责任</h2>
          <p className="text-muted-foreground mb-4">
            使用我们的服务时，您同意：
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>提供准确的信息</li>
            <li>不进行恶意行为</li>
            <li>尊重其他用户</li>
            <li>遵守相关法律法规</li>
            <li>不滥用我们的服务</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">知识产权</h2>
          <p className="text-muted-foreground mb-4">
            本网站的内容、设计、代码等均受知识产权法保护。
            未经许可，不得复制、修改或分发。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">免责声明</h2>
          <p className="text-muted-foreground mb-4">
            我们努力提供准确的信息，但不保证：
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>服务的持续可用性</li>
            <li>信息的完全准确性</li>
            <li>第三方工具的质量</li>
            <li>服务不会中断</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">服务变更</h2>
          <p className="text-muted-foreground mb-4">
            我们保留随时修改或终止服务的权利，
            重要变更会提前通知用户。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">争议解决</h2>
          <p className="text-muted-foreground mb-4">
            因使用本服务产生的争议，应通过友好协商解决。
            如协商不成，可通过法律途径解决。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">联系我们</h2>
          <p className="text-muted-foreground">
            如果您对本服务条款有任何疑问，请通过 
            <a href="/contact" className="text-primary hover:underline ml-1">
              联系页面
            </a> 
            与我们联系。
          </p>
        </section>
      </div>
    </div>
  );
}