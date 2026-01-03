import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '隐私政策 - 工具导航',
  description: '了解我们如何收集、使用和保护您的个人信息',
};

export default function PrivacyPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">隐私政策</h1>
      
      <div className="prose prose-gray dark:prose-invert max-w-none">
        <p className="text-sm text-muted-foreground mb-8">
          最后更新时间：2024年1月
        </p>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">信息收集</h2>
          <p className="text-muted-foreground mb-4">
            我们可能收集以下类型的信息：
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>您主动提供的信息（如收藏的工具、评价等）</li>
            <li>自动收集的使用信息（如访问页面、点击行为等）</li>
            <li>设备信息（如浏览器类型、操作系统等）</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">信息使用</h2>
          <p className="text-muted-foreground mb-4">
            我们使用收集的信息用于：
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>提供和改进我们的服务</li>
            <li>个性化用户体验</li>
            <li>分析网站使用情况</li>
            <li>发送重要通知</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">信息保护</h2>
          <p className="text-muted-foreground mb-4">
            我们采取适当的安全措施来保护您的个人信息：
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>使用加密技术传输敏感信息</li>
            <li>限制员工访问个人信息</li>
            <li>定期审查安全措施</li>
            <li>遵守相关法律法规</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Cookie 使用</h2>
          <p className="text-muted-foreground mb-4">
            我们使用 Cookie 来：
          </p>
          <ul className="list-disc list-inside space-y-2 text-muted-foreground">
            <li>记住您的偏好设置</li>
            <li>分析网站流量</li>
            <li>提供个性化内容</li>
            <li>改善用户体验</li>
          </ul>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">第三方服务</h2>
          <p className="text-muted-foreground mb-4">
            我们可能使用第三方服务来提供更好的用户体验，
            这些服务有自己的隐私政策。
          </p>
        </section>

        <section className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">联系我们</h2>
          <p className="text-muted-foreground">
            如果您对本隐私政策有任何疑问，请通过 
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