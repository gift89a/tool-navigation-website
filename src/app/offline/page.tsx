'use client';

import { Layout } from '@/components/layout/layout';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';

export default function OfflinePage() {
  return (
    <Layout>
      <div className="container mx-auto px-4 py-16">
        <div className="max-w-2xl mx-auto text-center">
          {/* 离线图标 */}
          <div className="text-8xl mb-8">📱</div>
          
          {/* 标题 */}
          <h1 className="text-4xl font-bold text-gray-900 dark:text-gray-100 mb-4">
            离线模式
          </h1>
          
          {/* 描述 */}
          <p className="text-xl text-gray-600 dark:text-gray-400 mb-8">
            您当前处于离线状态。部分功能可能不可用，但您仍可以浏览已缓存的内容。
          </p>
          
          {/* 功能卡片 */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            <Card className="p-6">
              <div className="text-3xl mb-4">✅</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                可用功能
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• 浏览已缓存的工具</li>
                <li>• 查看工具分类</li>
                <li>• 搜索本地数据</li>
                <li>• 管理收藏夹</li>
              </ul>
            </Card>
            
            <Card className="p-6">
              <div className="text-3xl mb-4">⏳</div>
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2">
                待同步功能
              </h3>
              <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                <li>• 获取最新工具</li>
                <li>• 提交评分评论</li>
                <li>• 同步收藏状态</li>
                <li>• 查看实时统计</li>
              </ul>
            </Card>
          </div>
          
          {/* 操作按钮 */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              onClick={() => window.location.reload()}
              size="lg"
              className="px-8"
            >
              🔄 重新连接
            </Button>
            
            <Button
              onClick={() => window.history.back()}
              variant="outline"
              size="lg"
              className="px-8"
            >
              ← 返回上页
            </Button>
          </div>
          
          {/* 提示信息 */}
          <div className="mt-12 p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
            <div className="flex items-center justify-center space-x-2 text-blue-600 dark:text-blue-400">
              <span className="text-lg">💡</span>
              <span className="text-sm font-medium">
                网络恢复后，您的操作将自动同步
              </span>
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}