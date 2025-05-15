/**
 * 创业分析平台 - 图片预加载检查
 * 此脚本会在页面加载前检查图片路径并预加载关键图片
 */

(function() {
  console.log('🔍 初始化图片预加载检查...');
  
  // 检测当前页面类型
  function getBaseUrl() {
    return window.location.pathname.includes('/pages/') ? '../..' : '.';
  }
  
  // 预加载核心图片资源
  function preloadCoreImages() {
    const baseUrl = getBaseUrl();
    const timestamp = new Date().getTime();
    
    // 核心图片列表
    const coreImages = [
      'logo.png',
      'logo-white.png',
      'avatar-default.png',
      'banner-illustration.png',
      'ai-avatar.png',
      'empty-data.svg'
    ];
    
    console.log(`预加载 ${coreImages.length} 个核心图片...`);
    
    // 创建图片预加载器
    coreImages.forEach(function(img) {
      const image = new Image();
      // 添加时间戳防止缓存
      image.src = `${baseUrl}/images/${img}?t=${timestamp}`;
      
      // 添加加载事件处理
      image.onload = function() {
        console.log(`✓ 预加载成功: ${img}`);
      };
      
      image.onerror = function() {
        console.warn(`✗ 预加载失败: ${img}`);
        
        // 尝试替代格式
        const altFormat = img.endsWith('.png') ? 
          img.replace('.png', '.svg') : 
          img.replace('.svg', '.png');
          
        console.log(`  尝试加载替代格式: ${altFormat}`);
        const altImage = new Image();
        altImage.src = `${baseUrl}/images/${altFormat}?t=${timestamp}`;
      };
    });
  }
  
  // 设置全局错误处理函数
  function setupGlobalErrorHandler() {
    window.addEventListener('error', function(event) {
      // 仅处理图片加载错误
      if (event.target.tagName === 'IMG') {
        const img = event.target;
        const src = img.src;
        console.warn(`⚠️ 图片加载错误: ${src}`);
        
        // 阻止默认错误处理
        event.preventDefault();
        
        // 尝试修复图片路径
        if (window.fixAllImages && typeof window.fixAllImages === 'function') {
          console.log('尝试自动修复图片...');
          window.fixAllImages(img);
        }
      }
    }, true);
  }
  
  // 在页面加载前执行
  document.addEventListener('DOMContentLoaded', function() {
    preloadCoreImages();
    setupGlobalErrorHandler();
    
    console.log('✅ 图片预加载检查完成');
  });
  
  // 导出全局接口
  window.imagePreloader = {
    preloadImages: preloadCoreImages
  };
})();
