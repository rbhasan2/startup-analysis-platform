/**
 * 创业分析平台 - 图片加载器
 * 这个脚本增强了平台的图片加载能力，解决图片路径问题
 */

// 立即执行函数表达式(IIFE)，避免变量污染全局作用域
(function() {
  // 定义支持的图片格式
  const SUPPORTED_FORMATS = ['png', 'jpg', 'jpeg', 'svg', 'gif', 'webp'];
  
  // 图片加载器类
  class ImageLoader {
    constructor() {
      this.loadedImages = new Set();
      this.errorImages = new Set();
      this.baseUrl = this.detectBaseUrl();
    }
    
    // 检测基础URL
    detectBaseUrl() {
      const path = window.location.pathname;
      if (path.includes('/pages/')) {
        return '../..';
      }
      return '.';
    }
      // 规范化图片路径
    normalizePath(path, type) {
      if (!path) return null;
      
      console.log('处理图片路径:', path);
      
      // 如果是数据URI或HTTP URL，直接返回
      if (path.startsWith('data:') || 
          path.startsWith('http://') || 
          path.startsWith('https://')) {
        return path;
      }
      
      const baseUrl = this.baseUrl;
      console.log('基础URL:', baseUrl);
      
      // 主页上的图片
      if (baseUrl === '.') {
        // 如果已经是正确的相对路径
        if (path.startsWith('./images/') || path.startsWith('images/')) {
          console.log('保持主页相对路径不变:', path);
          return path;
        }
        // 如果是绝对路径（/开头）
        if (path.startsWith('/images/')) {
          const newPath = `images${path.substring(7)}`;
          console.log('主页：修复绝对路径 -> 相对路径:', path, '->', newPath);
          return newPath;
        }
      } 
      // 子页面上的图片
      else if (baseUrl === '../..') {
        // 如果已经是正确的相对路径
        if (path.startsWith('../../images/')) {
          console.log('保持子页面相对路径不变:', path);
          return path;
        }
        // 如果是绝对路径或者主页的相对路径
        if (path.startsWith('/images/')) {
          const newPath = `../../images${path.substring(7)}`;
          console.log('子页面：修复绝对路径 -> 相对路径:', path, '->', newPath);
          return newPath;
        }
        if (path.startsWith('images/')) {
          const newPath = `../../${path}`;
          console.log('子页面：修复主页相对路径 -> 子页面相对路径:', path, '->', newPath);
          return newPath;
        }      }
      
      // 根据类型返回默认图片
      if (type) {
        // 根据当前页面类型选择正确的路径格式
        if (baseUrl === '.') {
          return `images/${type}${type.endsWith('.svg') ? '' : '.png'}`;
        } else {
          return `../../images/${type}${type.endsWith('.svg') ? '' : '.png'}`;
        }
      }
      
      // 如果路径中包含images/但相对路径不正确
      if (path.includes('images/')) {
        const parts = path.split('images/');
        // 根据当前页面类型选择正确的路径格式
        if (baseUrl === '.') {
          return `images/${parts[1]}`;
        } else {
          return `../../images/${parts[1]}`;
        }
      }
      
      console.log('无法处理的图片路径:', path);
      // 如果都处理不了，至少保证有个默认路径
      if (baseUrl === '.') {
        return `images/avatar-default.png`;
      } else {
        return `../../images/avatar-default.png`;
      }
    }
    
    // 尝试不同格式加载图片
    tryDifferentFormats(imagePath, callback) {
      if (!imagePath || imagePath.startsWith('data:') || 
          imagePath.includes('http://') || imagePath.includes('https://')) {
        callback(imagePath);
        return;
      }
      
      // 移除扩展名
      let basePath = imagePath;
      const extMatch = imagePath.match(/\.(png|jpg|jpeg|svg|gif|webp)$/i);
      if (extMatch) {
        basePath = imagePath.substring(0, imagePath.lastIndexOf('.'));
      }
      
      let loadedAny = false;
      let remainingFormats = [...SUPPORTED_FORMATS];
      
      const checkNextFormat = () => {
        if (remainingFormats.length === 0) {
          if (!loadedAny) {
            console.warn(`⚠️ 所有格式都无法加载: ${basePath}`);
            callback(null);
          }
          return;
        }
        
        const format = remainingFormats.shift();
        const testPath = `${basePath}.${format}`;
        
        const img = new Image();
        img.onload = () => {
          loadedAny = true;
          console.log(`✅ 成功加载图片: ${testPath}`);
          callback(testPath);
        };
        img.onerror = () => {
          console.log(`❌ 无法加载格式: ${format}`);
          checkNextFormat();
        };
        img.src = testPath;
      };
      
      checkNextFormat();
    }
    
    // 修复图片路径
    fixImagePath(element) {
      if (!element || !element.getAttribute) return;
      
      const src = element.getAttribute('src');
      if (!src) return;
      
      // 确定图片类型
      let type = 'avatar-default';
      if (src.includes('logo-white') || element.classList.contains('logo-white')) {
        type = 'logo-white';
      } else if (src.includes('logo') || element.classList.contains('logo')) {
        type = 'logo';
      } else if (src.includes('avatar') || element.classList.contains('avatar') || element.classList.contains('user-avatar')) {
        type = 'avatar-default';
      } else if (src.includes('banner') || element.classList.contains('banner')) {
        type = 'banner-illustration';
      } else if (src.includes('empty') || element.classList.contains('empty')) {
        type = 'empty-data.svg';
      } else if (src.includes('ai') || element.classList.contains('ai')) {
        type = 'ai-avatar';
      }
      
      // 应用规范化路径
      const normalizedPath = this.normalizePath(src, type);
      if (normalizedPath && normalizedPath !== src) {
        console.log(`🔄 修正图片路径: ${src} → ${normalizedPath}`);
        element.src = normalizedPath;
        
        // 添加错误处理
        if (!element._errorHandled) {
          element._errorHandled = true;
          element.addEventListener('error', () => {
            if (this.errorImages.has(normalizedPath)) return;
            this.errorImages.add(normalizedPath);
            
            console.warn(`⚠️ 图片加载失败: ${normalizedPath}`);
            
            // 尝试使用完整的备选路径
            const fallbackPath = this.normalizePath(null, type);
            if (fallbackPath && fallbackPath !== normalizedPath) {
              console.log(`🔄 使用备选图片: ${fallbackPath}`);
              element.src = fallbackPath;
            }
          });
        }
      }
    }
    
    // 修复背景图片
    fixBackgroundImage(element) {
      if (!element || !element.style || !element.style.backgroundImage) return;
      
      const bgImage = element.style.backgroundImage;
      const match = bgImage.match(/url\(['"]?([^'"]+)['"]?\)/);
      if (!match) return;
      
      const url = match[1];
      if (!url) return;
      
      // 确定图片类型
      let type = null;
      if (url.includes('logo-white')) {
        type = 'logo-white';
      } else if (url.includes('logo')) {
        type = 'logo';
      } else if (url.includes('avatar')) {
        type = 'avatar-default';
      } else if (url.includes('banner')) {
        type = 'banner-illustration';
      } else if (url.includes('empty')) {
        type = 'empty-data.svg';
      } else if (url.includes('ai')) {
        type = 'ai-avatar';
      }
      
      // 应用规范化路径
      const normalizedPath = this.normalizePath(url, type);
      if (normalizedPath && normalizedPath !== url) {
        console.log(`🔄 修正背景图片路径: ${url} → ${normalizedPath}`);
        element.style.backgroundImage = `url('${normalizedPath}')`;
      }
    }
    
    // 初始化
    init() {
      console.log('🖼️ 图片加载器初始化...');
      
      // 处理所有图片
      document.querySelectorAll('img').forEach(img => this.fixImagePath(img));
      
      // 处理背景图片
      document.querySelectorAll('[style*="background-image"]').forEach(el => this.fixBackgroundImage(el));
      
      // 监听DOM变化
      const observer = new MutationObserver(mutations => {
        mutations.forEach(mutation => {
          // 添加的节点
          mutation.addedNodes.forEach(node => {
            // 处理添加的图片元素
            if (node.tagName === 'IMG') {
              this.fixImagePath(node);
            }
            
            // 处理添加的元素内的图片
            if (node.querySelectorAll) {
              node.querySelectorAll('img').forEach(img => this.fixImagePath(img));
              node.querySelectorAll('[style*="background-image"]').forEach(el => this.fixBackgroundImage(el));
            }
          });
          
          // 修改的属性
          if (mutation.type === 'attributes') {
            const node = mutation.target;
            if (node.tagName === 'IMG' && mutation.attributeName === 'src') {
              this.fixImagePath(node);
            }
            if (mutation.attributeName === 'style' && 
                node.style && node.style.backgroundImage) {
              this.fixBackgroundImage(node);
            }
          }
        });
      });
      
      // 配置观察器
      observer.observe(document.body, {
        childList: true,
        subtree: true,
        attributes: true,
        attributeFilter: ['src', 'style']
      });
      
      console.log('✅ 图片加载器启动完成');
    }
  }
  
  // 页面加载完成后初始化
  window.addEventListener('DOMContentLoaded', () => {
    const imageLoader = new ImageLoader();
    imageLoader.init();
    
    // 将loader暴露给全局，方便调试
    window._imageLoader = imageLoader;
  });
})();
