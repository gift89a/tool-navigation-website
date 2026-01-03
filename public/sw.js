/**
 * Service Worker temporarily disabled for debugging
 * 临时禁用Service Worker进行调试
 */

console.log('Service Worker disabled for debugging');

// 如果已经注册了Service Worker，注销它
if ('serviceWorker' in navigator) {
  navigator.serviceWorker.getRegistrations().then(function(registrations) {
    for(let registration of registrations) {
      registration.unregister();
      console.log('Service Worker unregistered');
    }
  });
}