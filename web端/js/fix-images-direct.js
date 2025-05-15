/**
 * 创业分析平台 - 直接图片修复脚本
 * 这个脚本使用更简单直接的方式修复图片路径问题
 */

(function() {
  // 页面加载完成后执行
  window.addEventListener('DOMContentLoaded', function() {
    console.log('🔧 开始直接修复图片路径...');
    
    // 获取当前页面类型
    const isSubPage = window.location.pathname.includes('/pages/');
    const basePrefix = isSubPage ? '../../' : '';
    
    // 尝试修复所有图片路径
    document.querySelectorAll('img').forEach(function(img) {
      const src = img.getAttribute('src');
      if (!src) return;
      
      // 如果已经是完整URL或数据URI，跳过
      if (src.startsWith('data:') || src.startsWith('http://') || src.startsWith('https://')) {
        return;
      }
      
      // 检测图片类型
      let imageType = '';
      if (src.includes('avatar') || img.classList.contains('avatar') || img.classList.contains('user-avatar')) {
        imageType = 'avatar-default.png';
      } else if (src.includes('logo-white')) {
        imageType = 'logo-white.png';
      } else if (src.includes('logo')) {
        imageType = 'logo.png';
      } else if (src.includes('banner')) {
        imageType = 'banner-illustration.png';
      } else if (src.includes('empty')) {
        imageType = 'empty-data.svg';
      } else if (src.includes('ai')) {
        imageType = 'ai-avatar.png';
      } else {
        // 如果没有明确类型，尝试从路径中获取文件名
        const parts = src.split('/');
        const fileName = parts[parts.length - 1];
        if (fileName) {
          imageType = fileName;
        } else {
          imageType = 'avatar-default.png'; // 默认回退
        }
      }
      
      // 强制修复为正确路径
      const correctPath = basePrefix + 'images/' + imageType;
      
      // 只有在路径不同时才替换
      if (src !== correctPath) {
        console.log(`🔄 直接修复图片: ${src} -> ${correctPath}`);
        img.setAttribute('src', correctPath);
      }
      
      // 添加错误处理
      if (!img._errorHandled) {
        img._errorHandled = true;
        img.addEventListener('error', function() {
          console.warn(`⚠️ 图片加载失败: ${this.src}`);
          // 尝试使用默认图片
          if (!this.src.includes('avatar-default.png')) {
            console.log(`↩️ 回退到默认图片`);
            this.src = basePrefix + 'images/avatar-default.png';
          }
        });
      }
    });
    
    // 尝试修复CSS中的背景图片
    document.querySelectorAll('[style*="background-image"]').forEach(function(el) {
      const style = el.getAttribute('style');
      if (!style) return;
      
      const bgMatch = style.match(/background-image\s*:\s*url\(['"]?([^'"]+)['"]?\)/i);
      if (!bgMatch) return;
      
      const bgUrl = bgMatch[1];
      if (!bgUrl) return;
      
      // 如果已经是完整URL或数据URI，跳过
      if (bgUrl.startsWith('data:') || bgUrl.startsWith('http://') || bgUrl.startsWith('https://')) {
        return;
      }
      
      // 检测背景图片类型
      let imageType = '';
      if (bgUrl.includes('avatar')) {
        imageType = 'avatar-default.png';
      } else if (bgUrl.includes('logo-white')) {
        imageType = 'logo-white.png';
      } else if (bgUrl.includes('logo')) {
        imageType = 'logo.png';
      } else if (bgUrl.includes('banner')) {
        imageType = 'banner-illustration.png';
      } else if (bgUrl.includes('empty')) {
        imageType = 'empty-data.svg';
      } else if (bgUrl.includes('ai')) {
        imageType = 'ai-avatar.png';
      } else {
        // 尝试从路径中获取文件名
        const parts = bgUrl.split('/');
        const fileName = parts[parts.length - 1];
        if (fileName) {
          imageType = fileName;
        } else {
          return; // 无法确定类型就跳过
        }
      }
      
      // 强制修复为正确路径
      const correctPath = basePrefix + 'images/' + imageType;
      
      // 只有在路径不同时才替换
      if (bgUrl !== correctPath) {
        const newStyle = style.replace(
          /background-image\s*:\s*url\(['"]?[^'"]+['"]?\)/i,
          `background-image: url('${correctPath}')`
        );
        console.log(`🔄 直接修复背景图片: ${bgUrl} -> ${correctPath}`);
        el.setAttribute('style', newStyle);
      }
    });
    
    // 检查Vue数据绑定
    if (window.Vue && window.app) {
      // 给Vue一些时间来渲染
      setTimeout(function() {
        // 处理Vue中的用户头像
        if (app.userInfo && app.userInfo.avatar) {
          const avatarPath = app.userInfo.avatar;
          if (!avatarPath.startsWith('data:') && 
              !avatarPath.startsWith('http://') && 
              !avatarPath.startsWith('https://')) {
            console.log(`🔄 修复Vue用户头像数据绑定: ${avatarPath} -> ${basePrefix}images/avatar-default.png`);
            app.userInfo.avatar = basePrefix + 'images/avatar-default.png';
          }
        }
        
        // 重新处理新渲染的图片元素
        document.querySelectorAll('img').forEach(function(img) {
          if (!img._errorHandled) {
            const src = img.getAttribute('src');
            if (src && !src.startsWith('data:') && !src.startsWith('http://') && !src.startsWith('https://')) {
              const imageType = src.includes('avatar') ? 'avatar-default.png' : 
                               src.includes('logo-white') ? 'logo-white.png' : 
                               src.includes('logo') ? 'logo.png' : 
                               src.includes('banner') ? 'banner-illustration.png' : 
                               src.includes('empty') ? 'empty-data.svg' : 
                               src.includes('ai') ? 'ai-avatar.png' : 'avatar-default.png';
              
              const correctPath = basePrefix + 'images/' + imageType;
              if (src !== correctPath) {
                console.log(`🔄 修复后期渲染图片: ${src} -> ${correctPath}`);
                img.setAttribute('src', correctPath);
              }
            }
            
            // 添加错误处理
            img._errorHandled = true;
            img.addEventListener('error', function() {
              if (!this.src.includes('avatar-default.png')) {
                this.src = basePrefix + 'images/avatar-default.png';
              }
            });
          }
        });
      }, 500);
    }
    
    console.log('✅ 直接图片修复完成');
  });
  
  // 页面完全加载后做最后检查
  window.addEventListener('load', function() {
    setTimeout(function() {
      console.log('🔍 最终检查所有图片...');
      
      document.querySelectorAll('img').forEach(function(img) {
        if (img.complete && img.naturalHeight === 0) {
          const isSubPage = window.location.pathname.includes('/pages/');
          const basePrefix = isSubPage ? '../../' : '';
          console.log(`⚠️ 发现未加载的图片: ${img.src}`);
          img.src = basePrefix + 'images/avatar-default.png';
        }
      });
    }, 1000);
  });

  function fixImagePaths() {
    document.querySelectorAll('img').forEach(function(img) {
      const src = img.getAttribute('src');
      // 修复特定图片路径
      if (src && (src.includes('avatar-default.png') || src.includes('avatar-default.svg'))) {
        img.setAttribute('src', src.replace(/avatar-default\.(png|svg)/, 'avatar-default.jpg'));
      }
      if (src && (src.includes('ai-avatar.png') || src.includes('ai-avatar.svg'))) {
        img.setAttribute('src', src.replace(/ai-avatar\.(png|svg)/, 'ai-avatar.jpg'));
      }
      if (src && (src.includes('empty-data.png') || src.includes('empty-data.svg'))) {
        img.setAttribute('src', src.replace(/empty-data\.(png|svg)/, 'empty-data.jpg'));
      }
      if (src && (src.includes('logo.png') || src.includes('logo.svg'))) {
        img.setAttribute('src', src.replace(/logo\.(png|svg)/, 'logo.jpg'));
      }
      if (src && (src.includes('logo-white.png') || src.includes('logo-white.svg'))) {
        img.setAttribute('src', src.replace(/logo-white\.(png|svg)/, 'logo-white.jpg'));
      }
    });
  }
})();
