/**
 * 图片加载测试工具
 * 这个脚本会在页面角落显示一个小工具，用于测试图片加载状态
 */

(function() {  // 检查URL参数
  function getUrlParam(name) {
    const url = new URL(window.location.href);
    return url.searchParams.get(name);
  }

  // 默认显示测试工具，除非URL参数debug=false
  const showDebug = getUrlParam('debug') !== 'false';
  
  // 在页面加载完成后执行
  window.addEventListener('load', function() {
    // 如果URL中有debug=false参数，则不显示调试工具
    if (!showDebug) {
      console.log('调试模式已禁用，添加?debug=true到URL可启用图片诊断工具');
      return;
    }
    
    // 创建测试工具容器
    const testTool = document.createElement('div');
    testTool.setAttribute('id', 'image-test-tool');
    testTool.style.cssText = `
      position: fixed;
      bottom: 10px;
      right: 10px;
      padding: 10px;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      border-radius: 5px;
      font-size: 12px;
      z-index: 9999;
      max-width: 300px;
      box-shadow: 0 0 10px rgba(0,0,0,0.5);
      font-family: Arial, sans-serif;
      transition: all 0.3s ease;
    `;
    
    // 添加标题
    const title = document.createElement('div');
    title.textContent = '图片加载状态检测';
    title.style.cssText = 'font-weight: bold; margin-bottom: 5px; text-align: center;';
    testTool.appendChild(title);
    
    // 添加状态信息
    const info = document.createElement('div');
    
    // 统计图片加载情况
    const images = document.querySelectorAll('img');
    let loadedCount = 0;
    let errorCount = 0;
    let pendingCount = 0;
    
    images.forEach(function(img) {
      if (img.complete && img.naturalHeight > 0) {
        loadedCount++;
      } else if (img.complete && img.naturalHeight === 0) {
        errorCount++;
      } else {
        pendingCount++;
      }
    });
    
    // 显示统计信息
    info.innerHTML = `
      <div style="margin: 5px 0">
        <span style="color: #4caf50">✓ 正常:</span> ${loadedCount}<br>
        <span style="color: #f44336">✗ 失败:</span> ${errorCount}<br>
        <span style="color: #ff9800">⟳ 加载中:</span> ${pendingCount}<br>
        <span>总数:</span> ${images.length}
      </div>
    `;
    testTool.appendChild(info);
    
    // 添加修复按钮
    const fixButton = document.createElement('button');
    fixButton.textContent = '修复图片';
    fixButton.style.cssText = `
      background: #4caf50;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 3px;
      cursor: pointer;
      margin: 5px 0;
      width: 100%;
    `;
    fixButton.addEventListener('click', function() {
      // 尝试修复所有图片
      if (window.fixAllImages) {
        window.fixAllImages();
        
        // 更新统计信息
        setTimeout(function() {
          let fixedLoadedCount = 0;
          let fixedErrorCount = 0;
          images.forEach(function(img) {
            if (img.complete && img.naturalHeight > 0) {
              fixedLoadedCount++;
            } else {
              fixedErrorCount++;
            }
          });
          
          info.innerHTML = `
            <div style="margin: 5px 0">
              <span style="color: #4caf50">✓ 正常:</span> ${fixedLoadedCount} (+${fixedLoadedCount - loadedCount})<br>
              <span style="color: #f44336">✗ 失败:</span> ${fixedErrorCount} (${errorCount > fixedErrorCount ? '-' + (errorCount - fixedErrorCount) : '+' + (fixedErrorCount - errorCount)})<br>
              <span>总数:</span> ${images.length}
            </div>
            <div style="color:#4caf50; margin-top:5px;">图片已修复!</div>
          `;
        }, 1000);
      } else {
        info.innerHTML += '<div style="color:#f44336; margin-top:5px;">修复工具未加载</div>';
      }
    });
    testTool.appendChild(fixButton);
    
    // 添加关闭按钮
    const closeButton = document.createElement('button');
    closeButton.textContent = '关闭';
    closeButton.style.cssText = `
      background: #f44336;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 3px;
      cursor: pointer;
      width: 100%;
    `;
    closeButton.addEventListener('click', function() {
      document.body.removeChild(testTool);
    });
    testTool.appendChild(closeButton);
      // 添加实时刷新按钮
    const refreshButton = document.createElement('button');
    refreshButton.textContent = '刷新状态';
    refreshButton.style.cssText = `
      background: #2196f3;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 3px;
      cursor: pointer;
      margin: 5px 0;
      width: 100%;
    `;
    
    // 刷新图片状态函数
    function refreshImageStatus() {
      const images = document.querySelectorAll('img');
      let loadedCount = 0;
      let errorCount = 0;
      let pendingCount = 0;
      
      images.forEach(function(img) {
        if (img.complete && img.naturalHeight > 0) {
          loadedCount++;
        } else if (img.complete && img.naturalHeight === 0) {
          errorCount++;
        } else {
          pendingCount++;
        }
      });
      
      // 更新状态显示
      info.innerHTML = `
        <div style="margin: 5px 0">
          <span style="color: #4caf50">✓ 正常:</span> ${loadedCount}<br>
          <span style="color: #f44336">✗ 失败:</span> ${errorCount}<br>
          <span style="color: #ff9800">⟳ 加载中:</span> ${pendingCount}<br>
          <span>总数:</span> ${images.length}
        </div>
        <div style="margin-top: 5px; font-size: 10px; color: #aaa;">最后更新: ${new Date().toLocaleTimeString()}</div>
      `;
      
      return { loadedCount, errorCount, pendingCount, total: images.length };
    }
    
    refreshButton.addEventListener('click', refreshImageStatus);
    testTool.appendChild(refreshButton);
    
    // 添加更多调试信息按钮
    const detailsButton = document.createElement('button');
    detailsButton.textContent = '显示图片详情';
    detailsButton.style.cssText = `
      background: #9c27b0;
      color: white;
      border: none;
      padding: 5px 10px;
      border-radius: 3px;
      cursor: pointer;
      margin: 5px 0;
      width: 100%;
      display: none;
    `;
    
    // 图片详情显示区域
    const detailsArea = document.createElement('div');
    detailsArea.style.cssText = `
      margin-top: 10px;
      display: none;
      max-height: 200px;
      overflow-y: auto;
      border-top: 1px solid #555;
      padding-top: 5px;
    `;
    
    detailsButton.addEventListener('click', function() {
      // 如果已经显示，则隐藏
      if (detailsArea.style.display === 'block') {
        detailsArea.style.display = 'none';
        detailsButton.textContent = '显示图片详情';
        return;
      }
      
      // 否则显示详细信息
      detailsArea.innerHTML = '';
      detailsArea.style.display = 'block';
      detailsButton.textContent = '隐藏图片详情';
      
      const images = document.querySelectorAll('img');
      images.forEach(function(img, i) {
        const status = img.complete ? 
          (img.naturalHeight > 0 ? '✓' : '✗') : 
          '⟳';
        const statusColor = status === '✓' ? '#4caf50' : 
                           status === '✗' ? '#f44336' : 
                           '#ff9800';
        
        const imgItem = document.createElement('div');
        imgItem.style.cssText = `
          margin-bottom: 5px;
          font-size: 11px;
          border-bottom: 1px dotted #444;
          padding-bottom: 2px;
        `;
        
        const imgSrc = img.getAttribute('src') || '(没有src)';
        const imgAlt = img.getAttribute('alt') || '(没有alt)';
        
        imgItem.innerHTML = `
          <div><span style="color: ${statusColor}">${status}</span> ${i+1}. ${imgAlt}</div>
          <div style="word-break: break-all; color: #aaa; font-size: 9px;">
            ${imgSrc}
          </div>
        `;
        
        detailsArea.appendChild(imgItem);
      });
    });
    
    // 如果有错误的图片，显示详情按钮
    const status = refreshImageStatus();
    if (status.errorCount > 0) {
      detailsButton.style.display = 'block';
    }
    
    testTool.appendChild(detailsButton);
    testTool.appendChild(detailsArea);
    
    // 将测试工具添加到页面
    document.body.appendChild(testTool);
    
    // 定期刷新状态
    setInterval(function() {
      const status = refreshImageStatus();
      // 如果有错误的图片，显示详情按钮
      if (status.errorCount > 0) {
        detailsButton.style.display = 'block';
      }
    }, 3000);
  });
  
  // 添加到URL的图片调试开关
  console.log('提示: 在URL后添加?debug=true可显示图片调试工具，?debug=false则隐藏');
})();
