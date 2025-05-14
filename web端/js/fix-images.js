/**
 * 创业分析平台 - 图片加载修复脚本 (增强版)
 */

// 获取基础URL路径（根据当前页面层级）
function getBasePath() {
  const path = window.location.pathname;
  // 判断当前是否在子目录中
  if (path.includes('/pages/')) {
    return '../..';
  }
  return '.';
}

// 修复路径函数
function fixPath(originalPath, type) {
  if (!originalPath) return '';
  
  // 如果是数据URL或完整URL不处理
  if (originalPath.startsWith('data:') || 
      originalPath.startsWith('http://') || 
      originalPath.startsWith('https://')) {
    return originalPath;
  }
  
  // 处理基于当前路径的相对路径
  const basePath = getBasePath();
  
  // 如果是绝对路径（以/开头）
  if (originalPath.startsWith('/')) {
    return originalPath;
  }
  
  // 如果已经包含正确的相对路径前缀
  if ((basePath === '.' && originalPath.startsWith('images/')) || 
      (basePath === '../..' && originalPath.startsWith('../../images/'))) {
    return originalPath;
  }
  
  // 处理特定类型的图片
  switch (type) {
    case 'avatar':
      return `${basePath}/images/avatar-default.png`;
    case 'logo':
      return `${basePath}/images/logo.png`;
    case 'logo-white':
      return `${basePath}/images/logo-white.png`;
    case 'banner':
      return `${basePath}/images/banner-illustration.png`;
    case 'empty':
      return `${basePath}/images/empty-data.svg`;
    case 'ai':
      return `${basePath}/images/ai-avatar.png`;
    default:
      // 如果路径中包含images/，则修复路径
      if (originalPath.includes('images/')) {
        const imgName = originalPath.split('images/')[1];
        return `${basePath}/images/${imgName}`;
      }
      return originalPath;
  }
}

// 强制预加载关键图片
function preloadImages() {
  const basePath = getBasePath();
  const imagesToPreload = [
    `${basePath}/images/avatar-default.png`,
    `${basePath}/images/logo.png`,
    `${basePath}/images/logo-white.png`,
    `${basePath}/images/ai-avatar.png`
  ];
  
  imagesToPreload.forEach(src => {
    const img = new Image();
    img.src = src;
  });
}

// 当DOM加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
  console.log('🖼️ 图片修复工具启动...');
  preloadImages();
  
  // 检查图片加载错误并提供回退
  document.querySelectorAll('img').forEach(img => {
    // 原始src
    const originalSrc = img.getAttribute('src');
    
    // 先尝试修复src属性
    if (originalSrc && !img.getAttribute('data-fixed')) {
      const imgType = 
        originalSrc.includes('avatar') || img.classList.contains('avatar') || img.classList.contains('user-avatar') ? 'avatar' :
        originalSrc.includes('logo-white') ? 'logo-white' :
        originalSrc.includes('logo') ? 'logo' :
        originalSrc.includes('banner') ? 'banner' :
        originalSrc.includes('empty') ? 'empty' :
        originalSrc.includes('ai') ? 'ai' : 'other';
      
      img.setAttribute('data-fixed', 'true');
      img.setAttribute('data-original', originalSrc);
      
      // 修复路径
      const fixedSrc = fixPath(originalSrc, imgType);
      if (fixedSrc !== originalSrc) {
        img.src = fixedSrc;
        console.log(`🔧 修复图片路径: ${originalSrc} -> ${fixedSrc}`);
      }
    }
    
    // 处理图片加载错误
    img.onerror = function() {
      const originalSrc = this.getAttribute('data-original') || this.getAttribute('src');
      console.warn(`⚠️ 图片加载失败: ${originalSrc}`);
      
      // 检查是否是用户头像
      if (originalSrc.includes('avatar') || this.classList.contains('avatar') || this.classList.contains('user-avatar')) {
        this.src = fixPath(null, 'avatar');
      } 
      // 检查是否是logo
      else if (originalSrc.includes('logo-white')) {
        this.src = fixPath(null, 'logo-white');
      }
      else if (originalSrc.includes('logo')) {
        this.src = fixPath(null, 'logo');
      }
      // AI头像
      else if (originalSrc.includes('ai')) {
        this.src = fixPath(null, 'ai');
      }
      // 其他图片
      else {
        // 显示一个错误占位符
        this.src = 'data:image/svg+xml;charset=utf-8,%3Csvg xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22 width%3D%22100%25%22 height%3D%22100%25%22 viewBox%3D%220 0 300 200%22%3E%3Crect fill%3D%22%23f5f5f5%22 width%3D%22300%22 height%3D%22200%22%2F%3E%3Ctext fill%3D%22%23999%22 font-family%3D%22Arial%2CSans-serif%22 font-size%3D%2216%22 x%3D%2250%25%22 y%3D%2250%25%22 text-anchor%3D%22middle%22 dy%3D%22.3em%22%3E图片加载错误%3C%2Ftext%3E%3C%2Fsvg%3E';
      }
      
      // 从控制台获取更多信息
      console.log('完整图片路径:', new URL(originalSrc, window.location.href).href);
    };
  });
    // 处理 Vue 绑定的图片
  if (window.Vue) {
    console.log('🔍 检测到 Vue，添加全局图片处理...');
    
    // 为Vue实例添加全局混入，处理所有绑定图片
    Vue.mixin({
      mounted() {
        this.$nextTick(() => {
          this.fixVueImages();
        });
      },
      updated() {
        this.$nextTick(() => {
          this.fixVueImages();
        });
      },
      methods: {
        fixVueImages() {
          // 处理当前组件中的所有图片
          if (this.$el) {
            const imgs = this.$el.querySelectorAll('img');
            imgs.forEach(img => {
              if (!img._vueErrorHandled) {
                img._vueErrorHandled = true;
                
                // 原始src
                const originalSrc = img.getAttribute('src');
                if (!originalSrc) return;
                
                // 判断图片类型
                const imgType = 
                  originalSrc.includes('avatar') || img.classList.contains('avatar') || img.classList.contains('user-avatar') ? 'avatar' :
                  originalSrc.includes('logo-white') ? 'logo-white' :
                  originalSrc.includes('logo') ? 'logo' :
                  originalSrc.includes('banner') ? 'banner' :
                  originalSrc.includes('empty') ? 'empty' :
                  originalSrc.includes('ai') ? 'ai' : 'other';
                
                // 修复路径
                const fixedSrc = fixPath(originalSrc, imgType);
                if (fixedSrc !== originalSrc) {
                  img.src = fixedSrc;
                  console.log(`🔧 修复Vue图片: ${originalSrc} -> ${fixedSrc}`);
                }
                
                // 添加错误处理
                img.addEventListener('error', function() {
                  const src = this.getAttribute('src');
                  console.warn(`⚠️ Vue图片加载失败: ${src}`);
                  
                  // 根据图片类型应用适当的默认图片
                  if (src.includes('avatar') || this.classList.contains('avatar') || this.classList.contains('user-avatar')) {
                    this.src = fixPath(null, 'avatar');
                  } else if (src.includes('logo-white')) {
                    this.src = fixPath(null, 'logo-white');
                  } else if (src.includes('logo')) {
                    this.src = fixPath(null, 'logo');
                  } else if (src.includes('ai')) {
                    this.src = fixPath(null, 'ai');
                  } else if (src.includes('banner')) {
                    this.src = fixPath(null, 'banner');
                  } else if (src.includes('empty')) {
                    this.src = fixPath(null, 'empty');
                  }
                });
              }
            });
          }
          
          // 特殊处理：修复用户信息中的头像路径
          if (this.userInfo && this.userInfo.avatar) {
            const avatarSrc = this.userInfo.avatar;
            // 如果是占位符或相对路径不正确
            if (avatarSrc.includes('placeholder') || 
                (avatarSrc.includes('images/') && !avatarSrc.startsWith(getBasePath()))) {
              this.userInfo.avatar = fixPath(null, 'avatar');
              console.log('🔄 修复用户头像数据:', this.userInfo.avatar);
            }
          }
        }
      }
    });
    
    // 添加全局错误处理
    window.addEventListener('error', function(event) {
      if (event.target.tagName === 'IMG') {
        console.log('🚨 捕获到图片加载错误:', event.target.src);
        event.preventDefault();
        
        // 尝试修复
        const img = event.target;
        const originalSrc = img.getAttribute('src');
        
        // 获取图片类型并应用默认图片
        if (originalSrc.includes('avatar') || img.classList.contains('avatar') || img.classList.contains('user-avatar')) {
          img.src = fixPath(null, 'avatar');
        } else if (originalSrc.includes('logo-white')) {
          img.src = fixPath(null, 'logo-white');
        } else if (originalSrc.includes('logo')) {
          img.src = fixPath(null, 'logo');
        } else if (originalSrc.includes('ai')) {
          img.src = fixPath(null, 'ai');
        } else if (originalSrc.includes('empty')) {
          img.src = fixPath(null, 'empty');
        }
      }
    }, true);
  }
  
  console.log('✅ 图片修复工具加载完成');
});

// 最后再次检查页面加载完成后的图片状态
window.addEventListener('load', function() {
  console.log('🔄 页面完全加载，进行最终图片检查...');
  
  // 检查所有图片
  document.querySelectorAll('img').forEach(img => {
    // 检查是否还有未正确加载的图片
    if (img.complete && img.naturalHeight === 0) {
      console.log('🛠️ 发现未正确加载的图片:', img.src);
      
      // 尝试最后的修复
      const originalSrc = img.src;
      if (originalSrc.includes('avatar') || img.classList.contains('avatar') || img.classList.contains('user-avatar')) {
        img.src = fixPath(null, 'avatar');
      } else if (originalSrc.includes('logo-white')) {
        img.src = fixPath(null, 'logo-white');
      } else if (originalSrc.includes('logo')) {
        img.src = fixPath(null, 'logo');
      } else if (originalSrc.includes('ai')) {
        img.src = fixPath(null, 'ai');
      } else if (originalSrc.includes('empty')) {
        img.src = fixPath(null, 'empty');
      }
    }
  });
  
  // 修复Vue实例中的用户头像
  if (window.app && app.userInfo) {
    if (!app.userInfo.avatar || 
        app.userInfo.avatar.includes('placeholder') || 
        app.userInfo.avatar.includes('../images/')) {
      app.userInfo.avatar = fixPath(null, 'avatar');
      console.log('🔄 最终修复用户头像:', app.userInfo.avatar);
    }
  }
});
