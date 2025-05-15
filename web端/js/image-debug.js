/**
 * 创业分析平台 - 图片加载测试工具
 * 这个工具用于检查网页上的所有图片是否正确加载
 */

(function() {
  // 检查所有图片元素
  function checkAllImages() {
    console.log('%c图片加载状态检查工具', 'color: #4a8af4; font-weight: bold; font-size: 16px;');
    console.log('----------------------------------------');
    
    // 获取所有图片元素
    const images = document.querySelectorAll('img');
    console.log(`页面共有 ${images.length} 张图片`);
    
    let loadedCount = 0;
    let errorCount = 0;
    const errorImages = [];
    
    // 检查每个图片的加载状态
    images.forEach((img, index) => {
      const src = img.getAttribute('src');
      const alt = img.getAttribute('alt') || '无说明';
      const isLoaded = img.complete && img.naturalHeight !== 0;
      
      if (isLoaded) {
        loadedCount++;
        console.log(`✅ 图片 #${index + 1} 加载正常: "${alt}"`, img);
      } else {
        errorCount++;
        errorImages.push({ src, alt, element: img });
        console.log(`❌ 图片 #${index + 1} 加载失败: "${alt}", 路径: ${src}`, img);
      }
    });
    
    // 检查CSS背景图片(这个比较复杂，只能检查内联样式)
    const elementsWithBgImage = document.querySelectorAll('[style*="background-image"]');
    console.log(`页面共有 ${elementsWithBgImage.length} 个带有背景图片的元素`);
    
    // 显示统计结果
    console.log('----------------------------------------');
    console.log(`总图片数: ${images.length}, 加载成功: ${loadedCount}, 加载失败: ${errorCount}`);
    
    if (errorCount > 0) {
      console.log('%c发现加载失败的图片，请修复:', 'color: #f44336; font-weight: bold;');
      errorImages.forEach((img, idx) => {
        console.log(`${idx + 1}. "${img.alt}" - ${img.src}`);
        
        // 尝试找出问题原因
        const url = new URL(img.src, window.location.href);
        console.log('   完整URL:', url.href);
        
        // 检查相对路径问题
        if (url.pathname.includes('//')) {
          console.log('   ⚠️ URL路径包含重复的斜杠，可能导致路径错误');
        }
        
        if (img.element.style.display === 'none' || 
            getComputedStyle(img.element).display === 'none') {
          console.log('   ⚠️ 图片元素被隐藏，可能是预期行为');
        }
      });
    } else {
      console.log('%c✨ 太好了! 所有图片加载正常!', 'color: #4caf50; font-weight: bold;');
    }
    
    // 返回统计信息
    return {
      total: images.length,
      loaded: loadedCount,
      failed: errorCount,
      errorList: errorImages
    };
  }
  
  // 修复错误的图片
  function fixErrorImages() {
    const result = checkAllImages();
    if (result.failed > 0) {
      console.log('%c尝试修复失败的图片...', 'color: #ff9800; font-weight: bold;');
      
      result.errorList.forEach(img => {
        const element = img.element;
        const src = img.src;
        
        // 分析图片类型
        let type = 'other';
        if (src.includes('avatar') || element.classList.contains('avatar') || element.classList.contains('user-avatar')) {
          type = 'avatar-default';
        } else if (src.includes('logo-white') || element.classList.contains('logo-white')) {
          type = 'logo-white';
        } else if (src.includes('logo') || element.classList.contains('logo')) {
          type = 'logo';
        } else if (src.includes('banner') || element.classList.contains('banner')) {
          type = 'banner-illustration';
        } else if (src.includes('empty') || element.classList.contains('empty')) {
          type = 'empty-data.svg';
        } else if (src.includes('ai') || element.classList.contains('ai')) {
          type = 'ai-avatar';
        }
        
        // 获取基础路径
        const basePath = window.location.pathname.includes('/pages/') ? '../..' : '.';
        
        // 应用修复
        const fixedPath = `${basePath}/images/${type}${type.endsWith('.svg') ? '' : '.png'}`;
        console.log(`🔧 修复图片: ${src} -> ${fixedPath}`);
        element.src = fixedPath;
        
        // 添加重试监听
        element.onerror = function() {
          // 如果仍然失败，尝试不同的扩展名
          const extensions = ['png', 'svg', 'jpg'];
          let tried = 0;
          
          const tryNextExt = () => {
            if (tried >= extensions.length) {
              console.log(`💔 修复失败，无法加载图片: ${img.alt}`);
              return;
            }
            
            const ext = extensions[tried++];
            const tryPath = `${basePath}/images/${type}.${ext}`;
            console.log(`🔄 尝试加载: ${tryPath}`);
            element.src = tryPath;
          };
          
          element.onerror = tryNextExt;
          tryNextExt();
        };
      });
    }
  }
  
  // 在加载完成后执行检查
  window.addEventListener('load', function() {
    // 等待一下，确保异步加载的图片也能被检查
    setTimeout(function() {
      checkAllImages();
    }, 1000);
  });
  
  // 导出到全局以便于控制台调用
  window.imageDebugger = {
    checkAllImages,
    fixErrorImages
  };
  
  console.log('🔎 图片加载测试工具已加载，在控制台使用 imageDebugger.checkAllImages() 检查图片状态');
})();
