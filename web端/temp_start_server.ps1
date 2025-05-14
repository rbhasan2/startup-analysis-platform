# 创业分析平台 - Web前端服务器启动脚本
# 设置输出编码为UTF-8，确保中文正确显示
[Console]::OutputEncoding = [System.Text.Encoding]::UTF8

# 定义颜色函数
function Write-ColorOutput($ForegroundColor, $Message) {
    $fc = $host.UI.RawUI.ForegroundColor
    $host.UI.RawUI.ForegroundColor = $ForegroundColor
    Write-Output $Message
    $host.UI.RawUI.ForegroundColor = $fc
}

# 输出启动信息
Write-ColorOutput Green "正在启动Web前端服务器..."
Write-ColorOutput Cyan "请访问: http://localhost:3000"
Write-ColorOutput Yellow "按下 Ctrl+C 可停止服务器"

# 切换到脚本所在目录并启动HTTP服务器
Set-Location -Path $PSScriptRoot
python -m http.server 3000
