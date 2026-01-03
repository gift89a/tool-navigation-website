import { Metadata } from 'next';

export const metadata: Metadata = {
  title: '联系我们 - 工具导航',
  description: '联系我们获取支持或提供反馈',
};

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl">
      <h1 className="text-3xl font-bold mb-8">联系我们</h1>
      
      <div className="grid md:grid-cols-2 gap-8">
        <div>
          <h2 className="text-2xl font-semibold mb-4">联系方式</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">邮箱</h3>
              <p className="text-muted-foreground">contact@toolnavigation.com</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">工作时间</h3>
              <p className="text-muted-foreground">周一至周五 9:00 - 18:00 (UTC+8)</p>
            </div>
            <div>
              <h3 className="font-medium mb-2">响应时间</h3>
              <p className="text-muted-foreground">我们会在24小时内回复您的邮件</p>
            </div>
          </div>
        </div>

        <div>
          <h2 className="text-2xl font-semibold mb-4">常见问题</h2>
          <div className="space-y-4">
            <div>
              <h3 className="font-medium mb-2">如何提交新工具？</h3>
              <p className="text-muted-foreground text-sm">
                请发送邮件至我们的邮箱，包含工具名称、描述、链接和分类建议。
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">工具信息有误怎么办？</h3>
              <p className="text-muted-foreground text-sm">
                请联系我们并提供正确的信息，我们会及时更新。
              </p>
            </div>
            <div>
              <h3 className="font-medium mb-2">如何成为合作伙伴？</h3>
              <p className="text-muted-foreground text-sm">
                请通过邮件联系我们，详细说明合作意向和方案。
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-12 p-6 bg-muted rounded-lg">
        <h2 className="text-xl font-semibold mb-4">反馈建议</h2>
        <p className="text-muted-foreground">
          您的反馈对我们非常重要。如果您有任何建议或发现了问题，
          请不要犹豫与我们联系。我们会认真对待每一条反馈，
          并持续改进我们的服务。
        </p>
      </div>
    </div>
  );
}